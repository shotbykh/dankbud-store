'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function AccountPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [memberId, setMemberId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
             // Fallback Auth Logic: Check localStorage if cookie fails
            let headers: any = {};
            const stored = localStorage.getItem('dankbud-session');
            if (stored) {
                try {
                    const member = JSON.parse(stored);
                    
                    // CRITICAL FIX: Prioritize UUID (member.id) because that is what Orders are linked to.
                    // Fallback to email/idNumber only for legacy support (though likely won't work for new orders).
                    headers['x-member-id'] = member.id || member.email || member.idNumber || '';
                    
                    console.log("Account Page: Fetching orders for member:", headers['x-member-id']);
                } catch (e) {
                    console.error("Failed to parse session", e);
                }
            }

            try {
                const res = await fetch('/api/account/orders', { headers });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders);
                    setMemberId(data.memberId);
                } else {
                     // If unauthorized, maybe redirect to login?
                     console.warn("Unauthorized to fetch orders");
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-[#facc15] font-mono pt-32 p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* ID CARD */}
                <div className="bg-black text-white p-8 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 font-black text-9xl leading-none select-none">DB</div>
                    <h1 className="text-4xl font-black uppercase mb-2 text-[#facc15]">Member Card</h1>
                    <div className="space-y-1 font-mono text-sm opacity-80">
                        <p>ID: {memberId || 'Loading...'}</p>
                        <p>CLUB: PORT ELIZABETH</p>
                        <p>STATUS: <span className="text-green-500 font-bold">ACTIVE</span></p>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
                    <h2 className="text-4xl font-black uppercase font-archivo">Order History</h2>
                    <Link href="/shop" className="bg-black text-[#facc15] px-6 py-3 font-bold uppercase hover:bg-white hover:text-black border-4 border-black transition-colors">
                        Back to Shop
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 animate-pulse font-bold text-2xl">Loading Records...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 border-4 border-black bg-white">
                        <p className="text-2xl font-bold mb-4">No orders yet.</p>
                        <Link href="/shop" className="underline">Start your stash</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white border-4 border-black p-6 relative group transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="font-black text-2xl">#{order.id}</span>
                                            <span className={`px-3 py-1 text-xs font-bold uppercase border-2 ${
                                                order.status === 'PENDING' ? 'bg-orange-100 border-orange-500 text-orange-600' :
                                                order.status === 'PAID' ? 'bg-blue-100 border-blue-500 text-blue-600' :
                                                order.status === 'DISPATCHED' ? 'bg-purple-100 border-purple-500 text-purple-600' :
                                                'bg-green-100 border-green-500 text-green-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-gray-500 text-xs font-mono mb-4">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                        <div className="space-y-1">
                                            {order.items.map((item: any, i: number) => (
                                                <div key={i} className="text-sm font-bold">
                                                    {item.quantity}x {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end">
                                        <div className="text-3xl font-black font-archivo">R{order.total}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
