import { getOrders } from "@/lib/db";
import Link from "next/link";

// Force fresh data
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // Directly fetch from DB (Server Component)
  const orders = (await getOrders()).reverse(); 

  return (
    <main className="min-h-screen bg-black text-[#facc15] font-mono p-8">
      <header className="flex justify-between items-center mb-12 border-b border-[#facc15] pb-4">
        <h1 className="text-3xl font-bold uppercase">DankBud Logistics</h1>
        <Link href="/" className="text-sm hover:underline">Exit Console</Link>
      </header>

      <div className="max-w-6xl mx-auto space-y-6">
         {orders.length === 0 ? (
            <div className="text-center opacity-50 py-20">No active orders found in database.</div>
         ) : (
             orders.map((order) => (
                <div key={order.id} className="border border-[#facc15] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden group">
                    {/* Status Indicator */}
                    <div className={`absolute top-0 right-0 p-2 font-bold text-xs uppercase ${
                        order.status === 'PENDING' ? 'bg-orange-500 text-black' :
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
                            <div className="text-xs opacity-70">{new Date(order.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="bg-[#facc15]/10 p-3 border-l-4 border-[#facc15]">
                             <div className="text-xs opacity-50 uppercase mb-1">Method</div>
                             <div className="text-xl font-bold uppercase">{order.deliveryMethod}</div>
                             
                             {order.deliveryMethod === 'DELIVERY' && order.address && (
                                <div className="mt-2 text-sm opacity-90 break-words">
                                    {order.address.street}<br/>
                                    {order.address.suburb}, {order.address.code}<br/>
                                    <span className="italic">"{order.address.instructions}"</span>
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Column 2: Client Contact */}
                    <div className="space-y-4">
                         <div>
                             <div className="text-xs opacity-50 uppercase">Member</div>
                             {/* Determining member name requires member lookup, for now showing ID or we'd need to join tables */}
                             <div className="text-lg font-bold break-all">{order.memberId}</div> 
                         </div>

                         <div>
                            <div className="text-xs opacity-50 uppercase mb-1">Payment</div>
                            <div className="font-bold text-lg mb-2">{order.paymentMethod}</div>
                         </div>
                    </div>

                     {/* Column 3: The Stash (Packing List) */}
                     <div className="bg-[#facc15]/10 p-4 border border-[#facc15]/30">
                        <div className="text-xs opacity-50 uppercase mb-2">Packing Slip</div>
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
                </div>
             ))
         )}
      </div>
    </main>
  );
}
