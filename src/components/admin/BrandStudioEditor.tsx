'use client';

import React, { useState, useRef } from 'react';
import type { Product } from '@/lib/products';

// --- ASSETS & HELPERS ---
const TODAY = new Date().toLocaleDateString('en-ZA', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

// Barcode SVG Component for that "Industrial" look
const Barcode = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 20" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,0h2v20h-2z M4,0h1v20h-1z M6,0h3v20h-3z M11,0h1v20h-1z M14,0h2v20h-2z M17,0h1v20h-1z M22,0h4v20h-4z M28,0h2v20h-2z M32,0h1v20h-1z M34,0h3v20h-3z M40,0h2v20h-2z M45,0h1v20h-1z M48,0h2v20h-2z M54,0h3v20h-3z M60,0h1v20h-1z M65,0h2v20h-2z M70,0h4v20h-4z M76,0h1v20h-1z M79,0h3v20h-3z M85,0h2v20h-2z M90,0h1v20h-1z M95,0h2v20h-2z M99,0h1v20h-1z" />
    </svg>
);

interface EditorProps {
    products: Product[];
}

export default function BrandStudioEditor({ products }: EditorProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
    
    // Custom overrides
    const [tagline, setTagline] = useState("FRESH DROP");
    const [dropDate, setDropDate] = useState(TODAY);
    const [vibeOverride, setVibeOverride] = useState("");
    
    // Derived values
    const currentVibe = vibeOverride || (selectedProduct?.effects?.[0] || "HYBRID");
    const price = selectedProduct ? `R${selectedProduct.price}` : "R000";
    const productName = selectedProduct?.name || "SELECT PRODUCT";
    const productImage = selectedProduct?.image || "";
    // Generate a pseudo-ref code
    const refCode = selectedProduct ? `${selectedProduct.name.substring(0,3).toUpperCase()}-${selectedProduct.id.substring(0,4).toUpperCase()}` : "000-0000";

    const productWords = productName.split(' ');

    return (
        <div className="flex flex-col md:flex-row h-screen bg-neutral-100 text-black overflow-hidden font-sans">
            
            {/* --- LEFT SIDEBAR: CONTROLS --- */}
            <div className="w-full md:w-[400px] bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-xl">
                 <div className="p-6 border-b border-black bg-black text-white">
                     <h1 className="text-2xl font-black uppercase tracking-tighter">Brand Studio_V1</h1>
                     <div className="text-[10px] font-mono opacity-60 mt-1">INTERNAL ASSET GENERATOR // {TODAY}</div>
                 </div>

                 {/* Product List */}
                 <div className="flex-1 overflow-y-auto p-0">
                     <div className="bg-gray-50 px-6 py-2 border-b border-gray-200 font-mono text-[10px] uppercase font-bold text-gray-400 sticky top-0">
                         1. Select Source
                     </div>
                     {products.map(p => (
                         <button 
                            key={p.id}
                            onClick={() => setSelectedProduct(p)}
                            className={`w-full text-left px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center group ${selectedProduct?.id === p.id ? 'bg-[#facc15] border-black text-black' : ''}`}
                         >
                             <div>
                                 <div className="font-bold uppercase text-sm leading-tight">{p.name}</div>
                                 <div className="font-mono text-[10px] opacity-50">{p.category}</div>
                             </div>
                             {selectedProduct?.id === p.id && <div className="w-2 h-2 bg-black rounded-full" />}
                         </button>
                     ))}
                 </div>

                 {/* Inputs */}
                 <div className="border-t-4 border-black p-6 bg-white">
                     <div className="mb-4 font-mono text-[10px] uppercase font-bold text-gray-400">
                         2. Remix Details
                     </div>
                     
                     <div className="space-y-4">
                         <div>
                             <label className="block text-[10px] font-bold uppercase mb-1">Campaign Tagline</label>
                             <input 
                                value={tagline} 
                                onChange={(e) => setTagline(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 p-2 font-black uppercase focus:ring-2 focus:ring-[#facc15] focus:border-transparent outline-none"
                             />
                         </div>
                         <div className="flex gap-4">
                             <div className="flex-1">
                                 <label className="block text-[10px] font-bold uppercase mb-1">Drop Date</label>
                                 <input 
                                    value={dropDate} 
                                    onChange={(e) => setDropDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 p-2 font-mono text-sm uppercase focus:ring-2 focus:ring-[#facc15] outline-none"
                                 />
                             </div>
                             <div className="flex-1">
                                 <label className="block text-[10px] font-bold uppercase mb-1">Vibe Override</label>
                                 <input 
                                    value={vibeOverride} 
                                    onChange={(e) => setVibeOverride(e.target.value)}
                                    placeholder={currentVibe}
                                    className="w-full bg-gray-50 border border-gray-300 p-2 font-mono text-sm uppercase focus:ring-2 focus:ring-[#facc15] outline-none"
                                 />
                             </div>
                         </div>
                     </div>
                 </div>
            </div>


            {/* --- RIGHT: CANVAS / PREVIEW --- */}
            <div className="flex-1 bg-neutral-100 p-8 md:p-12 overflow-auto flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
                
                {/* --- TEMPLATE 1: STORY (9:16) --- */}
                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold uppercase mb-2 text-gray-400 tracking-widest">Story Asset (9:16)</div>
                    
                    {/* THE CANVAS */}
                    <div className="w-[360px] h-[640px] bg-white relative flex flex-col border border-gray-300 shadow-2xl overflow-hidden group">
                        
                        {/* HEADER */}
                        <div className="h-16 flex justify-between items-center px-4 border-b-2 border-black z-10 bg-white">
                             <div className="flex flex-col">
                                 <span className="font-black text-xl leading-none tracking-tighter">DANKBUD®</span>
                                 <span className="font-mono text-[9px] tracking-widest">EST. 2026 // ZA</span>
                             </div>
                             <div className="bg-[#facc15] px-2 py-1 border border-black font-mono text-[10px] font-bold uppercase transform -rotate-2">
                                 Waitlist Only
                             </div>
                        </div>

                        {/* HERO IMAGE SECTION */}
                        <div className="relative flex-1 bg-neutral-200 overflow-hidden">
                            {productImage && (
                                <img src={productImage} className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" />
                            )}
                            
                            {/* OVERLAY TYPOGRAPHY */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none mix-blend-difference text-white">
                                <div className="border-l-2 border-white pl-4 mb-4">
                                     <div className="font-mono text-xs mb-1 bg-white text-black inline-block px-1">REF_{refCode}</div>
                                     <h1 className="text-6xl font-black font-archivo leading-[0.85] uppercase tracking-tighter">
                                        {productWords.map((word, i) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                     </h1>
                                </div>
                            </div>
                        </div>

                        {/* INFO STRIP */}
                        <div className="h-48 bg-[#facc15] border-t-2 border-black p-4 flex flex-col justify-between relative overflow-hidden">
                             {/* Big Background Text */}
                             <div className="absolute -right-4 top-4 text-9xl font-black font-archivo opacity-10 pointer-events-none select-none text-black">
                                 DB
                             </div>

                             <div className="z-10">
                                 <div className="flex justify-between items-end border-b border-black/20 pb-2 mb-2">
                                     <span className="font-mono text-xs font-bold uppercase">Spec Sheet</span>
                                     <span className="font-black text-3xl">{price}</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-y-2 font-mono text-[10px] uppercase">
                                     <div className="flex gap-2"><span className="opacity-50">Type:</span> <b>{selectedProduct?.category}</b></div>
                                     <div className="flex gap-2"><span className="opacity-50">Str:</span> <b>{selectedProduct?.thc}</b></div>
                                     <div className="flex gap-2"><span className="opacity-50">Vibe:</span> <b>{currentVibe}</b></div>
                                     <div className="flex gap-2"><span className="opacity-50">Date:</span> <b>{dropDate}</b></div>
                                 </div>
                             </div>

                             <div className="z-10 bg-black text-white p-3 flex justify-between items-center mt-2">
                                 <span className="font-black uppercase text-sm tracking-widest">{tagline}</span>
                                 <Barcode className="h-4 w-12 text-white" />
                             </div>
                        </div>
                    </div>
                </div>


                {/* --- TEMPLATE 2: FEED (1:1) --- */}
                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold uppercase mb-2 text-gray-400 tracking-widest">Feed Asset (1:1)</div>
                    
                    <div className="w-[400px] h-[400px] bg-white border border-gray-300 shadow-2xl relative flex flex-col p-6 justify-between overflow-hidden">
                        
                        {/* Decorative Grid Lines */}
                        <div className="absolute top-0 left-12 w-[1px] h-full bg-gray-100"></div>
                        <div className="absolute top-0 right-12 w-[1px] h-full bg-gray-100"></div>
                        <div className="absolute top-12 left-0 w-full h-[1px] bg-gray-100"></div>
                        <div className="absolute bottom-12 left-0 w-full h-[1px] bg-gray-100"></div>

                        {/* Top Bar */}
                        <div className="flex justify-between items-start z-10">
                             <div className="bg-black text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                                 New Arrival
                             </div>
                             <div className="text-right">
                                 <div className="font-black text-xs uppercase tracking-tighter">Verified Authentic</div>
                                 <div className="font-mono text-[9px] text-gray-400">{dropDate}</div>
                             </div>
                        </div>

                        {/* Main Visual */}
                        <div className="flex-1 flex items-center justify-center relative z-10">
                             <div className="w-48 h-48 rounded-full border-[3px] border-black overflow-hidden relative group">
                                 {productImage && (
                                     <img src={productImage} className="w-full h-full object-cover" />
                                 )}
                                 {/* Sticker Overlay */}
                                 <div className="absolute top-0 right-0 w-16 h-16 bg-[#facc15] rounded-full flex items-center justify-center border border-black transform translate-x-4 -translate-y-4">
                                     <span className="font-black text-[10px] transform rotate-12">{selectedProduct?.thc}</span>
                                 </div>
                             </div>
                             
                             {/* Background Text behind image */}
                             <h1 className="absolute text-9xl font-black font-archivo text-gray-100 z-[-1] tracking-tighter uppercase whitespace-nowrap">
                                 {tagline}
                             </h1>
                        </div>

                        {/* Bottom Bar */}
                        <div className="z-10 border-t-2 border-black pt-3">
                             <div className="flex justify-between items-baseline mb-1">
                                 <h2 className="text-3xl font-black font-archivo uppercase tracking-tighter leading-none">{productName}</h2>
                                 <span className="font-mono text-sm font-bold bg-[#facc15] px-1">{price}</span>
                             </div>
                             <div className="flex gap-4 font-mono text-[9px] uppercase tracking-wide text-gray-500">
                                 <span>{selectedProduct?.lineage || "PREMIUM GENETICS"}</span>
                                 <span>//</span>
                                 <span>{currentVibe}</span>
                                 <span className="ml-auto text-black font-bold">dankbud.co.za</span>
                             </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
