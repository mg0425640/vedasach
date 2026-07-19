'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, savings, totalItems } = useCart();
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">{lang === 'hi' ? 'शॉपिंग कार्ट' : 'Shopping Cart'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-[#111] mb-8">
          {lang === 'hi' ? 'शॉपिंग कार्ट' : 'Shopping Cart'}
          <span className="text-[#999] text-lg font-body ml-2">({totalItems} {totalItems === 1 ? (lang === 'hi' ? 'आइटम' : 'item') : (lang === 'hi' ? 'आइटम' : 'items')})</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-[#DDD] mb-4" />
            <h2 className="font-display text-xl font-semibold text-[#111] mb-2">
              {lang === 'hi' ? 'आपका कार्ट खाली है' : 'Your cart is empty'}
            </h2>
            <p className="text-[#666] font-body mb-6">
              {lang === 'hi' ? 'अपने पसंदीदा उत्पाद खोजें और उन्हें कार्ट में जोड़ें।' : 'Discover our wellness products and add them to your cart.'}
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 font-body font-semibold hover:bg-brand/90 transition-colors">
              {lang === 'hi' ? 'शॉपिंग शुरू करें' : 'Start Shopping'} <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white border border-[#E8E8E8] divide-y divide-[#F5F5F5]">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover border border-[#F5F5F5]" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.slug}`} className="font-body font-semibold text-[#111] hover:text-brand transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body font-bold text-brand">₹{item.price.toLocaleString()}</span>
                        {item.original_price && item.original_price > item.price && (
                          <span className="text-sm text-[#999] line-through font-body">₹{item.original_price.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-[#E8E8E8]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-[#F8F8F8] transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="px-3 font-body font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-[#F8F8F8] transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-[#999] hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-body font-bold text-[#111]">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Link href="/shop" className="text-brand font-body font-semibold hover:underline">
                  {lang === 'hi' ? '← खरीदारी जारी रखें' : '← Continue Shopping'}
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-white border border-[#E8E8E8] p-6 sticky top-4">
                <h2 className="font-display text-lg font-bold text-[#111] mb-4">
                  {lang === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
                </h2>

                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#666]">{lang === 'hi' ? 'उप-योग' : 'Subtotal'}</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{lang === 'hi' ? 'छूट' : 'You Save'}</span>
                      <span className="font-semibold">-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#666]">{lang === 'hi' ? 'शिपिंग' : 'Shipping'}</span>
                    <span className="font-semibold">{shipping === 0 ? (lang === 'hi' ? 'मुफ्त' : 'Free') : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-[#E8E8E8] pt-3 flex justify-between">
                    <span className="font-semibold text-[#111]">{lang === 'hi' ? 'कुल' : 'Total'}</span>
                    <span className="font-bold text-lg text-brand">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {subtotal < 499 && (
                  <div className="mt-4 p-3 bg-[#FFF8F6] border border-[#FFE5DD] text-xs font-body text-[#996633]">
                    {lang === 'hi' ? `रुपये ${((499 - subtotal)).toLocaleString()} और खर्च करें और मुफ्त शिपिंग पाएं` : `Add ₹${(499 - subtotal).toLocaleString()} more for free shipping`}
                  </div>
                )}

                <Link href="/checkout" className="block w-full mt-6 bg-brand text-white text-center py-3 font-body font-semibold hover:bg-brand/90 transition-colors">
                  {lang === 'hi' ? 'चेकआउट करें' : 'Proceed to Checkout'}
                </Link>

                <p className="mt-4 text-xs font-body text-center text-[#999]">
                  {lang === 'hi' ? 'सुरक्षित भुगतान Razorpay द्वारा' : 'Secure checkout powered by Razorpay'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
