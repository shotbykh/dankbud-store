import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';
import { saveMember } from '@/lib/db';
import { EmailService } from '@/lib/email';

export async function POST(req: Request) {
    try {
        console.log(">>> SIGNUP START <<<");
        const body = await req.json();
        const { email, password, fullName, idNumber, phone } = body;
        console.log("Signup Payload:", { email, fullName, idNumber, phone });

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

        console.log("Signup: Calling Supabase Auth...");
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, id_number: idNumber, phone }, 
            }
        });

        if (authError) {
            console.error("Signup: Auth Error!", authError);
            return NextResponse.json({ message: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            console.error("Signup: No User Returned from Auth!");
            return NextResponse.json({ message: "Auth creation failed." }, { status: 500 });
        }
        
        console.log("Signup: Auth Success. User ID:", authData.user.id);

        console.log("Signup: Saving to DB...");
        try {
            await saveMember({
                id: authData.user.id,
                email: email,
                fullName: fullName,
                idNumber: idNumber,
                phone: phone,
                status: 'PENDING',
                joinedAt: new Date().toISOString(),
                totalSpent: 0
            });
            console.log("Signup: DB Save Success.");
        } catch (dbErr) {
             console.error("Signup: DB Save Failed!", dbErr);
             throw dbErr;
        }

        console.log("Signup: Notifying Staff...");
        try {
            await EmailService.sendStaffNotification(
                "New Sign Up",
                `New User: ${fullName} (${email}). Check Members list.`
            );
             console.log("Signup: Staff Email Sent.");
        } catch (e) { console.error("Signup: Staff Email Failed", e); }

        console.log("Signup: Sending Welcome Email...");
        try {
            await EmailService.sendWelcomeEmail(email, fullName);
            console.log("Signup: Welcome Email Sent.");
        } catch (e) { console.error("Signup: Welcome Email Failed", e); }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Signup CRITICAL EXCEPTION:", err);
        return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
    }
}
