'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StockItem {
    id: string;
    name: string;
    stock: number;
}

export default function InventoryForm({ products }: { products: StockItem[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpdate = async (id: string, newStock: number) => {
        setLoading(id);
        try {
            await fetch('/api/admin/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, stock: newStock })
            });
            router.refresh(); // Refresh Server Component to see new data
        } catch (e) {
            alert("Update failed");
        }
        setLoading(null);
    };

    return (
        <div className="space-y-4">
            {products.map(p => (
                <div key={p.id} className="border border-[#facc15]/30 p-4 flex items-center justify-between hover:bg-[#facc15]/5 transition-colors">
                    <div>
                        <div className="font-bold text-lg">{p.name}</div>
                        <div className="text-xs opacity-50 font-mono">{p.id}</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className={`text-2xl font-black ${p.stock < 50 ? 'text-red-500' : 'text-[#facc15]'}`}>
                            {p.stock}g
                        </div>
                        
                        <div className="flex gap-1">
                            {/* Quick Actions */}
                            <button 
                                disabled={loading === p.id}
                                onClick={() => handleUpdate(p.id, p.stock + 50)} 
                                className="px-3 py-1 bg-[#facc15]/20 text-[#facc15] hover:bg-[#facc15] hover:text-black font-bold uppercase text-xs"
                            >
                                +50g
                            </button>
                             <button 
                                disabled={loading === p.id}
                                onClick={() => {
                                    const val = prompt(`Set stock for ${p.name}`, p.stock.toString());
                                    if (val) handleUpdate(p.id, parseInt(val));
                                }} 
                                className="px-3 py-1 border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black font-bold uppercase text-xs"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
