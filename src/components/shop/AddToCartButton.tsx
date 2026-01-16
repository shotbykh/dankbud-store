'use client';

import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";
import { useState } from "react";

export default function AddToCartButton({ product, quantity }: { product: Product, quantity: number }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(product, quantity); 
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
        onClick={handleClick}
        className="w-full py-6 text-4xl font-black uppercase tracking-widest border-4 border-black transition-all active:scale-[0.98] relative overflow-hidden group font-archivo"
    >
        <span className={`relative z-10 transition-colors ${added ? 'text-black' : 'text-[#facc15]'}`}>
            {added ? `Added ${quantity}g ✓` : `Add ${quantity}g to Stash`}
        </span>
        
        {/* Fill Animation */}
        <div className={`absolute inset-0 bg-black transition-transform duration-300 ${added ? 'translate-y-full' : 'translate-y-0'}`}></div>
        <div className={`absolute inset-0 bg-white transition-transform duration-300 ${added ? 'translate-y-0' : '-translate-y-full'}`}></div>
    </button>
  );
}
