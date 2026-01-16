import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data/products.json');

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  thc: string;
  lineage: string;
  description: string;
  effects: string[];
  image: string; // CSS class for now, would be URL in real app
}

export function getProducts(): Product[] {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read products DB", error);
    return [];
  }
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}
