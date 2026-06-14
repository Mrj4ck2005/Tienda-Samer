import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Samer Florería y Regalos',
  description: 'Arreglos florales únicos para tus momentos especiales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" style={{ overflowX: 'hidden' }}>
      <body style={{ overflowX: 'hidden', margin: 0, padding: 0, width: '100%', boxSizing: 'border-box' }}>
        <AuthProvider>
          <Header />
          <main style={{ width: '100%', overflowX: 'hidden' }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}