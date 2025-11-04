import { GetServerSideProps } from "next";
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
      
      <div className="flex gap-6">
        <div className="main-content">
          <PageTitle />
          <div className="bg-background3 rounded-2xl overflow-hidden px-4 py-8">
            {/* Data Source Indicator */}
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                dataSource === 'cache' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {dataSource === 'cache' ? '📦 From Cache' : '🌐 From API'}
              </span>
              {dataSource === 'cache' && cacheAge !== null && (
                <span className="text-gray-500">
                  (Cache age: {cacheAge}s)
                </span>
              )}
              <span className="text-xs text-gray-400">
                Fixture ID: {fixtureId}
              </span>
            </div>

            {/* Match Info */}
            {league && (
              <div className="mb-6 flex items-center gap-3">
                <img src={league.logo} alt={league.name} className="w-8 h-8" />
                <div>
                  <h2 className="font-bold text-lg">{league.name}</h2>
                  <p className="text-sm text-gray-500">{league.country} - {league.round}</p>
                </div>
              </div>
            )}

            {/* Match Score */}
            {fixture && teams && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
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
                      <span className="font-bold text-xl">{teams.home.name}</span>
                      <img src={teams.home.logo} alt={teams.home.name} className="w-12 h-12" />
                    </div>
                  </div>

                  <div className="px-8">
                    <div className="text-4xl font-bold text-center">
                      {goals?.home ?? 0} - {goals?.away ?? 0}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      {fixture.status?.long}
                    </p>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={teams.away.logo} alt={teams.away.name} className="w-12 h-12" />
                      <span className="font-bold text-xl">{teams.away.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Match Events */}
            {events && events.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Match Events</h3>
                <div className="space-y-2">
                  {events.map((event: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium w-16">
                        {event.time.elapsed}' {event.time.extra && `+${event.time.extra}`}
                      </span>
                      <span className="text-sm">{event.type}</span>
                      <span className="text-sm font-medium flex-1">
                        {event.team.name}: {event.player?.name}
                      </span>
                    </div>
                  ))}
                </div>
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
  
  console.log(`[MatchDetail] Request received - FixtureId: ${fixtureId}, CacheKey: ${cacheKey}`);
  
  // Check cache first - query data từ cache bằng fixtureId
  const cacheResult = cache.getWithInfo<any>(cacheKey);
  let matchData: any | null = null;
  let dataSource: 'cache' | 'api' = 'api';
  let cacheAge: number | undefined;
  
  if (!cacheResult) {
    console.log(`[MatchDetail] ❌ Cache MISS - Fetching from API for fixtureId: ${fixtureId}...`);
    // Fetch from API if not in cache
    const { success, data } = await fetchMatchDetail(fixtureId);
    
    if (success && data) {
      matchData = data;
      cache.set(cacheKey, matchData, 60000); // Cache for 1 minute
      dataSource = 'api';
      console.log(`[MatchDetail] ✅ API success - Match found (ID: ${fixtureId}), Cached for 60s`);
    } else {
      console.log(`[MatchDetail] ❌ API failed - Match not found (ID: ${fixtureId})`);
      matchData = null;
      dataSource = 'api';
    }
  } else {
    matchData = cacheResult.data;
    cacheAge = Math.round(cacheResult.age / 1000); // Convert to seconds
    dataSource = 'cache';
    console.log(`[MatchDetail] ✅ Cache HIT - Match found (ID: ${fixtureId}), Cache age: ${cacheAge}s`);
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

