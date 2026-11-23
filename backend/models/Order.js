const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  customerName: {
    type: String,
    required: [true, 'Vui lòng nhập tên người nhận hàng'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại nhận hàng'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ giao hàng công trình/nhà'],
    trim: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    default: 'COD',
    enum: ['COD'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
