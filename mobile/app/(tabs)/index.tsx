import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../../components/SearchBar';
import { CategoryItem } from '../../components/CategoryItem';
import { ProductCard } from '../../components/ProductCard';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';
import { ShoppingCart, MessageCircle, ChevronRight } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ['cart'] }),
    ]);
    setRefreshing(false);
  };

  // Responsive columns calculation
  const numColumns = width >= 800 ? 4 : width >= 550 ? 3 : 2;
  const cardWidth = (width - 32) / numColumns;

  // Lấy danh mục
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  // Lấy sản phẩm nổi bật
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  // Lấy số lượng giỏ hàng
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: !!user,
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
        Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', [
          { text: 'Hủy' },
          { text: 'Đăng nhập', onPress: () => router.push('/(auth)/login') },
        ]);
      } else {
        Alert.alert('Lỗi', err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
      }
    },
  });

  if (loadingCategories && loadingProducts) {
    return <Loading message="Đang tải dữ liệu trang chủ..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandTitle}>VLXD HUB</Text>
            <Text style={styles.brandSubtitle}>Vật liệu xây dựng chính hãng</Text>
          </View>
          <TouchableOpacity
            style={styles.cartIconBtn}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <ShoppingCart size={22} color={Colors.textPrimary} />
            {cart && cart.totalCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.totalCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Thanh tìm kiếm */}
        <SearchBar
          editable={false}
          onPress={() => router.push('/search')}
          placeholder="Tìm xi măng, sắt thép, gạch, cát, đá..."
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* 2. Banner thực tế */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerHeading}>CUNG ỨNG VẬT LIỆU TẬN CÔNG TRÌNH</Text>
            <Text style={styles.bannerText}>Giao nhanh 24/7 - Giá cạnh tranh - Đủ chủng loại</Text>
          </View>
        </View>

        {/* 3. AI Banner Card */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push('/ai')}
          activeOpacity={0.9}
        >
          <View style={styles.aiIconBox}>
            <MessageCircle size={24} color={Colors.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.aiTitle}>Tư vấn vật liệu cùng AI</Text>
            <Text style={styles.aiDesc}>Hỏi đáp mác xi măng, loại gạch, tính năng sơn...</Text>
          </View>
          <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* 4. Danh mục */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/categories')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Xem tất cả</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <CategoryItem
              key={cat._id}
              category={cat}
              onPress={() => router.push({ pathname: '/(tabs)/categories', params: { categoryId: cat._id } })}
            />
          ))}
        </ScrollView>

        {/* 5. Sản phẩm nổi bật */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm mới & bán chạy</Text>
          <Text style={styles.itemCountText}>({products.length} sản phẩm)</Text>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  cartIconBtn: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bannerHeading: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '400',
  },
  aiCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  aiDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  itemCountText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  categoryScroll: {
    paddingHorizontal: 10,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
});
