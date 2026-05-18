'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingBag, Users, ShoppingCart, 
  Settings, Bell, Search, TrendingUp, Package, CheckCircle, 
  AlertCircle, ChevronDown, Menu, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const API = 'http://localhost:5000/api/admin';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  chartData: { name: string; revenue: number; orders: number }[];
}

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API}/stats`, { credentials: 'include' }),
        fetch(`${API}/orders`, { credentials: 'include' }),
      ]);

      if (statsRes.status === 401 || ordersRes.status === 401) {
        setError('Not authorized. Please log in as Admin first.');
        setIsLoading(false);
        return;
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }
    } catch (err) {
      setError('Could not connect to backend. Make sure it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (n: number) => `৳ ${n.toLocaleString()}`;

  const getOrderStatus = (order: Order) => {
    if (order.isDelivered) return { label: 'Delivered', color: 'text-green-600 bg-green-100' };
    if (order.isPaid) return { label: 'Processing', color: 'text-amber-600 bg-amber-100' };
    return { label: 'Pending', color: 'text-slate-600 bg-slate-100' };
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShoppingBag className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">Antigravity</span>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 overflow-y-auto flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</p>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-xl font-medium smooth-transition">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-medium smooth-transition">
            <ShoppingCart className="h-5 w-5" /> Orders
            {stats && stats.pendingOrders > 0 && (
              <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
            )}
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-medium smooth-transition">
            <Package className="h-5 w-5" /> Products
          </Link>
          <Link href="/customers" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-medium smooth-transition">
            <Users className="h-5 w-5" /> Customers
          </Link>
          
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-6">System</p>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-medium smooth-transition">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-semibold text-primary">AD</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64 smooth-transition text-slate-900"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchAll} title="Refresh" className="text-slate-500 hover:text-primary smooth-transition">
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
            </button>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-sm font-medium">Store Status</span>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
              <p className="text-slate-500 text-sm">Live data from your MongoDB database.</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-24 text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin mr-3" />
              <span className="text-lg">Loading live data...</span>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="admin-card p-6 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats?.totalRevenue || 0)}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <TrendingUp className="text-primary h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">From paid orders only</p>
                </div>

                <div className="admin-card p-6 border-l-4 border-l-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.totalOrders ?? 0}</h3>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <ShoppingCart className="text-purple-500 h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">All time orders</p>
                </div>

                <div className="admin-card p-6 border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Pending Orders</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.pendingOrders ?? 0}</h3>
                    </div>
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <AlertCircle className="text-amber-500 h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">Unpaid & undelivered</p>
                </div>

                <div className="admin-card p-6 border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
                      <h3 className="text-2xl font-bold text-slate-800">{stats?.totalCustomers ?? 0}</h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="text-green-500 h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">Registered customers</p>
                </div>
              </div>

              {/* Charts & Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="admin-card p-6 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Revenue Overview</h3>
                    <span className="text-sm text-slate-400">Last 7 months</span>
                  </div>
                  <div className="h-[300px] w-full">
                    {stats?.chartData && stats.chartData.some(d => d.revenue > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <CartesianGrid vertical={false} stroke="#f1f5f9" />
                          <Tooltip 
                            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#64748b' }}
                            itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col gap-3 text-slate-300">
                        <TrendingUp className="h-12 w-12" />
                        <p className="text-slate-400 font-medium">No paid orders yet — chart will update automatically</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Recent Orders</h3>
                    <Link href="/orders" className="text-sm text-primary hover:text-accent font-medium">View All</Link>
                  </div>
                  <div className="flex flex-col gap-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">No orders yet</p>
                      </div>
                    ) : (
                      orders.slice(0, 6).map((order) => {
                        const status = getOrderStatus(order);
                        return (
                          <div key={order._id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl smooth-transition border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${status.color.split(' ')[1]} ${status.color.split(' ')[0]}`}>
                                {order.isDelivered ? <CheckCircle className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{order.user?.name || 'Guest'}</p>
                                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-800">{formatCurrency(order.totalPrice)}</p>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
