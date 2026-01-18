'use client';

import Link from "next/link";

interface LiquidButtonProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function LiquidButton({ href, children, className = "", onClick }: LiquidButtonProps) {
  // PX-8 and Text-2xl on mobile, larger on desktop
  const baseClasses = `group relative inline-flex items-center justify-center px-8 py-5 md:px-12 md:py-6 bg-transparent text-black text-2xl md:text-3xl font-black uppercase tracking-widest border-4 border-black hover:text-[#facc15] transition-colors duration-300 ${className}`;
  
  const inner = (
    <>
        <span className="relative z-10">{children}</span>
        
        {/* Liquid Fill Animation */}
        <div className="absolute inset-0 w-full h-full bg-black transform scale-y-0 origin-bottom transition-transform duration-300 ease-out group-hover:scale-y-100"></div>

        {/* Decorative Blobs on Hover */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 group-hover:-translate-y-2 group-hover:translate-x-2"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 group-hover:translate-y-2 group-hover:-translate-x-2"></div>
    </>
  );

  if (href) {
    return (
        <Link href={href} className={baseClasses}>
            {inner}
        </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
        {inner}
    </button>
  );
}
