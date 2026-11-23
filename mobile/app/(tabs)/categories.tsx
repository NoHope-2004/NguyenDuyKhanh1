import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';
import { ProductCard } from '../../components/ProductCard';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';

export default function CategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedCatId, setSelectedCatId] = useState<string>('');

  const numColumns = width >= 800 ? 4 : width >= 550 ? 3 : 2;
  const cardWidth = (width - 32) / numColumns;

  // Lấy tất cả danh mục
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  // Đồng bộ categoryId từ params nếu có
  useEffect(() => {
    if (params.categoryId) {
      setSelectedCatId(params.categoryId);
    } else if (categories.length > 0 && !selectedCatId) {
      setSelectedCatId(categories[0]._id);
    }
  }, [params.categoryId, categories]);

  // Lấy sản phẩm theo danh mục đã chọn
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products', selectedCatId],
    queryFn: () => productService.getProducts({ categoryId: selectedCatId }),
    enabled: !!selectedCatId,
  });

  // Mutation thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartService.addToCart(productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!');
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

  if (loadingCategories) {
    return <Loading message="Đang tải danh mục..." />;
  }

  return (
    <View style={styles.container}>
      {/* Category selector horizontal pills */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {categories.map((cat) => {
            const isSelected = cat._id === selectedCatId;
            return (
              <TouchableOpacity
                key={cat._id}
                style={[styles.tabChip, isSelected && styles.selectedTabChip]}
                onPress={() => setSelectedCatId(cat._id)}
              >
                <Text
                  style={[styles.tabText, isSelected && styles.selectedTabText]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loadingProducts ? (
          <Loading message="Đang lọc sản phẩm..." />
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có sản phẩm nào trong danh mục này</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {products.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                style={{ width: cardWidth }}
                onPress={() => router.push(`/product/${item._id}` as any)}
                onAddToCart={() => addToCartMutation.mutate(item._id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsWrapper: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingVertical: 10,
  },
  tabsScroll: {
    paddingHorizontal: 12,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    marginHorizontal: 4,
  },
  selectedTabChip: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedTabText: {
    color: Colors.white,
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
});
