import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/app.css';
import { DeviceProvider } from '@/context/DeviceContext';
import { isAuthenticated } from '@/utils/auth';

export default function App({ Component, pageProps }: AppProps) {
  // Check authentication status on app load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This will check token and sync account_info
      isAuthenticated();
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

