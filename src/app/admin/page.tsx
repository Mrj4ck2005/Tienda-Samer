'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/db/supabase';
import { Category, Product } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { deleteImage } from '@/services/storage';

import {
  Trash2,
  LogOut,
  Loader,
  Package,
  Star,
  Layers3,
  AlertTriangle,
  Search,
} from 'lucide-react';

type Tab = 'productos' | 'categorias';

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('productos');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: catsData }, { data: prodsData }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ]);
      setCategories(catsData || []);
      setProducts(prodsData || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;

    // 1. Buscar el producto para obtener sus imágenes
    const product = products.find((p) => p.id === id);

    // 2. Eliminar cada imagen del bucket ANTES de borrar el registro
    if (product?.image_urls && product.image_urls.length > 0) {
      for (const url of product.image_urls) {
        try {
          await deleteImage(url);
        } catch (err) {
          console.error('Error eliminando imagen del bucket:', err);
          // Continuamos aunque falle una imagen individual
        }
      }
    }

    // 3. Eliminar el registro de la tabla
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await fetchData();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader size={50} className="animate-spin text-rose-500" />
      </div>
    );
  }

  if (!user) return null;

  const featuredProducts = products.filter((p) => p.featured).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;

  const filteredProducts = products
    .filter((p) => selectedCategory === 'all' || p.category_id === selectedCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const countByCategory = (catId: string) =>
    products.filter((p) => p.category_id === catId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ── TÍTULO ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <p className="text-rose-500 uppercase tracking-[0.35em] text-xs mb-2">
              Samer Florería y Regalos
            </p>
            <h1 className="font-playfair text-5xl font-bold text-gray-900">
              Panel Administrativo
            </h1>
            <p className="text-gray-500 mt-2">
              Gestiona productos, categorías, stock e imágenes.
            </p>
          </div>
        </div>

        {/* ── ESTADÍSTICAS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Package className="text-rose-500" />
              <div>
                <p className="text-gray-500 text-sm">Productos</p>
                <h3 className="text-3xl font-bold text-gray-900">{products.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Layers3 className="text-cyan-500" />
              <div>
                <p className="text-gray-500 text-sm">Categorías</p>
                <h3 className="text-3xl font-bold text-gray-900">{categories.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-500" />
              <div>
                <p className="text-gray-500 text-sm">Destacados</p>
                <h3 className="text-3xl font-bold text-gray-900">{featuredProducts}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" />
              <div>
                <p className="text-gray-500 text-sm">Sin Stock</p>
                <h3 className="text-3xl font-bold text-gray-900">{outOfStock}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* ── BLOQUE STICKY: TABS + COLUMNAS ── */}
        <div className="xl:sticky xl:top-[80px] xl:h-[calc(100vh-80px)] flex flex-col">

          {/* TABS */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 flex gap-2 mb-8 flex-shrink-0">
            <button
              onClick={() => setTab('productos')}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                tab === 'productos' ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setTab('categorias')}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                tab === 'categorias' ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Categorías
            </button>
          </div>

          {/* PRODUCTOS */}
          {tab === 'productos' && (
            <div className="flex flex-col xl:flex-row gap-8 flex-1 min-h-0">

              {/* Columna formulario */}
              <div className="xl:w-[380px] xl:flex-shrink-0 xl:overflow-y-auto xl:pr-2 pb-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                  <h2 className="font-playfair text-3xl text-gray-900 mb-6">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <ProductForm
                    categories={categories}
                    initialProduct={editingProduct || undefined}
                    onSuccess={() => {
                      setEditingProduct(null);
                      fetchData();
                    }}
                  />
                </div>
              </div>

              {/* Columna lista productos */}
              <div className="flex-1 min-h-0 flex flex-col gap-4 pb-6">

                {/* FILTROS */}
                <div className="flex-shrink-0 space-y-3">

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                        selectedCategory === 'all'
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                      }`}
                    >
                      Todos
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        selectedCategory === 'all' ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {products.length}
                      </span>
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                          selectedCategory === cat.id
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                        }`}
                      >
                        {cat.name}
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                          selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {countByCategory(cat.id)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 pl-1">
                    {filteredProducts.length === products.length
                      ? `${products.length} productos en total`
                      : `${filteredProducts.length} de ${products.length} productos`}
                  </p>

                </div>

                {/* Lista filtrada */}
                <div className="flex-1 min-h-0 xl:overflow-y-auto xl:pr-2 space-y-4">
                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Package size={48} className="mb-3 opacity-30" />
                      <p className="text-sm">No se encontraron productos</p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition"
                      >
                        <div className="flex flex-col md:flex-row gap-4">

                          {product.image_urls?.[0] && (
                            <img
                              src={product.image_urls[0]}
                              alt={product.name}
                              className="w-full md:w-36 h-36 rounded-2xl object-cover"
                            />
                          )}

                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-600">
                                Stock: {product.stock}
                              </span>
                              {(() => {
                                const cat = categories.find((c) => c.id === product.category_id);
                                return cat ? (
                                  <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600">
                                    {cat.name}
                                  </span>
                                ) : null;
                              })()}
                              {product.featured && (
                                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                  ⭐ Destacado
                                </span>
                              )}
                              {product.show_price && (
                                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                  S/ {product.price}
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-600">{product.description}</p>
                          </div>

                          <div className="flex md:flex-col gap-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          )}

          {tab === 'categorias' && (
            <div className="flex-1 min-h-0 xl:overflow-y-auto pb-6">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <CategoryManager />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}