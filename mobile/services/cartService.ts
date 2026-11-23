import api from './api';
import { Cart } from '../types';

export const cartService = {
  // Lấy giỏ hàng
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Thêm vào giỏ hàng
  addToCart: async (productId: string, quantity: number = 1): Promise<Cart> => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  // Cập nhật số lượng
  updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.patch(`/cart/${productId}`, { quantity });
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem: async (productId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },
};
