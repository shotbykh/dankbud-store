'use client';

import { useCart } from "@/context/CartContext";

export default function CartIndicator() {
  const { items, toggleCart } = useCart();
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button onClick={toggleCart} className="relative group p-2 border-2 border-transparent hover:border-black rounded transition-all">
      <span className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-[#facc15] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#facc15]">
            {count}
        </span>
      )}
    </button>
  );
}
