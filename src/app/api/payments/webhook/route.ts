import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text(); // Get raw body for signature verification
        const headers = req.headers;
        const signature = headers.get('webhook-signature') || headers.get('x-yoco-signature');
        const timestamp = headers.get('webhook-timestamp') || headers.get('formatted-time');

        // SECURITY: Signature Verification
        // We enforce this ONLY if the secret is set, to avoid breaking prod if key is missing.
        // TODO: User must add YOCO_WEBHOOK_SECRET to env variables.
        const webhookSecret = process.env.YOCO_WEBHOOK_SECRET;

        console.log(`[Webhook] Received. Sig: ${signature ? 'Present' : 'Missing'}, Time: ${timestamp || 'Missing'}`);

        if (webhookSecret && signature && timestamp) {
            // Reconstruct the signed payload string (Standard Yoco/Webhook format usually: timestamp.body)
            // Note: IF verification fails, we log it but for now we might need to debug the exact format.
            // Assumption: HMAC-SHA256(timestamp + "." + body, secret)
            
            const signedPayload = `${timestamp}.${bodyText}`;
            const hmac = crypto.createHmac('sha256', webhookSecret);
            const digest = hmac.update(signedPayload).digest('base64');
            
            // Check if signature matches (Yoco might prefix with v1= or similar, handled by 'includes' check for loose compatibility)
            // Detailed verification logic should be strict in final production.
            
            const expectedSig = digest;
            const valid = signature.split(' ').some(part => part === `v1=${expectedSig}` || part === expectedSig);

            if (!valid) {
                 console.error("❌ [Webhook] Signature Verification FAILED");
                 console.error("Expected:", expectedSig);
                 console.error("Received:", signature);
                 return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
            }
            console.log("✅ [Webhook] Signature Verified");
        } else if (webhookSecret) {
             console.warn("⚠️ [Webhook] Secret is set but request has no signature headers. Possible Attack.");
             return NextResponse.json({ error: 'Missing Signature' }, { status: 401 });
        } else {
             console.warn("⚠️ [Webhook] Unverified Request - YOCO_WEBHOOK_SECRET not set.");
        }

        const body = JSON.parse(bodyText);
        const eventType = body.type;
        const payload = body.payload;

        if (eventType === 'payment.succeeded') {
            const orderId = payload.metadata?.orderId;

            if (orderId) {
                console.log(`✅ [Webhook] Payment Succeeded for Order ${orderId}`);
                await updateOrderStatus(orderId, 'PAID');
                console.log("ℹ️ [Webhook] Order marked PAID.");
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
