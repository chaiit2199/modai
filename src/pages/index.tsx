import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import MatchesComponent from "@/components/Matches/MatchesComponent";
import RankingsComponent from "@/components/RankingsComponent";
import FixturesLive from "@/components/Matches/FixturesLive";
import Tabs from "@/components/Tabs";
import Metadata from "@/components/Metadata";
import { fetchFixturesLive, fetchNewsLatest } from "@/api/fetchData";
import { cache } from "@/utils/cache";
import { CACHE_KEYS } from "@/constants/endpoint"; 
import NewsLatest from "@/components/News/NewsLatest";


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

interface HomeProps {
  fixturesLiveData: any[];
  newsLatestData: any[];
}

export default function Home({ fixturesLiveData, newsLatestData }: HomeProps) {
  const {isMobile} = useDevice();
  const [activeTab, setActiveTab] = useState(tabMenu[0].id);
  const [activeTabTournament, setActiveTabTournament] = useState(tabTournament[0].id);

  if (isMobile == undefined) return; 

  return (
    <div className="container my-8">
      <Metadata/>

      <div className="flex gap-6">
        <div className="main-content">
          <PageTitle />
          <div className="bg-background3 rounded-2xl overflow-hidden px-4 py-8 border border-line">
              <div className="mb-4">
                <Tabs tabs={tabMenu} switchTab={(id) => setActiveTab(id)} />
              </div>

              <div className="mb-4">
                <Tabs tabs={tabTournament} switchTab={(id) => setActiveTabTournament(id)} menuStyle="style-2" />
              </div>
 
              {activeTab === "match-live" && (
                <div className="flex flex-col gap-6">
                  <FixturesLive fixturesData={fixturesLiveData} /> 
                </div>
              )}

              {activeTab === "match-schedule" && (
                <div className="flex flex-col gap-6">
                  <MatchesComponent />
                  <MatchesComponent />
                  <MatchesComponent />
                </div>
              )}

              {activeTab === "match-result" && (
                <div className="flex flex-col gap-6">
                  <MatchesComponent />
                  <MatchesComponent />
                </div>
              )}

              {activeTab === "rankings" && (
                <div className="flex flex-col gap-6">
                  <RankingsComponent /> 
                </div>
              )}
            </div>
        </div>

        <div className="nav-content">
            <h2 className="text-xl font-bold mb-6">Tin tức</h2>
            <NewsLatest newsLatestData={newsLatestData} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const liveParam = "all"; // Có thể lấy từ query params nếu cần: context.query.live || "all"
  const fixturesCacheKey = CACHE_KEYS.FIXTURES_LIVE(liveParam);
  const newsCacheKey = CACHE_KEYS.NEWS_LATEST();
  
  // Fetch fixtures data
  let fixturesLiveData = cache.get<any[]>(fixturesCacheKey);
  
  if (!fixturesLiveData) {
    const { success, data: response } = await fetchFixturesLive(liveParam);
    
    if (success && response?.response) {
      fixturesLiveData = response.response;
      // Cache for 1 minute (60000 milliseconds)
      cache.set(fixturesCacheKey, fixturesLiveData, 60000);
    } else {
      fixturesLiveData = [];
    }
  }

  // Fetch news data
  let newsLatestData = cache.get<any[]>(newsCacheKey);
  
  if (!newsLatestData) {
    const { success, data: response } = await fetchNewsLatest();
    
    if (success && response) {
      // Handle different possible data structures
      const data = response?.data || response?.response || response || [];
      newsLatestData = Array.isArray(data) ? data : [];
      // Cache for 1 minute (60000 milliseconds)
      cache.set(newsCacheKey, newsLatestData, 60000);
    } else {
      newsLatestData = [];
    }
  } 

  return {
    props: {
      fixturesLiveData: fixturesLiveData || [],
      newsLatestData: newsLatestData || [],
    },
  };
}
