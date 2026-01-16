import { getProducts, getProductById, updateProductStock } from './products';

// Backwards compatibility for the "Map" structure
export type InventoryMap = Record<string, number>;

export async function getInventory(): Promise<InventoryMap> {
    const products = await getProducts();
    const map: InventoryMap = {};
    products.forEach(p => {
        map[p.id] = p.stock;
    });
    return map;
}

export async function getProductStock(id: string): Promise<number> {
    const product = await getProductById(id);
    return product ? product.stock : 0;
}

export async function updateStock(id: string, newQuantity: number) {
    await updateProductStock(id, newQuantity);
}

export async function deductStock(id: string, amount: number) {
    const current = await getProductStock(id);
    const newStock = Math.max(0, current - amount);
    await updateProductStock(id, newStock);
}
