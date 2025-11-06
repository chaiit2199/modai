import { API, API_SUCCESS } from '@/constants/endpoint';
import { ENV } from '@/constants';
import axios from 'axios';
import { saveAuth } from '@/utils/auth';

const CORE_API_BASE_URL = ENV.CORE_API_BASE_URL || 'http://localhost:4000';

// Create axios instance for CORE_API (different from http which uses API_BASE_URL)
const coreApiClient = axios.create({
  baseURL: CORE_API_BASE_URL,
  timeout: 10000,
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
    if (data && data.code === API_SUCCESS && data.token) {
      // Save token to cookie and account info to cache
      saveAuth(data.token, data.user);
      
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

    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
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
    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
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
    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
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
    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
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
