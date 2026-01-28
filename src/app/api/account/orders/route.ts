import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // 1. Secure Session Check
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberId = user.id;

    const allOrders = await getOrders();
    // Filter for this user's orders only and sort by newest
    const myOrders = allOrders.filter(o => o.memberId === memberId).reverse();

    return NextResponse.json({ orders: myOrders, memberId });
}
