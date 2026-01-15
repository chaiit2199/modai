'use client'
import Link from 'next/link' 
import { formatTimeToLocal, formatDateToLocal } from '@/utils/dateUtils';

interface MatchProps {
  data: any; 
  isLive: boolean;
  isFinished?: boolean; // Trận đã kết thúc
  showDate?: boolean; // Có hiển thị ngày không (dùng cho tab kết quả)
}

export default function Matches({ data, isLive, isFinished = false, showDate = false }: MatchProps) {
  // Xác định nội dung hiển thị ở giữa
  const getDisplayContent = () => {
    // Trận đã kết thúc → hiển thị kết quả
    if (isFinished) {
      const homeScore = data.goals?.home ?? data.score?.fulltime?.home ?? 0;
      const awayScore = data.goals?.away ?? data.score?.fulltime?.away ?? 0;
      
      return (
        <p className='font-bold text-center w-15 text-sm'>
          {homeScore} - {awayScore}
        </p>
      );
    }
    
    // Trận đang diễn ra → hiển thị score hiện tại
    if (isLive) {
      const homeScore = data.goals?.home ?? 0;
      const awayScore = data.goals?.away ?? 0;
      
      return (
        <p className='font-bold text-center w-15 text-sm text-red-600'>
          {homeScore} - {awayScore}
        </p>
      );
    }
    
    // Trận chưa đấu → hiển thị thời gian
    return (
      <p className='font-bold text-center w-15 text-sm'>
        {formatTimeToLocal(data.fixture.date)}
      </p>
    );
  };

  return (
    <Link href={`/matches/${data.fixture.id}`} className="matches-items"> 
      <ul className='matches-items--details'>
        <li className='left justify-end'>
          <strong className='text-right'>{data.teams.home.name}</strong>
          <img src={data.teams.home.logo} alt="National" className='w-6 h-6' />
        </li>
        {getDisplayContent()}
        <li className='right'>
          <img src={data.teams.away.logo} alt="National" className='w-6 h-6' />
          <strong>{data.teams.away.name}</strong>
        </li>
      </ul> 
    </Link>
  )
}
