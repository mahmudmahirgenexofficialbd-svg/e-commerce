'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  Plus, LogOut, TrendingUp, DollarSign, RefreshCw,
  CheckCircle, Clock, XCircle
} from 'lucide-react';

const API = 'http://localhost:5000/api/seller';

interface Stats {
  productsCount: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  countInStock: number;
  status: string;
  category: string;
}

const SellerSidebar = ({ active }: { active: string }) => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
    <div className="h-20 flex items-center justify-center border-b border-slate-100">
      <span className="text-xl font-bold text-primary">Seller Central</span>
    </div>
    <div className="flex-1 py-6 px-4 flex flex-col gap-2">
      <Link href="/seller" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='dashboard'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}>
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="/seller/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='products'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}>
        <Package className="h-5 w-5" /> My Products
      </Link>
      <Link href="/seller/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='orders'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}>
        <ShoppingCart className="h-5 w-5" /> Orders
      </Link>
      <Link href="/seller/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='settings'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}>
        <Settings className="h-5 w-5" /> Store Settings
      </Link>
    </div>
    <div className="p-4 border-t border-slate-100">
      <Link href="/" className="flex items-center gap-2 text-red-500 font-medium px-4 py-2 hover:bg-red-50 w-full rounded-xl smooth-transition">
        <LogOut className="h-5 w-5" /> Back to Store
      </Link>
    </div>
  </aside>
);

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetch(`${API}/stats`, { credentials: 'include' }),
        fetch(`${API}/products`, { credentials: 'include' }),
      ]);
      if (statsRes.status === 401) {
        setError('Please log in as a Seller account to access this page.');
        return;
      }
      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch {
      setError('Cannot connect to backend. Make sure it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'rejected') return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const statusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SellerSidebar active="dashboard" />

      <main className="flex-1 md:ml-64 overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Seller Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={fetchAll} title="Refresh" className="text-slate-400 hover:text-primary smooth-transition">
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
            </button>
            <Link href="/seller/products/add" className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 smooth-transition">
              <Plus className="h-5 w-5" /> Add Product
            </Link>
          </div>
        </header>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-24 text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin mr-3" />
              <span className="text-lg">Loading your store data...</span>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-xl text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Earnings</p>
                    <h3 className="text-2xl font-bold text-slate-800">৳ {(stats?.totalRevenue || 0).toLocaleString()}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats?.totalOrders || 0}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="bg-purple-100 p-4 rounded-xl text-purple-600">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Active Products</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats?.productsCount || 0}</h3>
                  </div>
                </div>
              </div>

              {/* My Products */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg">My Products</h3>
                  <Link href="/seller/products/add" className="text-primary text-sm font-semibold hover:text-accent flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add New
                  </Link>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No products yet</p>
                    <p className="text-slate-400 text-sm mt-1 mb-6">Start selling by adding your first product</p>
                    <Link href="/seller/products/add" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-light smooth-transition">
                      <Plus className="h-5 w-5" /> Add Your First Product
                    </Link>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-700">Product Name</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Stock</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(product => (
                        <tr key={product._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                          <td className="px-6 py-4 text-slate-500 capitalize">{product.category || '—'}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">৳ {product.price?.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {product.countInStock} left
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusBadge(product.status)}`}>
                              {statusIcon(product.status)} {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
