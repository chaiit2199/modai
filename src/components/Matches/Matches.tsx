'use client'
import Link from 'next/link' 
import { formatTimeToLocal } from '@/utils/dateUtils';

interface MatchProps {
  data: any; 
  isLive: boolean; 
}

export default function Matches({ data, isLive }: MatchProps) {


  return (
    <Link href={`/matches/${data.fixture.id}`} className="matches-items"> 
      <ul className='matches-items--details'>
        <li className='left justify-end'>
          <strong className='text-right'>{data.teams.home.name}</strong>
          <img src={data.teams.home.logo} alt="National" className='w-6 h-6' />
        </li>
        {isLive ? 
          <p className='font-bold text-center w-15 text-sm'>{data.goals?.home} - {data.goals?.away}</p> :
          <p className='font-bold text-center w-15 text-sm'>{formatTimeToLocal(data.fixture.date)}</p> 
        }
        
        <li className='right'>
          <img src={data.teams.away.logo} alt="National" className='w-6 h-6' />
          <strong>{data.teams.away.name}</strong>
        </li>
      </ul> 
    </Link>
  )
}
