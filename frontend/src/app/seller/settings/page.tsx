'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, LogOut, CheckCircle, Building2, Wallet, CreditCard } from 'lucide-react';

const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 smooth-transition placeholder:text-slate-400";

const SellerSidebar = ({ active }: { active: string }) => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
    <div className="h-20 flex items-center justify-center border-b border-slate-100">
      <span className="text-xl font-bold text-primary">Seller Central</span>
    </div>
    <div className="flex-1 py-6 px-4 flex flex-col gap-2">
      <Link href="/seller" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='dashboard'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
      <Link href="/seller/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='products'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><Package className="h-5 w-5" /> My Products</Link>
      <Link href="/seller/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='orders'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><ShoppingCart className="h-5 w-5" /> Orders</Link>
      <Link href="/seller/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold smooth-transition ${active==='settings'?'bg-primary/10 text-primary':'text-slate-600 hover:bg-slate-50'}`}><Wallet className="h-5 w-5" /> Withdraw & Settings</Link>
    </div>
    <div className="p-4 border-t border-slate-100">
      <Link href="/" className="flex items-center gap-2 text-red-500 font-medium px-4 py-2 hover:bg-red-50 w-full rounded-xl smooth-transition"><LogOut className="h-5 w-5" /> Back to Store</Link>
    </div>
  </aside>
);

function BkashLogo() {
  return (
    <div className="h-8 px-3 rounded-lg flex items-center justify-center" style={{ background: '#E2136E' }}>
      <svg viewBox="0 0 80 34" className="h-full w-auto" fill="none">
        <polygon points="8,26 20,8 24,20" fill="white" opacity="0.9"/>
        <polygon points="20,8 33,24 24,20" fill="white" opacity="0.7"/>
        <polygon points="24,20 33,24 28,30" fill="white" opacity="0.8"/>
        <text x="37" y="22" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">bKash</text>
      </svg>
    </div>
  );
}

function NagadLogo() {
  return (
    <div className="h-8 px-3 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F26522 0%, #EE3124 100%)' }}>
      <svg viewBox="0 0 90 34" className="h-full w-auto" fill="none">
        <circle cx="18" cy="17" r="12" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="17" r="6" fill="white" opacity="0.9"/>
        <circle cx="18" cy="17" r="3" fill="#F26522"/>
        <text x="35" y="22" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">Nagad</text>
      </svg>
    </div>
  );
}

type Method = 'bkash' | 'nagad' | 'bank';

