import { API } from '@/constants/endpoint';
import http from './http';

const NEXT_PUBLIC_RAPIDAPI_URL = process.env.NEXT_PUBLIC_RAPIDAPI_URL 
 
export async function fetchFixturesLive(live: string) {
  try {  
    const url = `${NEXT_PUBLIC_RAPIDAPI_URL}${API.PRODUCT.fixtures}?live=${live}`;
    const { data } = await http.get(url);

    // Group fixtures by league.id
    const groupedData: Record<number, {
      league: any;
      details: any[];
    }> = {};

    // Assuming data.response is an array of fixtures
    if (data?.response && Array.isArray(data.response)) {
      data.response.forEach((item: any) => {
        const leagueId = item.league?.id;
        
        if (leagueId !== undefined) {
          if (!groupedData[leagueId]) {
            // First occurrence of this league.id - create new group
            groupedData[leagueId] = {
              league: item.league,
              details: [{
                events: item.events,
                fixture: item.fixture,
                goals: item.goals,
                score: item.score,
                teams: item.teams
              }]
            };
          } else {
            // Add to existing group
            groupedData[leagueId].details.push({
              events: item.events,
              fixture: item.fixture,
              goals: item.goals,
              score: item.score,
              teams: item.teams
            });
          }
        }
      });
    }

    // Convert grouped object to array
    const groupedArray = Object.values(groupedData);

    return {
      success: true,
      data: {
        ...data,
        response: groupedArray
      },
    };
  } catch (error: unknown) {
    console.error(error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { errorCode?: string } } };
      const errorCode = anyError.response?.data?.errorCode;
      if (errorCode) {
        console.error('API error:', errorCode);
      }
    } else {
      console.error('FetchFixturesLive Request Error');
    }
    return {
      success: false,
    };
  }
}

export async function fetchMatchDetail(fixtureId: string) {
  try {  
    const url = `${NEXT_PUBLIC_RAPIDAPI_URL}${API.PRODUCT.fixtures}?id=${fixtureId}`;
    const { data } = await http.get(url);

    return {
      success: true,
      data: data,
    };
  } catch (error: unknown) {
    console.error(error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { errorCode?: string } } };
      const errorCode = anyError.response?.data?.errorCode;
      if (errorCode) {
        console.error('API error:', errorCode);
      }
    } else {
      console.error('FetchMatchDetail Request Error');
    }
    return {
      success: false,
    };
  }
} 