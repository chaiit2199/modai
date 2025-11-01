import Head from 'next/head';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const defaultMetadata = {
  siteName: 'Săn Sell là ghiền',
  defaultTitle: 'Săn Sell là ghiền',
  defaultDescription: 'Khám phá các sản phẩm công nghệ mới nhất với giá tốt nhất tại Săn Sell là ghiền. Smartphones, tablets, laptops và nhiều hơn nữa.',
  defaultKeywords: 'điện thoại, smartphone, tablet, laptop, công nghệ, mua sắm online, Săn Sell là ghiền',
  defaultOgImage: '/images/banner/banner-1.jpg',
  siteUrl: 'https://modai.com', // Update với domain thực tế của bạn
};

export default function Metadata({
  title,
  description = defaultMetadata.defaultDescription,
  keywords = defaultMetadata.defaultKeywords,
  ogImage = defaultMetadata.defaultOgImage,
  ogType = 'website',
  canonical,
  noindex = false,
  nofollow = false,
}: MetadataProps) {
  const pageTitle = title 
    ? `${title} - ${defaultMetadata.siteName}` 
    : defaultMetadata.defaultTitle;
  
  const canonicalUrl = canonical 
    ? `${defaultMetadata.siteUrl}${canonical}` 
    : defaultMetadata.siteUrl;
  
  const ogImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${defaultMetadata.siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex" />}
      {nofollow && <meta name="robots" content="nofollow" />}
      {!noindex && !nofollow && <meta name="robots" content="index, follow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={defaultMetadata.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="author" content={defaultMetadata.siteName} />
      <meta name="language" content="Vietnamese" />
      <meta httpEquiv="content-language" content="vi" />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
      <link rel="apple-touch-icon" href="/icons/favicon.svg" />
    </Head>
  );
}

