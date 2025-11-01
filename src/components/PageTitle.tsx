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
          autoplay={{ delay: 4000 }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          modules={[Autoplay, EffectFade]}
      >
        <SwiperSlide>
          <div className="slide-item">
            <div className="slide-item--content container">
              <h2 className="slide-item--title">Fall Winter Collection</h2>
              <p className="slide-item--sub-title">Vivamus lacinia odio vitae vestibulum vestibulum</p>
              <div className="slide-item--action"><a className="cs-btn" href="/shop-default-list">Shop now</a></div>
            </div>
            <img src="/images/banner/banner-1.jpg" alt="Slide Image" className="w-full"/>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <div className="slide-item--content container"> 
              <h2 className="slide-item--title">Spring Summer  Collection</h2>
              <p className="slide-item--sub-title">Discover the elegance of renewal with soft tones and flowing textures.</p>
              <div className="slide-item--action"><a className="cs-btn" href="/shop-default-list">Shop now</a></div>
            </div>
            <img src="/images/banner/banner-2.jpg" alt="Slide Image" className="w-full"/>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
