"use client"

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-background3 mt-12">  
      <div className="container py-16 flex flex-col gap-6">
        <div className="grid grid-cols-3"> 
          <div className="col-span-1">
            <Link  href="/" className="logo"> 
              MODAI
            </Link>

            <div className="mt-10">
              MODAI là ứng dụng bóng đá cần phải có.
            </div>
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
