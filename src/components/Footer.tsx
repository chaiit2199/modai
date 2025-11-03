"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SocialShare from '@/components/SocialShare';

export default function Footer() {
  const [currentUrl, setCurrentUrl] = useState('');

  // Get current URL for sharing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return (
    <footer className="w-full bg-background3 mt-12">  
      <div className="container py-12 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-8"> 
          <div className="col-span-1">
            <Link  href="/" className="logo"> 
              MODAI
            </Link>

            <div className="mt-4 flex items-center">
              <p className='font-medium text-lg mr-3'>Chia sẻ niềm đam mê: </p>
              <SocialShare url={currentUrl} />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-4"> 
            <p>
              <Link  href="/" className='text-lg font-medium hover:text-active'> 
                Trang chủ
              </Link>
            </p>
            <p>
              <Link  href="/" className='text-lg font-medium hover:text-active'> 
                Tin tức
              </Link>
            </p>
            <p>
              <Link  href="/" className='text-lg font-medium hover:text-active'> 
                Về Chúng tôi
              </Link> 
            </p>
          </div>

          <div className="col-span-1 flex flex-col gap-4"> 
            <p>
              <Link  href="/" className='text-lg font-medium hover:text-active'> 
                Trận đấu
              </Link>
            </p>
            <p>
              <Link  href="/" className='text-lg font-medium hover:text-active'> 
                Bảng xếp hạng
              </Link> 
            </p>
          </div>
        </div>
        
      </div>
      <div className='border-t border-background py-6 text-center'>
        <Link  href="/" className="text-center text-[#717171] font-semibold"> 
          © Copyright 2025 MODAI
        </Link> 
      </div>
    </footer>
  )
}
