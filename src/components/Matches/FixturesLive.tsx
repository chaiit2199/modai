'use client'

import Link from 'next/link' 
import { useState, useEffect } from "react";
import { fetchFixturesLive } from "@/api/fetchData";

export default function FixturesLive() {

    const [fixturesData, setFixturesData] = useState<any[]>([]);
 
    const fetchFixtures = async () => {
        const { success, data: response } = await fetchFixturesLive("all");
        if (success && response) {
          setFixturesData(response.response); 
        } 
    }; 

    useEffect(() => {
        fetchFixtures();
    }, []); 
    console.log(fixturesData);

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
