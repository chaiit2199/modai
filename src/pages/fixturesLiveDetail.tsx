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

interface HomeProps {
  fixturesLiveData: any[];
}

export default function Home({ fixturesLiveData }: HomeProps) {
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
               
            </div>
        </div>

        <div className="nav-content">
            <h2 className="text-xl font-bold mb-6">Trending News</h2>

              
        </div>
      </div>
    </div>
  );
}
 
