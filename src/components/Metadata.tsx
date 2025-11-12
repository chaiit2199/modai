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
  siteName: 'Tin Bóng Đá Mới Nhất Hôm Nay – Cập Nhật Kết Quả & Bảng Xếp Hạng',
  defaultTitle: 'Tin Bóng Đá Mới Nhất Hôm Nay – Cập Nhật Kết Quả & Bảng Xếp Hạng',
  defaultDescription: 'Cập nhật tin bóng đá mới nhất hôm nay: kết quả trận đấu, bảng xếp hạng, tin chuyển nhượng, nhận định trận đấu và tất cả thông tin nóng hổi về bóng đá Việt Nam và thế giới.Xem kết quả trận đấu Manchester United vs Liverpool hôm nay. Thống kê, highlight, bàn thắng và phân tích trận đấu mới nhất từ chuyên gia bóng đá. Tổng hợp tin chuyển nhượng bóng đá mùa đông 2025: cầu thủ mới, hợp đồng, tin đồn chuyển nhượng từ các CLB hàng đầu châu Âu và Việt Nam. Nhận định chuyên sâu trận đấu Chelsea vs Arsenal: dự đoán tỷ số, đội hình dự kiến, chiến thuật và những điểm nóng trước trận.Cập nhật tin tức bóng đá Việt Nam mới nhất: kết quả V.League, lịch thi đấu, cầu thủ nổi bật và các thông tin nóng về đội tuyển quốc gia.',
  defaultKeywords: 'tin bóng đá, kết quả bóng đá, bảng xếp hạng, chuyển nhượng, nhận định, phân tích, bóng đá Việt Nam, bóng đá thế giới',
  defaultOgImage: '/images/banner/banner-1.png',
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

