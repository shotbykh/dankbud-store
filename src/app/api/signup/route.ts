import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';
import { EmailService } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, fullName, idNumber, phone } = body;

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

        // 3. Notify Staff
        try {
            await EmailService.sendStaffNotification(
                "New Sign Up",
                `New User: ${fullName} (${email}). Check Members list.`
            );
        } catch (e) { console.error("Signup: Staff Email Failed", e); }

        // 4. Send Welcome Email
        try {
            await EmailService.sendWelcomeEmail(email, fullName);
        } catch (e) { console.error("Signup: Welcome Email Failed", e); }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Signup Error:", err);
        return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
    }
}
