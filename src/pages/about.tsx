import { GetServerSideProps } from "next";
import Link from "next/link";
import { useDevice } from '@/context/DeviceContext';
import Metadata from "@/components/Metadata";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";


export default function About() {
  const { isMobile } = useDevice();

  if (isMobile == undefined) return null;

  return (
    <div className="container my-8">
        <Metadata title="Về chúng tôi - Nhanh hơn từng trận đấu" />
      
        <section className="relative h-[420px] flex items-center justify-center rounded-2xl overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1509027572446-af8401acfdc3"
                alt="Football Stadium"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="text-yellow-400">Gói trọn đam mê - Sống cùng từng nhịp bóng</span>
                </h1> 
            </div>
        </section>

        <section className="max-w-6xl mx-auto py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                <h2 className="text-3xl font-bold mb-4">Giới thiệu</h2>
                <p className="text-gray-600 leading-relaxed">
                    Modai là nền tảng cung cấp thông tin bóng đá nhanh chóng và chính xác,
                    giúp người hâm mộ dễ dàng theo dõi lịch thi đấu, kết quả và các trận cầu
                    hấp dẫn mỗi ngày.
                </p>
                </div>

                <img
                src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6"
                alt="Football App"
                className="rounded-2xl shadow-lg"
                />
            </div>
        </section>

        <section className="bg-white py-16 rounded-2xl">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                   Tính năng nổi bật
                </h2>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">📅 Lịch thi đấu</h3>
                        <p className="text-gray-600">
                        Cập nhật lịch thi đấu theo ngày, theo giải, theo đội bóng.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">⏰ Giờ Việt Nam</h3>
                        <p className="text-gray-600">
                        Tự động quy đổi giờ thi đấu chuẩn theo múi giờ Việt Nam.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">⚡ Trận sắp diễn ra</h3>
                        <p className="text-gray-600">
                        Theo dõi nhanh các trận đấu sắp diễn ra và kết quả mới nhất.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
            Giải đấu hàng đầu
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-xl shadow">Premier League</div>
            <div className="p-4 bg-white rounded-xl shadow">La Liga</div>
            <div className="p-4 bg-white rounded-xl shadow">Serie A</div>
            <div className="p-4 bg-white rounded-xl shadow">Champions League</div>
        </div>
        </section>

        <section className="bg-white py-16 rounded-2xl">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Nguồn dữ liệu uy tín</h2>
                <p className="text-gray-600 leading-relaxed">
                Dữ liệu trên Modai được tổng hợp từ các nguồn thể thao đáng tin cậy,
                cập nhật liên tục và chính xác. Thông tin mang tính tham khảo và có thể
                có độ trễ nhỏ so với thực tế.
                </p>
            </div>
        </section>

        <section className="max-w-6xl mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d"
            alt="Football Fans"
            className="rounded-2xl shadow-lg"
            />

            <div>
            <h2 className="text-3xl font-bold mb-4">Sứ mệnh của Modai</h2>
            <p className="text-gray-600 leading-relaxed">
                Mang đến trải nghiệm theo dõi bóng đá đơn giản, nhanh chóng và hiện đại,
                đồng hành cùng người hâm mộ trong từng khoảnh khắc của trận đấu.
            </p>
            </div>
        </div>
        </section>

        <section className="bg-gray-900 text-white py-14 rounded-2xl">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4 text-yellow-400">Liên hệ với Modai</h2>
                <p className="text-gray-300 mb-6">
                Bạn có góp ý hoặc đề xuất tính năng?
                </p>
                <a
                href="mailto:contact@modai.vn"
                className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
                >
                contact@modai.vn
                </a>
            </div>
        </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
