"use client";

import LiquidButton from "@/components/ui/LiquidButton";
import AgeGate from "@/components/ui/AgeGate";
import Link from "next/link";
import { useEffect, useState } from "react";
import BentoGrid from "@/components/ui/BentoGrid";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isMember, setIsMember] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 1. Check Old Session
    const session = localStorage.getItem("dankbud-session");
    if (session) setIsMember(true);

    // 2. Auth Listener (Handles Password Reset Redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            console.log("Recovery Event Detected!");
            router.push('/admin/update-password');
        }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#facc15]"> 
      
      {/* HERO SECTION */}
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-8 md:p-12">
        
        {/* TEXT HERO - FLUID TYPOGRAPHY */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center select-none mix-blend-normal py-10">
            <h1 className="font-archivo font-black uppercase tracking-tighter text-black leading-none whitespace-nowrap transform scale-y-[1.1] origin-center -mb-4 md:-mb-8 text-[13vw]">
                DANKBUD
            </h1>
        </div>

        {/* BUTTONS - STACKED ON MOBILE */}
        <div className="mt-8 md:mt-16 flex flex-col md:flex-row gap-4 md:gap-6 items-center z-20 w-full px-4 md:w-auto">
             <LiquidButton href="/apply" className="w-full md:w-auto bg-white text-black border-4 border-black hover:bg-[#d946ef] hover:text-white hover:border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                JOIN CLUB
            </LiquidButton>
            
            {isMember ? (
                <Link href="/shop" className="text-xl md:text-2xl font-black uppercase underline decoration-4 underline-offset-4 hover:text-[#d946ef] transition-colors bg-black text-[#facc15] px-6 py-4 transform -rotate-1 hover:rotate-0 transition-transform shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-full md:w-auto text-center block">
                    Enter Shop →
                </Link>
            ) : (
                <Link href="/login" className="text-xl font-bold uppercase underline opacity-80 hover:opacity-100 bg-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto text-center block">
                    Login
                </Link>
            )}
        </div>
      </div>
      
      <AgeGate />
      
      {/* BENTO GRID */}
      <BentoGrid />

      <footer className="relative z-10 bg-black text-[#facc15] text-center py-6 text-sm font-black uppercase tracking-widest">
        Strictly No U18s • Right of Admission Reserved
      </footer>

    </main>
  );
}
