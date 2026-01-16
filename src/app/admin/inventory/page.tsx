import { getInventory } from "@/lib/inventory";
import { getProducts } from "@/lib/products";
import Link from "next/link";
import InventoryForm from "@/components/admin/InventoryForm"; // Client Component for actions

// Server Component
export default async function AdminInventoryPage() {
  const products = getProducts();
  const inventory = await getInventory();

  // Combine data
  const stockData = products.map(p => ({
    ...p,
    stock: inventory[p.id] || 0
  }));

  return (
    <main className="min-h-screen bg-black text-[#facc15] font-mono p-8">
      <header className="flex justify-between items-center mb-12 border-b border-[#facc15] pb-4">
        <div>
            <h1 className="text-3xl font-bold uppercase">DankBud Vault</h1>
            <p className="opacity-60 text-sm">Inventory Management</p>
        </div>
        <div className="space-x-4">
             <Link href="/admin/orders" className="text-sm hover:underline opacity-50 hover:opacity-100">Orders</Link>
             <span className="opacity-20">|</span>
             <Link href="/" className="text-sm hover:underline">Exit Console</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <InventoryForm products={stockData} />
      </div>
    </main>
  );
}
