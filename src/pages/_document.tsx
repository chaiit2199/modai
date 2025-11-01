import Footer from '@/components/Footer';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Săn Sell là ghiền</title>
        <link rel="icon" type="image/svg" href="/icons/favicon.png"></link>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

