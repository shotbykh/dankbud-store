export const YOCO_TEST_PUBLIC_KEY = 'pk_test_c6178eab2rRObAE56664';
export const YOCO_TEST_SECRET_KEY = 'sk_test_81a1f07dbBo09Zz103b41bfab361';

interface CheckoutProps {
  amount: number; // In cents (e.g., R10.00 = 1000)
  currency: string;
  cancelUrl: string;
  successUrl: string;
  metadata?: any;
}

export async function createYocoCheckout(props: CheckoutProps) {
  try {
    // CORRECT ENDPOINT: Using payments.yoco.com for Hosted Checkout
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOCO_TEST_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: props.amount,
        currency: props.currency,
        cancelUrl: props.cancelUrl,
        successUrl: props.successUrl,
        metadata: props.metadata
      })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Yoco API Error:", errorBody);
        throw new Error(`Yoco Error: ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Yoco checkout:', error);
    throw error;
  }
}
