import { NextResponse } from 'next/server';

// Your pickup location
const ORIGIN = '41 Newcombe Avenue, Walmer Heights, Port Elizabeth, South Africa';

// Pricing formula
const BASE_RATE = 30;    // R30 base
const RATE_PER_KM = 5;   // R5 per km
const MARKUP = 10;       // R10 markup

export async function POST(request: Request) {
    try {
        const { address } = await request.json();
        
        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const fullAddress = `${address.street}, ${address.suburb}, ${address.code}, Port Elizabeth, South Africa`;
        
        const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        
        if (!GOOGLE_MAPS_API_KEY) {
            // Fallback to flat rate if no API key
            console.warn('No Google Maps API key, using flat rate');
            return NextResponse.json({
                distance_km: null,
                delivery_fee: 80, // Fallback flat rate
                breakdown: {
                    base: BASE_RATE,
                    distance_fee: 40,
                    markup: MARKUP
                },
                fallback: true
            });
        }

        // Call Google Maps Distance Matrix API
        const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
        url.searchParams.set('origins', ORIGIN);
        url.searchParams.set('destinations', fullAddress);
        url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
        url.searchParams.set('units', 'metric');

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) {
            throw new Error('Google Maps API error: ' + data.status);
        }

        const element = data.rows[0].elements[0];
        
        if (element.status !== 'OK') {
            throw new Error('Could not calculate distance: ' + element.status);
        }

        // Distance in km
        const distanceM = element.distance.value; // meters
        const distanceKm = Math.ceil(distanceM / 1000); // round up to nearest km

        // Calculate fee
        const distanceFee = distanceKm * RATE_PER_KM;
        const deliveryFee = BASE_RATE + distanceFee + MARKUP;

        return NextResponse.json({
            distance_km: distanceKm,
            distance_text: element.distance.text,
            duration_text: element.duration.text,
            delivery_fee: deliveryFee,
            breakdown: {
                base: BASE_RATE,
                distance_fee: distanceFee,
                markup: MARKUP
            }
        });

    } catch (error: any) {
        console.error('Delivery quote error:', error);
        return NextResponse.json({ 
            error: error.message,
            delivery_fee: 80, // Fallback
            fallback: true 
        }, { status: 500 });
    }
}
