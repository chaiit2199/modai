import { useState, useEffect, useMemo } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import MatchesComponent from "@/components/Matches/MatchesComponent";
import StandingsComponent from "@/components/StandingsComponent";
import FixturesLive from "@/components/Matches/FixturesLive";
import Tabs from "@/components/Tabs";
import Metadata from "@/components/Metadata";
import { fetchFixturesLive, fetchNewsLatest, getStandingsData } from "@/api/fetchData";
import { cache } from "@/utils/cache";
import { CACHE_KEYS } from "@/constants/endpoint"; 
import { getTomorrowDate, getYesterdayDate, getTodayDate } from "@/utils/dateUtils";
import NewsLatest from "@/components/News/NewsLatest";
import Link from "next/link";
import Loading from "@/components/Loading";


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

// Mapping tournament id to league id
const tournamentLeagueMap: Record<string, string> = {
  "39": "39", // Premier League
  "la-liga": "140", // La Liga
  "serie-a": "135", // Serie A
  "bundesliga": "78", // Bundesliga
  "ligue-1": "61", // Ligue 1
  "champions-league": "2", // UEFA Champions League
  "europa-league": "3", // UEFA Europa League
  "world-cup": "1", // World Cup
  "afc-champions-league": "3", // AFC Champions League (cần update đúng id)
  "v-league": "169", // V-League (cần update đúng id)
};

