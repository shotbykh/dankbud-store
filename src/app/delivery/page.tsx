'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-[#facc15] text-black font-mono p-4 md:p-8 pt-24 md:pt-32 relative">
    
        {/* HOME NAV */ }
        <nav className="fixed top-0 left-0 p-4 md:p-8 z-50">
             <Link href="/" className="inline-block bg-white border-4 border-black px-4 py-2 font-black uppercase hover:bg-black hover:text-[#facc15] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                ← Home
            </Link>
        </nav>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
            <h1 className="text-4xl md:text-6xl font-black uppercase font-archivo mb-4">Logistics & Delivery</h1>
            <p className="text-lg md:text-xl font-bold">How we get the goods to you. Securely. Anonymously. Fast.</p>
        </motion.div>

        {/* METHODS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* PUDO LOCKER */}
            <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 }}
                 className="bg-black text-[#facc15] border-4 border-black p-6"
            >
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-3xl font-black uppercase font-archivo mb-2">To Locker</h2>
                <div className="text-4xl font-mono mb-4">R60.00</div>
                <ul className="space-y-2 text-sm md:text-base list-disc list-inside opacity-90">
                    <li><strong>Anonymity:</strong> 100%. No driver contact.</li>
                    <li><strong>Process:</strong> Select a locker near you (e.g., at a petrol station).</li>
                    <li><strong>Collection:</strong> We email you a PIN. You enter it at the locker. Door opens.</li>
                    <li><strong>Timing:</strong> 1-3 Business Days.</li>
                    <li><strong>Best For:</strong> Privacy & flexible pickup times.</li>
                </ul>
            </motion.div>

            {/* DOOR DELIVERY */}
            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white text-black border-4 border-black p-6"
            >
                <div className="text-6xl mb-4">🏠</div>
                <h2 className="text-3xl font-black uppercase font-archivo mb-2">To Door</h2>
                <div className="text-4xl font-mono mb-4">R100.00</div>
                 <ul className="space-y-2 text-sm md:text-base list-disc list-inside">
                    <li><strong>Convenience:</strong> Delivered straight to your gate.</li>
                    <li><strong>Process:</strong> Controlled by The Courier Guy (PUDO).</li>
                    <li><strong>Collection:</strong> Driver will call you. You need to be home.</li>
                    <li><strong>Timing:</strong> 1-3 Business Days.</li>
                    <li><strong>Best For:</strong> Laziness & WFH vibes.</li>
                </ul>
            </motion.div>
        
        </div>

        {/* COLLECTION */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-4 border-black bg-[#facc15] p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
            <div>
                <h3 className="text-2xl font-black uppercase font-archivo">📍 Local Collection</h3>
                <p className="font-bold">Walmer, Gqeberha (Port Elizabeth)</p>
                <p className="text-sm">We will WhatsApp you the exact location after payment.</p>
            </div>
            <div className="bg-black text-white px-6 py-2 font-black uppercase text-xl rotate-[-2deg]">
                FREE (R0)
            </div>
        </motion.div>

        {/* FAQs */}
        <div className="grid grid-cols-1 gap-4">
             <div className="bg-white border-2 border-black p-4">
                <h4 className="font-bold uppercase mb-1">📦 Is the packaging discreet?</h4>
                <p className="text-sm">Yes. We use standard, unbranded boxes or PUDO flyer bags. No logos. No smells.</p>
             </div>

             <div className="bg-white border-2 border-black p-4">
                <h4 className="font-bold uppercase mb-1">⏱️ When do you ship?</h4>
                <p className="text-sm">Orders paid before 10:00 AM are packed same-day. Courier collects around 14:00 daily.</p>
             </div>

             <div className="bg-white border-2 border-black p-4">
                <h4 className="font-bold uppercase mb-1">📲 How do I track it?</h4>
                <p className="text-sm">You will receive an email with your Waybill Number and a link to the PUDO portal.</p>
             </div>
        </div>

        <div className="text-center pt-8">
            <Link href="/shop" className="inline-block bg-black text-[#facc15] px-8 py-4 text-xl font-bold uppercase hover:scale-105 transition-transform">
                Start Shopping &rarr;
            </Link>
        </div>

      </div>
    </div>
  );
}
