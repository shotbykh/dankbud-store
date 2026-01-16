import { NextResponse } from 'next/server';
import { getOrders, saveOrder, Order } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic';

function updateOrderStatus(orderId: string, status: Order['status']) {
    const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
    try {
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        const db = JSON.parse(fileData);
        
        if (!db.orders) return;

        const updatedOrders = db.orders.map((o: Order) => 
            o.id === orderId ? { ...o, status } : o
        );

        db.orders = updatedOrders;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (e) {
        console.error("Failed to update status", e);
        throw e;
    }
}

export async function GET() {
    try {
        // Read fresh each time
        const orders = getOrders().reverse(); 
        return NextResponse.json({ orders });
    } catch (e) {
        return NextResponse.json({ orders: [] });
    }
}

export async function PUT(req: Request) {
    try {
        const { orderId, status } = await req.json();
        updateOrderStatus(orderId, status);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
