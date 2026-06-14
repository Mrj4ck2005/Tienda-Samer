'use client';

import React, { useState } from 'react';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CategoryFilter } from '@/components/ui/CategoryFilter';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: '60vh',
          background: 'linear-gradient(135deg, #fff5f7 0%, #ffe0e6 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 20px',
          borderBottom: '3px solid #db2777',
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          <p
            style={{
              color: '#db2777',
              fontSize: '14px',
              letterSpacing: '6px',
              marginBottom: '20px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            ✦ Bienvenido a Samer Florería ✦
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '72px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '20px',
              lineHeight: '1.2',
            }}
          >
            Nuestros <em style={{ fontStyle: 'italic', color: '#ec4899' }}>Arreglos</em>
          </h1>
          <p
            style={{
              color: '#555',
              fontSize: '20px',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Arreglos florales únicos, hechos con amor y alma para celebrar tus momentos especiales
          </p>
        </div>
      </section>

      {/* Productos Section */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 30px' }}>
        {/* Titulo */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '15px',
            }}
          >
            Catálogo de Productos
          </h2>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Selecciona una categoría para ver nuestros arreglos
          </p>
        </div>

        {/* Filtros */}
        <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'center' }}>
          <CategoryFilter onSelectCategory={setSelectedCategory} />
        </div>

        {/* Grid */}
        <ProductGrid categoryId={selectedCategory || undefined} />
      </section>

      {/* Footer */}
      <footer
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '60px 30px',
          textAlign: 'center',
          color: '#fff',
          marginTop: '60px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              marginBottom: '15px',
              color: '#f4a7b9',
            }}
          >
            Samer Florería y Regalos
          </h3>
          <p style={{ color: '#aaa', marginBottom: '20px' }}>
            Expresamos amor y celebración a través de flores
          </p>
          <p style={{ color: '#777', fontSize: '14px' }}>
            © 2026 Samer Florería. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}