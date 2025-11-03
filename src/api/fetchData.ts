import { API } from '@/constants/endpoint';
import http from './http';

const NEXT_PUBLIC_RAPIDAPI_URL = process.env.NEXT_PUBLIC_RAPIDAPI_URL 
 
export async function fetchFixturesLive(live: string) {
  try {  
    const url = `${NEXT_PUBLIC_RAPIDAPI_URL}${API.PRODUCT.fixtures}?live=${live}`;
    console.log(url);
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
      console.error('RESPONSE NOT FOUND');
    }
    return {
      success: false,
    };
  }
}
 