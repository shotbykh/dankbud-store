import { NextResponse } from 'next/server';
import { saveOrder, Order } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // DEBUG LOGGING
    console.log("Processing Order...");
    
    // Validate session: Check COOKIE first, then HEADER fallback
    const cookieStore = await cookies();
    const session = cookieStore.get('dankbud_session');
    const headerAuth = req.headers.get('x-member-id');
    
    console.log("Auth Debug:", { cookie: session?.value, header: headerAuth });

    // Auth is valid if either cookie or header is present
    const memberId = session?.value || headerAuth;
    
    if (!memberId) {
        return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const { items, total, address, paymentMethod, deliveryMethod } = data;

    if (!items || items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        memberId: memberId, 
        items,
        total,
        status: 'PENDING',
        address: deliveryMethod === 'COLLECTION' ? undefined : address,
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
