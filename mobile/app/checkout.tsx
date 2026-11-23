import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { Loading } from '../components/Loading';
import { Colors } from '../constants/Colors';
import { Cart, Order, CartItem } from '../types';
import { CheckCircle2, Truck, ShieldCheck } from 'lucide-react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');

  // Lấy dữ liệu giỏ hàng để hiển thị tóm tắt đơn
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: !!user,
  });

  const createOrderMutation = useMutation<Order, any, { customerName: string; phone: string; address: string }>({
    mutationFn: (data) => orderService.createOrder(data),
    onSuccess: (newOrder: Order) => {
      // Invalidate cart và orders cache
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      Alert.alert(
        'Đặt hàng thành công! 🎉',
        `Đơn hàng #${newOrder._id.slice(-6).toUpperCase()} đã được tạo thành công. Chúng tôi sẽ liên hệ qua SĐT ${phone} để xác nhận và giao hàng.`,
        [
          {
            text: 'Xem đơn hàng',
            onPress: () => router.replace('/(tabs)/orders' as any),
          },
        ]
      );
    },
    onError: (err: any) => {
      Alert.alert(
        'Đặt hàng thất bại',
        err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng'
      );
    },
  });

  const handleConfirmOrder = () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ nhận hàng');
      return;
    }

    createOrderMutation.mutate({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  if (isLoading) {
    return <Loading message="Đang kiểm tra giỏ hàng..." />;
  }

  const items: CartItem[] = cart?.items || [];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. Thông tin giao hàng */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Truck size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
          </View>

          <AppInput
            label="Họ và tên người nhận *"
            placeholder="Nguyễn Văn A"
            value={customerName}
            onChangeText={setCustomerName}
          />

          <AppInput
            label="Số điện thoại liên hệ *"
            placeholder="0901234567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <AppInput
            label="Địa chỉ công trình / nhà nhận hàng *"
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
            multiline
            numberOfLines={2}
            style={{ height: 60, textAlignVertical: 'top' }}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* 2. Phương thức thanh toán */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShieldCheck size={18} color={Colors.success} />
            <Text style={styles.cardTitle}>Hình thức thanh toán</Text>
          </View>

          <View style={styles.paymentOption}>
            <CheckCircle2 size={18} color={Colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.paymentTitle}>COD - Thanh toán khi nhận hàng</Text>
              <Text style={styles.paymentDesc}>
                Kiểm tra chất lượng và số lượng vật liệu tại công trình trước khi thanh toán.
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Tóm tắt đơn hàng */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sản phẩm đặt mua ({items.length})</Text>

          {items.map((item: CartItem) => (
            <View key={item.productId?._id} style={styles.orderItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.productId?.name}
                </Text>
                <Text style={styles.orderItemMeta}>
                  {item.quantity} {item.productId?.unit} x {formatPrice(item.productId?.price || 0)}
                </Text>
              </View>
              <Text style={styles.orderItemTotal}>
                {formatPrice((item.productId?.price || 0) * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính:</Text>
            <Text style={styles.summaryVal}>{formatPrice(cart?.totalPrice || 0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={styles.freeShipText}>Miễn phí giao hàng</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalVal}>{formatPrice(cart?.totalPrice || 0)}</Text>
          </View>
        </View>

        {/* Nút đặt hàng */}
        <AppButton
          title="Xác nhận đặt hàng"
          onPress={handleConfirmOrder}
          loading={createOrderMutation.isPending}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  orderItemMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  orderItemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  freeShipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  submitBtn: {
    marginTop: 8,
    height: 50,
  },
});
