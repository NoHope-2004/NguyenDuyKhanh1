const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Tạo đơn hàng mới từ giỏ hàng hiện tại
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, paymentMethod = 'COD' } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ giao hàng' });
    }

    // 1. Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng của bạn đang trống, không thể đặt hàng' });
    }

    // 2. Kiểm tra tồn kho và tính toán tổng tiền THỰC TẾ từ Database (Bảo mật)
    let calculatedTotalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;

      if (!product) {
        return res.status(400).json({ message: 'Một trong các sản phẩm không còn tồn tại' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} ${product.unit}, không đủ đáp ứng số lượng bạn đặt (${item.quantity})`,
        });
      }

      calculatedTotalPrice += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        image: product.image,
      });
    }

    // 3. Trừ tồn kho thực tế
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 4. Tạo bản ghi đơn hàng
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      customerName,
      phone,
      address,
      totalPrice: calculatedTotalPrice,
      paymentMethod,
      status: 'PENDING',
    });

    // 5. Xóa sạch giỏ hàng sau khi đặt thành công
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo đơn hàng: ' + error.message });
  }
};

// @desc    Lấy danh sách đơn hàng của người dùng hiện tại
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử đơn hàng: ' + error.message });
  }
};

// @desc    Lấy chi tiết 1 đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Chỉ chủ sở hữu đơn hàng mới được xem
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xem chi tiết đơn hàng: ' + error.message });
  }
};

// @desc    Lấy tất cả đơn hàng hệ thống (Dành cho Admin)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy tất cả đơn hàng: ' + error.message });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (Dành cho Admin)
// @route   PATCH /api/orders/admin/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn: ' + error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
};
