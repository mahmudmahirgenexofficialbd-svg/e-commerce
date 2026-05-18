import bcrypt from 'bcrypt';

const users = [
  {
    name: 'Admin User',
    email: 'admin@beachakena.com',
    password: 'password123',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'TechAudio BD Seller',
    email: 'seller@beachakena.com',
    password: 'password123',
    role: 'seller',
    isVerified: true,
  },
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
    isVerified: true,
  },
];

export default users;
