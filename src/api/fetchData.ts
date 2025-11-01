import { API } from '@/constants/endpoint';
import http from './http';

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
 
export async function getProduct(limit: number, skip: number) {
  try {  
    const queryParams = new URLSearchParams({ limit: String(limit), skip: String(skip) }).toString();
    const url = `${NEXT_PUBLIC_API_BASE_URL}${API.PRODUCT.LIST}?${queryParams}`;
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

export async function getCategory(category: String) {
  try {  
    const url = `${NEXT_PUBLIC_API_BASE_URL}${API.PRODUCT.CATEGORY}/${category}`; 
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