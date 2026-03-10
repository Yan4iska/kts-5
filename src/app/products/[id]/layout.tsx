import type { Metadata } from 'next';
import { getProduct } from '@/shared/config/api';

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: product?.title ? `${product.title} | Lalasia` : 'Product | Lalasia',
      description: product?.description ?? undefined,
    };
  } catch {
    return { title: 'Product | Lalasia' };
  }
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
