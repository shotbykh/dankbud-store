import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers';
import { PudoService } from '@/lib/pudo';
import { EmailService } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();

        // Server Side Supabase
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        );

        // 1. Get Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, members(*)') // Fetch member details too
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 2. Book PUDO
        // Use default source terminal if not set in env (104 is a fallback example, usually Env var)
        // The service handles PUDO vs Door logic internally based on order.delivery_method

        // Resolve Source Terminal
        let sourceTerminalId = process.env.PUDO_SOURCE_TERMINAL_ID;
        if (!sourceTerminalId && process.env.PUDO_SOURCE_TERMINAL_NAME) {
            const source = await PudoService.findTerminalByName(process.env.PUDO_SOURCE_TERMINAL_NAME);
            if (source) sourceTerminalId = source.id?.toString();
        }
        if (!sourceTerminalId) sourceTerminalId = "104"; // Fallback to Miramar ID

        const booking = await PudoService.createBooking(order, sourceTerminalId!);

        if (!booking) {
            throw new Error('Failed to create PUDO booking');
        }

        // 3. Update Order in DB
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'DISPATCHED', // Move to fully shipped
                address: {
                    ...order.address,
                    pudoBooking: booking // Save Waybill & PIN
                }
            })
            .eq('id', orderId);

        if (updateError) {
            throw new Error('Failed to update order status');
        }

        // 4. Send Emails (Fire and visible error if fails, but don't block 200 OK)
        try {
            if (order.members) {
                await EmailService.sendPudoConfirmation(
                    order.members.email,
                    order.members.full_name,
                    orderId,
                    {
                        pin: booking.pin,
                        waybill: booking.waybill_number,
                        trackingUrl: booking.tracking_url,
                        lockerName: order.address.pudoTerminal?.name
                    }
                );
            }
        } catch (emailErr) {
            console.error("Email failed:", emailErr);
            // We continue, as the booking itself is done.
        }

        return NextResponse.json({ success: true, booking });

    } catch (error: any) {
        console.error("Booking Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
