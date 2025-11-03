// src/api/client.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';
import { getItem, setItem, removeItem } from '@/utils/storage';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async config => {
        const token = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for the refresh to complete
            return new Promise(resolve => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.client.post('/auth/refresh-token', {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            await setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            await setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            // Notify all subscribers
            this.refreshSubscribers.forEach(callback => callback(accessToken));
            this.refreshSubscribers = [];

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            await this.clearAuth();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async clearAuth() {
    await removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await removeItem(STORAGE_KEYS.USER_DATA);
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }

  public async get<T>(url: string, config?: any) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: any) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: any) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: any) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient.getInstance();
