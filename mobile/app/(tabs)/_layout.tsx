import React from 'react';
import { Tabs } from 'expo-router';
import {
  House,
  LayoutGrid,
  ShoppingCart,
  ClipboardList,
  UserRound,
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  // Query badge số lượng giỏ hàng
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: !!user,
  });

  const cartCount = cart?.totalCount || 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.divider,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.textPrimary,
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <House size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Danh mục',
          headerTitle: 'Danh mục vật liệu',
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          headerTitle: 'Giỏ hàng của bạn',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.primary,
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          headerTitle: 'Lịch sử mua hàng',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          headerTitle: 'Tài khoản cá nhân',
          tabBarIcon: ({ color, size }) => <UserRound size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
