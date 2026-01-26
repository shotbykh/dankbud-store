import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PudoService } from '@/lib/pudo';
import { EmailService } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();

        // 1. Get Order with Member details using admin client
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*, members(*)')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error("Order fetch error:", orderError);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // SECURITY CHECK: Order must be PAID
        if (order.status !== 'PAID' && order.status !== 'DISPATCHED') {
            return NextResponse.json({ error: 'Order must be PAID before booking' }, { status: 403 });
        }

        // 2. Resolve Source Terminal
        let sourceTerminalId = process.env.PUDO_SOURCE_TERMINAL_ID;
        if (!sourceTerminalId && process.env.PUDO_SOURCE_TERMINAL_NAME) {
            const source = await PudoService.findTerminalByName(process.env.PUDO_SOURCE_TERMINAL_NAME);
            if (source) sourceTerminalId = source.id?.toString();
        }
        if (!sourceTerminalId) sourceTerminalId = "104"; // Fallback

        // 3. Create PUDO Booking
        const booking = await PudoService.createBooking(order, sourceTerminalId);

        if (!booking) {
            throw new Error('Failed to create PUDO booking');
        }

        // 4. Update Order in DB
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: 'DISPATCHED',
                address: {
                    ...order.address,
                    pudoBooking: booking
                }
            })
            .eq('id', orderId);

        if (updateError) {
            console.error("Order update error:", updateError);
            throw new Error('Failed to update order status');
        }

        // 5. Send Email Confirmation
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
        }

        return NextResponse.json({ success: true, booking });

    } catch (error: any) {
        console.error("PUDO Booking Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
