import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-[#facc15] border-t-[5px] border-black p-8 font-mono relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-black uppercase font-archivo mb-2">DankBud</h2>
          <p className="text-sm opacity-80">
            Exclusive Members Club.<br/>
            Top Shelf. Wholesale Prices.<br/>
            Port Elizabeth, ZA.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-bold uppercase mb-4 decoration-wavy underline decoration-[#facc15]">Navigate</h3>
          <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-yellow-400 uppercase">Home</Link></li>
              <li><Link href="/shop" className="hover:text-yellow-400 uppercase">Shop</Link></li>
              <li><Link href="/delivery" className="hover:text-yellow-400 uppercase">Delivery Info</Link></li>
              <li><Link href="/cart" className="hover:text-yellow-400 uppercase">Cart</Link></li>
              <li><Link href="/admin/login" className="text-neutral-500 hover:text-white uppercase text-xs">Staff</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
           <h3 className="font-bold uppercase mb-4 decoration-wavy underline decoration-[#facc15]">Legal</h3>
           <p className="text-xs opacity-60 mb-2">
             This website is for members only. 
             Strictly Over 18s. 
             Right of admission reserved.
           </p>
           <p className="text-xs opacity-60">
             &copy; {new Date().getFullYear()} DankBud Details Pty Ltd.
           </p>
        </div>

      </div>
    </footer>
  );
}
