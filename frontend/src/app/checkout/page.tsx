'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, ChevronRight, Copy, Check } from 'lucide-react';
import { getCart, saveCart, CartItem } from '@/lib/cart';

const MERCHANT_NUMBER = '01620177883';

const paymentMethods = [
  {
    id: 'bkash',
    name: 'bKash',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-500',
    bgLight: 'bg-pink-50',
    ringColor: 'ring-pink-400',
    instructions: `Send money to bKash Personal: ${MERCHANT_NUMBER}\nThen enter your Transaction ID below.`
  },
  {
    id: 'nagad',
    name: 'Nagad',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-500',
    bgLight: 'bg-orange-50',
    ringColor: 'ring-orange-400',
    instructions: `Send money to Nagad Personal: ${MERCHANT_NUMBER}\nThen enter your Transaction ID below.`
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    textColor: 'text-green-700',
    borderColor: 'border-green-500',
    bgLight: 'bg-green-50',
    ringColor: 'ring-green-400',
    instructions: 'Pay in cash when your order arrives at your doorstep.'
  }
];

function BkashLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-12' : 'h-9';
  return (
    <div className={`${h} px-3 rounded-xl flex items-center justify-center`} style={{ background: '#E2136E' }}>
      {/* bKash Bird SVG */}
      <svg viewBox="0 0 80 40" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Origami bird */}
        <polygon points="10,30 25,10 30,25" fill="white" opacity="0.9"/>
        <polygon points="25,10 40,28 30,25" fill="white" opacity="0.7"/>
        <polygon points="30,25 40,28 35,35" fill="white" opacity="0.8"/>
        <polygon points="10,30 30,25 20,38" fill="white" opacity="0.6"/>
        {/* bKash text */}
        <text x="44" y="28" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial">bKash</text>
      </svg>
    </div>
  );
}

function NagadLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-12' : 'h-9';
  return (
    <div className={`${h} px-3 rounded-xl flex items-center justify-center`} style={{ background: 'linear-gradient(135deg, #F26522 0%, #EE3124 100%)' }}>
      <svg viewBox="0 0 90 40" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circular emblem */}
        <circle cx="22" cy="20" r="14" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="22" cy="20" r="8" fill="white" opacity="0.9"/>
        <circle cx="22" cy="20" r="4" fill="#F26522"/>
        {/* Nagad text */}
        <text x="42" y="26" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial">Nagad</text>
      </svg>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('bkash');
  const [trxId, setTrxId] = useState('');
  const [form, setForm] = useState({ name: '', street: '', city: '', phone: '' });

  useEffect(() => { setCartItems(getCart()); }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + delivery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(MERCHANT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = () => {
    if (!form.name || !form.street || !form.city || !form.phone) {
      setError('Please fill in all delivery details.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if ((selectedPayment === 'bkash' || selectedPayment === 'nagad') && !trxId.trim()) {
      setError('Please enter your Transaction ID (TrxID) to verify your payment.');
      return;
    }

    setIsLoading(true);
    const order = {
      id: `ORD-${Math.floor(Math.random() * 1000000)}`,
      items: cartItems,
      total,
      delivery: form,
      method: selectedPayment.toUpperCase(),
      trxId: trxId || 'N/A',
      date: new Date().toISOString(),
      status: selectedPayment === 'cod' ? 'Confirmed' : 'Pending Verification'
    };
    localStorage.setItem('last_order', JSON.stringify(order));
    saveCart([]);
    router.push('/order-success');
  };

  const activeMethod = paymentMethods.find(p => p.id === selectedPayment)!;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center text-sm text-slate-500 mb-8 gap-2">
          <Link href="/cart" className="hover:text-primary">Cart</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-800 font-semibold">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Delivery + Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Truck className="text-primary h-6 w-6" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your full name" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                  <input name="street" type="text" value={form.street} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="House no, Road, Area" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input name="city" type="text" value={form.city} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Dhaka" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input name="phone" type="text" value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="01XXXXXXXXX" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Method</h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => { setSelectedPayment(method.id); setTrxId(''); setError(''); }}
                    className={`p-4 rounded-2xl border-2 text-center smooth-transition font-semibold flex flex-col items-center gap-2 ${
                      selectedPayment === method.id
                        ? `${method.borderColor} ${method.bgLight} ${method.textColor} ring-2 ${method.ringColor}`
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {method.id === 'bkash' && <BkashLogo />}
                    {method.id === 'nagad' && <NagadLogo />}
                    {method.id === 'cod' && (
                      <div className="h-9 px-3 rounded-xl bg-green-100 flex items-center justify-center text-2xl">💵</div>
                    )}
                    <span className="text-sm">{method.name}</span>
                  </button>
                ))}
              </div>

              {/* Instructions box */}
              {(selectedPayment === 'bkash' || selectedPayment === 'nagad') && (
                <div className={`${activeMethod.bgLight} border ${activeMethod.borderColor} rounded-2xl p-5 mb-5`}>
                  <div className="flex items-center gap-3 mb-4">
                    {selectedPayment === 'bkash' && <BkashLogo size="lg" />}
                    {selectedPayment === 'nagad' && <NagadLogo size="lg" />}
                    <p className={`font-bold ${activeMethod.textColor} text-lg`}>{activeMethod.name} Payment Instructions</p>
                  </div>

                  <ol className="space-y-2 text-slate-700 text-sm mb-4">
                    <li className="flex gap-2"><span className="font-bold">1.</span> Open your {activeMethod.name} app</li>
                    <li className="flex gap-2"><span className="font-bold">2.</span> Go to <strong>Send Money</strong></li>
                    <li className="flex gap-2 items-center">
                      <span className="font-bold">3.</span>
                      <span>Send <strong className="text-slate-900">৳ {total.toLocaleString()}</strong> to this number:</span>
                    </li>
                  </ol>

                  <div className={`flex items-center justify-between bg-white border ${activeMethod.borderColor} rounded-xl px-4 py-3 mb-4`}>
                    <span className={`text-xl font-bold tracking-widest ${activeMethod.textColor}`}>{MERCHANT_NUMBER}</span>
                    <button onClick={copyNumber} className={`flex items-center gap-1 text-sm font-semibold ${activeMethod.textColor} hover:opacity-80`}>
                      {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
                    </button>
                  </div>

                  <p className="text-sm text-slate-600">
                    <strong>4.</strong> After sending, copy your <strong>Transaction ID (TrxID)</strong> from the {activeMethod.name} app and paste it below.
                  </p>
                </div>
              )}

              {/* TrxID input for bKash/Nagad */}
              {(selectedPayment === 'bkash' || selectedPayment === 'nagad') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Transaction ID (TrxID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={e => setTrxId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono tracking-wider"
                    placeholder="e.g. A1B2C3D4E5"
                  />
                  <p className="text-xs text-slate-400 mt-1">Your order will be verified using this TrxID.</p>
                </div>
              )}

              {selectedPayment === 'cod' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-green-800 text-sm">
                  💚 <strong>Cash on Delivery selected.</strong> You'll pay in cash when your order is delivered to your address.
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-28">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>
              )}

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Your cart is empty.</p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex gap-3 items-center border-b border-slate-100 pb-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800">৳ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Delivery Fee</span>
                  <span className="font-medium">৳ {delivery}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">Total</span>
                  <span className="text-2xl font-bold text-primary">৳ {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 smooth-transition text-lg disabled:opacity-70"
              >
                {isLoading ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
