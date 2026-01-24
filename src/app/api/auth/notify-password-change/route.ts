import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { EmailService } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value; },
                    set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
                    remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }); },
                }
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ideally we'd get the name from a profile table, but fallback to email part
        const memberName = user.user_metadata?.full_name || user.email.split('@')[0];

        await EmailService.sendPasswordChangedNotification(user.email, memberName);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Notify error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
