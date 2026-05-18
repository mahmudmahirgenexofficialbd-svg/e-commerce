import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/users', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('BeachaKena API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
