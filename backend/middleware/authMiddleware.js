const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vlxd_hub_secret_key_2026_super_secure');

      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return res.status(401).json({ message: 'Tài khoản không tồn tại hoặc đã bị khóa' });
      }

      next();
    } catch (error) {
      console.error('Lỗi xác thực JWT:', error.message);
      return res.status(401).json({ message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Chưa có mã xác thực (Token), vui lòng đăng nhập' });
  }
};

module.exports = { protect };
