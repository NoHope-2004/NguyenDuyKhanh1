export interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  categoryId: Category | string;
  brand: string;
  price: number;
  image: string;
  description: string;
  unit: string;
  stock: number;
  createdAt?: string;
}

export interface CartItem {
  _id?: string;
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
}

export interface OrderItem {
  _id?: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit?: string;
  image?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role?: 'customer' | 'admin';
  token?: string;
}
