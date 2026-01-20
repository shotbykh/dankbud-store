'use server';

import { getOrders } from "@/lib/db";

export async function fetchOrders() {
    const orders = await getOrders();
    return orders.reverse();
}
