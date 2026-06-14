'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { Category } from '@/types';
import { supabase } from '@/lib/db/supabase';
import { deleteImage } from '@/services/storage';

import {
  Trash2,
  Plus,
  FolderOpen,
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [newCategory, setNewCategory] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    setCategories(data || []);
  };

  const handleAddCategory = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newCategory.trim()) return;

    setIsLoading(true);

    try {
      const slug = newCategory
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const { error } = await supabase
        .from('categories')
        .insert([
          {
            name: newCategory,
            slug,
            description: '',
            active: true,
          },
        ]);

      if (error) throw error;

      setNewCategory('');
      await fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Error creando categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (
    categoryId: string,
    categoryName: string
  ) => {
    try {
      /*
       * Buscar productos de esta categoría
       */
      const { data: products, error: productsError } =
        await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId);

      if (productsError) throw productsError;

      const totalProducts =
        products?.length || 0;

      let message = '';

      if (totalProducts > 0) {
        message = `
La categoría "${categoryName}" contiene ${totalProducts} producto(s).

Si continúas:

• Se eliminará la categoría.
• Se eliminarán todos los productos asociados.
• Se eliminarán todas las imágenes almacenadas en Supabase Storage.

Esta acción no se puede deshacer.

¿Deseas continuar?
        `;
      } else {
        message = `
¿Eliminar la categoría "${categoryName}"?

Esta acción no se puede deshacer.
        `;
      }

      const confirmed = window.confirm(
        message
      );

      if (!confirmed) return;

      /*
       * Eliminar imágenes del bucket
       */
      if (products?.length) {
        for (const product of products) {
          if (
            Array.isArray(product.image_urls)
          ) {
            for (const imageUrl of product.image_urls) {
              try {
                await deleteImage(imageUrl);
              } catch (error) {
                console.error(
                  'Error eliminando imagen:',
                  imageUrl,
                  error
                );
              }
            }
          }
        }

        /*
         * Eliminar productos
         */
        const { error: deleteProductsError } =
          await supabase
            .from('products')
            .delete()
            .eq(
              'category_id',
              categoryId
            );

        if (deleteProductsError)
          throw deleteProductsError;
      }

      /*
       * Eliminar categoría
       */
      const { error: deleteCategoryError } =
        await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);

      if (deleteCategoryError)
        throw deleteCategoryError;

      await fetchCategories();

      alert(
        totalProducts > 0
          ? 'Categoría, productos e imágenes eliminados correctamente.'
          : 'Categoría eliminada correctamente.'
      );
    } catch (error) {
      console.error(error);

      alert(
        'Ocurrió un error al eliminar la categoría.'
      );
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleAddCategory}
        className="flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          value={newCategory}
          onChange={(e) =>
            setNewCategory(
              e.target.value
            )
          }
          placeholder="Nueva categoría"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Plus size={18} />
          Agregar
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-rose-100 p-3 rounded-xl">
                <FolderOpen className="text-rose-500" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {cat.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {cat.slug}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                handleDelete(
                  cat.id,
                  cat.name
                )
              }
              className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};