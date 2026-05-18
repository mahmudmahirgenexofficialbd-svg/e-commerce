import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }

    const adminUser = createdUsers[0]._id;
    const sellerUser = createdUsers[1]._id;

    const sampleProducts = [
      {
        name: 'Premium Wireless Headphones',
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', altText: 'Headphones' }],
        description: 'High-quality audio with noise cancellation.',
        brand: 'TechAudio',
        category: 'electronics',
        price: 4500,
        countInStock: 45,
        rating: 4.8,
        numReviews: 12,
        seller: sellerUser,
        status: 'approved',
      },
      {
        name: 'Minimalist Ceramic Coffee Mug',
        images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop', altText: 'Mug' }],
        description: 'Perfect for your morning brew.',
        brand: 'Home Essentials',
        category: 'home',
        price: 450,
        countInStock: 120,
        rating: 4.5,
        numReviews: 8,
        seller: sellerUser,
        status: 'pending',
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
