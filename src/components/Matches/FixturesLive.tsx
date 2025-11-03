'use client'

import Link from 'next/link' 
import { useState, useEffect } from "react";
import { fetchFixturesLive } from "@/api/fetchData";
import Matches from './Matches'; 


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
    if(fixturesData.length === 0) return <p>Loading...</p>

  return (
    <div>
        {fixturesData && (
        fixturesData.map((item) => (
            <div className='matches' key={item.fixture.id}>
                <h5 className='matches-title'> 
                    <img src={item.league.logo} alt="item.league.logo" className="matches-title--icon"/>
                    {item.league.country} - {item.league.name}

                    <p className='ml-auto text-sm'>{item.league.round}</p>
                </h5>

                <Matches isLive={true} data={item} key={`detais_${item.fixture.id}`} />
            </div>
        )))}
    </div>
    
  )
}
