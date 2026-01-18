import { supabase } from './supabase';

export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone?: string;
    // products?: Product[] - linked via FK
}

export async function getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching suppliers:", error);
        return [];
    }
    return data;
}

export async function saveSupplier(supplier: Omit<Supplier, 'id'>) {
    const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteSupplier(id: string) {
    const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}
