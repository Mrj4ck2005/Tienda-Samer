'use client';

import React, { useEffect, useState } from 'react';
import { Product, Category } from '@/types';
import { supabase } from '@/lib/db/supabase';
import { uploadImage, deleteImage } from '@/services/storage';
import { X, ImagePlus } from 'lucide-react';

interface ProductFormProps {
  categories: Category[];
  onSuccess: () => void;
  initialProduct?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  onSuccess,
  initialProduct,
}) => {
  const emptyForm = {
    name: '',
    description: '',
    category_id: '',
    price: 0,
    show_price: false,
    stock: 0,
    featured: false,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        description: initialProduct.description || '',
        category_id: initialProduct.category_id || '',
        price: initialProduct.price || 0,
        show_price: initialProduct.show_price || false,
        stock: initialProduct.stock || 0,
        featured: initialProduct.featured || false,
      });
      setExistingImages(initialProduct.image_urls || []);
      setNewFiles([]);
      setPreviewUrls([]);
    } else {
      resetForm();
    }
  }, [initialProduct]);

  const resetForm = () => {
    setFormData(emptyForm);
    setExistingImages([]);
    setNewFiles([]);
    setPreviewUrls([]);
    setError('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  };

  /*
    Al hacer focus en precio o stock:
    si el valor actual es 0, lo limpiamos para que el campo quede vacío
    y el usuario pueda escribir directamente sin borrar el cero.
  */
  const handleNumberFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (Number(e.target.value) === 0) {
      const { name } = e.target;
      setFormData((prev) => ({ ...prev, [name]: '' as any }));
    }
  };

  /*
    Al salir del campo (blur):
    si quedó vacío, volvemos a poner 0.
  */
  const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || isNaN(Number(value))) {
      setFormData((prev) => ({ ...prev, [name]: 0 }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const selectedFiles = Array.from(files);
    setNewFiles((prev) => [...prev, ...selectedFiles]);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = async (url: string) => {
    try {
      await deleteImage(url);
      setExistingImages((prev) => prev.filter((img) => img !== url));
    } catch (error) {
      console.error(error);
      setError('No se pudo eliminar la imagen');
    }
  };

  const removeNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.name.trim()) throw new Error('Ingresa un nombre');
      if (!formData.category_id) throw new Error('Selecciona una categoría');

      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      const finalImages = [...existingImages, ...uploadedUrls];
      if (finalImages.length === 0) throw new Error('Debes agregar al menos una imagen');

      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        image_urls: finalImages,
        updated_at: new Date().toISOString(),
      };

      if (initialProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
        resetForm();
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error guardando producto');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2 font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Descripción</label>
        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Categoría</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          className={inputClass}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/*
        Precio y Stock con label flotante.
        - Al hacer focus y el valor es 0 → campo se vacía.
        - Al salir y está vacío → vuelve a 0.
        - El label "Precio" / "Stock" siempre visible a la derecha, pequeño y gris.
      */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* PRECIO */}
        <div className="relative">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            onFocus={handleNumberFocus}
            onBlur={handleNumberBlur}
            min="0"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-16 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300 font-medium pointer-events-none select-none">
            Precio
          </span>
        </div>

        {/* STOCK */}
        <div className="relative">
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            onFocus={handleNumberFocus}
            onBlur={handleNumberBlur}
            min="0"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-16 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300 font-medium pointer-events-none select-none">
            Stock
          </span>
        </div>

      </div>

      <div className="flex gap-5">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="show_price"
            checked={formData.show_price}
            onChange={handleInputChange}
          />
          Mostrar precio
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
          />
          Destacado
        </label>
      </div>

      {(existingImages.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {existingImages.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} className="h-32 w-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {previewUrls.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} className="h-32 w-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-rose-300 rounded-2xl p-8 cursor-pointer hover:bg-rose-50">
        <ImagePlus size={40} className="text-rose-500 mb-3" />
        <span>Seleccionar imágenes</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold"
      >
        {isLoading ? 'Guardando...' : initialProduct ? 'Actualizar Producto' : 'Crear Producto'}
      </button>
    </form>
  );
}