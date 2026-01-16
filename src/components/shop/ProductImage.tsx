import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export default function ProductImage({ src, alt, className = "", fill = false }: ProductImageProps) {
  const isUrl = src.startsWith("/");

  if (isUrl) {
    // Render Real Image
    return (
      <div className={`relative overflow-hidden ${className} ${fill ? 'w-full h-full' : ''}`}>
         <Image 
            src={src} 
            alt={alt} 
            fill 
            className="object-cover"
         />
      </div>
    );
  }

  // Render CSS Placeholder
  return (
    <div className={`relative overflow-hidden ${src} ${className} ${fill ? 'w-full h-full' : ''}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')] opacity-20"></div>
    </div>
  );
}
