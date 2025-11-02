'use client'

import Link from 'next/link'

import Matches from './Matches';

export default function MatchesComponent() {
  return (
    <div className='matches'>
        <h5 className='matches-title'> 
            <img src="/images/match/team1-copyright.png" alt="National" className="matches-title--icon"/>
            Anh - Premier League
        </h5>
        
        <Matches />
        <Matches />
        <Matches />
        <Matches />
    </div>
    
  )
}
