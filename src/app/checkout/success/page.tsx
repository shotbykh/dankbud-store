'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="max-w-2xl mx-auto bg-white border-8 border-black p-8 md:p-16 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-black"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-black"></div>
            
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            
            <h1 className="text-5xl md:text-7xl font-archivo uppercase mb-6 leading-none">Order<br/>Secured</h1>
            
            <div className="bg-[#facc15] p-4 border-4 border-black inline-block mb-8 transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold uppercase text-xl">Order #: {orderId}</p>
            </div>
            
            <div className="space-y-4 font-mono text-lg mb-10 text-left bg-gray-50 p-6 border-2 border-dashed border-black">
                <p className="font-bold uppercase underline mb-2">Payment Required (EFT):</p>
                <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-bold">FNB</span>
                    
                    <span className="text-gray-500">Account:</span>
                    <span className="font-bold">62045678901</span>
                    
                    <span className="text-gray-500">Ref:</span>
                    <span className="font-bold bg-black text-[#facc15] px-1">{orderId}</span>
                </div>
                <p className="text-xs mt-4 text-gray-500">* Please confirm your payment with the driver or via WhatsApp.</p>
            </div>
            
            <div className="space-y-2 font-mono text-center mb-8">
                 <p>Boom. Your stash is being prepared.</p>
                 <p>Our driver will contact you shortly.</p>
            </div>

            <div className="flex flex-col gap-4">
                <Link 
                    href="/shop"
                    className="inline-block px-12 py-4 bg-black text-white text-2xl font-archivo uppercase hover:scale-105 transition-transform"
                >
                    Back to the Club
                </Link>

                <Link 
                    href="/account"
                    className="inline-block px-8 py-3 bg-white text-black border-4 border-black text-xl font-bold uppercase hover:bg-black hover:text-[#facc15] transition-colors"
                >
                    View Order in Profile
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    </div>
  );
}
