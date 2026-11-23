const Category = require('../models/Category');

// @desc    Lấy danh sách tất cả danh mục
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh mục: ' + error.message });
  }
};

module.exports = {
  getCategories,
};
