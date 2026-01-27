import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { EmailService } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, fullName, idNumber, phone, referralCode } = body;

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                    set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                    remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
                },
            }
        );

        // 1. Sign Up User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, id_number: idNumber, phone }, 
            }
        });

        if (authError) {
            return NextResponse.json({ message: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ message: "Auth creation failed." }, { status: 500 });
        }
        
        // 2. Member Record Creation is now handled by DB TRIGGER on 'auth.users' insert.
        // We do not need to call saveMember() here.

        // 3. Process Referral Code (if provided)
        let referralApplied = false;
        if (referralCode && referralCode.trim()) {
            try {
                // Create admin client for referral operations
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );
                
                const code = referralCode.trim().toUpperCase();
                
                // Find the referral code
                const { data: refData, error: refError } = await supabaseAdmin
                    .from('referral_codes')
                    .select('id, member_id')
                    .eq('code', code)
                    .single();

                if (refData && !refError) {
                    // Don't allow self-referral (though unlikely at signup)
                    if (refData.member_id !== authData.user.id) {
                        const creditAmount = 50; // R50 for both

                        // Record the redemption
                        await supabaseAdmin.from('referral_redemptions').insert({
                            referral_code_id: refData.id,
                            referred_member_id: authData.user.id,
                            credit_awarded: creditAmount
                        });

                        // Update referral code stats
                        const { data: currentStats } = await supabaseAdmin
                            .from('referral_codes')
                            .select('uses, credits_earned')
                            .eq('id', refData.id)
                            .single();
                        
                        await supabaseAdmin
                            .from('referral_codes')
                            .update({
                                uses: (currentStats?.uses || 0) + 1,
                                credits_earned: (currentStats?.credits_earned || 0) + creditAmount
                            })
                            .eq('id', refData.id);

                        // Update member referred_by field (when member record exists)
                        setTimeout(async () => {
                            try {
                                await supabaseAdmin
                                    .from('members')
                                    .update({ referred_by: code })
                                    .eq('id', authData.user!.id);
                            } catch (e) { console.log("Referred_by update will happen after trigger"); }
                        }, 2000);

                        referralApplied = true;
                        console.log(`Referral applied: ${code} -> ${authData.user.id}`);
                    }
                }
            } catch (refErr) {
                console.error("Referral processing error:", refErr);
                // Don't fail signup for referral errors
            }
        }

        // 4. Notify Staff
        try {
            const refNote = referralApplied ? ` (Referred by code: ${referralCode?.toUpperCase()})` : '';
            await EmailService.sendStaffNotification(
                "New Sign Up",
                `New User: ${fullName} (${email})${refNote}. Check Members list.`
            );
        } catch (e) { console.error("Signup: Staff Email Failed", e); }

        // 5. Send Welcome Email
        try {
            await EmailService.sendWelcomeEmail(email, fullName);
        } catch (e) { console.error("Signup: Welcome Email Failed", e); }

        return NextResponse.json({ success: true, referralApplied });

    } catch (err: any) {
        console.error("Signup Error:", err);
        return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
    }
}
