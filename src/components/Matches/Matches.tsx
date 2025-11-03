'use client'
import Link from 'next/link' 
import { formatTimeToLocal } from '@/utils/dateUtils';

interface MatchProps {
  data: any; 
  isLive: boolean; 
}

export default function Matches({ data, isLive }: MatchProps) {
  
  return (
    <div className="matches-items">
        <p className='font-bold w-[60px] text-sm'>{isLive ? "live" : ""}</p>
        <ul className='matches-items--details'>
          <li className='left justify-end'>
            <strong>{data.teams.home.name}</strong>
            <img src={data.teams.home.logo} alt="National" className='w-6 h-6' />
          </li>
          {isLive ? 
            <p className='font-bold text-center w-[60px] text-sm'>{data.goals?.home} - {data.goals?.away}</p> :
            <p className='font-bold text-center w-[60px] text-sm'>{formatTimeToLocal(data.fixture.date)}</p> 
          }
          
          <li className='right'>
            <img src={data.teams.away.logo} alt="National" className='w-6 h-6' />
            <strong>{data.teams.away.name}</strong>
          </li>
        </ul>
        <p className='w-[60px]'></p>
    </div>
  )
}
