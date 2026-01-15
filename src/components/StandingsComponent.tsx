'use client'

import Link from 'next/link'

import Matches from './Matches/Matches';

interface StandingsComponentProps {
  standingsData?: any;
}

export default function StandingsComponent({ standingsData }: StandingsComponentProps) {
  // Lấy standings array từ data
  const standings = standingsData?.standings?.[0] || standingsData?.standings || [];
  const leagueName = standingsData?.name || standingsData?.league?.name || 'Premier League';
  const leagueLogo = standingsData?.logo || standingsData?.league?.logo || '/images/match/team1-copyright.png';
  const country = standingsData?.country || standingsData?.league?.country || 'England';

  return (
    <div className='rankings'>
        <h5 className='rankings-title'> 
            <img 
              src={leagueLogo} 
              alt={leagueName} 
              className="rankings-title--icon"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/match/team1-copyright.png';
              }}
            />
            {country} - {leagueName}
        </h5>
         <table className='matches-table'>
            <colgroup span={1}>
              <col width="2" />
              <col width="18" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
              <col width="6" />
              <col width="4" />
              <col width="4" />
            </colgroup>
            <thead>
              <tr className='pointer-events-none'>
                  <td>#</td>
                  <td></td>
                  <td>TR</td>
                  <td>T</td>
                  <td>H</td>
                  <td>B</td>
                  <td>+/-</td>
                  <td>HS</td>
                  <td>Đ</td>
              </tr>
            </thead>
            <tbody>
              {standings.length > 0 ? (
                standings.map((team: any, index: number) => {
                  const rank = team.rank || team.position || index + 1;
                  const teamName = team.team?.name || 'N/A';
                  const teamLogo = team.team?.logo || '/images/match/team1-copyright.png';
                  const played = team.all?.played || team.played || 0;
                  const win = team.all?.win || team.win || 0;
                  const draw = team.all?.draw || team.draw || 0;
                  const lose = team.all?.lose || team.lost || 0;
                  const goalsFor = team.all?.goals?.for || team.goalsFor || 0;
                  const goalsAgainst = team.all?.goals?.against || team.goalsAgainst || 0;
                  const goalsDiff = team.goalsDiff || (goalsFor - goalsAgainst);
                  const points = team.points || 0;

                  return (
                    <tr key={team.team?.id || index}>
                      <td>{rank}</td>
                      <td>
                        <div className="flex items-center">
                          <img 
                            src={teamLogo} 
                            alt={teamName} 
                            className="w-5 h-5 mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/match/team1-copyright.png';
                            }}
                          />
                          {teamName}
                        </div>
                      </td>
                      <td>{played}</td>
                      <td>{win}</td>
                      <td>{draw}</td>
                      <td>{lose}</td>
                      <td>{goalsFor}-{goalsAgainst}</td>
                      <td>{goalsDiff >= 0 ? '+' : ''}{goalsDiff}</td>
                      <td>{points}</td>
                    </tr>
                  );
                })
              ) : (
                // Fallback nếu không có data
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Không có dữ liệu bảng xếp hạng
                  </td>
                </tr>
              )}
            </tbody>
        </table> 
    </div>
  )
}
