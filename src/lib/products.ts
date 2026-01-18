import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number; // merged from inventory
  thc: string;
  lineage: string;
  description: string;
  effects: string[];
  image: string;
  supplier_id?: string; // Linked Supplier
}

// Fetch all products + stock
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Products Error:", error);
    return [];
  }

  return data.map((d: any) => ({
      ...d,
      // Ensure we handle arrays correctly (Supabase returns arrays as is)
      effects: d.effects || []
  }));
}

// Fetch single product
export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  return {
      ...data,
      effects: data.effects || []
  };
}

// Update Stock
export async function updateProductStock(id: string, newStock: number) {
    const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
}
