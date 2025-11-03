'use client';

interface ShareButtonProps {
  url: string;
  className?: string;
}

// Facebook Share Component
export function FacebookShareButton({ url, className = '' }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, 'facebook-share-dialog', 'width=626,height=436');
  };

  return (
    <button
      onClick={handleShare}
      className={`hover:opacity-80 transition-opacity cursor-pointer ${className}`}
      aria-label="Chia sẻ lên Facebook"
    >
      <img alt="Facebook" loading="lazy" width="18" height="18" src="/icons/facebook.svg" />
    </button>
  );
}

// LinkedIn Share Component
export function LinkedInShareButton({ url, className = '' }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, 'linkedin-share-dialog', 'width=626,height=436');
  };

  return (
    <button
      onClick={handleShare}
      className={`hover:opacity-80 transition-opacity cursor-pointer ${className}`}
      aria-label="Chia sẻ lên LinkedIn"
    >
      <img alt="LinkedIn" loading="lazy" width="18" height="18" src="/icons/LinkedIn.svg" />
    </button>
  );
}

// Combined Social Share Component for easy import
interface SocialShareProps {
  url: string;
  className?: string;
  showFacebook?: boolean;
  showLinkedIn?: boolean;
}

export default function SocialShare({ 
  url, 
  className = '',
  showFacebook = true,
  showLinkedIn = true 
}: SocialShareProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showFacebook && <FacebookShareButton url={url} />}
      {showLinkedIn && <LinkedInShareButton url={url} />}
    </div>
  );
}

