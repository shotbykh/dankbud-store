import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const ORDERS_FILE = path.join(process.cwd(), 'data/orders.json');

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    memberId: string;
    memberName: string;
    contactNumber: string; // NEW
    deliveryMethod: 'COLLECT' | 'DELIVER'; // NEW
    deliveryAddress?: string; // NEW
    items: OrderItem[];
    total: number;
    status: 'PENDING' | 'FULFILLED' | 'CANCELLED';
    timestamp: string;
}

export async function getOrders(): Promise<Order[]> {
    if (supabase) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            // Map snake_case from DB to camelCase if necessary.
            // For now assuming the DB columns match our needs or we map them.
            // Simplest is to just cast for this demo if we used JSONB for the whole thing,
            // but we defined structured columns. 
            // Let's assume we map explicitly to be safe:
            return data.map((d: any) => ({
                id: d.id,
                memberId: d.member_id,
                memberName: d.member_name,
                contactNumber: d.items.contactNumber || "N/A", // Storing extra metadata in items JSON or separate cols
                deliveryMethod: d.items.deliveryMethod || "COLLECT",
                deliveryAddress: d.items.deliveryAddress,
                items: d.items.cart || d.items, // Handle migration
                total: d.total,
                status: d.status,
                timestamp: d.created_at
            }));
        }
    }

    try {
        if (!fs.existsSync(ORDERS_FILE)) return [];
        const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function saveOrder(order: Order) {
    if (supabase) {
        const { error } = await supabase
            .from('orders')
            .insert([{
                id: order.id,
                member_id: order.memberId,
                member_name: order.memberName,
                // We'll store the shipping details inside the JSONB 'items' column 
                // to avoid schema migration for now, or just add columns. 
                // Let's pack them into the JSONB for flexibility since we haven't migrated schema.
                items: {
                    cart: order.items,
                    deliveryMethod: order.deliveryMethod,
                    deliveryAddress: order.deliveryAddress,
                    contactNumber: order.contactNumber
                },
                total: order.total,
                status: order.status,
                created_at: order.timestamp
            }]);
        if (!error) return; 
    }

    const orders = await getOrders();
    // Re-read local for fallback logic safely
    let localOrders: Order[] = [];
    try {
        if (fs.existsSync(ORDERS_FILE)) {
             localOrders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
        }
    } catch(e) {}

    localOrders.unshift(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(localOrders, null, 2));
}
