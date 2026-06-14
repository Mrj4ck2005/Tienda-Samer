'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC<{ categoryId?: string }> = ({
  categoryId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .gt('stock', 0)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (!error) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#999' }}>
        Cargando productos...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#999' }}>
        No hay productos disponibles
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        width: '100%',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};