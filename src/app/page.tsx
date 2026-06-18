'use client';

import React, { useState } from 'react';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CategoryFilter } from '@/components/ui/CategoryFilter';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf8f5', fontFamily: 'sans-serif' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0f0f0f 0%, #1c0a12 55%, #2a0d1a 100%)',
      }}>

        {/* Decoración fondo */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-120px', right: '-80px',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(219,39,119,0.18) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)',
          }} />
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06 }}
            viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <line x1="0" y1="200" x2="1440" y2="600" stroke="#f4a7b9" strokeWidth="1" />
            <line x1="0" y1="600" x2="1440" y2="200" stroke="#f4a7b9" strokeWidth="1" />
            <line x1="720" y1="0" x2="720" y2="900" stroke="#f4a7b9" strokeWidth="1" />
          </svg>
        </div>

        {/* Contenido hero */}
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', padding: '80px 24px',
          maxWidth: '900px',
        }}>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            marginBottom: '36px',
          }}>
            <span style={{ display: 'block', width: '40px', height: '1px', backgroundColor: '#db2777' }} />
            <span style={{
              color: '#f472b6', fontSize: '11px', letterSpacing: '5px',
              fontWeight: '600', textTransform: 'uppercase',
            }}>
              Florería &amp; Regalos · Lima, Perú
            </span>
            <span style={{ display: 'block', width: '40px', height: '1px', backgroundColor: '#db2777' }} />
          </div>

          {/* Título */}
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: '700',
            color: '#fff',
            lineHeight: '1.05',
            marginBottom: '28px',
            letterSpacing: '-1px',
          }}>
            Cada flor cuenta<br />
            <em style={{
              fontStyle: 'italic',
              color: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #f472b6, #db2777, #f9a8d4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}>
              una historia
            </em>
          </h1>

          {/* Subtítulo */}
          <p style={{
            color: '#c8a0ae',
            fontSize: 'clamp(15px, 2vw, 19px)',
            lineHeight: '1.7',
            maxWidth: '580px',
            margin: '0 auto 48px',
          }}>
            Arreglos únicos hechos a mano para celebrar tus momentos más especiales.
            Diseñamos con alma, entregamos con amor.
          </p>

          {/* CTA — solo ver catálogo */}
          <a href="#catalogo" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #db2777, #be185d)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(219,39,119,0.35)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(219,39,119,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(219,39,119,0.35)';
            }}
            >
              Ver catálogo
            </button>
          </a>
        </div>
      </section>

      {/* ── PROPUESTAS DE VALOR ── */}
      <section style={{
        background: '#fff',
        borderTop: '1px solid #f0e8ea',
        borderBottom: '1px solid #f0e8ea',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '64px 30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0',
        }}>
          {[
            { icon: '✦', label: 'Hecho a mano', desc: 'Cada arreglo es único, creado con dedicación y detalle para ti' },
            { icon: '⟡', label: 'Materiales premium', desc: 'Trabajamos con los mejores materiales para una durabilidad excepcional' },
            { icon: '◈', label: 'Diseño exclusivo', desc: 'Estética cuidada en cada pieza, pensada para sorprender' },
            { icon: '❋', label: 'Personalizable', desc: 'Adaptamos colores, tamaños y estilos a tu mensaje y ocasión' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              padding: '40px 32px',
              borderRight: i < arr.length - 1 ? '1px solid #f0e8ea' : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '22px', color: '#db2777',
                marginBottom: '16px', letterSpacing: '2px',
              }}>
                {item.icon}
              </div>
              <h4 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '17px', fontWeight: '700',
                color: '#1a1a1a', marginBottom: '10px',
              }}>
                {item.label}
              </h4>
              <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section
        id="catalogo"
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 30px 80px' }}
      >
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ display: 'block', width: '32px', height: '1px', backgroundColor: '#db2777' }} />
            <span style={{
              color: '#db2777', fontSize: '11px', letterSpacing: '5px',
              fontWeight: '600', textTransform: 'uppercase',
            }}>
              Catálogo
            </span>
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: '700',
            color: '#1a1a1a',
            lineHeight: '1.1',
            marginBottom: '16px',
            maxWidth: '600px',
          }}>
            Nuestros arreglos
          </h2>
          <p style={{ color: '#888', fontSize: '15px', maxWidth: '480px', lineHeight: '1.7' }}>
            Desde diseños clásicos hasta creaciones personalizadas — encuentra el arreglo perfecto para cada momento.
          </p>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <CategoryFilter onSelectCategory={setSelectedCategory} />
        </div>

        <ProductGrid categoryId={selectedCategory || undefined} />
      </section>

      {/* ── BANNER CONTACTO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1c0a12 100%)',
        padding: '100px 30px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <p style={{
            color: '#f472b6', fontSize: '11px', letterSpacing: '5px',
            fontWeight: '600', textTransform: 'uppercase', marginBottom: '24px',
          }}>
            ¿Tienes una ocasión especial?
          </p>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '700', color: '#fff',
            lineHeight: '1.15', marginBottom: '20px',
          }}>
            Diseñamos el arreglo<br />
            <em style={{
              fontStyle: 'italic', color: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #f472b6, #db2777)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
            }}>
              que imaginaste
            </em>
          </h2>
          <p style={{
            color: '#c8a0ae', fontSize: '16px',
            lineHeight: '1.7', marginBottom: '44px',
          }}>
            Escríbenos por WhatsApp y cuéntanos tu idea. Te respondemos con opciones y precios.
          </p>
          <a
            href="https://wa.me/51992741960?text=Hola!%20Quisiera%20información%20sobre%20arreglos%20florales"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button style={{
              padding: '18px 52px',
              background: 'linear-gradient(135deg, #db2777, #be185d)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(219,39,119,0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(219,39,119,0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(219,39,119,0.4)';
            }}
            >
              💬 Escribir por WhatsApp
            </button>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#0a0a0a',
        borderTop: '1px solid #1f1f1f',
        padding: '60px 30px 40px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Marca */}
          <div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '22px', color: '#fff',
              marginBottom: '12px',
            }}>
              Samer<span style={{ color: '#db2777', margin: '0 6px' }}>&</span>Florería
            </h3>
            <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.7', maxWidth: '240px' }}>
              Expresamos amor y celebración a través de arreglos únicos hechos a mano.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{
              color: '#fff', fontSize: '12px', letterSpacing: '3px',
              textTransform: 'uppercase', marginBottom: '20px',
            }}>
              Contacto
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'WhatsApp', val: '+51 992 741 960' },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {item.label}
                  </span>
                  <p style={{ color: '#aaa', fontSize: '14px', margin: '4px 0 0' }}>{item.val}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Horario */}
          <div>
            <h4 style={{
              color: '#fff', fontSize: '12px', letterSpacing: '3px',
              textTransform: 'uppercase', marginBottom: '20px',
            }}>
              Atención
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Lun – Sáb', val: '9:00 am – 8:00 pm' },
                { label: 'Domingo', val: '10:00 am – 4:00 pm' },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {item.label}
                  </span>
                  <p style={{ color: '#aaa', fontSize: '14px', margin: '4px 0 0' }}>{item.val}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          paddingTop: '32px',
          borderTop: '1px solid #1f1f1f',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ color: '#333', fontSize: '12px' }}>
            © 2026 Samer Florería y Regalos. Todos los derechos reservados.
          </p>
          <p style={{ color: '#333', fontSize: '12px' }}>
            Lima, Perú
          </p>
        </div>
      </footer>

    </div>
  );
}