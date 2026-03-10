import { getProducts } from 'config/api';
import { useState, useEffect } from 'react';
import type { Product } from 'types/product';

export function useProductList(pageSize = 12) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getProducts({ pageSize })
      .then((data) => {
        if (mounted) {
          setProducts(data.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Ошибка загрузки товаров');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [pageSize]);

  return { products, loading, error };
}
