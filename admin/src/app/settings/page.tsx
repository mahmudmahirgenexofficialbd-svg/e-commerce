'use client';

import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="text-xl font-bold text-slate-800">Antigravity Admin</span>
        </div>
        <div className="flex-1 py-6 px-4 flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
            <Package className="h-5 w-5" /> Products
          </Link>
          <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
            <ShoppingCart className="h-5 w-5" /> Orders
          </Link>
          <Link href="/customers" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
            <Users className="h-5 w-5" /> Customers
          </Link>
          
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-6">System</p>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-xl font-medium">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">System Settings</h1>
        </header>

        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <Settings className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Settings Module</h2>
            <p className="text-slate-500">This module is currently under construction.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
