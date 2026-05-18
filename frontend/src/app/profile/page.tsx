'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Phone, LogOut, Package } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/users/logout', { method: 'POST', credentials: 'include' });
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <Link href="/" className="text-primary hover:text-accent font-medium">
            &larr; Back to Store
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                <p className="text-slate-500 capitalize">{profile.role} Account</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${profile.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {profile.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <span>{profile.phone || 'No phone number added'}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="h-5 w-5 text-slate-400 mt-1" />
                  <span>
                    {profile.address?.street ? (
                      <>{profile.address.street}<br/>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</>
                    ) : 'No address added'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex gap-4">
              <button className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 smooth-transition">
                Edit Profile
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-6 py-2.5 rounded-xl font-semibold smooth-transition">
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
