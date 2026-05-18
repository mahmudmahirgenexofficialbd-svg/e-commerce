'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === 'seller') {
          router.push('/seller');
        } else {
          router.push('/');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/30">
              <ShoppingBag className="text-white h-8 w-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Create Account</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">Join the Antigravity ecosystem</p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary smooth-transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary smooth-transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary smooth-transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary smooth-transition appearance-none"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 smooth-transition disabled:opacity-70 mt-6"
            >
              {isLoading ? 'Creating...' : (
                <>Register <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:text-accent smooth-transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
