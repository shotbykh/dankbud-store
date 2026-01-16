import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { getProducts, getProductById } from "@/lib/products";
import { getProductStock } from "@/lib/inventory";

// Server Component
export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  const stock = await getProductStock(id); // Fetch Stock

  if (!product) {
    notFound();
  }

  // Pass stock to client
  return <ProductDetailClient product={product} initialStock={stock} />;
}
