import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all products (including pending ones)
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update product status (Approve/Reject)
// @route   PUT /api/admin/products/:id/status
// @access  Private/Admin
router.put('/products/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.status = status;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product completely
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
router.put('/orders/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (req.body.isPaid !== undefined) {
        order.isPaid = req.body.isPaid;
        order.paidAt = req.body.isPaid ? Date.now() : undefined;
      }
      if (req.body.isDelivered !== undefined) {
        order.isDelivered = req.body.isDelivered;
        order.deliveredAt = req.body.isDelivered ? Date.now() : undefined;
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update product details
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put('/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name ?? product.name;
      product.price = req.body.price ?? product.price;
      product.countInStock = req.body.countInStock ?? product.countInStock;
      product.description = req.body.description ?? product.description;
      product.status = req.body.status ?? product.status;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ isDelivered: false, isPaid: false });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly revenue for chart (last 7 months)
    const months = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const result = await Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } }
      ]);
      months.push({
        name: date.toLocaleString('default', { month: 'short' }),
        revenue: result[0]?.revenue || 0,
        orders: result[0]?.orders || 0,
      });
    }

    res.json({ totalRevenue, totalOrders, pendingOrders, totalCustomers, chartData: months });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
