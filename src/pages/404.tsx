import { useDevice } from '@/context/DeviceContext';
import Metadata from "@/components/Metadata";
import Link from 'next/link';

export default function Custom404() {
  const { isMobile } = useDevice();

  if (isMobile == undefined) return null;

  return (
    <div className="container my-8">
      <Metadata title="404 - Page Not Found" />
      
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          Trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

