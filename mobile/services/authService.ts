import api, { setToken, removeToken } from './api';
import { User } from '../types';

export const authService = {
  // Đăng ký
  register: async (userData: { fullName: string; email: string; phone: string; password: string }): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      await setToken(response.data.token);
    }
    return response.data;
  },

  // Đăng nhập
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      await setToken(response.data.token);
    }
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await removeToken();
  },
};
