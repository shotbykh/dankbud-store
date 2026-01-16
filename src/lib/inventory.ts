import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const INVENTORY_FILE = path.join(process.cwd(), 'data/inventory.json');

export type InventoryMap = Record<string, number>;

// Helper to read local file
function readLocalInventory(): InventoryMap {
    try {
        if (!fs.existsSync(INVENTORY_FILE)) return {};
        return JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
    } catch (e) {
        return {};
    }
}

export async function getInventory(): Promise<InventoryMap> {
    // 1. Supabase
    if (supabase) {
        const { data, error } = await supabase.from('inventory').select('*');
        if (!error && data) {
            // Convert [{product_id: 'x', stock: 10}] -> {'x': 10}
            const map: InventoryMap = {};
            data.forEach((row: any) => {
                map[row.product_id] = row.stock;
            });
            return map;
        }
    }

    // 2. Local Fallback
    return readLocalInventory();
}

export async function getProductStock(id: string): Promise<number> {
    const inv = await getInventory();
    return inv[id] || 0;
}

export async function updateStock(id: string, newQuantity: number) {
    // 1. Supabase
    if (supabase) {
        // Upsert
        const { error } = await supabase
            .from('inventory')
            .upsert({ product_id: id, stock: newQuantity }, { onConflict: 'product_id' });
        
        if (!error) return;
    }

    // 2. Local Fallback
    const inv = readLocalInventory();
    inv[id] = newQuantity;
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inv, null, 2));
}

export async function deductStock(id: string, amount: number) {
    const current = await getProductStock(id);
    const newStock = Math.max(0, current - amount);
    await updateStock(id, newStock);
}
