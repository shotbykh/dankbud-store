'use client';

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "@/components/shop/ProductImage"; // Reusing this for consistent image styles
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, total } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCart();
    };
    if (isCartOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, toggleCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#facc15] border-l-[8px] border-black z-[70] flex flex-col shadow-[-16px_0px_0px_0px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-black text-[#facc15]">
                <div className="flex flex-col">
                  <h2 className="text-4xl font-archivo uppercase leading-none">Your Stash</h2>
                  <Link href="/account" onClick={toggleCart} className="text-xs font-mono underline hover:text-white mt-1 uppercase tracking-widest">
                       [ My Profile ]
                  </Link>
                </div>
              <button onClick={toggleCart} className="text-4xl font-bold hover:text-white transition-colors">
                ×
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <span className="text-6xl mb-4">🕸️</span>
                  <p className="text-2xl font-black uppercase font-archivo">Empty Stash</p>
                  <p className="font-bold">Go fill it up.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-white border-4 border-black p-4 flex gap-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-20 h-20 border-2 border-black relative shrink-0">
                         {/* Simple fallback image or reused component */}
                         <div className="w-full h-full bg-gray-200">
                             <ProductImage src={item.image} alt={item.name} fill />
                         </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-archivo uppercase leading-none">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold uppercase underline hover:text-red-600">Remove</button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                             <div className="flex items-center gap-2 font-bold bg-gray-100 border-2 border-black px-2">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                             </div>
                             <div className="font-black">R{item.price * item.quantity}</div>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="p-6 border-t-4 border-black bg-white">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-xl font-bold uppercase">Total</span>
                        <span className="text-5xl font-archivo">R{total}</span>
                    </div>
                    <Link 
                        href="/checkout" 
                        onClick={toggleCart}
                        className="block w-full py-4 bg-black text-[#facc15] text-center text-2xl font-archivo uppercase tracking-widest hover:bg-[#d946ef] hover:text-white transition-colors border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
                    >
                        Secure The Bag
                    </Link>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
