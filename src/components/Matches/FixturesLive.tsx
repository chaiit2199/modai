import Link from 'next/link' 
import Matches from './Matches'; 

interface FixturesLiveProps {
    fixturesData: any[];
}

export default function FixturesLive({ fixturesData }: FixturesLiveProps) {
    if(fixturesData.length === 0) return <p>Loading...</p>

    return (
        <div className='flex flex-col gap-6'>
            {fixturesData && (
            fixturesData.map((item) => (
                <div className='matches' key={item.league.id}>
                    <h5 className='matches-title'> 
                        <img src={item.league.logo} alt="item.league.logo" className="matches-title--icon"/>
                        {item.league.country} - {item.league.name}
                        <p className='ml-auto text-sm'>{item.league.round}</p>
                    </h5>
                    
                    {item.details.map((item: any) => (
                        <Matches isLive={true} data={item} key={`detais_${item.fixture.id}`} />
                    ))}
                </div>
            )))}
        </div>
  )
}
