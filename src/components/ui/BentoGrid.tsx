'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from 'next/link';

const cards = [
    {
        id: "vibe",
        title: "THE VIBE",
        content: "STRICTLY TOP SHELF FLOWER.",
        description: "We don't deal in mid. Our curators source only the finest, most potent genetics from master growers across the country. Every bud is hand-trimmed, perfectly cured, and tested for maximum loud.",
        color: "bg-[#06b6d4]", // Cyan
        textColor: "text-black",
        size: "md:col-span-2",
        art: "waving-lines" 
    },
    {
        id: "members",
        title: "MEMBERS ONLY",
        content: "PRIVATE CLUB", // Back to space, let CSS handle wrapping
        description: "Exclusivity is our currency. Membership is capped to ensure supply always meets demand. Take the leap.",
        color: "bg-black",
        textColor: "text-[#facc15]",
        size: "md:col-span-1",
        art: "circle"
    },
    {
        id: "location",
        title: "SINCE 2026",
        content: "GQ\nHQ", // Grid View
        expandedContent: "GQEBERHA\nHQ", // Pop Out View
        description: "Born in the Friendly City. We run a stealth operation delivering discreetly to your door. Local pickup available for inner circle members.",
        color: "bg-[#d946ef]", // Magenta
        textColor: "text-black",
        size: "md:col-span-1",
        art: "dots"
    },
    {
        id: "manifesto",
        title: "MANIFESTO",
        content: "WE CURATE THE CULTURE.",
        description: "DANKBUD isn't just a store, it's a movement. We believe in the power of the plant to unlock creativity and connection. Join us in elevating the standard.",
        color: "bg-[#facc15]", // Yellow
        textColor: "text-black",
        size: "md:col-span-2",
        art: "none"
    },
    {
        id: "profile",
        title: "MEMBER ZONE",
        content: "OPEN DASHBOARD ->",
        description: "", 
        color: "bg-white", 
        textColor: "text-black",
        size: "md:col-span-3", // Full width
        art: "none",
        href: "/account"
    }
];

export default function BentoGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Helper for dynamic text size based on card ID
  const getCardTextClass = (id: string) => {
      // Logic:
      // Location (GQ HQ): Very short, can be huge.
      // Members (PRIVATE CLUB): 12 chars. Needs to be smaller to fit in 1/3 col.
      // Vibe: Longer sentence.
      
      if (id === 'location') return "text-[clamp(3rem,8vw,5rem)] break-words";
      if (id === 'members') return "text-[clamp(1.5rem,2.5vw,3.5rem)] leading-tight break-words"; // Aggressively smaller
      if (id === 'vibe' || id === 'manifesto') return "text-[clamp(1.5rem,3vw,3.5rem)] max-w-lg";
      
      return "text-3xl md:text-5xl";
  };

  return (
    <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => {
                // If it's the profile card, make it a sleek banner
                if (card.href) {
                     return (
                        <Link 
                            key={card.id}
                            href={card.href}
                            // Reduced min-height and padding for sleek look
                            className={`${card.size} ${card.color} ${card.textColor} p-6 min-h-[100px] flex items-center justify-between relative overflow-hidden group border-4 border-black cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                                <h3 className="text-xl font-black uppercase tracking-widest z-10 opacity-60">{card.title}</h3>
                                <p className="font-black uppercase leading-none z-10 text-[clamp(1.5rem,3vw,2.5rem)] text-black group-hover:underline decoration-4 underline-offset-4">
                                    {card.content}
                                </p>
                            </div>
                            
                            <div className="text-4xl group-hover:translate-x-2 transition-transform">
                                ↗
                            </div>
                        </Link>
                     );
                }

                // Standard expanding card
                return (
                <motion.div
                    key={card.id}
                    layoutId={card.id}
                    onClick={() => setSelectedId(card.id)}
                    className={`${card.size} ${card.color} ${card.textColor} p-6 md:p-8 min-h-[220px] md:min-h-[300px] flex flex-col justify-between relative overflow-hidden group border-4 border-black cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow`}
                >
                    {/* Abstract Art Overlays */}
                    {card.art === 'waving-lines' && (
                        <div className="absolute inset-0 opacity-20 pointer-events-none" 
                             style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, black 10px, black 20px)'}} 
                        />
                    )}
                    {card.art === 'dots' && (
                        <div className="absolute inset-0 opacity-20 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(black 2px, transparent 2px)', backgroundSize: '20px 20px'}} 
                        />
                    )}

                    <motion.h3 className="text-xl md:text-2xl font-black uppercase tracking-widest z-10">{card.title}</motion.h3>
                    
                    <motion.p className={`font-black uppercase leading-[0.85] z-10 whitespace-pre-line ${getCardTextClass(card.id)}`}>
                        {card.content}
                    </motion.p>
                    
                    <div className="absolute bottom-4 right-4 text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                    </div>
                </motion.div>
                );
            })}
        </div>

        <AnimatePresence>
            {selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedId(null)}>
                    {cards.filter(c => c.id === selectedId).map(card => (
                        <motion.div 
                            layoutId={selectedId}
                            key={card.id}
                            className={`${card.color} ${card.textColor} p-8 md:p-12 w-full max-w-2xl border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden`}
                            onClick={(e) => e.stopPropagation()} 
                        >
                             <button className="absolute top-4 right-4 text-3xl font-black hover:bg-black hover:text-white w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-colors" onClick={() => setSelectedId(null)}>×</button>

                             <motion.h3 className="text-3xl font-black uppercase tracking-widest mb-4 opacity-50">{card.title}</motion.h3>
                             
                             <motion.h2 className="text-5xl md:text-6xl font-black uppercase leading-none mb-8 whitespace-pre-line break-words">
                                {/* @ts-ignore */}
                                {card.expandedContent || card.content}
                             </motion.h2>
                             
                             <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold uppercase leading-tight"
                             >
                                {card.description}
                             </motion.p>
                             
                              {/* Modal Actions for Members */ }
                             {card.id === 'members' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-8 flex gap-4"
                                >
                                    <Link href="/apply" className="text-[#facc15] px-6 py-3 font-bold uppercase border-2 border-[#facc15] hover:bg-[#facc15] hover:text-black transition-colors">
                                        Apply for Membership
                                    </Link>
                                </motion.div>
                             )}

                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
    </section>
  );
}
