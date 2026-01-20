import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const eventType = body.type;
        const payload = body.payload;

        if (eventType === 'payment.succeeded') {
            const orderId = payload.metadata?.orderId;

            if (orderId) {
                console.log(`✅ [Webhook] Payment Succeeded for Order ${orderId}`);

                // 1. Mark Order as PAID
                // NO Automated PUDO Booking. Authorization is now manual in Admin Console.
                await updateOrderStatus(orderId, 'PAID');

                console.log("ℹ️ [Webhook] Order marked PAID. Awaiting Admin Authorization for PUDO.");

                return NextResponse.json({ received: true, status: 'updated' });
            } else {
                console.warn("⚠️ [Webhook] No Order ID in metadata");
                return NextResponse.json({ received: true, status: 'no_metadata' });
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("❌ [Webhook] Error:", error.message);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}
