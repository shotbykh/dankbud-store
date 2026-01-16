'use client';

import { Product } from "@/lib/products";
import AddToCartButton from "@/components/shop/AddToCartButton";
import Link from "next/link";
import CartIndicator from "@/components/cart/CartIndicator";
import LogoutButton from "@/components/shop/LogoutButton";
import ProductImage from "@/components/shop/ProductImage";
import { useState } from "react";

export default function ProductDetailClient({ product, initialStock = 0 }: { product: Product, initialStock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [stock] = useState(initialStock);
  
  const isSoldOut = stock <= 0;
  const maxPurchase = Math.min(stock, 28); // Cap at 28g (ounce)

  if (quantity > maxPurchase && maxPurchase > 0) setQuantity(maxPurchase);

  return (
    <main className="min-h-screen bg-[#facc15] text-black">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-4 md:p-8 bg-[#facc15]/90 backdrop-blur border-b-4 border-black">
        <Link href="/shop" className="text-xl md:text-2xl font-black uppercase tracking-tighter hover:underline decoration-4">
            ← Back to Catalog
        </Link>
        <div className="font-bold uppercase tracking-widest text-sm flex gap-4 items-center">
            <CartIndicator />
            <LogoutButton />
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Left: Visuals */}
        <div className="w-full md:w-1/2">
            <div className="w-full aspect-square border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative bg-white">
                <ProductImage src={product.image} alt={product.name} fill className={isSoldOut ? 'grayscale opacity-50' : ''}/>
                {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-white font-black text-6xl -rotate-12 border-8 border-white px-8 py-4 bg-black/50 backdrop-blur">SOLD OUT</span>
                    </div>
                )}
            </div>
            
             <div className="mt-8">
                 <div className={`p-4 text-center mb-4 transition-colors border-4 border-black ${stock < 10 && stock > 0 ? 'bg-[#d946ef] text-white animate-pulse' : 'bg-black text-[#facc15]'}`}>
                    <div className="text-sm uppercase font-bold opacity-80 mb-2">Availability Status</div>
                    <div className="text-3xl font-archivo font-black uppercase tracking-wide">
                        {stock <= 0 ? (
                            "SOLD OUT"
                        ) : stock < 10 ? (
                            `ONLY ${stock}g REMAINING`
                        ) : (
                            "IN STOCK"
                        )}
                    </div>
                 </div>
             </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 space-y-8">
            <div className="border-b-4 border-black pb-8">
                <div className="flex items-center gap-4 mb-4">
                     <span className="bg-black text-[#facc15] px-4 py-2 text-sm font-black uppercase">{product.category}</span>
                </div>
                
                {/* 
                  UPDATED TYPOGRAPHY:
                  Removed 'break-words' to prevent "BLUEBERR-Y".
                  Added 'max-w-full' to ensure container constraints.
                  Increased font size slightly for very long names but relied on natural wrapping.
                */}
                <h1 className={`font-archivo font-extrabold uppercase tracking-tight leading-[0.85] mb-6 transform scale-y-110 origin-left max-w-full ${
                    product.name.length > 20 ? 'text-7xl md:text-[5.5rem]' : 
                    product.name.length > 10 ? 'text-7xl md:text-[6.5rem]' : 
                    'text-8xl md:text-[8rem]'
                }`}>
                    {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4 mb-6">
                    <div className="text-5xl font-black">R{product.price}</div>
                    <div className="text-xl font-bold uppercase opacity-60">/ gram</div>
                </div>

                <p className="text-xl font-bold uppercase leading-tight max-w-xl border-l-4 border-black pl-4 py-2">
                    {product.description}
                </p>
            </div>

            {/* QUANTITY SELECTOR */}
            {!isSoldOut && (
                <div className="bg-white border-4 border-black p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center">
                        <label className="text-2xl font-black uppercase">Quantity</label>
                        <span className="text-4xl font-archivo font-bold">{quantity}g</span>
                    </div>
                    
                    <input 
                        type="range" 
                        min="1" 
                        max={maxPurchase} 
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full h-6 bg-black appearance-none cursor-pointer accent-[#facc15] hover:accent-[#d946ef] border-2 border-black"
                    />
                    
                     <div className="flex justify-between items-center border-t-2 border-black pt-4">
                        <span className="font-bold text-lg uppercase">Total Price</span>
                        <span className="text-4xl font-black">R{product.price * quantity}</span>
                    </div>
                </div>
            )}

            <div className="space-y-4 pt-4">
                <h3 className="text-2xl font-black uppercase decoration-4 underline-offset-4 underline">Effects</h3>
                <div className="flex flex-wrap gap-3">
                    {product.effects.map((effect: string) => (
                        <span key={effect} className="px-4 py-2 border-2 border-black text-lg font-bold uppercase bg-white hover:bg-black hover:text-[#facc15] transition-colors cursor-default shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {effect}
                        </span>
                    ))}
                </div>
            </div>

            <div className="pt-8">
                {isSoldOut ? (
                    <button disabled className="w-full py-6 text-3xl font-black uppercase tracking-widest border-4 border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100">
                        Sold Out
                    </button>
                ) : (
                    <AddToCartButton product={product} quantity={quantity} />
                )}
            </div>
        </div>
      </div>
    </main>
  );
}
