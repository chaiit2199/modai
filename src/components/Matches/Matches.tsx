'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function Matches() {
  return (
    <div className="matches-items">
        <p className='font-bold w-[60px]'>13:40</p>
        <ul className='matches-items--details'>
          <li className='left justify-end'>
            <strong>Udinese</strong>
            <img src="/images/match/8600_xsmall.png" alt="National" className='w-6 h-6' />
          </li>
          <p className='font-bold text-center w-[60px]'>0 - 0</p>
          <li className='right'>
            <img src="/images/match/9789_xsmall.png" alt="National" className='w-6 h-6'/>
            <strong>Udinese</strong>
          </li>
        </ul>
        <p className='w-[60px]'></p>
    </div>
  )
}
