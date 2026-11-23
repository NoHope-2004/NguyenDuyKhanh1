import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { getToken } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Khôi phục phiên đăng nhập khi mở app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch (error) {
        console.warn('Phiên đăng nhập hết hạn:', error);
        await authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    queryClient.invalidateQueries();
  };

  const register = async (userData: { fullName: string; email: string; phone: string; password: string }) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
    queryClient.invalidateQueries();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    queryClient.clear(); // Xóa sạch cache dữ liệu cá nhân khi đăng xuất
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
