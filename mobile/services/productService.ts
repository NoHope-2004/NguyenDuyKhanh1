import api from './api';
import { Product, Category } from '../types';

export const productService = {
  // Lấy danh sách danh mục
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Lấy danh sách sản phẩm (có tìm kiếm, lọc danh mục, sắp xếp)
  getProducts: async (params?: { search?: string; categoryId?: string; sort?: string }): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // ADMIN: Thêm sản phẩm mới vào MongoDB
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // ADMIN: Cập nhật thông tin sản phẩm (giá, tồn kho, tên, ảnh...)
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // ADMIN: Xóa sản phẩm
  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
