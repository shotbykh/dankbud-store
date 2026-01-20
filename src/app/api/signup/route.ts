import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';
import { saveMember } from '@/lib/db';
import { EmailService } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, fullName, idNumber, phone } = body;

        // 1. Init Supabase Admin (or just Server Client)
        // We use createServerClient to use valid API interaction
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

        // 2. Sign Up User (Triggers Email if Enabled in Supabase Dashboard)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, id_number: idNumber, phone }, // Store meta in Auth too
            }
        });

        if (authError) {
            return NextResponse.json({ message: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ message: "Auth creation failed." }, { status: 500 });
        }

        // 3. Create Member Record (Linked to Auth ID)
        // Note: authData.user.id is the UUID from Auth
        await saveMember({
            id: authData.user.id, // VITAL: Link IDs
            email: email,
            fullName: fullName,
            idNumber: idNumber,
            phone: phone,
            status: 'PENDING', // Default pending until email confirmed? Or APPROVED? 
            // If email confirm is on, they can't login anyway.
            // Let's set to APPROVED so once they verify email, they are good.
            // OR keep PENDING if you want manual approval too?
            // "Normal flow" implies email verify = access.
            joinedAt: new Date().toISOString(),
            totalSpent: 0
        });

        // 4. Notify Staff
        await EmailService.sendStaffNotification(
            "New Sign Up",
            `New User: ${fullName} (${email}). Check Members list.`
        );

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Signup Error:", err);
        return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
    }
}
