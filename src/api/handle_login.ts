import { API, API_SUCCESS } from '@/constants/endpoint';
import { ENV } from '@/constants';
import axios from 'axios';
import { saveAuth } from '@/utils/auth';

// Use proxy path when on client-side to avoid CORS, direct URL on server-side
const getCoreApiBaseUrl = () => {
  // On server-side, use full URL
  return ENV.NEXT_PUBLIC_CORE_API_BASE_URL || 'http://localhost:4000';
};

// Create axios instance dynamically to handle both client and server-side
const getCoreApiClient = () => {
  const baseURL = getCoreApiBaseUrl();
  return axios.create({
    baseURL,
    timeout: 30000, // 30 seconds
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
 
export async function handleLogin(username: string, password: string) {
  try {  
    const url = API.USER.LOGIN;
    const coreApiClient = getCoreApiClient();
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
    const coreApiClient = getCoreApiClient();
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
    const coreApiClient = getCoreApiClient();
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
    const coreApiClient = getCoreApiClient();
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
    const coreApiClient = getCoreApiClient();
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

export async function handleGetAllPosts() {
  try {
    let url = API.NEWS.ALL;
    const coreApiClient = getCoreApiClient();
    const { data } = await coreApiClient.get(url);
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data.data || data.response || data,
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Không thể lấy danh sách bài viết',
      };
    }
  } catch (error: unknown) {
    console.error('Error fetching all posts:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi lấy bài viết';
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

export async function handleGetPostById(postId: string | number) {
  try {
    const url = `${API.NEWS.DETAIL}/${postId}`;
    const coreApiClient = getCoreApiClient();
    const { data } = await coreApiClient.get(url);
    
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data.data || data.response || data,
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Không thể lấy chi tiết bài viết',
      };
    }
  } catch (error: unknown) {
    console.error('Error fetching post detail:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi lấy chi tiết bài viết';
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

export async function createPost(postData: any, accessToken?: string, username?: string, email?: string) {
  try {
    const url = API.NEWS.CREATE;
    
    // Add username and email to request body if provided
    const requestData = {
      ...postData,
    };
    
    if (username) {
      requestData.username = username;
    }
    if (email) {
      requestData.email = email;
    }
    
    const coreApiClient = getCoreApiClient();
    const { data } = await coreApiClient.post(url, requestData);
    
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Tạo bài viết thành công',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Không thể tạo bài viết',
      };
    }
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi tạo bài viết';
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

export async function updatePost(postId: string | number, postData: any, accessToken?: string, username?: string, email?: string) {
  try {
    // Use POST method with update endpoint (server may not support PUT)
    const url = `${API.NEWS.UPDATE}/${postId}`;
    
    // Add postId, username, and email to request body
    const requestData = {
      ...postData,
      id: postId,
    };
    
    // Add username and email if provided
    if (username) {
      requestData.username = username;
    }
    if (email) {
      requestData.email = email;
    }
    
    // Use POST method instead of PUT to avoid CORS issues
    const coreApiClient = getCoreApiClient();
    const { data } = await coreApiClient.put(url, requestData);
    
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Cập nhật bài viết thành công',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Không thể cập nhật bài viết',
      };
    }
  } catch (error: unknown) {
    console.error('Error updating post:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi cập nhật bài viết';
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

export async function deletePost(postId: string | number, accessToken?: string, username?: string, email?: string) {
  try {
    const url = `${API.NEWS.DELETE}/${postId}`;
    
    // Add username and email to request body if provided
    const requestData: any = {
      id: postId,
    };
    
    if (username) {
      requestData.username = username;
    }
    if (email) {
      requestData.email = email;
    }
    
    const coreApiClient = getCoreApiClient();
    const { data } = await coreApiClient.delete(url, { data: requestData });
    
    if (data && data.code === API_SUCCESS) {
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Xóa bài viết thành công',
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Không thể xóa bài viết',
      };
    }
  } catch (error: unknown) {
    console.error('Error deleting post:', error);
    
    let errorMessage = 'Có lỗi xảy ra khi xóa bài viết';
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