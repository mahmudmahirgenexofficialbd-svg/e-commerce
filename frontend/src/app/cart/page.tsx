'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { getCart, removeFromCart, updateCartQuantity, CartItem } from '@/lib/cart';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleUpdateQuantity = (id: string, change: number) => {
    const updated = updateCartQuantity(id, change);
    setCartItems(updated);
  };

  const handleRemove = (id: string) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-primary h-8 w-8" /> Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary/30 smooth-transition">
              Continue Shopping <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">Sold by: {item.seller}</p>
                    <p className="font-bold text-primary text-xl">৳ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-slate-400 hover:text-red-500 smooth-transition p-2"
                      title="Remove Item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="p-2 text-slate-600 hover:text-primary smooth-transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="p-2 text-slate-600 hover:text-primary smooth-transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-28">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span className="font-medium">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium">৳ {delivery.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-primary">৳ {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 smooth-transition text-lg mb-4">
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Secure Checkout with SSLCommerz</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
