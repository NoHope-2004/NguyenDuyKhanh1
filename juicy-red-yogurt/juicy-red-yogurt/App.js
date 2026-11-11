import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// ==========================================
// DỮ LIỆU MẪU (DATA)
// ==========================================
const DATA_4A = [
  {
    id: '1',
    title: 'Ca nấu lẩu, nấu mì mini...',
    shop: 'Devang',
    image: 'https://picsum.photos/200?random=1',
  },
  {
    id: '2',
    title: '1KG KHÔ GÀ BƠ TỎI ...',
    shop: 'LTD Food',
    image: 'https://picsum.photos/200?random=2',
  },
  {
    id: '3',
    title: 'Xe cần cẩu đa năng',
    shop: 'Thế giới đồ chơi',
    image: 'https://picsum.photos/200?random=3',
  },
  {
    id: '4',
    title: 'Đồ chơi dạng mô hình',
    shop: 'Thế giới đồ chơi',
    image: 'https://picsum.photos/200?random=4',
  },
  {
    id: '5',
    title: 'Lãnh đạo đơn giản',
    shop: 'Minh Long Book',
    image: 'https://picsum.photos/200?random=5',
  },
  {
    id: '6',
    title: 'Hiểu lòng con trẻ',
    shop: 'Minh Long Book',
    image: 'https://picsum.photos/200?random=6',
  },
];

const DATA_4B = [
  {
    id: '1',
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    discount: '-39%',
    rating: 5,
    reviews: 15,
    image: 'https://picsum.photos/200?random=7',
  },
  {
    id: '2',
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    discount: '-39%',
    rating: 5,
    reviews: 15,
    image: 'https://picsum.photos/200?random=8',
  },
  {
    id: '3',
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    discount: '-39%',
    rating: 5,
    reviews: 15,
    image: 'https://picsum.photos/200?random=9',
  },
  {
    id: '4',
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    discount: '-39%',
    rating: 5,
    reviews: 15,
    image: 'https://picsum.photos/200?random=10',
  },
  {
    id: '5',
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    discount: '-39%',
    rating: 5,
    reviews: 15,
    image: 'https://picsum.photos/200?random=11',
  },
  {
    id: '6',
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    discount: '-39%',
    rating: 5,
    reviews: 15,
    image: 'https://picsum.photos/200?random=12',
  },
];

// ==========================================
// MÀN HÌNH 4_A (CHAT LIST)
// ==========================================
const Screen4A = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item4aContainer}>
      <Image source={{ uri: item.image }} style={styles.item4aImage} />
      <View style={styles.item4aInfo}>
        <Text style={styles.item4aTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.item4aShop}>
          Shop <Text style={{ color: '#E53935' }}>{item.shop}</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Chat</Text>
        <Ionicons name="cart-outline" size={24} color="#fff" />
      </View>

      {/* Sub-header text */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          Bạn có thắc mắc với sản phẩm vừa xem. Đừng ngại chat với shop!
        </Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={DATA_4A}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

// ==========================================
// MÀN HÌNH 4_B (PRODUCT GRID 2 CỘT)
// ==========================================
const Screen4B = () => {
  const renderGridItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      <Text style={styles.gridTitle} numberOfLines={2}>
        {item.title}
      </Text>
      
      {/* Rating stars */}
      <View style={styles.ratingRow}>
        {[...Array(5)].map((_, index) => (
          <Ionicons key={index} name="star" size={12} color="#FFD700" />
        ))}
        <Text style={styles.reviewText}>({item.reviews})</Text>
      </View>

      {/* Price & Discount */}
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>{item.price}</Text>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Dây cáp usb"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Cart Icon với Badge đỏ */}
        <View style={styles.cartContainer}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <View style={styles.badge} />
        </View>

        <MaterialIcons name="more-horiz" size={24} color="#fff" />
      </View>

      {/* Grid FlatList 2 cột */}
      <FlatList
        data={DATA_4B}
        keyExtractor={(item) => item.id}
        renderItem={renderGridItem}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
};

// ==========================================
// APP CHÍNH (ĐỔI GIỮA 2 MÀN HÌNH ĐỂ TEST)
// ==========================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('4a');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1BA9FF" />

      {/* Thanh nút bấm chuyển đổi giữa Màn 4_a và 4_b */}
      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleBtn, currentScreen === '4a' && styles.activeBtn]}
          onPress={() => setCurrentScreen('4a')}>
          <Text style={styles.toggleText}>Màn 4_a (List Chat)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, currentScreen === '4b' && styles.activeBtn]}
          onPress={() => setCurrentScreen('4b')}>
          <Text style={styles.toggleText}>Màn 4_b (Grid Sản Phẩm)</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị màn hình tương ứng */}
      {currentScreen === '4a' ? <Screen4A /> : <Screen4B />}

      {/* Bottom Navigation Bar giả lập */}
      <View style={styles.bottomNav}>
        <Ionicons name="menu" size={24} color="#000" />
        <Ionicons name="home-outline" size={24} color="#000" />
        <Ionicons name="return-back" size={24} color="#000" />
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 6,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: '#1BA9FF',
    borderRadius: 4,
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Header chung
  header: {
    backgroundColor: '#1BA9FF',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Sub Header Màn 4a
  subHeader: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subHeaderText: {
    fontSize: 13,
    color: '#333',
  },

  // Item Màn 4a (Chat)
  item4aContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  item4aImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  item4aInfo: {
    flex: 1,
    marginLeft: 12,
  },
  item4aTitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  item4aShop: {
    fontSize: 12,
    color: '#777',
  },
  chatButton: {
    backgroundColor: '#E53935',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 2,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Header Màn 4b (Search)
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 34,
    borderRadius: 2,
    marginHorizontal: 12,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000',
    padding: 0,
  },
  cartContainer: {
    position: 'relative',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Item Màn 4b (Grid)
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 4,
  },
  gridImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    height: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  reviewText: {
    fontSize: 10,
    color: '#777',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  discountText: {
    fontSize: 11,
    color: '#888',
    marginLeft: 6,
  },

  // Bottom Nav
  bottomNav: {
    height: 45,
    backgroundColor: '#1BA9FF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});