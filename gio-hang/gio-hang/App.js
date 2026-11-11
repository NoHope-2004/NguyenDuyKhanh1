import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';

// Danh sách sản phẩm mẫu
const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Điện thoại Vsmart Joy 3',
    price: 1790000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-znFjw3vcEWpA6NWdCQLptuWdVKuFnbvI8i0LOFtrlA&s=10',
  },
  {
    id: '2',
    name: 'Tai nghe Bluetooth True Wireless',
    price: 450000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVKVK2Wj74SFPpoGC_7-xisUr2k62AV3jF1o6GE8aH1Q&s=10',
  },
  {
    id: '3',
    name: 'Đồng hồ thông minh Smartwatch',
    price: 1250000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSErjWMGEtBz7bqW7ZVBgGuwOYoRpFZN7KQqozofAe0xg&s=10',
  },
  {
    id: '4',
    name: 'Sạc dự phòng 10.000mAh',
    price: 320000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU-dWFZjPvGEm0IKan7JLDD33s6NADzO7AP4y2MOKlsg&s=10',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' hoặc 'cart'
  const [cart, setCart] = useState([]);

  // Hàm thêm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Hàm tăng/giảm số lượng trong giỏ
  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Tính tổng số lượng và tổng tiền
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* TAB NAVIGATOR TRÊN CÙNG */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'products' && styles.activeTabButton]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Sản Phẩm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'cart' && styles.activeTabButton]}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
            Giỏ Hàng {totalQuantity > 0 ? `(${totalQuantity})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* NỘI DUNG CHÍNH */}
      <View style={styles.content}>
        {activeTab === 'products' ? (
          /* MÀN HÌNH DANH SÁCH SẢN PHẨM */
          <FlatList
            data={INITIAL_PRODUCTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {item.price.toLocaleString('vi-VN')} VNĐ
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.addButtonText}>+ Thêm vào giỏ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          /* MÀN HÌNH GIỎ HÀNG */
          cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống!</Text>
            </View>
          ) : (
            <ScrollView style={styles.cartList}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.cartImage} />
                  <View style={styles.cartDetails}>
                    <Text style={styles.cartName}>{item.name}</Text>
                    <Text style={styles.cartPrice}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )
        )}
      </View>

      {/* THANH THỐNG KÊ TỔNG TIỀN Ở ĐÁY MÀN HÌNH */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tổng số lượng: {totalQuantity}</Text>
        <Text style={styles.footerText}>
          Tổng tiền: {totalPrice.toLocaleString('vi-VN')} VNĐ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cartList: {
    padding: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  cartDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartName: {
    fontSize: 14,
    fontWeight: '500',
  },
  cartPrice: {
    fontSize: 13,
    color: '#E53935',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    backgroundColor: '#e0e0e0',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 15,
  },
  footerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
  },
});