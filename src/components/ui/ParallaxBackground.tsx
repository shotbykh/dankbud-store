'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function ParallaxBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  // Parallax Transforms
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const rotateSlow = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotateFast = useTransform(scrollYProgress, [0, 1], [0, -360]);
  
  if (!mounted) return <div className="fixed inset-0 bg-[#facc15]" />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f4ff00]">
        
        {/* TEXTURE: Dots Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                backgroundImage: 'radial-gradient(#d946ef 2px, transparent 2px)',
                backgroundSize: '20px 20px' 
             }} 
        />

        {/* --- SVG LAYER --- */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
                {/* Gradients */}
                <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="cyan" />
                    <stop offset="100%" stopColor="magenta" />
                </linearGradient>
                <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#d946ef" />
                     <stop offset="100%" stopColor="#f97316" />
                </linearGradient>

                {/* Filters */}
                <filter id="distortShop">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
                </filter>
                <filter id="furShop">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
                    <feDisplacementMap in="SourceGraphic" scale="10" />
                </filter>
                
                {/* Patterns */}
                <pattern id="checkersSmall" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="black" />
                    <rect x="10" y="10" width="10" height="10" fill="black" />
                </pattern>
            </defs>
        </svg>

        {/* ELEMENT 1: Giant Furry Worm (Left) */}
        <motion.div style={{ y: y1 }} className="absolute -left-[10%] top-[20%] w-[500px] h-[800px] opacity-80 mix-blend-multiply">
             <svg viewBox="0 0 200 600" className="w-full h-full">
                <path 
                    d="M 100 0 Q 200 150 50 300 Q -100 450 100 600" 
                    stroke="url(#furGrad)" 
                    strokeWidth="40" 
                    fill="none" 
                    filter="url(#furShop)" 
                />
             </svg>
        </motion.div>

        {/* ELEMENT 2: Floating Checkerboard Shapes */}
        <motion.div style={{ rotate: rotateSlow, right: '10%' }} className="absolute top-[10%] w-64 h-64 opacity-60">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="url(#checkersSmall)" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        </motion.div>

        <motion.div style={{ y: y2, left: '20%' }} className="absolute bottom-[10%] w-48 h-48 opacity-80 rotate-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="10" width="80" height="80" fill="cyan" stroke="black" strokeWidth="3" />
                <rect x="20" y="20" width="60" height="60" fill="url(#checkersSmall)" />
            </svg>
        </motion.div>

        {/* ELEMENT 3: The Melting Sun (Top Right) */}
        <motion.div style={{ rotate: rotateFast }} className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] mix-blend-hard-light">
             <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="url(#neonGrad)" filter="url(#distortShop)" />
                {/* Rays */}
                <path d="M 100 10 L 100 190 M 10 100 L 190 100" stroke="black" strokeWidth="5" />
                <path d="M 35 35 L 165 165 M 165 35 L 35 165" stroke="black" strokeWidth="5" />
             </svg>
        </motion.div>

        {/* ELEMENT 4: Random Squiggles */}
        <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[30%] w-96 h-96 opacity-50 mix-blend-difference">
             <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                <path d="M 0 100 Q 50 50 100 100 T 200 100" stroke="white" strokeWidth="20" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="50" r="20" fill="magenta" />
             </svg>
        </motion.div>

    </div>
  );
}
