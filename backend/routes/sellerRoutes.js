import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private/Seller
router.get('/products', protect, seller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new product
// @route   POST /api/seller/products
// @access  Private/Seller
router.post('/products', protect, seller, async (req, res) => {
  try {
    const { name, price, description, category, countInStock, images } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      countInStock,
      images: images || [],
      seller: req.user._id,
      status: 'pending', // Requires Admin approval
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get orders for seller's products
// @route   GET /api/seller/orders
// @access  Private/Seller
router.get('/orders', protect, seller, async (req, res) => {
  try {
    // Find orders that contain at least one item from this seller
    const orders = await Order.find({ 'orderItems.seller': req.user._id })
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
      
    // Filter out items in the order that don't belong to the seller
    const sellerOrders = orders.map(order => {
      const filteredItems = order.orderItems.filter(
        item => item.seller.toString() === req.user._id.toString()
      );
      return {
        ...order._doc,
        orderItems: filteredItems
      };
    });

    res.json(sellerOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/stats
// @access  Private/Seller
router.get('/stats', protect, seller, async (req, res) => {
  try {
    const productsCount = await Product.countDocuments({ seller: req.user._id });
    const orders = await Order.find({ 'orderItems.seller': req.user._id });
    
    let totalRevenue = 0;
    let pendingOrders = 0;

    orders.forEach(order => {
      if (order.status === 'Pending') pendingOrders++;
      
      const sellerItems = order.orderItems.filter(
        item => item.seller.toString() === req.user._id.toString()
      );
      
      sellerItems.forEach(item => {
        if (order.isPaid) {
          totalRevenue += (item.price * item.qty);
        }
      });
    });

    res.json({
      productsCount,
      totalOrders: orders.length,
      pendingOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
