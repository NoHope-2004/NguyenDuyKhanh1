import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';
import { AuthProvider } from '../context/AuthContext';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: Colors.surface },
              headerTintColor: Colors.primary,
              headerTitleStyle: { fontWeight: '600', color: Colors.textPrimary },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{ title: 'Chi tiết sản phẩm' }}
            />
            <Stack.Screen
              name="search"
              options={{ title: 'Tìm kiếm sản phẩm' }}
            />
            <Stack.Screen
              name="checkout"
              options={{ title: 'Xác nhận đặt hàng' }}
            />
            <Stack.Screen
              name="ai"
              options={{ title: 'Tư vấn vật liệu AI' }}
            />
            <Stack.Screen
              name="admin/orders"
              options={{ title: 'Quản lý đơn hàng (Admin)' }}
            />
            <Stack.Screen
              name="admin/products"
              options={{ title: 'Quản lý kho vật liệu (Admin)' }}
            />
            <Stack.Screen
              name="admin/add-product"
              options={{ title: 'Thêm vật liệu mới (Admin)' }}
            />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
