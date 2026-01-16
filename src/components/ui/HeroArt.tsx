'use client';

import { motion } from "framer-motion";

export default function HeroArt() {
  return (
    <div className="relative w-full max-w-5xl aspect-square md:aspect-video mx-auto select-none">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 600" xmlns="http://www.w3.org/200/svg">
        <defs>
          {/* 1. FURRRY WORM GRADIENT */}
          <linearGradient id="wormGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />  {/* Cyan */}
            <stop offset="50%" stopColor="#d946ef" /> {/* Magenta */}
            <stop offset="100%" stopColor="#f97316" /> {/* Orange */}
          </linearGradient>

          {/* 2. FUR FILTER (Turbulence + Displacement) */}
          <filter id="fur" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* 3. PATTERN: CHECKERBOARD */}
          <pattern id="checkers" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="black" />
            <rect x="20" y="20" width="20" height="20" fill="black" />
          </pattern>
          
          {/* 4. PATTERN: DOTS */}
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
             <circle cx="10" cy="10" r="5" fill="#d946ef" />
          </pattern>
        </defs>

        {/* --- BACKGROUND ELEMENTS (Intricate Patterns) --- */}
        
        {/* Top Left Swirls */}
        <g transform="translate(0,0)">
            <path d="M -50 -50 Q 100 50 150 200 T 300 100" stroke="#000" strokeWidth="50" fill="none" strokeDasharray="20 20" opacity="0.5"/>
            <circle cx="50" cy="100" r="80" fill="cyan" />
            <circle cx="50" cy="100" r="60" fill="none" stroke="black" strokeWidth="10" />
        </g>

        {/* Bottom Right Checkers */}
        <rect x="800" y="400" width="300" height="300" fill="url(#checkers)" transform="rotate(-10 800 400)" />
        
        {/* Top Right Dots */}
        <circle cx="900" cy="100" r="150" fill="url(#dots)" />


        {/* --- LAYER 1: WORM BEHIND --- */}
        {/* A winding path that goes behind the text in places */}
        <motion.path 
          d="M -100 300 C 100 100, 300 500, 500 300 S 900 100, 1100 300"
          stroke="url(#wormGrad)" 
          strokeWidth="60" 
          fill="none" 
          filter="url(#fur)"
          className="drop-shadow-xl"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* --- LAYER 2: TEXT (The Meat) --- */}
        <text x="500" y="500" textAnchor="middle" fontSize="350" fontFamily="Archivo Black" fontWeight="900" letterSpacing="-10" fill="black" className="uppercase">
          BUD
        </text>
        <text x="500" y="280" textAnchor="middle" fontSize="350" fontFamily="Archivo Black" fontWeight="900" letterSpacing="-10" fill="black" className="uppercase">
          DANK
        </text>

        {/* --- LAYER 3: WORM IN FRONT (Weaving effect) --- */}
        {/* We use a mask or just distinct segments. For this stylized look, a second offsetting worm looks dope. */}
        <motion.path 
          d="M -100 450 C 150 550, 400 100, 600 400 S 1000 0, 1200 200"
          stroke="url(#wormGrad)" 
          strokeWidth="45" 
          fill="none" 
          filter="url(#fur)"
          opacity="0.9"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />

        {/* EXTRA DETAILS: Melting Drips on Text */}
        <path d="M 250 280 Q 260 350 250 400" stroke="#facc15" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 750 500 Q 760 580 750 620" stroke="#facc15" strokeWidth="15" fill="none" strokeLinecap="round" />

      </svg>
    </div>
  );
}
