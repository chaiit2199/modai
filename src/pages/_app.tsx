import type { AppProps } from 'next/app'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/app.css';
import { DeviceProvider } from '@/context/DeviceContext';

export default function App({ Component, pageProps }: AppProps) {
  const handlePageTitleChange = (title: string) => {
    document.title = title;
  };

  return (
    <DeviceProvider>
      <div className="main-container">
        <Header onPageTitleChange={handlePageTitleChange} />
        <Component {...pageProps} />
        <Footer />
      </div>
    </DeviceProvider>
  );
}

