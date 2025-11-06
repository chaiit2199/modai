import type { AppProps } from 'next/app'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/app.css';
import { DeviceProvider } from '@/context/DeviceContext';

export default function App({ Component, pageProps }: AppProps) {
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

