import { API, API_SUCCESS } from '@/constants/endpoint';
import http from './http';
import { ENV } from '@/constants';

const NEXT_PUBLIC_RAPIDAPI_URL = process.env.NEXT_PUBLIC_RAPIDAPI_URL;

// Use proxy path when on client-side to avoid CORS, direct URL on server-side
const getCoreApiBaseUrl = () => {
  // On client-side, use relative path that will be proxied by Next.js
  // On server-side, use full URL
  return ENV.NEXT_PUBLIC_CORE_API_BASE_URL;
};

import axios from 'axios';

// Create axios instance dynamically
const getCoreApiClient = () => {
  const baseURL = getCoreApiBaseUrl();
  return axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
 
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


export async function fetchNewsLatest() {
  try {  
    const coreApiClient = getCoreApiClient();
    const url = API.NEWS.LATEST;
    const { data } = await coreApiClient.get(url);
 
    // Kiểm tra cấu trúc response giống handleGetAllPosts
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data.data || data.response || data,
      };
    } else if (data) {
      // Nếu không có code hoặc code khác, vẫn trả về data
      return {
        success: true,
        data: data.data || data.response || data,
      };
    } else {
      return {
        success: false,
        message: 'Không có dữ liệu trả về',
      };
    }
  } catch (error: unknown) {
    console.error('Error fetching news latest:', error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { message?: string; errorCode?: string } } };
      const errorMessage = anyError.response?.data?.message;
      const errorCode = anyError.response?.data?.errorCode;
      if (errorMessage) {
        console.error('API error message:', errorMessage);
      }
      if (errorCode) {
        console.error('API error code:', errorCode);
      }
    } else {
      console.error('FetchNewsLatest Request Error');
    }
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy tin tức mới nhất',
    };
  }
} 