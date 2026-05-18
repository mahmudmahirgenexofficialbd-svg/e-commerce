import express from 'express';
import SSLCommerzPayment from 'sslcommerz-lts';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const store_id = process.env.STORE_ID || 'testbox';
const store_passwd = process.env.STORE_PASSWORD || 'qwerty';
const is_live = false; // true for live, false for sandbox

// @desc    Initialize SSLCommerz Payment
// @route   POST /api/payments/init
// @access  Private
router.post('/init', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'name email phone address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const tran_id = `REF-${Math.floor(Math.random() * 10000000)}`;

    const data = {
      total_amount: order.totalPrice,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `http://localhost:5000/api/payments/success/${tran_id}`,
      fail_url: `http://localhost:5000/api/payments/fail/${tran_id}`,
      cancel_url: `http://localhost:5000/api/payments/cancel/${tran_id}`,
      ipn_url: 'http://localhost:5000/api/payments/ipn',
      shipping_method: 'Courier',
      product_name: 'BeachaKena Store Products',
      product_category: 'General',
      product_profile: 'general',
      cus_name: order.user.name,
      cus_email: order.user.email,
      cus_add1: order.shippingAddress.address,
      cus_city: order.shippingAddress.city,
      cus_postcode: order.shippingAddress.postalCode,
      cus_country: 'Bangladesh',
      cus_phone: order.user.phone || '01711111111',
      ship_name: order.user.name,
      ship_add1: order.shippingAddress.address,
      ship_city: order.shippingAddress.city,
      ship_postcode: order.shippingAddress.postalCode,
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    
    // Redirect URL to SSLCommerz gateway
    if (apiResponse?.GatewayPageURL) {
      // Save tran_id in order for verification later
      order.paymentResult = { id: tran_id, status: 'PENDING' };
      await order.save();
      
      return res.status(200).json({ url: apiResponse.GatewayPageURL });
    } else {
      return res.status(400).json({ message: 'Session was not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Payment Success Callback
// @route   POST /api/payments/success/:tran_id
// @access  Public (Callback from SSLCommerz)
router.post('/success/:tran_id', async (req, res) => {
  const { tran_id } = req.params;
  
  const order = await Order.findOne({ 'paymentResult.id': tran_id });
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: tran_id,
      status: 'VALID',
      update_time: Date.now().toString(),
      email_address: req.body.cus_email,
    };
    await order.save();
    
    // Redirect user to frontend success page
    res.redirect(`http://localhost:3000/order/${order._id}?status=success`);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// @desc    Payment Fail Callback
// @route   POST /api/payments/fail/:tran_id
// @access  Public
router.post('/fail/:tran_id', async (req, res) => {
  const { tran_id } = req.params;
  const order = await Order.findOne({ 'paymentResult.id': tran_id });
  if (order) {
    order.paymentResult.status = 'FAILED';
    await order.save();
    res.redirect(`http://localhost:3000/order/${order._id}?status=fail`);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

export default router;
