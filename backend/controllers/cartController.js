const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Lấy giỏ hàng của user hiện tại
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.productId',
      select: 'name price image unit stock brand',
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Lọc bỏ những sản phẩm đã bị xóa khỏi hệ thống nếu có
    const validItems = cart.items.filter((item) => item.productId !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Tính tổng tiền giỏ hàng
    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);

    res.status(200).json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice,
      totalCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy giỏ hàng: ' + error.message });
  }
};

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Thiếu mã sản phẩm' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Đã có trong giỏ -> tăng số lượng
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Chưa có -> thêm mới
      cart.items.push({ productId, quantity: Number(quantity) });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // Trả về giỏ hàng mới nhất đã populate
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm vào giỏ hàng: ' + error.message });
  }
};

// @desc    Cập nhật số lượng sản phẩm trong giỏ hàng
// @route   PATCH /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    if (Number(quantity) <= 0) {
      // Nếu số lượng <= 0 thì xóa khỏi giỏ
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    cart.updatedAt = Date.now();
    await cart.save();

    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật giỏ hàng: ' + error.message });
  }
};

// @desc    Xóa sản phẩm khỏi giỏ hàng
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    cart.updatedAt = Date.now();
    await cart.save();

    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa khỏi giỏ hàng: ' + error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
