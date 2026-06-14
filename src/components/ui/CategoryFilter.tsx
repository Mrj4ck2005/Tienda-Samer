'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase';
import { Category } from '@/types';

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (!error) {
        setCategories(data || []);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleSelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onSelectCategory(categoryId);
  };

  if (loading) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
      <button
        onClick={() => handleSelect(null)}
        style={{
          padding: '12px 28px',
          borderRadius: '25px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '14px',
          letterSpacing: '1px',
          backgroundColor: selectedCategory === null ? '#db2777' : '#fff',
          color: selectedCategory === null ? '#fff' : '#db2777',
          boxShadow: selectedCategory === null ? '0 4px 12px rgba(219, 39, 119, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          border: selectedCategory === null ? 'none' : '2px solid #db2777',
        }}
        onMouseEnter={(e) => {
          if (selectedCategory !== null) {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCategory !== null) {
            e.currentTarget.style.backgroundColor = '#fff';
          }
        }}
      >
        Todos
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleSelect(category.id)}
          style={{
            padding: '12px 28px',
            borderRadius: '25px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            letterSpacing: '1px',
            backgroundColor: selectedCategory === category.id ? '#db2777' : '#fff',
            color: selectedCategory === category.id ? '#fff' : '#db2777',
            boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(219, 39, 119, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            border: selectedCategory === category.id ? 'none' : '2px solid #db2777',
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category.id) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category.id) {
              e.currentTarget.style.backgroundColor = '#fff';
            }
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};