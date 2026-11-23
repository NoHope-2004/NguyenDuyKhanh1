import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/Colors';
import {
  UserRound,
  Mail,
  Phone,
  ClipboardList,
  MessageCircle,
  LogOut,
  Info,
  ChevronRight,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@vlxdhub.vn';

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await logout();
          Alert.alert('Thông báo', 'Đã đăng xuất thành công');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* 1. Header thông tin User */}
      <View style={styles.userCard}>
        <View style={styles.avatarBox}>
          <UserRound size={36} color={Colors.white} />
        </View>
        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <View style={styles.userSubRow}>
              <Mail size={13} color={Colors.textSecondary} />
              <Text style={styles.userSubText}>{user.email}</Text>
            </View>
            <View style={styles.userSubRow}>
              <Phone size={13} color={Colors.textSecondary} />
              <Text style={styles.userSubText}>{user.phone}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Khách ghé thăm</Text>
            <Text style={styles.guestText}>Đăng nhập để lưu đơn hàng và giỏ hàng</Text>
            <AppButton
              title="Đăng nhập / Đăng ký"
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginBtn}
              textStyle={{ fontSize: 13 }}
            />
          </View>
        )}
      </View>

      {/* 2. Tiện ích */}
      {isAdmin ? (
        <View style={[styles.menuGroup, { borderColor: '#F59E0B', borderWidth: 1.5 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.groupTitle, { color: '#B45309', marginBottom: 0 }]}>Khu vực Quản trị Admin</Text>
            <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#B45309' }}>ADMIN</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/orders' as any)}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
              <ClipboardList size={18} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Quản lý & Duyệt đơn hàng</Text>
              <Text style={styles.menuSubLabel}>Xem toàn bộ đơn, đổi trạng thái giao hàng</Text>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/products' as any)}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
              <UserRound size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Quản lý kho vật liệu (Thêm, Sửa, Xóa)</Text>
              <Text style={styles.menuSubLabel}>Thêm mới, sửa giá, tồn kho, ảnh hoặc xóa sản phẩm</Text>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>Tiện ích ứng dụng</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/orders')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
            <ClipboardList size={18} color="#2563EB" />
          </View>
          <Text style={styles.menuLabel}>Lịch sử mua hàng</Text>
          <ChevronRight size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/ai')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
            <MessageCircle size={18} color="#16A34A" />
          </View>
          <Text style={styles.menuLabel}>Trợ lý AI tư vấn vật liệu</Text>
          <ChevronRight size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 3. Thông tin ứng dụng */}
      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>Về ứng dụng</Text>

        <View style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#F3F4F6' }]}>
            <Info size={18} color={Colors.textPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>Phiên bản</Text>
            <Text style={styles.menuSubLabel}>VLXD Hub v1.0.0 (Expo SDK 58)</Text>
          </View>
        </View>
      </View>

      {/* 4. Đăng xuất nếu đã đăng nhập */}
      {user ? (
        <View style={{ marginTop: 20 }}>
          <AppButton
            title="Đăng xuất tài khoản"
            variant="outline"
            onPress={handleLogout}
            icon={<LogOut size={16} color={Colors.primary} />}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 16,
    marginBottom: 16,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  guestText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  loginBtn: {
    height: 36,
    width: 160,
  },
  menuGroup: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
  },
  menuSubLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
