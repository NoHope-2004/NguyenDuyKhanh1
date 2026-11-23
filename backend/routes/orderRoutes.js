const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Tất cả route đơn hàng đều yêu cầu đăng nhập

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', getAllOrdersAdmin);
router.patch('/admin/:id/status', updateOrderStatus);
router.get('/:id', getOrderById);

module.exports = router;
