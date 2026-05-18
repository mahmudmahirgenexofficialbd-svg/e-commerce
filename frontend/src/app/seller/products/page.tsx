'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

const API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/seller`;

const SellerSidebar = ({ active }: { active: string }) => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
    <div className="h-20 flex items-center justify-center border-b border-slate-100">
      <span className="text-xl font-bold text-primary">Seller Central</span>
    </div>
    <div className="flex-1 py-6 px-4 flex flex-col gap-2">
      <Link href="/seller" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='dashboard'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
      <Link href="/seller/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='products'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><Package className="h-5 w-5" /> My Products</Link>
      <Link href="/seller/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='orders'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><ShoppingCart className="h-5 w-5" /> Orders</Link>
    </div>
    <div className="p-4 border-t border-slate-100">
      <Link href="/" className="flex items-center gap-2 text-red-500 font-medium px-4 py-2 hover:bg-red-50 w-full rounded-xl smooth-transition"><LogOut className="h-5 w-5" /> Back to Store</Link>
    </div>
  </aside>
);

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/products`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setProducts)
      .catch(e => setError(e === 401 ? 'Please log in as a Seller.' : 'Cannot connect to backend.'))
      .finally(() => setIsLoading(false));
  }, []);

  const statusBadge = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SellerSidebar active="products" />
      <main className="flex-1 md:ml-64">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">My Products</h1>
          <Link href="/seller/products/add" className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 smooth-transition">
            <Plus className="h-5 w-5" /> Add Product
          </Link>
        </header>
        <div className="p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">⚠️ {error}</div>}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">Loading your products...</div>
            ) : products.length === 0 ? (
              <div className="p-16 text-center">
                <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium mb-2">No products yet</p>
                <Link href="/seller/products/add" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-light smooth-transition">
                  <Plus className="h-5 w-5" /> Add Your First Product
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Stock</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                      <td className="px-6 py-4 text-slate-500 capitalize">{p.category || '—'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">৳ {p.price?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.countInStock} left
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusBadge(p.status)}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
