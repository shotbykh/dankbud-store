'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgeGate() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage on mount
    const verified = localStorage.getItem("dankbud-age-verified");
    if (verified === "true") {
      setIsVerified(true);
      setIsVisible(false);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem("dankbud-age-verified", "true");
    setIsVerified(true);
    setIsVisible(false);
  };

  const handleNo = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: "anticipate" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#facc15] p-4 cursor-crosshair text-center"
        >
          <div className="max-w-[90vw] w-full">
            <h1 className="text-[12vw] leading-[0.8] font-black uppercase text-black tracking-tighter mix-blend-multiply mb-12">
              Are you<br />18+?
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-2xl mx-auto">
              <button
                onClick={handleYes}
                className="group relative w-full md:w-1/2 h-24 bg-black text-[#facc15] text-4xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black hover:scale-105 transition-all duration-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                HELL YES
                {/* Dripping Effect */}
                <span className="absolute -bottom-4 left-1/4 w-4 h-8 bg-black rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></span>
                <span className="absolute -bottom-6 left-1/2 w-3 h-10 bg-black rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"></span>
              </button>
              
              <button
                onClick={handleNo}
                className="w-full md:w-1/2 h-24 border-4 border-black text-black text-2xl font-bold uppercase tracking-widest hover:bg-black hover:text-[#facc15] transition-colors duration-200"
              >
                NOPE
              </button>
            </div>
            
            <p className="mt-12 text-black font-bold uppercase tracking-widest text-sm md:text-base">
              Strictly for the connoisseur.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
