import api from './api';
import { Order } from '../types';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (data: { customerName: string; phone: string; address: string }): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Lấy lịch sử đơn hàng
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Xem chi tiết 1 đơn hàng
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // ADMIN: Lấy tất cả đơn hàng hệ thống
  getAllOrdersAdmin: async (): Promise<Order[]> => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  // ADMIN: Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/admin/${orderId}/status`, { status });
    return response.data;
  },
};
