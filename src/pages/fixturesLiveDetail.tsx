import Image from "next/image";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import MatchesComponent from "@/components/Matches/MatchesComponent";
import RankingsComponent from "@/components/RankingsComponent";
import FixturesLive from "@/components/Matches/FixturesLive";
import Tabs from "@/components/Tabs";
import Loading from "@/components/Loading";
import Metadata from "@/components/Metadata";
import { fetchFixturesLive } from "@/api/fetchData";
import { cache } from "@/utils/cache";
import { CACHE_KEYS } from "@/constants/endpoint"; 


const tabMenu = [
  {
    id: "match-live",
    label: "Trận đang diễn ra",
    icons: "/icons/live.svg"
  },
  {
    id: "match-schedule",
    label: "Lịch thi đấu",
    icons: "/icons/lich.svg"
  },
  {
    id: "match-result",
    label: "Kết quả",
    icons: "/icons/cup.svg"
  },
  {
    id: "rankings",
    label: "Bảng xếp hạng",
    icons: "/icons/ranks.svg"
  }
  
];

const tabTournament = [
  {
    "id": "premier-league",
    "label": "Premier League"
  },
  {
    "id": "la-liga",
    "label": "La Liga"
  },
  {
    "id": "serie-a",
    "label": "Serie A"
  },
  {
    "id": "bundesliga",
    "label": "Bundesliga"
  },
  {
    "id": "ligue-1",
    "label": "Ligue 1"
  },
  {
    "id": "champions-league",
    "label": "UEFA Champions League"
  },
  {
    "id": "europa-league",
    "label": "UEFA Europa League"
  },
  {
    "id": "world-cup",
    "label": "World Cup"
  },
  {
    "id": "afc-champions-league",
    "label": "AFC Champions League"
  },
  {
    "id": "v-league",
    "label": "V-League"
  }
];

interface FixturesLiveDetailProps {
  fixturesLiveData: any[];
  dataSource: 'cache' | 'api';
  cacheAge?: number; // Age in seconds
}

export default function FixturesLiveDetail({ fixturesLiveData, dataSource, cacheAge }: FixturesLiveDetailProps) {
  const {isMobile} = useDevice();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabMenu[0].id); 

  if (isMobile == undefined) return; 

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
              {dataSource === 'cache' && cacheAge !== undefined && (
                <span className="text-gray-500">
                  (Cache age: {cacheAge}s)
                </span>
              )}
            </div>
            
            <FixturesLive fixturesData={fixturesLiveData} />
          </div>
        </div>

        <div className="nav-content">
            <h2 className="text-xl font-bold mb-6">Trending News</h2>

              
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const liveParam = "all"; // Có thể lấy từ query params nếu cần: context.query.live || "all"
  const cacheKey = CACHE_KEYS.FIXTURES_LIVE(liveParam);
  
  console.log(`[FixturesLiveDetail] Request received - Param: ${liveParam}, CacheKey: ${cacheKey}`);
  
  // Check cache first - sử dụng cùng cacheKey với trang index
  const cacheResult = cache.getWithInfo<any[]>(cacheKey);
  let fixturesLiveData: any[] | null = null;
  let dataSource: 'cache' | 'api' = 'api';
  let cacheAge: number | undefined;
  
  if (!cacheResult) {
    console.log(`[FixturesLiveDetail] ❌ Cache MISS - Fetching from API...`);
    // Fetch from API if not in cache
    const { success, data: response } = await fetchFixturesLive(liveParam);
    
    if (success && response?.response) {
      fixturesLiveData = response.response;
      cache.set(cacheKey, fixturesLiveData, 60000);
      dataSource = 'api';
    } else {
      console.log(`[FixturesLiveDetail] ❌ API failed - Returning empty array`);
      fixturesLiveData = [];
      dataSource = 'api';
    }
  } else {
    fixturesLiveData = cacheResult.data;
    cacheAge = Math.round(cacheResult.age / 1000); // Convert to seconds
    dataSource = 'cache';
    console.log(`[FixturesLiveDetail] ✅ Cache HIT - Data length: ${fixturesLiveData.length}, Cache age: ${cacheAge}s`);
  }

  return {
    props: {
      fixturesLiveData: fixturesLiveData || [],
      dataSource,
      cacheAge: cacheAge || undefined,
    },
  };
}
 
