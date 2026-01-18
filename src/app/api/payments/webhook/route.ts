import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook Received:", body);

    // Yoco Webhook Structure:
    // {
    //   type: "payment.succeeded",
    //   payload: {
    //     metadata: { orderId: "..." },
    //     status: "successful",
    //     ...
    //   }
    // }

    const eventType = body.type;
    const payload = body.payload;

    if (eventType === 'payment.succeeded') {
        const orderId = payload.metadata?.orderId;
        
        if (orderId) {
            console.log(`[Webhook] Marking Order ${orderId} as PAID`);
            await updateOrderStatus(orderId, 'PAID');
            return NextResponse.json({ received: true, status: 'updated' });
        } else {
             console.warn("[Webhook] No orderId found in metadata");
             return NextResponse.json({ received: true, status: 'ignored_no_id' });
        }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
