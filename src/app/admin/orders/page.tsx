'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminOrdersPage() {
    // Client Side Supabase
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, members(full_name, email, phone_number, id_number)')
            .order('created_at', { ascending: false });
        if (data) setOrders(data);
        setLoading(false);
    };

    const handleProcessOrder = async (orderId: string, isPaid: boolean) => {
        const msg = isPaid ? "Authorize PUDO Booking & Generate Waybill?" : "Confirm Payment & Book PUDO Courier?";
        if (!confirm(msg)) return;

        setProcessingId(orderId);
        try {
            const res = await fetch('/api/admin/orders/book-pudo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`✅ SUCCESS! Waybill: ${data.booking.waybill_number}`);
                fetchOrders(); // Refresh
            } else {
                alert(`❌ ERROR: ${data.error}`);
            }
        } catch (e: any) {
            alert("Network Error: " + e.message);
        }
        setProcessingId(null);
    };

    if (loading) return <div className="min-h-screen bg-black text-[#facc15] font-mono p-8 animate-pulse">Loading Console...</div>;

    return (
        <main className="min-h-screen bg-black text-[#facc15] font-mono p-2 md:p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#facc15] pb-4">
                <h1 className="text-xl md:text-3xl font-bold uppercase">DankBud Logistics</h1>
                <Link href="/" className="text-sm hover:underline">Exit Console</Link>
            </header>

            <div className="max-w-6xl mx-auto space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center opacity-50 py-20">No active orders found in database.</div>
                ) : (
                    orders.map((order) => {
                        // Extract Member Data if available
                        const member = order.members;

                        // Action Logic:
                        // 1. PUDO Delivery
                        // 2. Not yet Booked (no waybill)
                        // 3. Status is either PAID (Online) or PENDING (EFT waiting for verify)
                        const showPudoButton = order.delivery_method === 'PUDO' &&
                            !order.address?.pudoBooking &&
                            (order.status === 'PAID' || (order.status === 'PENDING' && (order.payment_method === 'EFT' || order.payment_method === 'CASH')));

                        return (
                            <div key={order.id} className="border border-[#facc15] p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden group">
                                {/* Status Indicator */}
                                <div className={`absolute top-0 right-0 p-2 font-bold text-xs uppercase ${order.status === 'PENDING' ? 'bg-orange-500 text-black' :
                                        order.status === 'PAID' ? 'bg-blue-500 text-white' :
                                            'bg-green-500 text-white'
                                    }`}>
                                    {order.status}
                                </div>

                                {/* Column 1: Logistics & Meta */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs opacity-50 uppercase">Order ID / Time</div>
                                        <div className="font-bold">#{order.id}</div>
                                        <div className="text-xs opacity-70">{new Date(order.created_at).toLocaleString()}</div>
                                    </div>

                                    <div className="bg-[#facc15]/10 p-3 border-l-4 border-[#facc15]">
                                        <div className="text-xs opacity-50 uppercase mb-1">Method</div>
                                        <div className="text-xl font-bold uppercase">{order.delivery_method}</div>

                                        {order.delivery_method === 'DELIVERY' && order.address && (
                                            <div className="mt-2 text-sm opacity-90 break-words">
                                                {order.address.street}<br />
                                                {order.address.suburb}, {order.address.code}<br />
                                                <span className="italic">"{order.address.instructions}"</span>
                                            </div>
                                        )}
                                        {order.delivery_method === 'PUDO' && order.address?.pudoTerminal && (
                                            <div className="mt-2 text-sm opacity-90 break-words">
                                                LOCKER: {order.address.pudoTerminal.name}<br />
                                                ID/CODE: {order.address.pudoTerminal.code || order.address.pudoTerminal.id}
                                            </div>
                                        )}
                                    </div>

                                    {/* MEMBER DETAILS (UPDATED) */}
                                    <div className="opacity-80 text-sm">
                                        <div className="text-xs opacity-50 uppercase">Member</div>
                                        {member ? (
                                            <>
                                                <div className="font-bold uppercase">{member.full_name || 'N/A'}</div>
                                                <div className="text-xs">{member.email}</div>
                                                <div className="text-xs">{member.phone_number}</div>
                                            </>
                                        ) : (
                                            <div className="italic text-xs text-red-500">
                                                Guest/Deleted ({order.memberId})
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Column 2: Items & Actions */}
                                <div className="space-y-4">
                                    <div className="bg-[#facc15]/10 p-4 border border-[#facc15]/30">
                                        <ul className="space-y-2 mb-4">
                                            {order.items.map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between text-sm border-b border-[#facc15]/20 pb-1">
                                                    <span className="font-bold">{item.quantity}x {item.name}</span>
                                                    <span className="opacity-50">R{item.price * item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex justify-between font-black text-xl">
                                            <span>TOTAL</span>
                                            <span>R{order.total}</span>
                                        </div>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div className="border-t border-[#facc15]/30 pt-4">
                                        <div className="font-bold text-sm mb-2">{order.payment_method} PAYMENT</div>

                                        {/* Authorization / Booking Button */}
                                        {showPudoButton && (
                                            <button
                                                onClick={() => handleProcessOrder(order.id, order.status === 'PAID')}
                                                disabled={!!processingId}
                                                className="w-full bg-[#facc15] text-black font-black uppercase py-3 hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {processingId === order.id ? (
                                                    'Booking...'
                                                ) : (
                                                    <>
                                                        <span>🔐</span>
                                                        <span>{order.status === 'PAID' ? 'Authorize & Book PUDO' : 'Verify & Book PUDO'}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Tracking Info Display */}
                                        {order.address?.pudoBooking && (
                                            <div className="bg-green-900/50 p-2 border border-green-500 text-xs">
                                                <div className="font-bold text-green-400">✅ WAYBILL: {order.address.pudoBooking.waybill}</div>
                                                <div className="font-mono mt-1">PIN: {order.address.pudoBooking.pin}</div>
                                            </div>
                                        )}

                                        {/* Info if manual delivery needed */}
                                        {order.delivery_method === 'DELIVERY' && order.status === 'PAID' && (
                                            <div className="text-xs text-center p-2 bg-gray-800 text-gray-400">
                                                Local Delivery (Manual Fulfillment)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </main>
    );
}
