import { GetServerSideProps } from "next";
import Link from 'next/link';
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import Metadata from "@/components/Metadata";
import { fetchMatchDetail } from "@/api/fetchData";
import { cache } from "@/utils/cache";
import { CACHE_KEYS } from "@/constants/endpoint";

interface MatchDetailProps {
  matchData: any;
  dataSource: 'cache' | 'api';
  cacheAge: number | null;
  fixtureId: string;
}

export default function MatchDetail({ matchData, dataSource, cacheAge, fixtureId }: MatchDetailProps) {
  const { isMobile } = useDevice();

  if (isMobile == undefined) return null;

  if (!matchData) {
    return (
      <div className="container my-8">
        <Metadata/>
        <div className="text-center py-8">
          <p className="text-gray-500">Match not found</p>
        </div>
      </div>
    );
  }

  const fixture = matchData?.response?.[0]?.fixture;
  const teams = matchData?.response?.[0]?.teams;
  const goals = matchData?.response?.[0]?.goals;
  const events = matchData?.response?.[0]?.events;
  const league = matchData?.response?.[0]?.league;

  return (
    <div className="container my-8">
      <Metadata/>
      
      <div className="flex gap-6 md:flex-col">
        <div className="main-content gap-6">
          <div className="p-4 flex items-center gap-3 justify-between border-b-[0.5px] border-background  bg-background3 rounded-t-xl overflow-hidden">
            <Link href="/"><p className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><img src='/icons/back.svg' alt={teams.away.name} className="w-3 h-3 mr-[2px] -mt-[1px]" /></p></Link>
            {league && (
              <p className="text-lg font-bold text-white text-center">{league.country} - {league.round}</p>
            )} 
            <div className="w-7"></div>
          </div>
          <div className="px-4 pb-8  bg-background3 rounded-b-xl overflow-hidden">
            <div className="flex items-center gap-3 justify-center">
              <img src={league.logo} alt={league.name} className="w-auto h-6" />
              <h2 className="font-bold text-lg">{league.name}</h2>
            </div>

            {/* Match Score */}
            {fixture && teams && (
              <div className="rounded-lg py-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {new Date(fixture.date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{fixture.venue?.name}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <span className="font-bold text-xl leading-none">{teams.home.name}</span>
                      <img src={teams.home.logo} alt={teams.home.name} className="w-12 h-12 md:w-8 md:h-8" />
                    </div>
                  </div>

                  <div className="px-8 md:px-2 mt-4">
                    <div className="text-4xl md:text-3xl font-bold text-center">
                      {goals?.home ?? 0} - {goals?.away ?? 0}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      {fixture.status?.long}
                    </p>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={teams.away.logo} alt={teams.away.name} className="w-12 h-12 md:w-8 md:h-8" />
                      <span className="font-bold text-xl leading-none">{teams.away.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}  
          </div>
          
          <div className="mt-4 p-4 bg-background3 rounded-xl overflow-hidden">
            <h3 className="font-bold text-lg mb-4 text-center text-white">Sự kiện</h3>
            {events && events.length > 0 ? (
              <div className="space-y-1">
                {(() => {
                  // Phân loại events thành home và away
                  const homeEvents: any[] = [];
                  const awayEvents: any[] = [];
                  
                  events.forEach((event: any) => {
                    if (event.team?.id === teams?.home?.id) {
                      homeEvents.push(event);
                    } else if (event.team?.id === teams?.away?.id) {
                      awayEvents.push(event);
                    }
                  });
                  
                  // Tạo map để group events theo timestamp
                  const eventsByTime: Record<string, { home?: any; away?: any; time: any }> = {};
                  
                  homeEvents.forEach((event: any) => {
                    const timeKey = `${event.time.elapsed}_${event.time.extra || 0}`;
                    if (!eventsByTime[timeKey]) {
                      eventsByTime[timeKey] = { time: event.time };
                    }
                    eventsByTime[timeKey].home = event;
                  });
                  
                  awayEvents.forEach((event: any) => {
                    const timeKey = `${event.time.elapsed}_${event.time.extra || 0}`;
                    if (!eventsByTime[timeKey]) {
                      eventsByTime[timeKey] = { time: event.time };
                    }
                    eventsByTime[timeKey].away = event;
                  });
                  
                  // Sắp xếp theo thời gian
                  const sortedTimes = Object.keys(eventsByTime).sort((a, b) => {
                    const [elapsedA, extraA] = a.split('_').map(Number);
                    const [elapsedB, extraB] = b.split('_').map(Number);
                    if (elapsedA !== elapsedB) return elapsedA - elapsedB;
                    return extraA - extraB;
                  });
                  
                  // Helper functions
                  const getEventIcon = (event: any) => {
                    if (event.type === 'Substitution') {
                      return (
                        <div className="flex items-center gap-0.5">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      );
                    } else if (event.type === 'Card') {
                      const cardColor = event.detail === 'Yellow Card' || event.detail?.includes('Yellow') ? 'bg-yellow-500' : 'bg-red-500';
                      return <div className={`w-3 h-4 ${cardColor} rounded-sm`}></div>;
                    } else if (event.type === 'Goal') {
                      return <p className="text-md md:text-sm flex items-center gap-4 font-bold text-red-500">Ghi bàn!
                        <img src='/icons/banh.svg' alt="goal" className="w-5 h-5" />
                      </p>;
                    }
                    return null;
                  };

                  const getPlayerDisplay = (event: any) => {
                    if (event.type === 'subst') {
                      const playerIn = event.assist?.name || event.player?.name;
                      const playerOut = event.player?.name;
                      return (
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-green-400 text-sm font-medium opacity-50">{playerIn}</span>
                          <img className="w-3 h-3" src="/icons/switch.svg" alt="switch.svg" />
                          <span className="text-red-400 text-sm font-medium flex items-center gap-1">
                            {playerOut} 
                          </span>
                        </div>
                      );
                    } else {
                      return <span className="text-sm font-medium"> {event.player?.name || event.team.name}</span>;
                    }
                  };

                  return sortedTimes.map((timeKey, index) => {
                    const { home, away, time } = eventsByTime[timeKey];
                    const prevTime = index > 0 ? sortedTimes[index - 1] : null;
                    const prevTimeData = prevTime ? eventsByTime[prevTime] : null;
                    const showHalfTimeSeparator = prevTimeData && prevTimeData.time.elapsed <= 45 && time.elapsed > 45;
                    
                    return (
                      <div key={timeKey}>
                        {/* Half-time separator */}
                        {showHalfTimeSeparator && (
                          <div className="flex items-center justify-center my-2">
                            <div className="flex-1 h-px bg-background"></div>
                            <span className="px-3 text-white text-sm">GL {goals?.home ?? 0} - {goals?.away ?? 0}</span>
                            <div className="flex-1 h-px bg-background"></div>
                          </div>
                        )}
                        
                        {/* Injury time notification */}
                        {time.extra && time.extra > 0 && index > 0 && eventsByTime[sortedTimes[index - 1]]?.time.extra === undefined && (
                          <div className="text-xs text-center py-1 text-gray-400">
                            đã thêm + {time.extra} phút
                          </div>
                        )}

                        {/* Event row - 3 columns: Home | Time | Away */}
                        <div className="flex items-center gap-3 py-2">
                          {/* Home events column */}
                          <div className="flex-1 flex items-center gap-2 justify-end text-right">
                            {home && (
                              <>
                                <div className="flex-1">{getPlayerDisplay(home)}</div>
                                <div>{getEventIcon(home)}</div>
                              </>
                            )}
                          </div>

                          {/* Time column - center */}
                          <div className="w-10 h-10 rounded-full bg-gray-200  flex items-center justify-center">
                            <span className="text-xs font-semibold">
                              {time.elapsed}'{time.extra ? `+${time.extra}` : ''}
                            </span>
                          </div>

                          {/* Away events column */}
                          <div className="flex-1 flex items-center gap-2 justify-start text-left">
                            {away && (
                              <>
                                <div>{getEventIcon(away)}</div>
                                <div className="flex-1">{getPlayerDisplay(away)}</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Chưa có sự kiện nào</p>
              </div>
            )}
          </div>
        </div>

        <div className="nav-content">
          <h2 className="text-xl font-bold mb-6">Match Details</h2>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Lấy fixtureId từ URL params: /matches/1469104 -> id = "1469104"
  const fixtureId = context.params?.id as string;
  
  if (!fixtureId) {
    return {
      notFound: true,
    };
  }

  // Tạo cache key dựa trên fixtureId: "match-detail-1469104"
  const cacheKey = CACHE_KEYS.MATCH_DETAIL(fixtureId);
  
  // Check cache first - query data từ cache bằng fixtureId
  const cacheResult = cache.getWithInfo<any>(cacheKey);
  let matchData: any | null = null;
  let dataSource: 'cache' | 'api' = 'api';
  let cacheAge: number | undefined;
  
  if (!cacheResult) {
    // Fetch from API if not in cache
    const { success, data } = await fetchMatchDetail(fixtureId);
    
    if (success && data) {
      matchData = data;
      cache.set(cacheKey, matchData, 60000); // Cache for 1 minute
      dataSource = 'api';
    } else {
      matchData = null;
      dataSource = 'api';
    }
  } else {
    matchData = cacheResult.data;
    cacheAge = Math.round(cacheResult.age / 1000); // Convert to seconds
    dataSource = 'cache';
  }

  return {
    props: {
      matchData: matchData || null,
      dataSource,
      cacheAge: cacheAge ?? null, // Use null instead of undefined for JSON serialization
      fixtureId,
    },
  };
}

