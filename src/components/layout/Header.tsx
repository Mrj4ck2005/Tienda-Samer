'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdminPanel = pathname?.startsWith('/admin') && pathname !== '/admin/login';

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <>
      <style>{`
        .header-wrap {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: #fff;
          border-bottom: 1px solid #eee;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 12px;
          height: 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
        }
        .header-logo {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: #1a1a1a;
          text-decoration: none;
          flex-shrink: 1;
          min-width: 0;
          white-space: nowrap;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .nav-link {
          text-decoration: none;
          color: #666;
          font-weight: 500;
          font-size: 12px;
          white-space: nowrap;
        }
        .nav-link-pink {
          text-decoration: none;
          color: #db2777;
          font-weight: 600;
          font-size: 12px;
          white-space: nowrap;
        }
        .nav-btn {
          padding: 7px 10px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          color: #1a1a1a;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-btn-pink {
          padding: 7px 10px;
          background-color: #db2777;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          color: #fff;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (min-width: 480px) {
          .header-inner { padding: 0 20px; height: 64px; }
          .header-logo { font-size: 20px; }
          .header-nav { gap: 12px; }
          .nav-link, .nav-link-pink { font-size: 13px; }
          .nav-btn, .nav-btn-pink { padding: 8px 14px; font-size: 13px; }
        }
        @media (min-width: 768px) {
          .header-inner { padding: 0 30px; height: 80px; }
          .header-logo { font-size: 24px; }
          .header-nav { gap: 20px; }
          .nav-link, .nav-link-pink { font-size: 15px; }
          .nav-btn, .nav-btn-pink { padding: 10px 20px; font-size: 14px; }
        }
      `}</style>

      <header className="header-wrap">
        <div className="header-inner">

          {/* Logo */}
          <Link href="/" className="header-logo">
            Samer
            <span style={{ color: '#db2777', margin: '0 4px' }}>&</span>
            Florería
          </Link>

          {/* Nav */}
          <nav className="header-nav">

            {isAdminPanel && (
              <>
                <Link href="/" className="nav-link">Ver Tienda</Link>
                <button onClick={handleLogout} className="nav-btn">Cerrar Sesión</button>
              </>
            )}

            {!isAdminPanel && (
              <>
                <Link href="/" className="nav-link">INICIO</Link>
                {user ? (
                  <>
                    <Link href="/admin" className="nav-link-pink">PANEL ADMIN</Link>
                    <button onClick={handleLogout} className="nav-btn">Cerrar Sesión</button>
                  </>
                ) : (
                  <Link href="/admin/login" style={{ textDecoration: 'none' }}>
                    <button className="nav-btn-pink">Login</button>
                  </Link>
                )}
              </>
            )}

          </nav>
        </div>
      </header>
    </>
  );
};