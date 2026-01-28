import { NextResponse } from 'next/server';
import { saveOrder, Order } from '@/lib/db';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // DEBUG LOGGING
    console.log("Processing Order...", data?.deliveryMethod);
    
    // 2. Validate Session with Supabase Auth (Strict)
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
        return NextResponse.json({ error: 'Unauthorized: Valid login required' }, { status: 401 });
    }

    const memberId = user.id;

    // Extract all fields
    const { items, total, address, paymentMethod, deliveryMethod, pudoTerminal } = data;

    if (!items || items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Construct the final address object
    // If PUDO, we attach the terminal info to the address JSON
    let finalAddress = address;
    if (deliveryMethod === 'PUDO' && pudoTerminal) {
        finalAddress = {
            ...address,
            pudoTerminal: pudoTerminal // { id, name }
        };
    } else if (deliveryMethod === 'COLLECTION') {
        finalAddress = undefined; // No address needed for collection
    }

    const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        memberId: memberId, 
        items,
        total,
        status: 'PENDING',
        address: finalAddress,
        deliveryMethod: deliveryMethod || 'DELIVERY',
        paymentMethod,
        createdAt: new Date().toISOString(),
    };

    await saveOrder(newOrder); // Async now!
    console.log("Order Saved:", newOrder.id);

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error: any) {
    console.error('Order API Error:', error);
    // Return exact error message for debugging
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}
