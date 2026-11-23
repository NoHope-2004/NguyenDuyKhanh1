require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Khởi tạo database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware chung
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Định tuyến API theo chuẩn REST
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'VLXD Hub Backend is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.send('VLXD Hub API Server is Active. Access /api/health to verify status.');
});

// Khởi động server (0.0.0.0 để điện thoại cùng Wi-Fi truy cập được)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VLXD Hub API] Server listening on http://localhost:${PORT}`);
    console.log(`[VLXD Hub API] Health check at http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
