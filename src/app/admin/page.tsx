'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/db';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOrderId, setBookingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        const data = await res.json();
        setOrders(data.orders || []);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const fetchLogs = async () => {
      try {
          const res = await fetch('/api/admin/audit'); 
          const data = await res.json();
          setAuditLogs(data.logs || []);
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
    fetchOrders();
    fetchLogs();
    const interval = setInterval(() => {
        fetchOrders();
        fetchLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, status: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status })
      });
      fetchOrders();
  };

  const bookPudo = async (orderId: string) => {
      setBookingOrderId(orderId);
      try {
          const res = await fetch('/api/admin/orders/book-pudo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId })
          });
          const data = await res.json();
          if (data.success) {
              alert(`✅ PUDO Booked!\nWaybill: ${data.booking?.waybill_number}\nPIN: ${data.booking?.pin}`);
              fetchOrders();
          } else {
              alert(`❌ Booking failed: ${data.error}`);
          }
      } catch (e: any) {
          alert(`❌ Error: ${e.message}`);
      } finally {
          setBookingOrderId(null);
      }
  };

  const getPudoBooking = (order: Order) => {
      return (order.address as any)?.pudoBooking;
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-mono">
        <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
            <h1 className="text-4xl font-bold uppercase text-[#facc15]">Command Center</h1>
            <div className="flex gap-4">
                <Link href="/admin/members" className="px-4 py-2 border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black font-bold uppercase transition-colors">
                    Manage Members &rarr;
                </Link>
                <Link href="/admin/suppliers" className="px-4 py-2 border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black font-bold uppercase transition-colors">
                    Suppliers &rarr;
                </Link>
                <div className="w-px bg-white/20"></div>
                <span className="animate-pulse text-xs text-green-500 self-center">● LIVE</span>
                <button onClick={fetchOrders} className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors">
                    REFRESH
                </button>
            </div>
        </div>

        <div className="grid gap-6 max-w-7xl mx-auto">
            {loading && orders.length === 0 && <div className="text-center py-20 text-[#facc15] animate-pulse">Establishing Uplink...</div>}
            
            {!loading && orders.length === 0 && <div className="text-center py-20 text-gray-500">No active orders.</div>}

            {orders.length > 0 && orders.map(order => {
                const pudoBooking = getPudoBooking(order);
                const isPudo = order.deliveryMethod === 'PUDO';
                const canBookPudo = isPudo && order.status === 'PAID' && !pudoBooking;
                const isBooking = bookingOrderId === order.id;

                return (
                <div key={order.id} className="bg-black border border-white/20 p-6 flex flex-col md:flex-row gap-6 hover:border-[#facc15] transition-colors relative group shadow-lg">
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 font-bold text-xs border ${
                        order.status === 'PENDING' ? 'bg-orange-500 text-black border-orange-500' :
                        order.status === 'PAID' ? 'bg-blue-500 text-black border-blue-500' :
                        'bg-green-500 text-black border-green-500'
                    }`}>
                        {order.status}
                    </div>

                    <div className="flex-1">
                        <div className="text-xl font-bold mb-2 text-[#facc15]">#{order.id}</div>
                        <div className="text-xs text-gray-500 mb-4">{new Date(order.createdAt).toLocaleString()}</div>
                        
                        <div className="mb-4 space-y-1">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex gap-2 text-sm border-b border-white/10 pb-1">
                                    <span className="text-[#facc15] font-bold">{item.quantity}x</span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-2xl font-bold">R{order.total} <span className="text-sm font-normal text-gray-400">via {order.paymentMethod}</span></div>
                    </div>

                    <div className="w-px bg-white/20 hidden md:block"></div>

                    <div className="flex-1 text-sm text-gray-400 bg-white/5 p-4 rounded">
                        <div className="font-bold text-white mb-2 uppercase border-b border-white/20 pb-1">{order.deliveryMethod}</div>
                        {order.deliveryMethod === 'DELIVERY' && order.address ? (
                            <>
                                <div className="text-white">{order.address.street}</div>
                                <div className="text-white">{order.address.suburb}, {order.address.code}</div>
                                {order.address.instructions && <div className="mt-2 italic text-[#facc15]">"{order.address.instructions}"</div>}
                            </>
                        ) : order.deliveryMethod === 'PUDO' && order.address?.pudoTerminal ? (
                            <>
                                <div className="text-white">📦 {order.address.pudoTerminal.name}</div>
                                {pudoBooking && (
                                    <div className="mt-2 p-2 bg-green-900/50 border border-green-500 rounded">
                                        <div className="text-green-400 font-bold text-xs">✅ BOOKED</div>
                                        <div className="text-white">Waybill: {pudoBooking.waybill_number}</div>
                                        <div className="text-[#facc15] font-bold">PIN: {pudoBooking.pin}</div>
                                        {pudoBooking.tracking_url && (
                                            <a href={pudoBooking.tracking_url} target="_blank" className="text-blue-400 underline text-xs">Track →</a>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-[#facc15]">📦 Customer Collecting from Walmer</div>
                        )}
                        <div className="mt-4 text-xs font-mono">Member: {order.memberId}</div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col gap-2 justify-center w-full md:w-40">
                        {order.status === 'PENDING' && (
                            <button onClick={() => updateStatus(order.id, 'PAID')} className="bg-blue-600 hover:bg-blue-500 text-white py-3 font-bold uppercase text-xs tracking-wider">
                                Mark Paid
                            </button>
                        )}
                        
                        {/* BOOK PUDO BUTTON */}
                        {canBookPudo && (
                            <button 
                                onClick={() => bookPudo(order.id)} 
                                disabled={isBooking}
                                className="bg-purple-600 hover:bg-purple-500 text-white py-3 font-bold uppercase text-xs tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isBooking ? '⏳ Booking...' : '📦 Book PUDO'}
                            </button>
                        )}

                        {(order.status === 'PENDING' || order.status === 'PAID') && !canBookPudo && (
                             <button onClick={() => updateStatus(order.id, 'DISPATCHED')} className="bg-green-600 hover:bg-green-500 text-white py-3 font-bold uppercase text-xs tracking-wider">
                                Dispatch
                            </button>
                        )}
                        
                        {order.status === 'DISPATCHED' && (
                             <div className="text-center">
                                <span className="text-green-500 font-bold uppercase text-xs border border-green-500 px-2 py-1 block mb-2">Completed</span>
                                <button onClick={() => updateStatus(order.id, 'PENDING')} className="text-[10px] text-gray-600 underline hover:text-gray-400">Reset</button>
                             </div>
                        )}
                    </div>
                </div>
            )})}
        </div>

        {/* AUDIT LOGS SECTION */}
        <div className="max-w-7xl mx-auto mt-12 border-t border-white/20 pt-8">
            <h2 className="text-2xl font-bold uppercase text-[#facc15] mb-6">Security Audit Log</h2>
            <div className="bg-black border border-white/20 p-6 overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                    <thead>
                        <tr className="border-b border-white/20 text-gray-500 uppercase">
                            <th className="py-2">Time</th>
                            <th className="py-2">Staff Member</th>
                            <th className="py-2">Action</th>
                            <th className="py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.length === 0 ? (
                            <tr><td colSpan={4} className="py-4 text-center text-gray-500">No logs found.</td></tr>
                        ) : (
                            auditLogs.map((log) => (
                                <tr key={log.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                    <td className="py-2 text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="py-2 font-bold text-white">{log.adminName}</td>
                                    <td className="py-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                                            log.action === 'LOGIN' ? 'bg-green-900 text-green-300' :
                                            log.action === 'BAN' ? 'bg-red-900 text-red-300' :
                                            'bg-gray-800 text-gray-300'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-2 text-gray-500 truncate max-w-xs">
                                        {JSON.stringify(log.details)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
