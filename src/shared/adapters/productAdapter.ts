import type { Product, ProductCategory, StrapiImage } from 'types/product';

export type OldProductRaw = {
  id: number;
  documentId?: string;
  title?: string;
  description?: string;
  price?: number;
  discountPercent?: number;
  rating?: number | null;
  isInStock?: boolean;
  images?: StrapiImage[] | null;
  productCategory?: ProductCategory | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  [key: string]: unknown;
};

export type EscuelaProductRaw = {
  id: number;
  title: string;
  price: number;
  description: string;
  slug: string;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  creationAt?: string;
  updatedAt?: string;
};

const ESCUELA_ID_OFFSET = 100000;

function stringToStrapiImage(url: string): StrapiImage {
  return {
    id: 0,
    documentId: '',
    name: '',
    alternativeText: null,
    caption: null,
    width: 0,
    height: 0,
    hash: '',
    ext: '',
    mime: '',
    size: 0,
    url,
    previewUrl: null,
    provider: '',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  };
}

export function mapOldProductToProduct(raw: OldProductRaw): Product {
  const category = raw.productCategory;
  return {
    id: raw.id,
    documentId: raw.documentId ?? String(raw.id),
    title: raw.title ?? '',
    description: raw.description ?? '',
    price: Number(raw.price) ?? 0,
    discountPercent: typeof raw.discountPercent === 'number' ? raw.discountPercent : 0,
    rating: raw.rating ?? null,
    isInStock: raw.isInStock ?? true,
    images: Array.isArray(raw.images) ? raw.images : undefined,
    productCategory: category
      ? {
          id: category.id,
          documentId: category.documentId ?? '',
          name: category.name ?? '',
          image: category.image,
        }
      : null,
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    publishedAt: raw.publishedAt ?? '',
  };
}

export function mapEscuelaProductToProduct(raw: EscuelaProductRaw): Product {
  const images: StrapiImage[] = Array.isArray(raw.images)
    ? raw.images.filter((u): u is string => typeof u === 'string').map(stringToStrapiImage)
    : [];
  return {
    id: ESCUELA_ID_OFFSET + raw.id,
    documentId: raw.slug ?? String(raw.id),
    title: raw.title ?? '',
    description: raw.description ?? '',
    price: Number(raw.price) || 0,
    discountPercent: 0,
    rating: 0,
    isInStock: true,
    images: images.length > 0 ? images : undefined,
    productCategory: raw.category
      ? {
          id: raw.category.id,
          documentId: raw.category.slug ?? '',
          name: raw.category.name ?? '',
          image: raw.category.image,
        }
      : null,
    createdAt: raw.creationAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    publishedAt: raw.creationAt ?? '',
  };
}
