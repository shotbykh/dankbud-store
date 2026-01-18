import type { Metadata } from "next";
import { Syne, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import CartDrawer from "@/components/cart/CartDrawer";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DankBud | Exclusive Cannabis Club",
  description: "Members only. Premium product. Wholesale prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${archivoBlack.variable} font-sans antialiased min-h-screen border-[5px] border-black bg-[#facc15]`}
      >
        <Providers>
            <CartDrawer />
            {children}
        </Providers>
      </body>
    </html>
  );
}
