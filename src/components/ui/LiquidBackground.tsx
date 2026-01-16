'use client';

import { motion } from "framer-motion";

export default function LiquidBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#facc15] pointer-events-none z-0">
      
      {/* SVG Filters for Real Liquid Distortion */}
      <svg className="hidden">
        <defs>
          <filter id="liquidFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
          <filter id="turbulenceFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Base Flow */}
      <div className="absolute inset-0 opacity-70" style={{ filter: 'url(#turbulenceFilter)' }}>
          <motion.div 
            animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,#facc15_120deg,#000_180deg,#facc15_240deg,transparent_360deg)] opacity-30"
          />
      </div>

      {/* Layer 2: Intricate Ribbons */}
      <div className="absolute inset-0 blur-3xl saturate-200 contrast-125">
         {/* Blue Acid Stream */}
         <motion.div 
            animate={{ 
                rotate: [0, 360],
                scale: [1, 1.5, 0.8, 1]
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-gradient-to-tr from-blue-600 via-cyan-400 to-transparent rounded-full mix-blend-difference opacity-80"
         />
         
         {/* Pink Noise Blob */}
         <motion.div 
            animate={{ 
                x: [-100, 100, -100],
                y: [100, -100, 100],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] bg-gradient-to-bl from-pink-600 via-purple-500 to-transparent rounded-full mix-blend-difference opacity-70"
         />

         {/* Black Void Injections */}
         <motion.div 
             animate={{ scale: [1, 1.3, 1] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30vh] h-[30vh] bg-black rounded-full mix-blend-overlay filter blur-xl"
         />
      </div>

      {/* Layer 3: Film Grain & Scanlines */}
      <div className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
      </div>
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none" />

    </div>
  );
}
