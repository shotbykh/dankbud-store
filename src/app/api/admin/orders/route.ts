import { NextResponse } from 'next/server';
import { getOrders, Order } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-auth';

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic';

async function updateOrderStatus(orderId: string, status: Order['status']) {
    const { error } = await supabaseAdmin
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
        const auth = await verifyAdminRequest();
        if (!auth.valid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await getOrders();
        return NextResponse.json({ orders: orders.reverse() });
    } catch (e) {
        console.error("Error fetching orders:", e);
        return NextResponse.json({ orders: [] });
    }
}

export async function PUT(req: Request) {
    try {
        const auth = await verifyAdminRequest();
        if (!auth.valid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, status } = await req.json();
        await updateOrderStatus(orderId, status);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
