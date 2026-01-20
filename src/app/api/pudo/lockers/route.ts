import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const PUDO_ENV = process.env.PUDO_ENV || 'sandbox';
    const API_KEY = process.env.PUDO_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: No PUDO API Key' }, { status: 500 });
    }

    // Use hyphen for production as verified by debug script
    const BASE_URL = PUDO_ENV === 'production' 
      ? 'https://api-pudo.co.za/api/v1' 
      : 'https://sandbox.api-pudo.co.za/api/v1';

    console.log(`🔌 [PUDO] Fetched lockers from ${BASE_URL}...`);

    const res = await fetch(`${BASE_URL}/lockers-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store' // Force fresh fetch
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error(`❌ [PUDO] Error: ${res.status} ${errText}`);
        return NextResponse.json({ error: `PUDO API Error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    console.log(`✅ [PUDO] Fetched ${data?.length || 0} lockers/terminals.`);

    return NextResponse.json(data);

  } catch (err: any) {
    console.error("❌ [PUDO] Exception:", err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
