"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ComplianceBar() {
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dankbud-cookie-consent");
    if (!consent) {
      setShowCookies(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("dankbud-cookie-consent", "true");
    setShowCookies(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] font-mono text-[10px] md:text-xs uppercase tracking-widest">
      
      {/* COOKIE BANNER (Dismissible) */}
      {showCookies && (
        <div className="bg-[#facc15] text-black p-3 flex justify-between items-center border-t-2 border-black animate-slide-up">
           <div className="flex items-center gap-4">
             <span>🍪 We use cookies to enhance your club experience.</span>
             <Link href="/legal/privacy" className="underline font-bold">Read Policy</Link>
           </div>
           <button 
             onClick={acceptCookies}
             className="bg-black text-[#facc15] px-4 py-1 font-bold hover:bg-white hover:text-black transition-colors"
           >
             ACCEPT
           </button>
        </div>
      )}

      {/* PERMANENT LEGAL STATUS BAR */}
      <div className="bg-black text-[#facc15] py-2 px-4 flex justify-center items-center gap-4 text-center border-t border-[#facc15]/20">
        <span>🔒 PRIVATE MEMBER CLUB</span>
        <span className="hidden md:inline">•</span>
        <span>NOT FOR PUBLIC SALE</span>
        <span className="hidden md:inline">•</span>
        <span className="opacity-60">RIGHT OF ADMISSION RESERVED</span>
      </div>
    </div>
  );
}
