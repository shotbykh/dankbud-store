'use client';

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LockerSelector from "@/components/shop/LockerSelector";

// RATES
const RATES = {
    COLLECTION: 0,
    PUDO_LOCKER: 60,
    PUDO_DOOR: 100
};

// Types
interface PudoTerminal {
    id?: number;
    code?: string;
    name: string;
    address: string;
    city?: string;
    detailed_address?: {
        city?: string;
        locality?: string;
        sublocality?: string;
        postal_code?: string;
    };
    latitude: string;
    longitude: string;
    status: string;
}

export default function CheckoutPage() {
    const { items, total: cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        street: '',
        suburb: '',
        city: 'Port Elizabeth',
        code: '',
        instructions: ''
    });

    const [paymentMethod, setPaymentMethod] = useState<'EFT' | 'CASH' | 'ONLINE'>('ONLINE');

    // Logic
    const [mainMethod, setMainMethod] = useState<'DELIVERY' | 'COLLECTION'>('DELIVERY');
    const [pudoType, setPudoType] = useState<'DOOR' | 'LOCKER'>('LOCKER');
    const [selectedLocker, setSelectedLocker] = useState<PudoTerminal | null>(null);

    // Derived Shipping Cost
    const shippingCost = mainMethod === 'COLLECTION' ? 0 : (pudoType === 'LOCKER' ? RATES.PUDO_LOCKER : RATES.PUDO_DOOR);

    // Auto-switch payment if switching to Delivery (Cash not allowed)
    useEffect(() => {
        if (mainMethod === 'DELIVERY' && paymentMethod === 'CASH') {
            setPaymentMethod('ONLINE');
        }
    }, [mainMethod, paymentMethod]);

    // Final Total
    const finalTotal = cartTotal + shippingCost;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFixSession = () => {
        localStorage.removeItem('dankbud-session');
        window.location.href = '/login';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let backendDeliveryMethod = 'COLLECTION';
        if (mainMethod === 'DELIVERY') {
            backendDeliveryMethod = pudoType === 'DOOR' ? 'DELIVERY' : 'PUDO';
        }

        if (backendDeliveryMethod === 'PUDO' && !selectedLocker) {
            setError('Please choose a PUDO locker.');
            setLoading(false);
            return;
        }

        let memberIdHeader = '';
        try {
            const stored = localStorage.getItem('dankbud-session');
            if (stored) {
                const member = JSON.parse(stored);
                memberIdHeader = member.email || member.idNumber || '';
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
                    total: finalTotal, // Send Final Total with Shipping
                    address: formData,
                    paymentMethod,
                    deliveryMethod: backendDeliveryMethod,
                    pudoTerminal: selectedLocker ? { id: selectedLocker.code || selectedLocker.id || 'UNKNOWN', name: selectedLocker.name } : null
                })
            });

            const data = await res.json();

            if (res.ok) {
                if (paymentMethod === 'ONLINE') {
                    try {
                        const payRes = await fetch('/api/payments/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                amount: finalTotal, // Charge Final Total
                                orderId: data.orderId,
                                cartItems: items
                            })
                        });
                        const payData = await payRes.json();

                        if (payData.redirectUrl) {
                            clearCart();
                            window.location.href = payData.redirectUrl;
                            return;
                        } else {
                            throw new Error(payData.error || "Payment link generation failed");
                        }
                    } catch (payErr: any) {
                        setError(payErr.message || "Payment Gateway Error.");
                        setLoading(false);
                        return;
                    }
                }

                clearCart();
                router.push(`/checkout/success?orderId=${data.orderId}`);
            } else {
                const errorMsg = JSON.stringify(data);
                if (res.status === 401 || errorMsg.includes('foreign key') || errorMsg.includes('constraint')) {
                    setError('Session STALE. Please click "Fix Session" below.');
                } else {
                    setError(data.error || 'Something went wrong. Please try again.');
                }
                setLoading(false);
            }

        } catch (err) {
            setError('Network error. Check your connection.');
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
        <div className="min-h-screen bg-[#facc15] p-4 md:p-8 pt-12 md:pt-32">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT: FORM */}
                <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-4xl md:text-5xl font-archivo uppercase mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-500 text-white p-4 font-bold border-2 border-black animate-pulse flex flex-col items-start gap-2">
                                <span>{error}</span>
                                {(error.includes('Session') || error.includes('STALE')) && (
                                    <button type="button" onClick={handleFixSession} className="underline bg-white text-red-500 px-4 py-2 uppercase text-sm font-black hover:bg-black hover:text-[#facc15] transition-colors">
                                        🔄 Fix Session (Relogin) &rarr;
                                    </button>
                                )}
                            </div>
                        )}

                        {/* MAIN METHOD TOGGLE - RESPONSIVE FIX */}
                        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
                            <button type="button" onClick={() => setMainMethod('DELIVERY')} className={`p-2 md:p-4 border-2 md:border-4 border-black font-black uppercase text-sm md:text-xl transition-all flex flex-col items-center justify-center gap-1 md:gap-2 ${mainMethod === 'DELIVERY' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-100'}`}>
                                <span className="text-center w-full leading-tight">DELIVERY</span>
                                <span className="text-2xl md:text-3xl">🚚</span>
                            </button>
                            <button type="button" onClick={() => setMainMethod('COLLECTION')} className={`p-2 md:p-4 border-2 md:border-4 border-black font-black uppercase text-sm md:text-xl transition-all flex flex-col items-center justify-center gap-1 md:gap-2 ${mainMethod === 'COLLECTION' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-100'}`}>
                                <span className="text-center w-full leading-tight">COLLECT</span>
                                <span className="text-2xl md:text-3xl">📦</span>
                            </button>
                        </div>

                        {/* SUB-TOGGLE FOR DELIVERY */}
                        {mainMethod === 'DELIVERY' && (
                            <div className="bg-gray-100 p-2 md:p-4 border-2 border-gray-200 animate-in fade-in slide-in-from-top-2 mb-6">
                                <p className="font-bold uppercase text-[10px] md:text-xs mb-2 text-center text-gray-500">Select Delivery Type</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setPudoType('LOCKER')} className={`p-2 md:p-3 border-2 border-black font-bold uppercase text-xs md:text-sm transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 ${pudoType === 'LOCKER' ? 'bg-[#facc15] text-black' : 'bg-white text-gray-500'}`}>
                                        <span className="text-xl">🔐</span>
                                        <span>PUDO Locker (+R60)</span>
                                    </button>
                                    <button type="button" onClick={() => setPudoType('DOOR')} className={`p-2 md:p-3 border-2 border-black font-bold uppercase text-xs md:text-sm transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 ${pudoType === 'DOOR' ? 'bg-[#facc15] text-black' : 'bg-white text-gray-500'}`}>
                                        <span className="text-xl">🏠</span>
                                        <span>Local Delivery (+R100)</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* LOCKER SELECTOR */}
                        {mainMethod === 'DELIVERY' && pudoType === 'LOCKER' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h3 className="text-2xl font-black uppercase font-archivo border-b-2 border-black pb-2">Choose Locker</h3>
                                <p className="text-sm font-mono text-gray-600">Secure, anonymous collection from a locker near you.</p>

                                <LockerSelector
                                    onSelect={(locker) => setSelectedLocker(locker)}
                                    selectedLockerId={selectedLocker?.id || selectedLocker?.code}
                                />

                                <div className="bg-yellow-100 p-4 border-l-4 border-[#facc15] text-sm">
                                    {selectedLocker ? (
                                        <>
                                            <div className="font-bold">✅ Selected: {selectedLocker.name}</div>
                                            <div className="font-mono text-xs">{selectedLocker.address}</div>
                                        </>
                                    ) : (
                                        <div className="font-bold text-red-500">⚠️ Please select a locker above.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ADDRESS FORM (For Door Delivery) */}
                        {mainMethod === 'DELIVERY' && pudoType === 'DOOR' && (
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
                        )}

                        {/* COLLECTION INFO */}
                        {mainMethod === 'COLLECTION' && (
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* ONLINE */}
                                <label className={`cursor-pointer border-4 border-black p-4 flex flex-col items-center justify-center transition-all ${paymentMethod === 'ONLINE' ? 'bg-black text-[#facc15] scale-105 shadow-xl' : 'bg-white hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ONLINE"
                                        checked={paymentMethod === 'ONLINE'}
                                        onChange={() => setPaymentMethod('ONLINE')}
                                        className="hidden"
                                    />
                                    <span className="text-4xl mb-2 animate-pulse">💳</span>
                                    <span className="font-bold uppercase text-center text-sm">Pay Online</span>
                                    <span className="text-[10px] uppercase opacity-75 mt-1">(Apple Pay / Card)</span>
                                </label>

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
                                    <span className="font-bold uppercase text-center text-sm">EFT / GeoPay</span>
                                </label>

                                <label className={`cursor-pointer border-4 border-black p-4 flex flex-col items-center justify-center transition-all ${mainMethod === 'DELIVERY' ? 'opacity-50 cursor-not-allowed bg-gray-200' : (paymentMethod === 'CASH' ? 'bg-black text-[#facc15]' : 'bg-white hover:bg-gray-50')}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="CASH"
                                        checked={paymentMethod === 'CASH'}
                                        onChange={() => mainMethod !== 'DELIVERY' && setPaymentMethod('CASH')}
                                        disabled={mainMethod === 'DELIVERY'}
                                        className="hidden"
                                    />
                                    <span className="text-3xl mb-2">💵</span>
                                    <span className="font-bold uppercase text-center text-sm">Cash on Drop</span>
                                    {mainMethod === 'DELIVERY' && <span className="text-[10px] text-red-600 font-bold mt-1 uppercase">Collection Only</span>}
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
                            <span className="relative z-10">{loading ? 'Processing...' : `Place Order & Pay R${finalTotal}`}</span>
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

                        {/* SHIPPING COST ROW */}
                        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                            <span className="font-bold text-sm uppercase opacity-75">Delivery</span>
                            <span className="font-mono text-xl">{shippingCost === 0 ? 'FREE' : `R${shippingCost}`}</span>
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-[#facc15] flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-xl font-bold uppercase">Total</span>
                                <span className="text-xs opacity-75">{items.reduce((s, i) => s + i.quantity, 0)} Items</span>
                            </div>
                            <span className="text-4xl md:text-5xl font-archivo">R{finalTotal}</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 border-4 border-black font-mono text-sm">
                        <p className="font-bold uppercase underline mb-2">Secure Checkout</p>
                        <p>Your order is encrypted and processed securely. We do not store your banking details.
                            We deliver <strong>Nationwide</strong> via PUDO Lockers and offer <strong>Local Delivery</strong> within Port Elizabeth.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
