'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, Phone, ShoppingBag, Hash } from 'lucide-react';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_order');
    if (saved) setOrder(JSON.parse(saved));
  }, []);

  if (!order) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500">No order found.</p>
    </div>
  );

  const isPending = order.status === 'Pending Verification';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
        <div className={`w-20 h-20 ${isPending ? 'bg-amber-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <CheckCircle className={`h-12 w-12 ${isPending ? 'text-amber-500' : 'text-green-500'}`} />
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isPending ? 'Order Submitted! ⏳' : 'Order Confirmed! 🎉'}
        </h1>
        <p className="text-slate-500 mb-8">
          {isPending
            ? `Your ${order.method} payment is pending verification. We'll confirm your order once we verify the TrxID.`
            : "Thank you for your order. We'll deliver it as soon as possible."}
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Order ID</p>
              <p className="font-bold text-slate-800">{order.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Delivering to</p>
              <p className="font-bold text-slate-800">{order.delivery.name} — {order.delivery.street}, {order.delivery.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-bold text-slate-800">{order.delivery.phone}</p>
            </div>
          </div>

          {order.trxId && order.trxId !== 'N/A' && (
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-slate-500">{order.method} Transaction ID</p>
                <p className="font-bold text-slate-800 font-mono tracking-wider">{order.trxId}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 flex items-center justify-center">
              <span className="text-base">{order.method === 'COD' ? '💵' : order.method === 'BKASH' ? '🩷' : '🧡'}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">Payment Method</p>
              <p className="font-bold text-slate-800">{order.method}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
            <span className="text-slate-600 font-medium">
              {isPending ? 'Amount Sent' : 'Total Payable'}
            </span>
            <span className="text-2xl font-bold text-primary">৳ {order.total.toLocaleString()}</span>
          </div>
        </div>

        <Link href="/" className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 smooth-transition">
          <ShoppingBag className="h-5 w-5" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
