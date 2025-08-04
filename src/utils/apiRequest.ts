import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { httpClient } from './http';

/*
 * Generic API request helper – axios config alır ve response.data döner.
 * Kullanım: const data = await apiRequest<LoginResponse>({ method: 'POST', url: '/api/Auth/Login', data: body })
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.request<T>(config);
  return response.data;
} 