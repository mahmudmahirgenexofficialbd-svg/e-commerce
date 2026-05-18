'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Edit2, Trash2, CheckCircle, XCircle, 
  LayoutDashboard, Package, ShoppingCart, Users, Save, X 
} from 'lucide-react';

const API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin`;

interface Product {
  _id: string;
  name: string;
  seller: { name: string } | null;
  price: number;
  countInStock: number;
  status: string;
  description?: string;
}

const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
    <div className="h-16 flex items-center px-6 border-b border-slate-100">
      <span className="text-xl font-bold text-slate-800">বেচা-কেনা Admin</span>
    </div>
    <div className="flex-1 py-6 px-4 flex flex-col gap-1">
      <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
      <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium bg-primary/10 text-primary"><Package className="h-5 w-5" /> Products</Link>
      <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"><ShoppingCart className="h-5 w-5" /> Orders</Link>
      <Link href="/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"><Users className="h-5 w-5" /> Customers</Link>
    </div>
  </aside>
);

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, countInStock: 0, description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/products`, { credentials: 'include' });
      if (res.ok) setProducts(await res.json());
      else setError('Not authorized. Log in as Admin first.');
    } catch { setError('Cannot connect to backend.'); }
    finally { setIsLoading(false); }
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setEditForm({ name: product.name, price: product.price, countInStock: product.countInStock, description: product.description || '' });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updated } : p));
        setEditingId(null);
      }
    } catch { } finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`${API}/products/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setProducts(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    const res = await fetch(`${API}/products/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) setProducts(prev => prev.filter(p => p._id !== id));
  };

  const filtered = products
    .filter(p => activeTab === 'all' || p.status === activeTab)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.seller?.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Product Management</h1>
          <span className="text-sm text-slate-500">{products.length} total products</span>
        </header>

        <div className="flex-1 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">⚠️ {error}</div>}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex bg-white border border-slate-200 p-1 rounded-xl gap-1">
              {['all', 'pending', 'approved', 'rejected'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize smooth-transition ${activeTab === tab ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                >{tab} {tab === 'pending' && products.filter(p => p.status === 'pending').length > 0 && `(${products.filter(p => p.status === 'pending').length})`}</button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">Loading products...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No products found in this category.</div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Seller</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((product) => (
                    <>
                      <tr key={product._id} className="hover:bg-slate-50/50 smooth-transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                            <span className="font-medium text-slate-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.seller?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">৳ {product.price?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.countInStock} left
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${product.status === 'approved' ? 'bg-green-100 text-green-600' : product.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {product.status === 'pending' && (
                              <>
                                <button onClick={() => handleStatusChange(product._id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle className="h-5 w-5" /></button>
                                <button onClick={() => handleStatusChange(product._id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"><XCircle className="h-5 w-5" /></button>
                              </>
                            )}
                            <button onClick={() => editingId === product._id ? setEditingId(null) : startEdit(product)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg" title="Edit">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline Edit Row */}
                      {editingId === product._id && (
                        <tr key={`edit-${product._id}`} className="bg-primary/5 border-b border-primary/20">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Product Name</label>
                                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Price (৳)</label>
                                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: +e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Stock Count</label>
                                <input type="number" value={editForm.countInStock} onChange={e => setEditForm({ ...editForm, countInStock: +e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                              </div>
                              <div className="flex items-end gap-2">
                                <button onClick={() => saveEdit(product._id)} disabled={saving}
                                  className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light smooth-transition disabled:opacity-60">
                                  <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button onClick={() => setEditingId(null)}
                                  className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 smooth-transition">
                                  <X className="h-4 w-4" /> Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
