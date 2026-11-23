import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { Colors } from '../constants/Colors';

export default function SearchScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [keyword, setKeyword] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const numColumns = width >= 800 ? 4 : width >= 550 ? 3 : 2;
  const cardWidth = (width - 32) / numColumns;

  // Lấy danh mục để lọc
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  // Lấy danh sách sản phẩm theo bộ lọc
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', keyword, selectedCatId, sortOption],
    queryFn: () =>
      productService.getProducts({
        search: keyword,
        categoryId: selectedCatId,
        sort: sortOption,
      }),
  });

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

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.searchHeader}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Nhập tên sản phẩm, thương hiệu..."
        />

        {/* Sort filters */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Sắp xếp: </Text>
          <TouchableOpacity
            style={[styles.sortChip, sortOption === 'newest' && styles.selectedSortChip]}
            onPress={() => setSortOption('newest')}
          >
            <Text style={[styles.sortText, sortOption === 'newest' && styles.selectedSortText]}>
              Mới nhất
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortOption === 'price_asc' && styles.selectedSortChip]}
            onPress={() => setSortOption('price_asc')}
          >
            <Text style={[styles.sortText, sortOption === 'price_asc' && styles.selectedSortText]}>
              Giá tăng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortOption === 'price_desc' && styles.selectedSortChip]}
            onPress={() => setSortOption('price_desc')}
          >
            <Text style={[styles.sortText, sortOption === 'price_desc' && styles.selectedSortText]}>
              Giá giảm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          <TouchableOpacity
            style={[styles.catChip, selectedCatId === '' && styles.selectedCatChip]}
            onPress={() => setSelectedCatId('')}
          >
            <Text style={[styles.catText, selectedCatId === '' && styles.selectedCatText]}>
              Tất cả danh mục
            </Text>
          </TouchableOpacity>
          {categories.map((c) => (
            <TouchableOpacity
              key={c._id}
              style={[styles.catChip, selectedCatId === c._id && styles.selectedCatChip]}
              onPress={() => setSelectedCatId(selectedCatId === c._id ? '' : c._id)}
            >
              <Text style={[styles.catText, selectedCatId === c._id && styles.selectedCatText]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>Tìm thấy {products.length} sản phẩm phù hợp</Text>
      </View>

      {/* Product Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <Loading message="Đang tìm kiếm sản phẩm..." />
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào phù hợp</Text>
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
  searchHeader: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.gray100,
    marginRight: 6,
  },
  selectedSortChip: {
    backgroundColor: Colors.primary,
  },
  sortText: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  selectedSortText: {
    color: Colors.white,
    fontWeight: '700',
  },
  catScroll: {
    marginTop: 10,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    marginRight: 6,
  },
  selectedCatChip: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  catText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedCatText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
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
