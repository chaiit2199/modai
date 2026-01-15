import { API, API_SUCCESS, CACHE_KEYS } from '@/constants/endpoint';
import http from './http';
import { ENV } from '@/constants';
import { cache } from '@/utils/cache';

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

export async function fetchFixturesByDate(date: string) {
  try {  
    const url = `${NEXT_PUBLIC_RAPIDAPI_URL}${API.PRODUCT.fixtures}?date=${date}`;
    const { data } = await http.get(url);

    // Group fixtures by league.id (giống fetchFixturesLive)
    const groupedData: Record<number, {
      league: any;
      details: any[];
    }> = {};

    if (data?.response && Array.isArray(data.response)) {
      data.response.forEach((item: any) => {
        const leagueId = item.league?.id;
        
        if (leagueId !== undefined) {
          if (!groupedData[leagueId]) {
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

    const groupedArray = Object.values(groupedData);

    return {
      success: true,
      data: {
        ...data,
        response: groupedArray
      },
    };
  } catch (error: unknown) {
    console.error('Error fetching fixtures by date:', error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { errorCode?: string } } };
      const errorCode = anyError.response?.data?.errorCode;
      if (errorCode) {
        console.error('API error:', errorCode);
      }
    } else {
      console.error('FetchFixturesByDate Request Error');
    }
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy lịch thi đấu',
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

export async function fetchStandings(league: string, season: string) {
  try {  
    const url = `${NEXT_PUBLIC_RAPIDAPI_URL}${API.PRODUCT.standings}?league=${league}&season=${season}`;
    const { data } = await http.get(url);

    // Parse standings data - cấu trúc: data.response[0].league hoặc data.league
    let standingsData = null;
    if (data?.response && Array.isArray(data.response) && data.response.length > 0) {
      // Nếu response là array, lấy league từ phần tử đầu tiên
      standingsData = data.response[0]?.league || data.response[0];
    } else if (data?.response?.league) {
      // Nếu response có league
      standingsData = data.response.league;
    } else if (data?.league) {
      // Nếu data có league trực tiếp
      standingsData = data.league;
    } else if (data?.response) {
      standingsData = data.response;
    } else if (data) {
      standingsData = data;
    }

    console.log('📊 Standings API Response:', {
      hasData: !!data,
      hasResponse: !!data?.response,
      hasLeague: !!standingsData?.league,
      standingsArray: standingsData?.standings ? `Array(${standingsData.standings.length})` : 'null',
      leagueName: standingsData?.name || standingsData?.league?.name || 'N/A'
    });

    return {
      success: true,
      data: standingsData || data,
    };
  } catch (error: unknown) {
    console.error('❌ FetchStandings Error:', error);

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { errorCode?: string; message?: string } } };
      const errorCode = anyError.response?.data?.errorCode;
      const errorMessage = anyError.response?.data?.message;
      if (errorCode) {
        console.error('API error code:', errorCode);
      }
      if (errorMessage) {
        console.error('API error message:', errorMessage);
      }
    } else {
      console.error('FetchStandings Request Error');
    }
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy bảng xếp hạng',
    };
  }
} 

/**
 * Helper function để fetch standings data với cache
 * Dùng chung cho index.tsx và [tab].tsx
 * @param leagueId - ID của giải đấu
 * @param season - Mùa giải
 * @param ttl - Time to live cho cache (mặc định 1 ngày)
 */
export async function getStandingsData(leagueId: string = "39", season: string = "2022", ttl?: number) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const THIRTY_MINUTES_MS = 30 * 60 * 1000;
  const cacheTTL = ttl !== undefined ? ttl : ONE_DAY_MS;
  
  const standingsCacheKey = CACHE_KEYS.STANDINGS(leagueId, season);
  const standingsCacheResult = cache.getWithInfo<any>(standingsCacheKey);
  
  if (standingsCacheResult) {
    console.log('✅ Using cached standings data', { 
      leagueId, 
      season, 
      cacheAge: standingsCacheResult.age 
    });
    return {
      data: standingsCacheResult.data || null,
      fromCache: true,
    };
  }
  
  console.log('📡 Fetching standings from API...', { leagueId, season });
  const result = await fetchStandings(leagueId, season);
  
  if (result.success && result.data) {
    const standingsData = result.data;
    console.log('✅ Standings data fetched successfully:', {
      hasData: !!standingsData,
      dataKeys: standingsData ? Object.keys(standingsData) : null,
      ttl: `${cacheTTL / 1000 / 60} minutes`
    });
    cache.set(standingsCacheKey, standingsData, cacheTTL);
    return {
      data: standingsData,
      fromCache: false,
    };
  } else {
    console.warn('⚠️ Failed to fetch standings:', result.message || 'Unknown error');
    return {
      data: null,
      fromCache: false,
    };
  }
}

/**
 * Helper function để fetch fixtures theo ngày với cache thông minh
 * - Đã thi đấu (status = "FT" hoặc có score): cache 1 ngày
 * - Chưa thi đấu (status = "NS" hoặc chưa có score): cache 1 phút
 * @param date - Ngày cần fetch (YYYY-MM-DD)
 * @param ttl - TTL tùy chỉnh (nếu không có sẽ tự động tính theo trạng thái trận đấu)
 */
export async function getFixturesDataByDate(date: string, ttl?: number) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_MINUTE_MS = 60 * 1000;
  
  const fixturesCacheKey = CACHE_KEYS.FIXTURES_BY_DATE(date);
  const cachedData = cache.get<any[]>(fixturesCacheKey);
  
  if (cachedData !== null) {
    console.log('✅ Using cached fixtures data', { date });
    return {
      data: cachedData,
      fromCache: true,
    };
  }
  
  console.log('📡 Fetching fixtures from API...', { date });
  const result = await fetchFixturesByDate(date);
  
  if (result.success && result.data?.response) {
    const fixturesData = result.data.response;
    
    // Phân tích trạng thái trận đấu để quyết định TTL
    let cacheTTL = ttl;
    if (cacheTTL === undefined) {
      // Kiểm tra xem có trận nào đã thi đấu không
      const hasFinishedMatches = fixturesData.some((group: any) => 
        group.details?.some((detail: any) => {
          const status = detail.fixture?.status?.short;
          const hasScore = detail.goals?.home !== null && detail.goals?.away !== null;
          return status === 'FT' || status === 'AET' || status === 'PEN' || hasScore;
        })
      );
      
      // Nếu có trận đã thi đấu, cache 1 ngày, ngược lại cache 1 phút
      cacheTTL = hasFinishedMatches ? ONE_DAY_MS : ONE_MINUTE_MS;
      console.log('📊 Fixtures cache TTL:', {
        date,
        hasFinishedMatches,
        ttl: `${cacheTTL / 1000 / 60} minutes`
      });
    }
    
    cache.set(fixturesCacheKey, fixturesData, cacheTTL);
    return {
      data: fixturesData,
      fromCache: false,
    };
  } else {
    console.warn('⚠️ Failed to fetch fixtures:', result.message || 'Unknown error');
    return {
      data: [],
      fromCache: false,
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