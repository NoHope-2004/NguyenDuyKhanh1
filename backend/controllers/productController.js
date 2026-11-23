const Product = require('../models/Product');

// @desc    Lấy danh sách sản phẩm (có tìm kiếm, lọc danh mục, sắp xếp)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, categoryId, sort } = req.query;

    const query = {};

    // Tìm kiếm theo tên hoặc thương hiệu
    if (search && search.trim() !== '') {
      const keyword = search.trim();
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Lọc theo danh mục
    if (categoryId && categoryId.trim() !== '') {
      query.categoryId = categoryId;
    }

    // Xử lý sắp xếp
    let sortOption = { createdAt: -1 }; // Mặc định mới nhất
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    }

    const products = await Product.find(query)
      .populate('categoryId', 'name image')
      .sort(sortOption);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm: ' + error.message });
  }
};

// @desc    Lấy chi tiết 1 sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name image');

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết sản phẩm: ' + error.message });
  }
};

// @desc    Thêm sản phẩm mới (Dành cho Admin)
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, categoryId, brand, price, unit, stock, image, description } = req.body;

    if (!name || !categoryId || !brand || !price || !unit || !image) {
      return res.status(400).json({ message: 'Vui lòng điền các trường thông tin bắt buộc' });
    }

    const newProduct = await Product.create({
      name,
      categoryId,
      brand,
      price: Number(price),
      unit,
      stock: Number(stock) || 100,
      image,
      description: description || 'Sản phẩm vật liệu xây dựng chất lượng cao tại VLXD Hub.',
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm sản phẩm: ' + error.message });
  }
};

// @desc    Cập nhật sản phẩm (Dành cho Admin)
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.categoryId && typeof updateData.categoryId === 'object') {
      updateData.categoryId = updateData.categoryId._id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('LỖI CẬP NHẬT SẢN PHẨM:', error);
    res.status(500).json({ message: 'Lỗi cập nhật sản phẩm: ' + error.message });
  }
};

// @desc    Xóa sản phẩm (Dành cho Admin)
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(200).json({ message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa sản phẩm: ' + error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
