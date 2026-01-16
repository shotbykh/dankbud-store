import { NextResponse } from 'next/server';
import { getOrders, Order } from '@/lib/db';
import { supabase } from '@/lib/supabase'; // Direct access for update

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic';

async function updateOrderStatus(orderId: string, status: Order['status']) {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
    if (error) {
        console.error("Failed to update status", error);
        throw new Error(error.message);
    }
}

export async function GET() {
    try {
        // Read fresh each time
        const orders = await getOrders();
        // Since we fetch from DB, we can sort here or in the DB query. 
        // getOrders() already maps it, but let's reverse for recent first.
        return NextResponse.json({ orders: orders.reverse() });
    } catch (e) {
        return NextResponse.json({ orders: [] });
    }
}

export async function PUT(req: Request) {
    try {
        const { orderId, status } = await req.json();
        await updateOrderStatus(orderId, status);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
