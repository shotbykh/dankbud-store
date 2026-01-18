import Link from "next/link";
import { getProducts } from "@/lib/products";
import CartIndicator from "@/components/cart/CartIndicator";
import LogoutButton from "@/components/shop/LogoutButton";
import ProductImage from "@/components/shop/ProductImage";

// Force dynamic because we are fetching from DB now
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#facc15] text-black relative">
      
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-4 md:p-8 bg-[#facc15]/90 backdrop-blur border-b-4 border-black">
        <div className="flex items-center gap-6">
            <Link href="/" className="text-xl md:text-2xl font-black uppercase tracking-tighter hover:underline decoration-4">
                ← Exit Shop
            </Link>
            <span className="hidden md:inline opacity-30">|</span>
            <span className="hidden md:inline font-bold uppercase tracking-widest text-sm">
                Catalog v2.0 (Live DB)
            </span>
        </div>
        <div className="font-bold uppercase tracking-widest text-sm flex gap-4 items-center">
            <CartIndicator />
            <LogoutButton />
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* 
            FLUID TYPOGRAPHY FIX V2:
            Reduced to 15vw to be safe on all screens.
            Added break-words and hyphens-auto.
        */}
        <h1 className="font-archivo text-[15vw] font-extrabold uppercase tracking-tight leading-[0.8] mb-16 mix-blend-darken transform scale-y-[1.3] origin-left -ml-2 select-none break-words hyphens-auto">
            Fresh<br/>Drops
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
                const stock = product.stock ?? 0;
                const isSoldOut = stock <= 0;

                return (
                    <Link 
                        href={isSoldOut ? '#' : `/shop/${product.id}`}
                        key={product.id}
                        className={`group block border-4 border-black bg-white p-4 relative transition-all ${isSoldOut ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:bg-black hover:text-[#facc15] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'}`}
                    >
                        <div className="w-full aspect-square mb-4 border-4 border-black relative overflow-hidden bg-gray-50">
                            <ProductImage src={product.image} alt={product.name} fill />
                            
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-2 z-10">
                                <span className="bg-black text-[#facc15] font-black px-2 py-1 uppercase text-xs border border-[#facc15]">
                                    {product.category}
                                </span>
                                {stock < 50 && stock > 0 && (
                                     <span className="bg-[#d946ef] text-white border border-black font-black px-2 py-1 uppercase text-xs animate-pulse">
                                        Low Stock
                                    </span>
                                )}
                            </div>

                            {isSoldOut && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-black text-4xl -rotate-12 border-4 border-white px-4 py-2">SOLD OUT</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            {/* Card Title Fix: break-words and hyphens logic */}
                            <h3 className="text-4xl font-archivo font-bold uppercase leading-none tracking-tight transform scale-y-110 origin-left break-words hyphens-auto pr-2">{product.name}</h3>
                            <div className="text-2xl font-black shrink-0">R{product.price}</div>
                        </div>
                        
                         <div className="flex gap-2 mb-6 flex-wrap">
                            {product.effects && product.effects.slice(0, 3).map((effect, i) => (
                                <span key={i} className="text-xs font-bold uppercase border border-current px-2 py-1">
                                    {effect}
                                </span>
                            ))}
                        </div>

                        <div className={`w-full py-4 font-black uppercase tracking-widest text-center border-2 border-current transition-colors ${isSoldOut ? 'bg-gray-200 text-gray-500 border-gray-400' : 'bg-[#facc15] text-black group-hover:bg-white group-hover:text-black border-black'}`}>
                            {isSoldOut ? 'Out of Stock' : 'View Strain →'}
                        </div>
                    </Link>
                );
            })}
        </div>
      </div>
    </main>
  );
}
