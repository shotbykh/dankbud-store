'use client';

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    street: '',
    suburb: '',
    city: 'Port Elizabeth', // Default to PE
    code: '',
    instructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'EFT' | 'CASH'>('EFT');
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'COLLECTION'>('DELIVERY');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Fallback Auth: Get member ID from local storage to send as header
    let memberIdHeader = '';
    try {
        const stored = localStorage.getItem('dankbud-session');
        if (stored) {
            const member = JSON.parse(stored);
            memberIdHeader = member.email || member.idNumber || '';
            // NOTE: Ideally this should be member.id, but let's see what logging tells us
             if (member.id) memberIdHeader = member.id;
        }
    } catch (e) { console.error("Auth check failed", e); }

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-member-id': memberIdHeader 
            },
            body: JSON.stringify({
                items,
                total,
                address: formData,
                paymentMethod,
                deliveryMethod
            })
        });

        const data = await res.json();

        if (res.ok) {
            clearCart();
            router.push(`/checkout/success?orderId=${data.orderId}`);
        } else {
             if (res.status === 401) {
                 setError('Session expired. Please log in again to complete your order.');
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        }

    } catch (err) {
        setError('Network error. Check your connection.');
    } finally {
        setLoading(false);
    }
  };

  if (items.length === 0) {
      return (
          <div className="min-h-screen bg-[#facc15] flex flex-col items-center justify-center p-4">
              <h1 className="text-6xl font-archivo uppercase mb-4">Cart Empty</h1>
              <Link href="/shop" className="text-2xl underline font-mono">Go back to shop</Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#facc15] p-4 md:p-8 pt-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT: FORM */}
            <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-5xl font-archivo uppercase mb-8">Checkout</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500 text-white p-4 font-bold border-2 border-black animate-pulse flex flex-col items-start gap-2">
                            <span>{error}</span>
                            {error.includes('Session') && (
                                <Link href="/login" className="underline bg-white text-red-500 px-2 py-1 uppercase text-xs font-black">
                                    Login Now &rarr;
                                </Link>
                            )}
                        </div>
                    )}
                    
                    {/* Method Toggle - UPDATED LAYOUT */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button type="button" onClick={() => setDeliveryMethod('DELIVERY')} className={`p-4 border-4 border-black font-black uppercase text-xl transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'DELIVERY' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-100'}`}>
                            <span>DELIVERY</span>
                            <span className="text-3xl">🚚</span>
                        </button>
                        <button type="button" onClick={() => setDeliveryMethod('COLLECTION')} className={`p-4 border-4 border-black font-black uppercase text-xl transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'COLLECTION' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-100'}`}>
                            <span>COLLECT</span>
                            <span className="text-3xl">📦</span>
                        </button>
                    </div>

                    {deliveryMethod === 'DELIVERY' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-2xl font-black uppercase font-archivo border-b-2 border-black pb-2">Delivery Address</h3>
                            
                            <div>
                                <label className="block font-bold uppercase text-xs mb-1">Street Address</label>
                                <input 
                                    required 
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    type="text" 
                                    className="w-full bg-[#f3f4f6] border-2 border-black p-3 font-mono focus:bg-[#facc15] transition-colors outline-none" 
                                    placeholder="123 High Street" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold uppercase text-xs mb-1">Suburb</label>
                                    <input 
                                        required 
                                        name="suburb"
                                        value={formData.suburb}
                                        onChange={handleChange}
                                        type="text" 
                                        className="w-full bg-[#f3f4f6] border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none" 
                                        placeholder="Summerstrand" 
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase text-xs mb-1">Postal Code</label>
                                    <input 
                                        required 
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        type="text" 
                                        className="w-full bg-[#f3f4f6] border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none" 
                                        placeholder="6001" 
                                    />
                                </div>
                            </div>
    
                            <div>
                                <label className="block font-bold uppercase text-xs mb-1">City</label>
                                <input 
                                    disabled
                                    type="text" 
                                    value={formData.city} 
                                    className="w-full bg-gray-200 border-2 border-gray-400 p-3 font-mono text-gray-500 cursor-not-allowed" 
                                />
                                <p className="text-xs mt-1 text-gray-500">* We only deliver to Port Elizabeth currently.</p>
                            </div>
                            
                             <div>
                                <label className="block font-bold uppercase text-xs mb-1">Instructions (Optional)</label>
                                <textarea 
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    className="w-full bg-[#f3f4f6] border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none h-24" 
                                    placeholder="Gate code: 1234. Watch out for the dog." 
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#facc15] border-4 border-black p-6 animate-in fade-in zoom-in-95 duration-300">
                             <h3 className="text-2xl font-black uppercase font-archivo mb-4">Collection Point</h3>
                             <p className="font-bold text-lg mb-2">📍 WALMER, GQEBERHA</p>
                             <p className="font-mono text-sm mb-4">Exact address will be sent via WhatsApp after payment confirmation.</p>
                             <div className="bg-black text-white p-2 text-center text-xs uppercase font-bold">
                                No Delivery Fee
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 pt-6">
                        <h3 className="text-2xl font-black uppercase font-archivo border-b-2 border-black pb-2">Payment Method</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer border-4 border-black p-4 flex flex-col items-center justify-center transition-all ${paymentMethod === 'EFT' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="EFT" 
                                    checked={paymentMethod === 'EFT'} 
                                    onChange={() => setPaymentMethod('EFT')}
                                    className="hidden" 
                                />
                                <span className="text-3xl mb-2">💸</span>
                                <span className="font-bold uppercase">EFT / GeoPay</span>
                            </label>

                            <label className={`cursor-pointer border-4 border-black p-4 flex flex-col items-center justify-center transition-all ${paymentMethod === 'CASH' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="CASH" 
                                    checked={paymentMethod === 'CASH'} 
                                    onChange={() => setPaymentMethod('CASH')}
                                    className="hidden" 
                                />
                                <span className="text-3xl mb-2">💵</span>
                                <span className="font-bold uppercase">Cash on Drop</span>
                            </label>
                        </div>
                        
                        {/* BANKING DETAILS */}
                        {paymentMethod === 'EFT' && (
                             <div className="bg-gray-100 border-4 border-black p-4 text-sm font-mono animate-in fade-in slide-in-from-top-2">
                                <p className="font-bold uppercase mb-2 underline">Banking Details:</p>
                                <div className="grid grid-cols-[100px_1fr] gap-1">
                                    <span className="text-gray-500">Bank:</span>
                                    <span className="font-bold">FNB/RMB</span>
                                    
                                    <span className="text-gray-500">Account:</span>
                                    <span className="font-bold">62762988346 (Cheque)</span>
                                    
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-bold">Gess L Du Preez</span>
                                    
                                    <span className="text-gray-500">Branch:</span>
                                    <span className="font-bold">250655</span>
                                    
                                    <span className="text-gray-500">Ref:</span>
                                    <span className="font-bold bg-[#facc15] px-1">Order # (Shown Next)</span>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">* Please send proof of payment to confirm order.</p>
                             </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-black text-[#facc15] text-3xl font-archivo uppercase hover:bg-[#d946ef] hover:text-white transition-colors border-4 border-transparent hover:border-black mt-8 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <span className="relative z-10">{loading ? 'Processing...' : `Place Order & Pay R${total}`}</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 mix-blend-difference"></div>
                    </button>
                    
                    <p className="text-center font-mono text-xs text-gray-500 mt-4">
                        By placing this order you utilize your private member rights.
                    </p>
                </form>
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="space-y-6">
                <div className="bg-black text-[#facc15] p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                     <h2 className="text-3xl font-archivo uppercase mb-4 border-b-2 border-[#facc15] pb-2">Order Summary</h2>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-lg border-b border-white/20 pb-2">
                                <div className="flex-1">
                                    <div className="font-bold text-[#facc15]">{item.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                         <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-[#facc15] text-black font-bold flex items-center justify-center rounded hover:bg-white">-</button>
                                         <span>{item.quantity}</span>
                                         <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-[#facc15] text-black font-bold flex items-center justify-center rounded hover:bg-white">+</button>
                                    </div>
                                </div>
                                <div className="font-mono text-xl">R{item.price * item.quantity}</div>
                            </div>
                        ))}
                     </div>
                     <div className="mt-6 pt-4 border-t-2 border-[#facc15] flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold uppercase">Total</span>
                            <span className="text-xs opacity-75">{items.reduce((s,i)=>s+i.quantity,0)} Items</span>
                        </div>
                        <span className="text-5xl font-archivo">R{total}</span>
                     </div>
                </div>

                <div className="bg-white p-6 border-4 border-black font-mono text-sm">
                    <p className="font-bold uppercase underline mb-2">Secure Checkout</p>
                    <p>Your order is encrypted and processed securely. We do not store your banking details. Delivery is strictly to the registered member's address in Port Elizabeth.</p>
                </div>
            </div>

        </div>
    </div>
  );
}
