import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get('dankbud_session');
    const headerAuth = req.headers.get('x-member-id');
    
    // Auth Priority: Cookie -> Header -> Unauthorized
    const memberId = session?.value || headerAuth;
    
    if (!memberId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allOrders = getOrders();
    // Filter for this user's orders only and sort by newest
    const myOrders = allOrders.filter(o => o.memberId === memberId).reverse();

    return NextResponse.json({ orders: myOrders, memberId });
}
