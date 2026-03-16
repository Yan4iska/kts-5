import { getProduct, getProducts } from 'config/api';
import { notFound } from 'next/navigation';
import axios from 'axios';
import type { Product } from 'types/product';

import ProductClient from './components/ProductClient';

const RELATED_MAX = 16;

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function ProductPage({ params }: PageProps) {
  const { id: documentId } = await Promise.resolve(params);

  if (!documentId) {
    notFound();
  }

  let product: Product;
  try {
    product = await getProduct(documentId);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    throw err;
  }

  let relatedProducts: Product[] = [];
  try {
    const categoryId = product.productCategory?.id;
    const { data } = await getProducts({
      page: 1,
      pageSize: RELATED_MAX + 8,
      categoryIds: categoryId != null ? [categoryId] : undefined,
    });
    const seen = new Set<string>();
    relatedProducts = data
      .filter((p) => p.documentId !== documentId && !seen.has(p.documentId) && seen.add(p.documentId))
      .slice(0, RELATED_MAX);
  } catch {
    relatedProducts = [];
  }

  return (
    <ProductClient initialProduct={product} relatedProducts={relatedProducts} />
  );
}
