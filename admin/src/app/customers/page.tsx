'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Trash2, Search, Mail, Phone, MapPin, Shield } from 'lucide-react';

const API = 'http://localhost:5000/api/admin';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
}

const Sidebar = ({ active }: { active: string }) => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
    <div className="h-16 flex items-center px-6 border-b border-slate-100">
      <span className="text-xl font-bold text-slate-800">Antigravity Admin</span>
    </div>
    <div className="flex-1 py-6 px-4 flex flex-col gap-1">
      <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium ${active==='dashboard'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-100'}`}>
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium ${active==='products'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-100'}`}>
        <Package className="h-5 w-5" /> Products
      </Link>
      <Link href="/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium ${active==='orders'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-100'}`}>
        <ShoppingCart className="h-5 w-5" /> Orders
      </Link>
      <Link href="/customers" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium ${active==='customers'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-100'}`}>
        <Users className="h-5 w-5" /> Customers
      </Link>
    </div>
  </aside>
);

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/users`, { credentials: 'include' });
      if (res.ok) setUsers(await res.json());
      else setError('Not authorized. Log in as Admin first.');
    } catch { setError('Cannot connect to backend.'); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`${API}/users/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      setUsers(u => u.filter(u => u._id !== id));
      if (selected?._id === id) setSelected(null);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (role: string) => {
    if (role === 'admin') return 'bg-red-100 text-red-700';
    if (role === 'seller') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar active="customers" />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Customer Directory</h1>
          <span className="text-sm text-slate-500">{users.length} total users</span>
        </header>

        <div className="flex-1 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">⚠️ {error}</div>}

          <div className="flex gap-6">
            {/* User List */}
            <div className="flex-1">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or role..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                  <div className="p-12 text-center text-slate-400">Loading customers...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">No customers found.</div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">Joined</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(user => (
                        <tr key={user._id} className="hover:bg-slate-50 cursor-pointer smooth-transition" onClick={() => setSelected(user)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${roleColor(user.role)}`}>{user.role}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={e => { e.stopPropagation(); handleDelete(user._id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg smooth-transition">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* User Detail Panel */}
            {selected && (
              <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">User Details</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-3">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{selected.name}</h4>
                  <span className={`mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${roleColor(selected.role)}`}>{selected.role}</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-slate-800 font-medium break-all">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-slate-800 font-medium">{selected.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Verified</p>
                      <p className={`font-medium ${selected.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                        {selected.isVerified ? '✅ Verified' : '⏳ Not Verified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Joined</p>
                      <p className="text-slate-800 font-medium">{new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleDelete(selected._id)} className="mt-6 w-full flex items-center justify-center gap-2 text-red-500 border border-red-200 hover:bg-red-50 py-2 rounded-xl smooth-transition text-sm font-medium">
                  <Trash2 className="h-4 w-4" /> Delete User
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
