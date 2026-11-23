import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Product } from '../types';
import { Colors } from '../constants/Colors';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.cardWrapper, style]}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              <Text style={styles.unit}>/{product.unit}</Text>
            </View>
            {onAddToCart ? (
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                activeOpacity={0.7}
              >
                <ShoppingCart {...({ size: 16, color: Colors.white } as any)} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    padding: 4,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.divider,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.gray100,
  },
  infoContainer: {
    padding: 10,
  },
  brand: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    height: 36,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  unit: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  cartBtn: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
