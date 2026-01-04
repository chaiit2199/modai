import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import MatchesComponent from "@/components/Matches/MatchesComponent";
import StandingsComponent from "@/components/StandingsComponent";
import FixturesLive from "@/components/Matches/FixturesLive";
import Tabs from "@/components/Tabs";
import Metadata from "@/components/Metadata";
import { fetchFixturesLive, fetchNewsLatest } from "@/api/fetchData";
import { cache } from "@/utils/cache";
import { CACHE_KEYS } from "@/constants/endpoint"; 
import NewsLatest from "@/components/News/NewsLatest";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

const tabMenu = [
  {
    id: "",
    label: "Trận đang diễn ra",
    icons: "/icons/live.svg"
  },
  {
    id: "fixtures",
    label: "Lịch thi đấu",
    icons: "/icons/lich.svg"
  },
  {
    id: "match-result",
    label: "Kết quả",
    icons: "/icons/cup.svg"
  },
  {
    id: "standings",
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

interface TabPageProps {
  fixturesLiveData: any[];
  newsLatestData: any[];
}

export default function TabPage({ fixturesLiveData, newsLatestData }: TabPageProps) {
  const {isMobile} = useDevice();
  const router = useRouter();
  const tabParam = router.query.tab as string;
  
  // Lấy activeTab từ URL, nếu null hoặc không hợp lệ thì dùng tab đầu tiên
  const activeTab = useMemo(() => {
    if (tabParam && tabMenu.some(tab => tab.id === tabParam)) {
      return tabParam;
    }
    return tabMenu[0].id; // Mặc định tab đầu tiên
  }, [tabParam]);
  
  const [activeTabTournament, setActiveTabTournament] = useState(tabTournament[0].id);

  // Hàm xử lý khi click tab - push route
  const handleTabChange = (id: string) => {
    if (id !== activeTab) {
      // Nếu id rỗng thì push về /, ngược lại push về /id
      const targetRoute = id === "" ? "/" : `/${id}`;
      router.push(targetRoute, undefined, { scroll: false });
    }
  };

  // Redirect nếu tab không hợp lệ về tab đầu tiên
  useEffect(() => {
    if (tabParam && !tabMenu.some(tab => tab.id === tabParam)) {
      // Tab đầu tiên có id rỗng, redirect về /
      router.replace("/");
    }
  }, [tabParam, router]);

  if (isMobile == undefined) return;

  return (
    <div className="container my-8">
      <Metadata/>

      <div className="flex md:flex-col gap-6">
        <div className="main-content">
          <PageTitle />
          <div className="bg-background3 rounded-2xl overflow-hidden px-4 py-8 border border-line">
              <div className="mb-4">
                <Tabs tabs={tabMenu} switchTab={handleTabChange} defaultTab={activeTab} />
              </div>

              <div className="mb-4">
                <Tabs tabs={tabTournament} switchTab={(id) => setActiveTabTournament(id)} menuStyle="style-2" />
              </div>
 
              {activeTab === "" && (
                <div className="flex flex-col gap-6">
                  <FixturesLive fixturesData={fixturesLiveData} /> 
                </div>
              )}

              {activeTab === "fixtures" && (
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

              {activeTab === "standings" && (
                <div className="flex flex-col gap-6">
                  <StandingsComponent /> 
                </div>
              )}
            </div>
        </div>

        <div className="nav-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Tin tức</h2>

              <Link href="/news" className="hover:underline">Xem tất cả</Link>
            </div>
            <NewsLatest newsLatestData={newsLatestData} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const liveParam = "all";
  const fixturesCacheKey = CACHE_KEYS.FIXTURES_LIVE(liveParam);
  const newsCacheKey = CACHE_KEYS.NEWS_LATEST();
  
  // Fetch fixtures data
  let fixturesLiveData = cache.get<any[]>(fixturesCacheKey);
  
  if (!fixturesLiveData) {
    const { success, data: response } = await fetchFixturesLive(liveParam);
    
    if (success && response?.response) {
      fixturesLiveData = response.response;
      cache.set(fixturesCacheKey, fixturesLiveData, 60000);
    } else {
      fixturesLiveData = [];
    }
  }

  // Fetch news data - Cache 10 phút
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const newsCacheResult = cache.getWithInfo<any[]>(newsCacheKey);
  let newsLatestData: any[] = [];
  
  if (newsCacheResult) {
    newsLatestData = newsCacheResult.data || [];
  } else {
    const result = await fetchNewsLatest();
    
    if (result.success && result.data) {
      const data = result.data;
      newsLatestData = Array.isArray(data) ? data : [];
      cache.set(newsCacheKey, newsLatestData, TEN_MINUTES_MS);
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

