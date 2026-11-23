const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Cart = require('../models/Cart');

// Hàm tạo JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vlxd_hub_secret_key_2026_super_secure', {
    expiresIn: '7d',
  });
};

// @desc    Đăng ký tài khoản
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    // Kiểm tra email trùng
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng bởi tài khoản khác' });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      passwordHash,
    });

    // Tạo giỏ hàng rỗng cho user
    await Cart.create({
      userId: user._id,
      items: [],
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký: ' + error.message });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập: ' + error.message });
  }
};

// @desc    Lấy thông tin tài khoản hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông tin tài khoản: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