const tabTournament = [
  {
    "id": "39",
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
  standingsData: any;
}

export default function Home({ fixturesLiveData, newsLatestData, standingsData: initialStandingsData }: HomeProps) {
  const {isMobile} = useDevice();
  const router = useRouter();
  
  // Route / luôn là tab đầu tiên (id = "")
  const [activeTab] = useState(tabMenu[0].id); // Luôn là tab đầu tiên cho route /
  const [activeTabTournament, setActiveTabTournament] = useState(tabTournament[0].id);
  const [standingsData, setStandingsData] = useState(initialStandingsData);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [fixturesData, setFixturesData] = useState<any[]>([]);
  const [matchResultData, setMatchResultData] = useState<any[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [loadingMatchResult, setLoadingMatchResult] = useState(false);

  // Hàm xử lý khi click tab - push route
  const handleTabChange = (id: string) => {
    // Nếu id rỗng thì push về /, ngược lại push về /id
    const targetRoute = id === "" ? "/" : `/${id}`;
    if (router.pathname !== targetRoute) {
      router.push(targetRoute, undefined, { scroll: false });
    }
  };

  // Fetch standings khi tournament thay đổi và đang ở tab standings
  // Cache 30 phút mỗi lần chọn giải đấu
  useEffect(() => {
    if (activeTab === "standings" && activeTabTournament) {
      const leagueId = tournamentLeagueMap[activeTabTournament] || activeTabTournament;
      const season = "2022"; // Có thể lấy từ state hoặc config
      
      // Chỉ fetch nếu khác với data hiện tại
      if (standingsData?.league?.id?.toString() !== leagueId) {
        setLoadingStandings(true);
        
        // Gọi API route để fetch và cache standings với TTL 30 phút
        fetch(`/api/standings?leagueId=${leagueId}&season=${season}`)
          .then((res) => res.json())
          .then((result) => {
            if (result.success && result.data) {
              console.log('✅ Standings data fetched', { 
                fromCache: result.fromCache,
                leagueId 
              });
              setStandingsData(result.data);
            } else {
              console.warn('⚠️ Failed to fetch standings:', result.message || 'Unknown error');
            }
          })
          .catch((error) => {
            console.error('Error fetching standings:', error);
          })
          .finally(() => {
            setLoadingStandings(false);
          });
      }
    }
  }, [activeTab, activeTabTournament, standingsData?.league?.id]);

  // Fetch fixtures khi chuyển sang tab "Lịch thi đấu" (ngày mai)
  useEffect(() => {
    if (activeTab === "fixtures") {
      setLoadingFixtures(true);
      const tomorrow = getTomorrowDate();
      
      fetch(`/api/fixtures?date=${tomorrow}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.data) {
            console.log('✅ Fixtures data fetched', { 
              fromCache: result.fromCache,
              date: tomorrow 
            });
            setFixturesData(result.data || []);
          } else {
            console.warn('⚠️ Failed to fetch fixtures:', result.message || 'Unknown error');
            setFixturesData([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching fixtures:', error);
          setFixturesData([]);
        })
        .finally(() => {
          setLoadingFixtures(false);
        });
    }
  }, [activeTab]);

  // Fetch match results khi chuyển sang tab "Kết quả" 
  // Fetch cả ngày hôm qua và hôm nay để có kết quả trận đang diễn ra
  useEffect(() => {
    if (activeTab === "match-result") {
      setLoadingMatchResult(true);
      const yesterday = getYesterdayDate();
      const today = getTodayDate();
      
      // Fetch cả 2 ngày song song
      Promise.all([
        fetch(`/api/fixtures?date=${yesterday}`).then(res => res.json()),
        fetch(`/api/fixtures?date=${today}`).then(res => res.json())
      ])
        .then(([yesterdayResult, todayResult]) => {
          const allData: any[] = [];
          
          // Thêm data từ ngày hôm qua
          if (yesterdayResult.success && yesterdayResult.data) {
            allData.push(...(yesterdayResult.data || []));
          }
          
          // Thêm data từ ngày hôm nay (có thể có trận đang diễn ra)
          if (todayResult.success && todayResult.data) {
            allData.push(...(todayResult.data || []));
          }
          
          console.log('✅ Match result data fetched', { 
            yesterdayFromCache: yesterdayResult.fromCache,
            todayFromCache: todayResult.fromCache,
            yesterdayDate: yesterday,
            todayDate: today,
            totalGroups: allData.length
          });
          
          setMatchResultData(allData);
        })
        .catch((error) => {
          console.error('Error fetching match results:', error);
          setMatchResultData([]);
        })
        .finally(() => {
          setLoadingMatchResult(false);
        });
    }
  }, [activeTab]);

  // Hàm xử lý khi click tournament tab
  const handleTournamentChange = (id: string) => {
    setActiveTabTournament(id);
  };

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
                <Tabs tabs={tabTournament} switchTab={handleTournamentChange} defaultTab={activeTabTournament} menuStyle="style-2" />
              </div>
 
              {activeTab === "" && (
                <div className="flex flex-col gap-6">
                  <FixturesLive fixturesData={fixturesLiveData} /> 
                </div>
              )}

              {activeTab === "fixtures" && (
                <div className="flex flex-col gap-6 relative min-h-[300px]">
                  {loadingFixtures ? (
                    <Loading show={true} />
                  ) : fixturesData.length > 0 ? (
                    fixturesData.map((group: any, index: number) => (
                      <MatchesComponent key={index} data={group} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có lịch thi đấu
                    </div>
                  )}
                </div>
              )}

              {activeTab === "match-result" && (
                <div className="flex flex-col gap-6 relative min-h-[300px]">
                  {loadingMatchResult ? (
                    <Loading show={true} />
                  ) : matchResultData.length > 0 ? (
                    matchResultData.map((group: any, index: number) => (
                      <MatchesComponent key={index} data={group} showDate={true} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có kết quả trận đấu
                    </div>
                  )}
                </div>
              )}

              {activeTab === "standings" && (
                <div className="flex flex-col gap-6 relative min-h-[300px]">
                  {loadingStandings ? (
                    <Loading show={true} />
                  ) : (
                    <StandingsComponent standingsData={standingsData} /> 
                  )}
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

export const getServerSideProps: GetServerSideProps = async () => {
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

  // Fetch standings data - Cache 1 ngày
  const leagueId = "39"; // Premier League
  const season = "2022"; // Season 2024
  const { data: standingsData } = await getStandingsData(leagueId, season);

  return {
    props: {
      fixturesLiveData: fixturesLiveData || [],
      newsLatestData: newsLatestData || [],
      standingsData: standingsData || null,
    },
  };
}
