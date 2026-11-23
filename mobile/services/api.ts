import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'vlxd_hub_user_token';

// In-memory fallback
let memoryToken: string | null = null;

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : memoryToken;
    } catch {
      return memoryToken;
    }
  }
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Lỗi đọc token SecureStore:', error);
    return memoryToken;
  }
};

export const setToken = async (token: string): Promise<void> => {
  memoryToken = token;
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.warn('Lỗi ghi token SecureStore:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  memoryToken = null;
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
    } catch {}
    return;
  }
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Lỗi xóa token SecureStore:', error);
  }
};

// Axios instance cấu hình chung
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.31:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor tự động gắn Authorization Bearer Token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
