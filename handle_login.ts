import { API, API_SUCCESS } from '@/constants/endpoint';
import { ENV } from '@/constants';
import axios from 'axios';
import { saveAuth } from '@/utils/auth';

const CORE_API_BASE_URL = ENV.CORE_API_BASE_URL;

// Create axios instance for CORE_API (different from http which uses API_BASE_URL)
const coreApiClient = axios.create({
  baseURL: CORE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
export async function handleLogin(username: string, password: string) {
  try {  
    const url = API.USER.LOGIN;

    const { data } = await coreApiClient.post(url, {
      username,
      password,
    });

    // Check if login is successful
    if (data && data.code === API_SUCCESS && data.access_token) {
      // Save access_token to memory and account info to cache
      // Note: refresh_token is stored in HTTPOnly cookie by server automatically
      saveAuth(data.access_token, data.user);
      
      return {
        success: true,
        data: data,
        message: data.message || 'Đăng nhập thành công',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.',
      };
    }
  } catch (error: unknown) {

    let errorMessage = '"/auth/admin';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { message?: string } } };
      errorMessage = anyError.response?.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function handleRegister(username: string, email: string, password: string) {
  try {  
    const url = API.USER.REGISTER;
    const { data } = await coreApiClient.post(url, {
      username,
      email,
      password,
    });

    // Check if register is successful
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data,
        message: data.message || 'Đăng ký thành công',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: unknown) {
    let errorMessage = '"/auth/admin';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { message?: string } } };
      errorMessage = anyError.response?.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function handleForgotPassword(username: string, email: string) {
  try {  
    const url = API.USER.FORGOT_PASSWORD;
    const { data } = await coreApiClient.post(url, {
      username,
      email,
    });

    // Check if request is successful
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data,
        message: data.message || 'Email đặt lại mật khẩu đã được gửi',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Gửi email thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: unknown) {
    let errorMessage = '"/auth/admin';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { message?: string } } };
      errorMessage = anyError.response?.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function handleResetPassword(reset_token: string, password: string) {
  try {  
    const url = API.USER.RESET_PASSWORD;
    const { data } = await coreApiClient.post(url, {
      reset_token,
      password,
    });

    // Check if reset is successful
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data,
        message: data.message || 'Đặt lại mật khẩu thành công',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: unknown) {
    let errorMessage = '"/auth/admin';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const anyError = error as { response?: { data?: { message?: string } } };
      errorMessage = anyError.response?.data?.message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Refresh access token using refresh_token from HTTPOnly cookie
 * Server will check refresh_token in cookie and return new access_token
 * 
 * Token expiry:
 * - access_token: 30 minutes
 * - refresh_token: 1 day (stored in HTTPOnly cookie by server)
 */
export async function refreshAccessToken() {
  try {
    const url = API.USER.REFRESH_TOKEN;
    const { data } = await coreApiClient.post(url);

    // Check if refresh is successful
    if (data && data.code === API_SUCCESS && data.access_token) {
      // Save new access_token to memory
      saveAuth(data.access_token, data.user);
      
      return {
        success: true,
        access_token: data.access_token,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Refresh token thất bại',
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi refresh token',
    };
  }
}