export default function SellerSettingsPage() {
  const [method, setMethod] = useState<Method>('bkash');
  const [saved, setSaved] = useState(false);

  // bKash fields
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashName, setBkashName] = useState('');

  // Nagad fields
  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadName, setNagadName] = useState('');

  // Bank fields
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSaveMethod = () => {
    setError('');
    if (method === 'bkash' && (!bkashNumber || !bkashName)) {
      setError('Please fill in your bKash number and account name.');
      return;
    }
    if (method === 'nagad' && (!nagadNumber || !nagadName)) {
      setError('Please fill in your Nagad number and account name.');
      return;
    }
    if (method === 'bank' && (!bankAccountNumber || !bankAccountName || !bankName || !branchName)) {
      setError('Please fill in all required bank details.');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleWithdraw = () => {
    setError('');
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }
    if (method === 'bkash' && (!bkashNumber || !bkashName)) {
      setError('Please save your bKash details first before requesting a withdrawal.');
      return;
    }
    if (method === 'nagad' && (!nagadNumber || !nagadName)) {
      setError('Please save your Nagad details first before requesting a withdrawal.');
      return;
    }
    if (method === 'bank' && (!bankAccountNumber || !bankAccountName || !bankName || !branchName)) {
      setError('Please save your bank details first before requesting a withdrawal.');
      return;
    }
    setSubmitted(true);
    setWithdrawAmount('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SellerSidebar active="settings" />
      <main className="flex-1 md:ml-64">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Withdraw Earnings</h1>
        </header>

        <div className="p-8 max-w-3xl">

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">⚠️ {error}</div>}
          {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm font-medium">✅ Payment method saved successfully!</div>}
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-5 mb-6 font-medium">
              <p className="text-lg font-bold mb-1">✅ Withdrawal Request Submitted!</p>
              <p className="text-sm">Your request has been sent to the admin for processing. Funds will be transferred within 1–3 business days.</p>
            </div>
          )}

          {/* Method Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Choose Withdrawal Method</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* bKash */}
              <button onClick={() => { setMethod('bkash'); setError(''); }}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 smooth-transition ${method === 'bkash' ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <BkashLogo />
                <span className={`text-sm font-semibold ${method === 'bkash' ? 'text-pink-600' : 'text-slate-600'}`}>bKash</span>
                {method === 'bkash' && <CheckCircle className="h-4 w-4 text-pink-500" />}
              </button>

              {/* Nagad */}
              <button onClick={() => { setMethod('nagad'); setError(''); }}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 smooth-transition ${method === 'nagad' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-300' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <NagadLogo />
                <span className={`text-sm font-semibold ${method === 'nagad' ? 'text-orange-600' : 'text-slate-600'}`}>Nagad</span>
                {method === 'nagad' && <CheckCircle className="h-4 w-4 text-orange-500" />}
              </button>

              {/* Bank */}
              <button onClick={() => { setMethod('bank'); setError(''); }}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 smooth-transition ${method === 'bank' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <div className="h-8 px-3 rounded-lg flex items-center justify-center bg-blue-700">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className={`text-sm font-semibold ${method === 'bank' ? 'text-blue-700' : 'text-slate-600'}`}>Bank Transfer</span>
                {method === 'bank' && <CheckCircle className="h-4 w-4 text-blue-500" />}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            {/* bKash Form */}
            {method === 'bkash' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <BkashLogo />
                  <div>
                    <h2 className="font-bold text-slate-800 text-lg">bKash Account Details</h2>
                    <p className="text-sm text-slate-500">Enter your bKash personal/agent number</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">bKash Account Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={bkashNumber} onChange={e => setBkashNumber(e.target.value)}
                      placeholder="01XXXXXXXXX" maxLength={11} className={inputClass} />
                    <p className="text-xs text-slate-400 mt-1">Must be a valid 11-digit Bangladeshi mobile number</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Holder Name <span className="text-red-500">*</span></label>
                    <input type="text" value={bkashName} onChange={e => setBkashName(e.target.value)}
                      placeholder="Full name as registered in bKash" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Nagad Form */}
            {method === 'nagad' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <NagadLogo />
                  <div>
                    <h2 className="font-bold text-slate-800 text-lg">Nagad Account Details</h2>
                    <p className="text-sm text-slate-500">Enter your Nagad personal number</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nagad Account Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={nagadNumber} onChange={e => setNagadNumber(e.target.value)}
                      placeholder="01XXXXXXXXX" maxLength={11} className={inputClass} />
                    <p className="text-xs text-slate-400 mt-1">Must be a valid 11-digit Bangladeshi mobile number</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Holder Name <span className="text-red-500">*</span></label>
                    <input type="text" value={nagadName} onChange={e => setNagadName(e.target.value)}
                      placeholder="Full name as registered in Nagad" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Form */}
            {method === 'bank' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-10 rounded-lg bg-blue-700 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-lg">Bank Account Details</h2>
                    <p className="text-sm text-slate-500">Enter your bank transfer information</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Holder Name <span className="text-red-500">*</span></label>
                    <input type="text" value={bankAccountName} onChange={e => setBankAccountName(e.target.value)}
                      placeholder="Full name as on bank account" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Number <span className="text-red-500">*</span></label>
                    <input type="text" value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)}
                      placeholder="e.g. 1234567890123" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Name <span className="text-red-500">*</span></label>
                    <select value={bankName} onChange={e => setBankName(e.target.value)} className={`${inputClass} appearance-none`}>
                      <option value="">Select Bank</option>
                      <option>Dutch-Bangla Bank (DBBL)</option>
                      <option>BRAC Bank</option>
                      <option>Islami Bank Bangladesh</option>
                      <option>Sonali Bank</option>
                      <option>Janata Bank</option>
                      <option>Agrani Bank</option>
                      <option>Rupali Bank</option>
                      <option>Eastern Bank (EBL)</option>
                      <option>Pubali Bank</option>
                      <option>Mutual Trust Bank (MTB)</option>
                      <option>Standard Chartered Bank</option>
                      <option>City Bank</option>
                      <option>Prime Bank</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Branch Name <span className="text-red-500">*</span></label>
                    <input type="text" value={branchName} onChange={e => setBranchName(e.target.value)}
                      placeholder="e.g. Gulshan Branch" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Routing Number <span className="text-slate-400 font-normal">(optional)</span></label>
                    <input type="text" value={routingNumber} onChange={e => setRoutingNumber(e.target.value)}
                      placeholder="9-digit routing number" maxLength={9} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleSaveMethod}
              className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-semibold smooth-transition flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> Save Payment Details
            </button>
          </div>

          {/* Withdraw Request */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Request Withdrawal
            </h2>
            <p className="text-sm text-slate-500 mb-5">Enter the amount you'd like to withdraw to your selected payment method.</p>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">৳</span>
                <input type="number" min="1" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button onClick={handleWithdraw}
                className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 smooth-transition whitespace-nowrap">
                Withdraw Now
              </button>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-500 space-y-1">
              <p>⏱️ Processing time: <strong className="text-slate-700">1–3 business days</strong></p>
              <p>💰 Minimum withdrawal: <strong className="text-slate-700">৳ 500</strong></p>
              <p>📋 Withdrawals are reviewed by admin before processing</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
