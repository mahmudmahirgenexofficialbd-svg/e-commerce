'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Search, CheckCircle, Truck, XCircle } from 'lucide-react';

const API = 'http://localhost:5000/api/admin';

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  orderItems: { name: string; qty: number; price: number }[];
  shippingAddress: { address: string; city: string; postalCode: string };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

const Sidebar = ({ active }: { active: string }) => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
    <div className="h-16 flex items-center px-6 border-b border-slate-100">
      <span className="text-xl font-bold text-slate-800">বেচা-কেনা Admin</span>
    </div>
    <div className="flex-1 py-6 px-4 flex flex-col gap-1">
      <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100`}>
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100`}>
        <Package className="h-5 w-5" /> Products
      </Link>
      <Link href="/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium bg-primary/10 text-primary`}>
        <ShoppingCart className="h-5 w-5" /> Orders
      </Link>
      <Link href="/customers" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100`}>
        <Users className="h-5 w-5" /> Customers
      </Link>
    </div>
  </aside>
);

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/orders`, { credentials: 'include' });
      if (res.ok) setOrders(await res.json());
      else setError('Not authorized. Log in as Admin first.');
    } catch { setError('Cannot connect to backend.'); }
    finally { setIsLoading(false); }
  };

  const updateOrder = async (id: string, updates: Partial<{ isPaid: boolean; isDelivered: boolean }>) => {
    setUpdating(true);
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o._id === id ? { ...o, ...updated } : o));
        setSelected(prev => prev?._id === id ? { ...prev, ...updated } : prev);
      }
    } catch { } finally { setUpdating(false); }
  };

  const filtered = orders.filter(o =>
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o._id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (order: Order) => {
    if (order.isDelivered) return { label: 'Delivered', cls: 'bg-green-100 text-green-700' };
    if (order.isPaid) return { label: 'Processing', cls: 'bg-amber-100 text-amber-700' };
    return { label: 'Pending', cls: 'bg-slate-100 text-slate-600' };
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar active="orders" />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Order Management</h1>
          <span className="text-sm text-slate-500">{orders.length} total orders</span>
        </header>

        <div className="flex-1 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">⚠️ {error}</div>}

          <div className="flex gap-6">
            {/* Orders List */}
            <div className="flex-1">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search by customer name or order ID..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                  <div className="p-12 text-center text-slate-400">Loading orders...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No orders yet</p>
                    <p className="text-slate-400 text-sm mt-1">Orders will appear here when customers check out</p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Total</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(order => {
                        const status = getStatus(order);
                        return (
                          <tr key={order._id} onClick={() => setSelected(order)} className="hover:bg-slate-50 cursor-pointer smooth-transition">
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">{order.user?.name || 'Guest'}</td>
                            <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">৳ {order.totalPrice?.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.cls}`}>{status.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Order Detail Panel */}
            {selected && (
              <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Order Details</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
                </div>

                <div className="text-xs font-mono text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                  ID: #{selected._id.slice(-12).toUpperCase()}
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Customer</p>
                  <p className="font-bold text-slate-800">{selected.user?.name || 'Guest'}</p>
                  <p className="text-sm text-slate-500">{selected.user?.email || '—'}</p>
                </div>

                {selected.shippingAddress && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Delivery Address</p>
                    <p className="text-sm text-slate-700">{selected.shippingAddress.address}, {selected.shippingAddress.city} {selected.shippingAddress.postalCode}</p>
                  </div>
                )}

                {selected.orderItems && selected.orderItems.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Items</p>
                    <div className="space-y-2">
                      {selected.orderItems.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-700">{item.name} <span className="text-slate-400">×{item.qty}</span></span>
                          <span className="font-medium text-slate-800">৳ {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-primary text-lg">৳ {selected.totalPrice?.toLocaleString()}</span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Update Status</p>
                  <div className="space-y-2">
                    <button
                      disabled={selected.isPaid || updating}
                      onClick={() => updateOrder(selected._id, { isPaid: true })}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold smooth-transition ${selected.isPaid ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-light'}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {selected.isPaid ? '✅ Marked as Paid' : 'Mark as Paid'}
                    </button>
                    <button
                      disabled={selected.isDelivered || updating}
                      onClick={() => updateOrder(selected._id, { isDelivered: true })}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold smooth-transition ${selected.isDelivered ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                      <Truck className="h-4 w-4" />
                      {selected.isDelivered ? '✅ Delivered' : 'Mark as Delivered'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
