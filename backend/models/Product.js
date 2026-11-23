const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Vui lòng chọn danh mục'],
  },
  brand: {
    type: String,
    required: [true, 'Vui lòng nhập thương hiệu/nhà sản xuất'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập đơn giá'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Vui lòng nhập URL hình ảnh sản phẩm'],
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    trim: true,
  },
  unit: {
    type: String,
    required: [true, 'Vui lòng nhập đơn vị tính (Bao, Viên, Thanh, Kg, Thùng, Mét khối...)'],
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 100,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
