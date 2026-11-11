import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

// Dữ liệu 4 màu điện thoại
const phoneData = {
  blue: {
    colorName: 'Xanh dương',
    provider: 'Tiki Trading',
    price: '1.790.000 đ',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyAM5dJxPebgVVCoRUll4aaQCIZkocYEHxlQFVhKl0Vg&s=10',
  },
  red: {
    colorName: 'Đỏ',
    provider: 'Tiki Trading',
    price: '1.790.000 đ',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_KX__dLc7SrqQLzcTayga0rYhfo-c2g_TePYzfe7ACg&s=10',
  },
  black: {
    colorName: 'Đen',
    provider: 'Tiki Trading',
    price: '1.790.000 đ',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV4GW776YqD_Ndw0ihELoTKHK4ht8U-YyEQh19qXM72Q&s=10',
  },
  silver: {
    colorName: 'Bạc',
    provider: 'Tiki Trading',
    price: '1.790.000 đ',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7P70miRDPgqPSulBwrIi2ydwFqeNhq6nYtnUu5rgPtw&s=10',
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('ProductList'); // 'ProductList' hoặc 'ColorPicker'
  const [selectedColor, setSelectedColor] = useState('blue');
  const currentProduct = phoneData[selectedColor];

  // 1. Hiển thị màn hình danh sách sản phẩm
  if (currentScreen === 'ProductList') {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: currentProduct.image }} 
            style={styles.productImage} 
            resizeMode="contain"
          />
        </View>

        <Text style={styles.productTitle}>
          Điện Thoại Vsmart Joy 3 - Hàng chính hãng
        </Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.ratingText}>(Xem 828 đánh giá)</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{currentProduct.price}</Text>
          <Text style={styles.originalPrice}>1.790.000 đ</Text>
        </View>

        <Text style={styles.refundText}>Ở ĐÂU RẺ HƠN HOÀN TIỀN ?</Text>

        <TouchableOpacity 
          style={styles.colorPickerButton}
          onPress={() => setCurrentScreen('ColorPicker')}
        >
          <Text style={styles.colorPickerText}>4 MÀU-CHỌN MÀU</Text>
          <Text style={styles.arrowText}>></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>CHỌN MUA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Hiển thị màn hình chọn màu
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: currentProduct.image }} 
          style={styles.headerImage} 
          resizeMode="contain"
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Điện Thoại Vsmart Joy 3 Hàng chính hãng</Text>
          <Text style={styles.infoText}>Màu: <Text style={styles.boldText}>{currentProduct.colorName}</Text></Text>
          <Text style={styles.infoText}>Cung cấp bởi: <Text style={styles.boldText}>{currentProduct.provider}</Text></Text>
          <Text style={styles.priceText}>{currentProduct.price}</Text>
        </View>
      </View>

      <View style={styles.pickerSection}>
        <Text style={styles.pickerTitle}>Chọn một màu bên dưới:</Text>

        <View style={styles.colorBoxContainer}>
          <TouchableOpacity 
            style={[styles.colorBox, { backgroundColor: '#C5F1FB' }]} 
            onPress={() => setSelectedColor('silver')}
          />
          <TouchableOpacity 
            style={[styles.colorBox, { backgroundColor: '#F30D0D' }]} 
            onPress={() => setSelectedColor('red')}
          />
          <TouchableOpacity 
            style={[styles.colorBox, { backgroundColor: '#000000' }]} 
            onPress={() => setSelectedColor('black')}
          />
          <TouchableOpacity 
            style={[styles.colorBox, { backgroundColor: '#234896' }]} 
            onPress={() => setSelectedColor('blue')}
          />
        </View>

        <TouchableOpacity 
          style={styles.doneButton} 
          onPress={() => setCurrentScreen('ProductList')}
        >
          <Text style={styles.doneButtonText}>XONG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  productImage: {
    width: 250,
    height: 280,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  stars: {
    color: '#E0A400',
    fontSize: 18,
    marginRight: 10,
  },
  ratingText: {
    fontSize: 13,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 20,
  },
  originalPrice: {
    fontSize: 14,
    color: '#808080',
    textDecorationLine: 'line-through',
  },
  refundText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FA0000',
  },
  colorPickerButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  colorPickerText: {
    fontSize: 15,
    fontWeight: '500',
  },
  arrowText: {
    position: 'absolute',
    right: 20,
    fontSize: 18,
    color: '#000',
  },
  buyButton: {
    backgroundColor: '#CA1536',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
  },
  headerImage: {
    width: 100,
    height: 120,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 14,
    color: '#000',
  },
  infoText: {
    fontSize: 13,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  pickerSection: {
    flex: 1,
    backgroundColor: '#C4C4C4',
    padding: 15,
    justifyContent: 'space-between',
  },
  pickerTitle: {
    fontSize: 16,
    color: '#000',
  },
  colorBoxContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 250,
  },
  colorBox: {
    width: 80,
    height: 50,
  },
  doneButton: {
    backgroundColor: '#1952E29B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CA1536',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});