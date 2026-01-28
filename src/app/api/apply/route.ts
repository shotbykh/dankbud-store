import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'; // For Admin Client
import { cookies } from 'next/headers';
import { EmailService } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, idNumber, email, phone, password, referralCode } = body;

        // 1. Init Supabase Auth Client
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

        console.log("Apply: Creating Auth User...", email);

        // 2. Auth Sign Up (Trigger will create Member Profile)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password, 
            options: {
                data: { full_name: fullName, id_number: idNumber, phone }, 
            }
        });

        if (authError) {
            console.error("Apply: Auth Error", authError);
            return NextResponse.json({ message: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            console.error("Apply: No User Returned");
            return NextResponse.json({ message: "Auth creation failed." }, { status: 500 });
        }

        // 3. Process Referral Code (Atomic Admin Operation)
        let referralApplied = false;
        if (referralCode && referralCode.trim().length > 2) {
             try {
                // Admin client bypassing RLS for referrals
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );
                
                const code = referralCode.trim().toUpperCase();
                
                // Find Code
                const { data: refData, error: refError } = await supabaseAdmin
                    .from('referral_codes')
                    .select('id, member_id')
                    .eq('code', code)
                    .single();

                if (refData && !refError) {
                    // Prevent self-referral
                    if (refData.member_id !== authData.user.id) {
                        const creditAmount = 50; 

                        // A. Record Redemption
                        await supabaseAdmin.from('referral_redemptions').insert({
                            referral_code_id: refData.id,
                            referred_member_id: authData.user.id,
                            credit_awarded: creditAmount
                        });

                        // B. Update Usage Stats
                        // Note: A trigger might handle this optimally, but manual update ensures consistency for now
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

                        // C. Update Member's "Referred By" Field
                        // Wait briefly for trigger to create member row if needed (though usually instant)
                        await supabaseAdmin
                            .from('members')
                            .update({ referred_by: code })
                            .eq('id', authData.user.id);

                        referralApplied = true;
                        console.log(`Referral applied: ${code} -> ${authData.user.id}`);
                    }
                }
            } catch (refErr) {
                console.error("Referral processing error:", refErr);
                // Non-blocking error
            }
        }

        // 4. Notify Staff
        try {
            const refNote = referralApplied ? ` (Referred by code: ${referralCode?.toUpperCase()})` : '';
            await EmailService.sendStaffNotification(
                "New Member Application",
                `New applicant: ${fullName} (${idNumber}). Please review in Admin Console.${refNote}`
            );
        } catch (e) { console.error("Apply: Staff Email Failed", e); }

        // 5. Welcome Email
        try {
             await EmailService.sendWelcomeEmail(email, fullName);
        } catch (e) { console.error("Apply: Welcome Email Failed", e); }

        return NextResponse.json({ 
            success: true, 
            member: { 
                id: authData.user.id,
                email: email, 
                fullName: fullName,
                status: 'APPROVED' 
            } 
        });

    } catch (err: any) {
        console.error("Apply Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
