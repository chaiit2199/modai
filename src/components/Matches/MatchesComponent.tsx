'use client'

import Link from 'next/link'
import Matches from './Matches';
import { getMatchDisplay } from '@/utils/getMatchDisplay';
import { formatDateToLocal } from '@/utils/dateUtils';

interface MatchesComponentProps {
  data?: any;
  showDate?: boolean; // Có hiển thị ngày thi đấu không (dùng cho tab kết quả)
}

export default function MatchesComponent({ data, showDate = false }: MatchesComponentProps) {
  // Nếu không có data, render placeholder
  if (!data) {
    return (
      <div className='matches'>
        <h5 className='matches-title'> 
          <img src="/images/match/team1-copyright.png" alt="National" className="matches-title--icon"/>
          Anh - Premier League
        </h5>
      </div>
    );
  }

  return (
    <div className='matches' key={data.league?.id}>
      <h5 className='matches-title'> 
        <img 
          src={data.league?.logo || "/images/match/team1-copyright.png"} 
          alt={data.league?.name || "League"} 
          className="matches-title--icon"
        />
        {data.league?.country} - {data.league?.name} 
        {data.league?.round && (
          <>
            <p className='mx-2'>-</p> 
            <p className='text-sm'>{data.league.round}</p>
          </>
        )}
        {data.details?.[0]?.fixture?.status && (
          <div className='ml-auto flex items-center gap-2'>
            {showDate && data.details?.[0]?.fixture?.date && (
              <span className='text-xs text-gray-600'>
                {formatDateToLocal(data.details[0].fixture.date)}
              </span>
            )}
            <p className='font-bold bg-active text-white text-xs p-1 rounded-md'>
              {getMatchDisplay(data.details[0].fixture.status).displayStatus}
            </p>
          </div>
        )}
      </h5>
      
      {data.details?.map((item: any) => {
        const statusShort = item.fixture?.status?.short;
        
        // Trận đang diễn ra
        const isLive = statusShort === 'LIVE' || 
                      statusShort === 'HT' ||
                      statusShort === '1H' ||
                      statusShort === '2H' ||
                      statusShort === 'ET' ||
                      statusShort === 'P';
        
        // Trận đã kết thúc
        const isFinished = statusShort === 'FT' || 
                          statusShort === 'AET' || 
                          statusShort === 'PEN' ||
                          statusShort === 'FT_PEN' ||
                          (item.goals?.home !== null && item.goals?.away !== null && !isLive);
        
        return (
          <Matches 
            isLive={isLive} 
            isFinished={isFinished}
            showDate={showDate}
            data={item} 
            key={`details_${item.fixture?.id}`} 
          />
        );
      })}
    </div>
  );
}
