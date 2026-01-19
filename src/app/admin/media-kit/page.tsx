'use client';

import React from 'react';

// STYLES
const GRID_PATTERN = {
    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
};

function AssetContainer({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="mb-20">
            <h2 className="text-xl font-bold uppercase mb-4 text-[#facc15]">{title}</h2>
            <div className="border border-dashed border-gray-700 p-8 flex justify-center bg-black">
                {children}
            </div>
        </div>
    );
}

export default function MediaKitPage() {
  // NOTE: In a real scenario, we would use the actual uploaded filepath. 
  // For this demo, I will assume the image will be placed at /assets/liquid_chrome_texture.png
  // AFTER the user approves the generation.
  // For now, I will use a placeholder or the specific file path if I knew it.
  // I'll leave the style empty and let the USER set the bg image or I'll inject it.
  
  // Actually, I'll use a hardcoded style assuming the next step moves the file.
  const BG_IMAGE = {
      backgroundImage: `url('/assets/liquid_chrome.png')`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center'
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-4 tracking-tighter">
            V5: LIQUID CHROME
        </h1>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
            World Class / Industrial / High Fidelity
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* ASSET 1: THE BRAND POSTER (4:5) */}
        <AssetContainer title="1. The Chrome Poster (4:5)">
             <div className="w-[400px] h-[500px] bg-neutral-900 relative overflow-hidden border-[1px] border-white/20 flex flex-col items-center justify-center group">
                
                {/* 1. PHOTOREALISTIC BACKGROUND */}
                {/* We use a div here that the user will mentally fill with the generated image for now */}
                {/* Once generated, I will copy the file to public/assets/liquid_chrome.png */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0">
                     {/* Simulating the chrome effect if image missing */}
                     <div className="absolute inset-0 opacity-50 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black mix-blend-overlay"></div>
                </div>

                {/* THE IMAGE LAYER (To be filled) */}
                <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80 mix-blend-hard-light grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                     style={{ backgroundImage: "url('/liquid_chrome_texture_v1.png')" }} // Intentionally pointing to where I will put it
                ></div>

                {/* 2. FINE GRID */}
                <div className="absolute inset-0 z-10 opacity-30" style={GRID_PATTERN}></div>

                {/* 3. TYPOGRAPHY (Crystal Clear) */}
                <div className="relative z-20 flex flex-col items-center">
                    <div className="border border-white/30 backdrop-blur-md px-6 py-2 mb-8 rounded-full">
                         <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">Est. 2026 // Private Club</span>
                    </div>

                    <h1 className="text-9xl font-black font-archivo text-white tracking-tighter leading-[0.85] text-center mix-blend-difference">
                        DANK<br/>BUD
                    </h1>
                     
                     <div className="mt-8 flex gap-4">
                         <div className="w-2 h-2 bg-[#facc15] rounded-full animate-pulse"></div>
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                     </div>
                </div>

                {/* 4. CHROME UI OVERLAY */}
                <div className="absolute bottom-8 w-full px-8 z-20">
                    <div className="flex justify-between items-end border-b border-white/50 pb-2">
                         <span className="font-mono text-xs uppercase text-gray-400">System_Status</span>
                         <span className="font-mono text-xs uppercase text-[#facc15]">Operational</span>
                    </div>
                </div>

             </div>
        </AssetContainer>


        {/* ASSET 2: THE "GLASS" PASS (1:1) */}
         <AssetContainer title="2. The 'Access Code' (1:1)">
             <div className="w-[400px] h-[400px] bg-black relative flex items-center justify-center overflow-hidden border border-white/10">
                
                {/* Background */}
                <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60 blur-sm scale-150"
                     style={{ backgroundImage: "url('/liquid_chrome_texture_v1.png')" }}
                ></div>

                {/* The "Card" */}
                <div className="relative z-10 w-[320px] h-[200px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl flex flex-col p-6 justify-between overflow-hidden">
                     {/* Iridescent gloss on card */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none"></div>

                     <div className="flex justify-between items-start">
                         <div className="w-8 h-8 rounded-full border-2 border-[#facc15] bg-black/50"></div>
                         <span className="font-mono text-[10px] text-white/60 uppercase racking-widest">Member_ID_001</span>
                     </div>
                     
                     <div>
                         <h2 className="text-4xl font-black font-archivo text-white tracking-tight uppercase">Access<br/>Granted</h2>
                     </div>

                     <div className="flex justify-between items-end">
                         <span className="font-mono text-[10px] text-[#facc15] animate-pulse">● LIVE</span>
                         <span className="font-mono text-[10px] text-white/40">dankbud.co.za</span>
                     </div>
                </div>

             </div>
        </AssetContainer>

      </div>
    </div>
  );
}
