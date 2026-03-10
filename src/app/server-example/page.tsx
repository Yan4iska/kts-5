import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server data example | Lalasia',
  description: 'Demo of server-side fetch, caching and parallel data loading',
};

export const revalidate = 120;

type StrapiListResponse<T> = {
  data: T[];
};

type DemoProduct = {
  id: number;
  attributes?: {
    title?: string;
  };
};

type DemoCategory = {
  id: number;
  attributes?: {
    title?: string;
  };
};

async function loadServerData() {
  const baseUrl = 'https://front-school-strapi.ktsdev.ru/api';
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${baseUrl}/products?pagination[pageSize]=4`, {
      headers,
      next: { revalidate },
    }),
    fetch(`${baseUrl}/product-categories?pagination[pageSize]=6`, {
      headers,
      cache: 'no-store',
    }),
  ]);

  if (!productsRes.ok) {
    throw new Error('Failed to load products on the server');
  }

  if (!categoriesRes.ok) {
    throw new Error('Failed to load categories on the server');
  }

  const productsJson = (await productsRes.json()) as StrapiListResponse<DemoProduct>;
  const categoriesJson = (await categoriesRes.json()) as StrapiListResponse<DemoCategory>;

  return {
    products: productsJson.data,
    categories: categoriesJson.data,
  };
}

export default async function ServerExamplePage() {
  const { products, categories } = await loadServerData();

  return (
    <main style={{ padding: '24px 16px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Server-side data example</h1>
      <p style={{ marginBottom: 24 }}>
        This page demonstrates loading data in a server component using <code>fetch</code>, parallel
        requests with <code>Promise.all</code>, and caching / revalidation.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Sample products (ISR)</h2>
        {products.length === 0 ? (
          <p>No products loaded.</p>
        ) : (
          <ul style={{ paddingLeft: 16 }}>
            {products.map((p) => (
              <li key={p.id}>{p.attributes?.title ?? `Product #${p.id}`}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Sample categories (no-store)</h2>
        {categories.length === 0 ? (
          <p>No categories loaded.</p>
        ) : (
          <ul style={{ paddingLeft: 16 }}>
            {categories.map((c) => (
              <li key={c.id}>{c.attributes?.title ?? `Category #${c.id}`}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

