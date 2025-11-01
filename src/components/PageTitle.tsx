'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

export default function PageTitle() {
  return (
    <div className="container-fluid page-title px-0">
      {/* <div className="overlay"></div> */}
      <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          // autoplay={{ delay: 4000 }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          modules={[Autoplay, EffectFade]}
      >
        <SwiperSlide>
          <div className="slide-item">
            <div className="slide-item--content container">
              <h2 className="slide-item--title">Tin nóng bóng đá 24/7 - Cập nhật từng giây!</h2>
              <p className="slide-item--sub-title">Theo dõi tỉ số trực tiếp, kết quả trận đấu và tin tức nóng hổi từ khắp các giải đấu lớn: Premier League, Champions League, La Liga và hơn thế nữa.</p>
              <div className="slide-item--action"><a className="cs-btn text-black bg-white" href="/shop-default-list">Xem ngay &rarr;</a></div>
            </div>
            <div className="slide-item--backgroup">
              <img src="/images/banner/banner-1.jpg" alt="Slide Image" className='w-full'/>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <div className="slide-item--content container"> 
              <h2 className="slide-item--title">Chiến thuật, phân tích & nhận định từ chuyên gia!</h2>
              <p className="slide-item--sub-title">Hiểu sâu hơn về từng trận đấu – chiến thuật, phong độ cầu thủ và dự đoán kết quả từ những cây viết giàu kinh nghiệm.</p>
              <div className="slide-item--action"><a className="cs-btn text-black bg-white" href="/shop-default-list">Shop now</a></div>
            </div>
            <div className="slide-item--backgroup">
              <img src="/images/banner/banner-2.png" alt="Slide Image" className="w-full"/>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <div className="slide-item--content container"> 
              <h2 className="slide-item--title">Nơi cảm xúc bóng đá lan tỏa!</h2>
              <p className="slide-item--sub-title">Chia sẻ cảm xúc, bình luận sau trận, và hòa mình cùng cộng đồng fan cuồng nhiệt – nơi mọi người đều yêu bóng đá như bạn.</p>
              <div className="slide-item--action"><a className="cs-btn text-black bg-white" href="/shop-default-list">Shop now</a></div>
            </div>
            <div className="slide-item--backgroup">
              <img src="/images/banner/banner-3.png" alt="Slide Image" className="w-full"/>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
