# Antigravity E-Commerce Platform

A premium B2B & B2C E-Commerce Platform tailored for Bangladesh. Built with Next.js, Node.js, Express, MongoDB, and Tailwind CSS. Inspired by top platforms like Daraz, featuring a stunning "Sky Blue" and "White" aesthetic with glassmorphism touches.

## Project Structure

```
antigravity/
├── frontend/               # B2C & B2B Next.js Storefront (Customer & Seller UI)
├── admin/                  # Next.js Admin Dashboard (Owner UI)
└── backend/                # Node.js + Express REST API (MongoDB)
```

## Tech Stack

### Frontend & Admin
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Premium aesthetic, Glassmorphism)
- **Icons & Animation**: Lucide React, Framer Motion
- **Charts**: Recharts (Admin)
- **Language**: TypeScript

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT & Bcrypt (HttpOnly Cookies)
- **Payment**: SSLCommerz Integration (Pending module) & COD

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

## Features Complete 🚀
1. **Full Workspace Initialization**: Setup of frontend, backend, and admin repos.
2. **Backend Architecture**: MongoDB Models (User, Product, Order) and JWT Auth controllers.
3. **Frontend Premium Landing Page**: Incredible, dynamic hero section, product grid, navigation bar with glassmorphism.
4. **Admin Dashboard UI**: Professional sidebar navigation, responsive topbar, and real-time revenue/order charts built with Recharts.
5. **Frontend API Integrations**: Login/Registration forms perfectly wired to the Express backend.
6. **SSLCommerz Gateway**: Fully set up Payment Routes for Sandbox/Live IPN Callbacks (Init, Success, Fail, Cancel).
7. **Seller Dashboard**: Created the minimal and modern React-based Seller Dashboard and dedicated backend APIs.
8. **Admin Product Approval**: Built `adminRoutes.js` and a fully interactive Admin Product Management UI with Recharts and Tailwind.
9. **Cart & Checkout Flow**: Designed a stunning Cart and SSLCommerz Checkout UI in the Next.js frontend.
10. **Seller Product Upload**: Refined the Seller product upload form with image previews and B2B pricing inputs.
11. **API Wiring**: Successfully connected the React states in the Seller Product Upload, Admin Products Dashboard, and Checkout pages directly to the corresponding Express/MongoDB backend APIs.

*Status: The foundational B2B/B2C E-commerce platform is now fully structured, styled, and wired up!*
