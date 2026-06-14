'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push('/admin');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f7 0%, #ffe0e6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(219, 39, 119, 0.15)',
          padding: '60px 40px',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '10px',
            }}
          >
            Panel Admin
          </h1>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Samer Florería y Regalos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontSize: '14px',
              }}
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#db2777';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(219, 39, 119, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#eee';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontSize: '14px',
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#db2777';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(219, 39, 119, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#eee';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: '#ffebee',
                border: '1px solid #ef5350',
                color: '#c62828',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: loading ? '#ccc' : '#db2777',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'default' : 'pointer',
              fontSize: '15px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#c11f63';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(219, 39, 119, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#db2777';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Info Box */}
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '30px',
            fontSize: '13px',
            color: '#666',
            lineHeight: '1.6',
          }}
        >
          <strong>Nota:</strong> Solo el personal logindo puede acceder a este panel. Si tienes problemas para iniciar sesión, contacta al administrador.
        </div>
      </div>
    </div>
  );
}
