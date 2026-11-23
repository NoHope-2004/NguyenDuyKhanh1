import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/AppButton';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';
import { Plus, Minus, ShoppingCart, CheckCircle, Package } from 'lucide-react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@vlxdhub.vn';

  const [quantity, setQuantity] = useState(1);

  const deleteProductMutation = useMutation({
    mutationFn: (prodId: string) => productService.deleteProduct(prodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi hệ thống', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể xóa sản phẩm');
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: (qty: number) => cartService.addToCart(id!, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!', [
        { text: 'Tiếp tục xem' },
        { text: 'Xem giỏ hàng', onPress: () => router.push('/(tabs)/cart') },
      ]);
    },
    onError: (err: any) => {
      if (!user) {
        Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm vào giỏ hàng', [
          { text: 'Hủy' },
          { text: 'Đăng nhập', onPress: () => router.push('/(auth)/login') },
        ]);
      } else {
        Alert.alert('Lỗi', err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
      }
    },
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  if (isLoading) {
    return <Loading message="Đang tải thông tin sản phẩm..." />;
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm này</Text>
        <AppButton
          title="Quay lại"
          onPress={() => router.back()}
          style={{ marginTop: 12, width: 140 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ảnh sản phẩm */}
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Thông tin cơ bản */}
        <View style={styles.contentCard}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.nameText}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
            <Text style={styles.unitText}>/{product.unit}</Text>
          </View>

          {/* Tồn kho & Đơn vị tính */}
          <View style={styles.stockRow}>
            <View style={styles.stockBadge}>
              <CheckCircle size={14} color={Colors.success} />
              <Text style={styles.stockText}>Còn {product.stock} {product.unit} tại kho</Text>
            </View>
            <View style={styles.unitBadge}>
              <Package size={14} color={Colors.textSecondary} />
              <Text style={styles.unitBadgeText}>ĐVT: {product.unit}</Text>
            </View>
          </View>

          {/* Bộ chọn số lượng (Chỉ dành cho khách hàng) */}
          {!isAdmin ? (
            <View style={styles.qtySection}>
              <Text style={styles.qtyLabel}>Số lượng đặt mua:</Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} color={quantity <= 1 ? Colors.gray300 : Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[styles.qtySection, { backgroundColor: '#FEF3C7', padding: 8, borderRadius: 6 }]}>
              <Text style={{ fontSize: 13, color: '#B45309', fontWeight: '600' }}>
                👑 Bạn đang xem với vai trò Quản Trị Viên (Admin)
              </Text>
            </View>
          )}
        </View>

        {/* Mô tả chi tiết */}
        <View style={styles.descCard}>
          <Text style={styles.sectionHeading}>Mô tả sản phẩm & Quy cách</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Thanh nút bấm đặt mua ở cuối */}
      <View style={styles.bottomBar}>
        {!isAdmin ? (
          <>
            <View style={styles.totalBlock}>
              <Text style={styles.totalLabel}>Thành tiền:</Text>
              <Text style={styles.totalNumber}>{formatPrice(product.price * quantity)}</Text>
            </View>
            <AppButton
              title="Thêm vào giỏ"
              icon={<ShoppingCart size={18} color={Colors.white} />}
              onPress={() => addToCartMutation.mutate(quantity)}
              loading={addToCartMutation.isPending}
              style={styles.buyBtn}
            />
          </>
        ) : (
          <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
            <AppButton
              title="Về kho sản phẩm"
              variant="outline"
              onPress={() => router.push('/admin/products' as any)}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Xóa vật liệu này"
              variant="danger"
              onPress={() => {
                Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa "${product.name}"?`, [
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Xóa vĩnh viễn', style: 'destructive', onPress: () => deleteProductMutation.mutate(product._id) },
                ]);
              }}
              loading={deleteProductMutation.isPending}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  productImage: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.gray100,
  },
  contentCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  unitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  stockText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  unitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unitBadgeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  qtySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  qtyLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 6,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
  },
  qtyNumber: {
    width: 44,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  descCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalBlock: {
    flex: 1,
    marginRight: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  buyBtn: {
    flex: 1.2,
  },
});
