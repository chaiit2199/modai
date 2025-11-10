import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/app.css';
import { DeviceProvider } from '@/context/DeviceContext';
import { initializeAuth } from '@/utils/auth';

export default function App({ Component, pageProps }: AppProps) {
  // Initialize auth on app load - try to refresh token if expired
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeAuth();
    }
  }, []);

  return (
    <DeviceProvider>
      <div className="main-container min-h-screen flex flex-col">
        <Header/>
        <Component {...pageProps} />
        <Footer />
      </div>
    </DeviceProvider>
  );
}

