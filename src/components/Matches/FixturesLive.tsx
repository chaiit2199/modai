import Link from 'next/link' 
import Matches from './Matches'; 
import { getMatchDisplay } from '@/utils/getMatchDisplay';


interface FixturesLiveProps {
    fixturesData: any[];
}

export default function FixturesLive({ fixturesData }: FixturesLiveProps) {
    if(fixturesData.length === 0) return <p className="py-8 text-center text-gray-500">Chưa tìm thấy trận đấu nào phù hợp</p>

    return (
        <div className='flex flex-col gap-6'>
            {fixturesData && (
            fixturesData.map((item) => (
                <div className='matches' key={item.league.id}>
                    <h5 className='matches-title'> 
                        <img src={item.league.logo} alt="item.league.logo" className="matches-title--icon"/>
                        {item.league.country} - {item.league.name} <p className='mx-2'>-</p> <p className='text-sm'>{item.league.round}</p>

                        <p className='ml-auto font-bold bg-active text-white text-xs p-1 rounded-md'>{getMatchDisplay(item.details[0]?.fixture.status).displayStatus}</p>
                    </h5>
                    
                    {item.details.map((item: any) => (
                        <Matches isLive={true} data={item} key={`detais_${item.fixture.id}`} />
                    ))}
                </div>
            )))}
        </div>
  )
}
