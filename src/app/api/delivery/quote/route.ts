import { NextResponse } from 'next/server';

// Your pickup location coordinates (41 Newcombe Ave, Walmer Heights)
const ORIGIN_LAT = -33.9697;
const ORIGIN_LNG = 25.6174;

// Pricing formula
const BASE_RATE = 30;    // R30 base
const RATE_PER_KM = 5;   // R5 per km
const MARKUP = 10;       // R10 markup

// OpenStreetMap Nominatim for geocoding (free)
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('q', address);
        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '1');
        
        const res = await fetch(url.toString(), {
            headers: { 'User-Agent': 'DankBud-Delivery/1.0' }
        });
        const data = await res.json();
        
        if (data && data[0]) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
    } catch (e) {
        console.error('Geocoding error:', e);
        return null;
    }
}

// OSRM for actual driving distance (free)
async function getRouteDistance(originLat: number, originLng: number, destLat: number, destLng: number): Promise<{ distance_km: number; duration_min: number } | null> {
    try {
        // OSRM uses lng,lat order
        const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
            const route = data.routes[0];
            return {
                distance_km: Math.ceil(route.distance / 1000), // meters to km, round up
                duration_min: Math.ceil(route.duration / 60)    // seconds to minutes
            };
        }
        return null;
    } catch (e) {
        console.error('OSRM error:', e);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const { address } = await request.json();
        
        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const fullAddress = `${address.street}, ${address.suburb}, ${address.code}, Port Elizabeth, South Africa`;
        
        // Step 1: Geocode the destination address
        const destCoords = await geocodeAddress(fullAddress);
        
        if (!destCoords) {
            // Fallback if geocoding fails
            console.warn('Geocoding failed, using fallback');
            return NextResponse.json({
                distance_km: null,
                delivery_fee: 80,
                duration_text: 'Est. 30-45 min',
                breakdown: { base: BASE_RATE, distance_fee: 40, markup: MARKUP },
                fallback: true
            });
        }

        // Step 2: Get driving distance using OSRM
        const route = await getRouteDistance(ORIGIN_LAT, ORIGIN_LNG, destCoords.lat, destCoords.lng);
        
        if (!route) {
            // Fallback if routing fails
            console.warn('OSRM routing failed, using fallback');
            return NextResponse.json({
                distance_km: null,
                delivery_fee: 80,
                duration_text: 'Est. 30-45 min',
                breakdown: { base: BASE_RATE, distance_fee: 40, markup: MARKUP },
                fallback: true
            });
        }

        // Step 3: Calculate fee
        const distanceFee = route.distance_km * RATE_PER_KM;
        const deliveryFee = BASE_RATE + distanceFee + MARKUP;

        return NextResponse.json({
            distance_km: route.distance_km,
            distance_text: `${route.distance_km} km`,
            duration_text: `${route.duration_min} min`,
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
            delivery_fee: 80,
            fallback: true 
        }, { status: 500 });
    }
}
