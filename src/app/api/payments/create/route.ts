import { NextResponse } from 'next/server';
import { createYocoCheckout } from '@/lib/yoco';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, orderId, cartItems } = body;

    // Basic Validation
    if (!amount || !orderId) {
      return NextResponse.json({ error: 'Missing amount or orderId' }, { status: 400 });
    }

    // Amount needs to be in cents
    const amountInCents = Math.round(parseFloat(amount) * 100);
    console.log(`[Payment] Initiating Yoco Checkout: Order ${orderId}, Amount ${amountInCents} cents`);

    const checkout = await createYocoCheckout({
      amount: amountInCents,
      currency: 'ZAR',
      cancelUrl: `https://dankbud.co.za/checkout`, // Send them back to checkout if they cancel
      successUrl: `https://dankbud.co.za/checkout/success?orderId=${orderId}&payment=success`,
      metadata: {
        orderId: orderId,
        items: JSON.stringify(cartItems?.map((i:any) => i.name).slice(0, 3) || []) // Store brief summary
      }
    });

    return NextResponse.json({ redirectUrl: checkout.redirectUrl });

  } catch (error: any) {
    console.error('Payment creation failed:', error);
    // Return the actual error message
    return NextResponse.json({ error: error.message || 'Payment initialization failed' }, { status: 500 });
  }
}
