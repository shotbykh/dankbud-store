import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-[#facc15] border-t-4 border-[#facc15] py-12 px-8 font-mono relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
           <div className="text-3xl font-black uppercase mb-4">DankBud</div>
           <p className="text-sm text-gray-400 max-w-xs">
             A private members-only club for connoisseurs. 
             <br/>Strictly Over 18.
           </p>
        </div>

        <div className="flex flex-col gap-4 text-sm font-bold uppercase">
           <Link href="/terms" className="hover:underline hover:text-white">Terms of Service</Link>
           <Link href="/privacy" className="hover:underline hover:text-white">Privacy Policy</Link>
           <Link href="/returns" className="hover:underline hover:text-white">Refund Policy</Link>
        </div>
        
        <div className="text-right">
            <div className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} DankBud. All rights reserved.
            </div>
            <div className="text-xs text-gray-600 mt-2">
                Payments secured by Yoco
            </div>
        </div>
      </div>
    </footer>
  );
}
