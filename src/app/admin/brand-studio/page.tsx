import React from 'react';
import BrandStudioEditor from '@/components/admin/BrandStudioEditor';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function BrandStudioPage() {
  const products = await getProducts();
  return <BrandStudioEditor products={products} />;
}
