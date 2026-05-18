'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Search, User, Heart, ShoppingCart, 
  ChevronRight, Star, Truck, ShieldCheck, Zap, Check, LayoutDashboard, Store
} from 'lucide-react';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';

const products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    category: 'Tech & Audio',
    price: 4500,
    originalPrice: 5600,
    rating: 4.8,
    reviews: 124,
    discount: 20,
    seller: 'TechAudio BD',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Minimalist Ceramic Coffee Mug',
    category: 'Home & Living',
    price: 450,
    originalPrice: null,
    rating: 4.6,
    reviews: 88,
    discount: null,
    seller: 'Home Essentials',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Leather Tote Bag',
    category: 'Fashion',
    price: 2200,
    originalPrice: null,
    rating: 4.9,
    reviews: 212,
    discount: null,
    seller: 'Style House BD',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Smart Watch Series 5',
    category: 'Tech & Wearables',
    price: 8500,
    originalPrice: 10000,
    rating: 4.7,
    reviews: 67,
    discount: 15,
    seller: 'TechAudio BD',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400&auto=format&fit=crop'
  }
];

export default function Home() {
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      seller: product.seller,
      price: product.price,
      image: product.image
    });
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Quick Access Banner */}
      <div className="fixed top-0 w-full z-[60] bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-between">
        <span className="text-slate-400">🛍️ Antigravity Marketplace</span>
        <div className="flex items-center gap-4">
          <Link href="/seller" className="flex items-center gap-1.5 text-slate-300 hover:text-white smooth-transition font-medium">
            <Store className="h-3.5 w-3.5" /> Seller Dashboard
          </Link>
          <span className="text-slate-600">|</span>
          <a href="http://localhost:3002" target="_blank" className="flex items-center gap-1.5 text-slate-300 hover:text-white smooth-transition font-medium">
            <LayoutDashboard className="h-3.5 w-3.5" /> Admin Panel
          </a>
        </div>
      </div>

      {/* Top Navbar */}
      <nav className="fixed w-full z-50 glass" style={{ top: '32px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary p-2 rounded-xl">
                <ShoppingBag className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tight">
                Antigravity
              </span>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group">
                <input 
                  type="text" 
                  placeholder="Search for products, brands and more..." 
                  className="w-full bg-white border border-slate-200 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm smooth-transition group-hover:shadow-md text-slate-900"
                />
                <Search className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                <button className="absolute right-2 top-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-light smooth-transition">
                  Search
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <Link href="/profile" className="text-slate-600 hover:text-primary smooth-transition flex flex-col items-center gap-1">
                <User className="h-5 w-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider hidden md:block">Profile</span>
              </Link>
              <button className="text-slate-600 hover:text-primary smooth-transition flex flex-col items-center gap-1 relative">
                <Heart className="h-5 w-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider hidden md:block">Wishlist</span>
              </button>
              <Link href="/cart" className="text-slate-600 hover:text-primary smooth-transition flex flex-col items-center gap-1 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider hidden md:block">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/20 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          
          <div className="relative z-20 py-24 px-8 md:px-16 md:py-32 flex flex-col items-start justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-primary/20 backdrop-blur-md border border-primary/30 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 flex items-center gap-2"
            >
              <Zap className="h-4 w-4 text-yellow-400" /> Flash Sale is Live!
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white max-w-2xl leading-tight mb-6"
            >
              Elevate Your Lifestyle with Premium Goods.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-200 text-lg md:text-xl max-w-xl mb-10"
            >
              Discover curated collections from top brands with fast delivery across Bangladesh.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4"
            >
              <button className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-primary/30 smooth-transition flex items-center gap-2">
                Shop Now <ChevronRight className="h-5 w-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg smooth-transition">
                View Deals
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-primary/30 hover:shadow-md smooth-transition">
            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-primary group-hover:text-white text-primary smooth-transition">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Nationwide Delivery</h3>
              <p className="text-sm text-slate-500">Fast shipping across BD</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-primary/30 hover:shadow-md smooth-transition">
            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-primary group-hover:text-white text-primary smooth-transition">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Secure Payment</h3>
              <p className="text-sm text-slate-500">SSLCommerz & COD support</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-primary/30 hover:shadow-md smooth-transition">
            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-primary group-hover:text-white text-primary smooth-transition">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Premium Quality</h3>
              <p className="text-sm text-slate-500">Verified authentic sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Trending Products</h2>
            <p className="text-slate-500">Explore our most popular picks of the week.</p>
          </div>
          <button className="text-primary font-semibold hover:text-accent flex items-center gap-1 smooth-transition">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl smooth-transition">
              <div className="relative h-64 bg-slate-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                />
                <div className="absolute top-3 right-3">
                  <button className="bg-white/80 backdrop-blur p-2 rounded-full text-slate-600 hover:text-red-500 hover:bg-white smooth-transition">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                {product.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-slate-500 font-medium">{product.rating} ({product.reviews} reviews)</span>
                </div>
                <h3 className="font-semibold text-slate-800 text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{product.category}</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-primary font-bold text-lg">৳ {product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="text-slate-400 text-sm line-through">৳ {product.originalPrice.toLocaleString()}</span>}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`p-2.5 rounded-xl smooth-transition ${
                      addedIds.includes(product.id) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'
                    }`}
                    title="Add to Cart"
                  >
                    {addedIds.includes(product.id) ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
