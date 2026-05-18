'use client';

import { useState } from 'react';
import { Package, UploadCloud, DollarSign, Layers, Save, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 smooth-transition";

export default function AddProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !countInStock) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/seller/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          wholesalePrice: wholesalePrice ? Number(wholesalePrice) : undefined,
          category,
          countInStock: Number(countInStock),
          images: images.map(url => ({ url, altText: name }))
        }),
      });

      if (res.ok) {
        setSuccess('Product submitted for admin approval! Redirecting...');
        setTimeout(() => router.push('/seller'), 1500);
      } else if (res.status === 401) {
        setError('You must be logged in as a Seller to add products. Go to /login first.');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      setError('Cannot connect to backend. Make sure it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/seller" className="text-slate-400 hover:text-slate-600 p-2 -ml-2 rounded-lg hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Add New Product</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/seller" className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 smooth-transition">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 smooth-transition disabled:opacity-70"
            >
              <Save className="h-5 w-5" /> {isLoading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {error && <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl mb-6 text-sm font-medium">{success}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic Info */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Package className="text-primary h-5 w-5" /> Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Premium Wireless Headphones" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Describe your product features, material, and care instructions..."
                      className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <UploadCloud className="text-primary h-5 w-5" /> Product Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl border border-slate-200 overflow-hidden relative group">
                      <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 smooth-transition">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer smooth-transition text-slate-400 hover:text-primary">
                      <UploadCloud className="h-8 w-8 mb-2" />
                      <span className="text-xs font-medium">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-4">Upload up to 5 images. JPG, PNG. Max 5MB each.</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">

              {/* Pricing */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <DollarSign className="text-primary h-5 w-5" /> Pricing
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Retail Price (৳) <span className="text-red-500">*</span></label>
                    <input type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)}
                      placeholder="0" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Wholesale Price (৳)</label>
                    <input type="number" min="0" value={wholesalePrice} onChange={e => setWholesalePrice(e.target.value)}
                      placeholder="0" className={inputClass} />
                    <p className="text-xs text-slate-400 mt-1">Optional. For B2B bulk buyers.</p>
                  </div>
                </div>
              </div>

              {/* Category & Inventory */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Layers className="text-primary h-5 w-5" /> Category & Inventory
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <select required value={category} onChange={e => setCategory(e.target.value)}
                      className={`${inputClass} appearance-none`}>
                      <option value="">Select a category</option>
                      <option value="electronics">Electronics & Gadgets</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="home">Home & Lifestyle</option>
                      <option value="beauty">Health & Beauty</option>
                      <option value="food">Food & Grocery</option>
                      <option value="sports">Sports & Outdoors</option>
                      <option value="books">Books & Stationery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
                    <input type="number" required min="0" value={countInStock} onChange={e => setCountInStock(e.target.value)}
                      placeholder="0" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-amber-800 text-sm font-medium">📋 Review Required</p>
                <p className="text-amber-700 text-xs mt-1">Your product will be reviewed by an admin before going live. This usually takes 1–24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
