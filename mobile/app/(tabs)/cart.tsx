import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/AppButton';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react-native';

export default function CartScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: cart, isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: !!user,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Mutation cập nhật số lượng
  const updateQtyMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể cập nhật số lượng');
    },
  });

  // Mutation xóa sản phẩm
  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể xóa sản phẩm');
    },
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ShoppingBag size={56} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
        <Text style={styles.emptySub}>Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn</Text>
        <AppButton
          title="Đăng nhập ngay"
          onPress={() => router.push('/(auth)/login')}
          style={{ marginTop: 16, width: 200 }}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loading message="Đang tải giỏ hàng..." />;
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ShoppingBag size={56} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
        <Text style={styles.emptySub}>Hãy lựa chọn các sản phẩm vật liệu xây dựng chất lượng tại VLXD Hub</Text>
        <AppButton
          title="Mua sắm ngay"
          onPress={() => router.push('/')}
          style={{ marginTop: 16, width: 180 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {items.map((item) => {
          const product = item.productId;
          if (!product) return null;

          return (
            <View key={product._id} style={styles.itemCard}>
              <Image source={{ uri: product.image }} style={styles.itemImage} resizeMode="cover" />
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeItemMutation.mutate(product._id)}
                    style={styles.trashBtn}
                  >
                    <Trash2 size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemPrice}>
                  {formatPrice(product.price)}{' '}
                  <Text style={styles.itemUnit}>/{product.unit}</Text>
                </Text>

                <View style={styles.qtyRow}>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateQtyMutation.mutate({
                          productId: product._id,
                          quantity: item.quantity - 1,
                        })
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} color={item.quantity <= 1 ? Colors.gray300 : Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateQtyMutation.mutate({
                          productId: product._id,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      <Plus size={14} color={Colors.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subtotalText}>
                    {formatPrice(product.price * item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Thanh thanh toán ở dưới */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng tiền tạm tính:</Text>
          <Text style={styles.totalAmount}>{formatPrice(cart?.totalPrice || 0)}</Text>
        </View>
        <AppButton
          title="Tiến hành đặt hàng"
          onPress={() => router.push('/checkout')}
          style={{ width: '100%', marginTop: 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },
  scrollList: {
    padding: 16,
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.gray100,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  trashBtn: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginVertical: 4,
  },
  itemUnit: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
  },
  qtyText: {
    width: 32,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subtotalText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    padding: 16,
    paddingBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
});
