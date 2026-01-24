import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';
import { EmailService } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, idNumber, email, phone, password } = body;

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

        // 3. Notify Staff
        try {
            await EmailService.sendStaffNotification(
                "New Member Application",
                `New applicant: ${fullName} (${idNumber}). Please review in Admin Console.`
            );
        } catch (e) { console.error("Apply: Staff Email Failed", e); }

        // 4. Welcome Email
        try {
             await EmailService.sendWelcomeEmail(email, fullName);
        } catch (e) { console.error("Apply: Welcome Email Failed", e); }

        // Return the member object format expected by the frontend for simple login
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
