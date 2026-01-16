'use client';

import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8 pointer-events-none mix-blend-hard-light">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
        >
            <h2 className="text-[5rem] md:text-[10rem] leading-[0.8] font-black uppercase text-black">
                WE ARE
            </h2>
            <h2 className="text-[5rem] md:text-[10rem] leading-[0.8] font-black uppercase text-[#facc15] stroke-black text-stroke-4">
                LOUD
            </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-black/90 p-8 text-[#facc15] border-4 border-[#facc15]"
            >
                <h3 className="text-3xl font-black uppercase mb-4">The Mission</h3>
                <p className="font-bold text-lg uppercase leading-relaxed opacity-90">
                    We are not just a club. We are a movement. 
                    Dedicated to the highest grade, the loudest genetics, 
                    and the most immersive experiences.
                    Strictly for the connoisseur.
                </p>
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-[#facc15]/90 p-8 text-black border-4 border-black"
            >
                <h3 className="text-3xl font-black uppercase mb-4">The Promise</h3>
                <p className="font-bold text-lg uppercase leading-relaxed">
                    No mids. No stress. Just pure, unadulterated fire 
                    delivered to your door. We curate the culture 
                    so you can consume the best.
                </p>
            </motion.div>
        </div>

        <motion.div
             initial={{ scale: 0 }}
             whileInView={{ scale: 1 }}
             transition={{ type: "spring", bounce: 0.5 }} 
             className="pt-20"
        >
            <div className="text-[8rem] md:text-[15rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-black to-transparent opacity-20 select-none">
                2026
            </div>
        </motion.div>

      </div>
    </div>
  );
}
