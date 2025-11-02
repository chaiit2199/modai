import Image from "next/image";
import { useState, useEffect } from "react";
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import MatchesComponent from "@/components/Matches/MatchesComponent";
import RankingsComponent from "@/components/RankingsComponent";
import Tabs from "@/components/Tabs";
import Loading from "@/components/Loading";
import Metadata from "@/components/Metadata";

const tabMenu = [
  {
    id: "match-schedule",
    label: "Lịch thi đấu",
  },
  {
    id: "match-result",
    label: "Kết quả",
  },
  {
    id: "rankings",
    label: "Bảng xếp hạng",
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

export default function Home() {
  const {isMobile} = useDevice();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabMenu[0].id);
  const [activeTabTournament, setActiveTabTournament] = useState(tabTournament[0].id);

  if (isMobile == undefined) return; 

  return (
    <div className="container my-8">
      <Metadata/>

      <div className="flex gap-6">
        <div className="main-content">
          <PageTitle />
          <div className="bg-background3 rounded-2xl overflow-hidden p-4">
              <div className="mb-4">
                <Tabs tabs={tabMenu} switchTab={(id) => setActiveTab(id)} />
              </div>

              <div className="mb-4">
                <Tabs tabs={tabTournament} switchTab={(id) => setActiveTabTournament(id)} menuStyle="style-2" />
              </div>

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
            <h2 className="text-xl font-bold mb-6">Trending News</h2>

            <div className="post style1 mb-8">
              <img src="/images/blog/post-1.png" alt="Slide Image" className='post-image'/>
              <h5  className='post-title'>Results and scores from the Premier League Results and scores from the Premier League....!!</h5>
              <p className="post-date">
                5 hours ago
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="post style2">
                <img src="/images/blog/post-2.png" alt="Slide Image" className='post-image'/>
                <div className="post-content">
                  <h5  className='post-title'>Results and scores from the Premier League Results and scores from the Premier League....!!</h5>
                  <p className="post-date">
                    11 oct 2023, 06:00 aM
                  </p>
                </div>
              </div>

              <div className="post style2">
                <img src="/images/blog/post-2.png" alt="Slide Image" className='post-image'/>
                <div className="post-content">
                  <h5  className='post-title'>Results and scores from the Premier League Results and scores from the Premier League....!!</h5>
                  <p className="post-date">
                    11 oct 2023, 06:00 aM
                  </p>
                </div>
              </div>

              <div className="post style2">
                <img src="/images/blog/post-2.png" alt="Slide Image" className='post-image'/>
                <div className="post-content">
                  <h5  className='post-title'>Results and scores from the Premier League Results and scores from the Premier League....!!</h5>
                  <p className="post-date">
                    11 oct 2023, 06:00 aM
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
