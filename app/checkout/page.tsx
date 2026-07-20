'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, Download, MapPin, CreditCard, FileText } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, savings, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Address form
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayNow = async () => {
    if (!razorpayLoaded) return;

    const required = ['full_name', 'phone', 'address_line1', 'city', 'state', 'pincode', 'email'];
    const missing = required.filter((f) => !formData[f as keyof typeof formData]);
    if (missing.length > 0) {
      alert(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    setProcessing(true);

    try {
      // Create Razorpay order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `RCPT_${Date.now()}`,
          userId: user?.id,
        }),
      });

      const order = await res.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TAvHs3fXMPmIld',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'vedasach',
        description: 'Wellness Products Order',
        image: '/logo.png',
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address_line1}, ${formData.address_line2}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        },
        theme: { color: '#C49A6C' },
        handler: async (response: any) => {
          await saveOrder(response, order.id);
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const saveOrder = async (paymentResponse: any, razorpayOrderId: string) => {
    try {
      const orderNumber = `VW${Date.now().toString(36).toUpperCase()}`;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: 'Confirmed',
          status_hi: 'पुष्टि हो गई',
          total_amount: total,
          subtotal,
          discount: savings,
          shipping_amount: shipping,
          payment_method: 'Razorpay',
          payment_status: 'Paid',
          shipping_address: {
            full_name: formData.full_name,
            phone: formData.phone,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await supabase.from('order_items').insert(orderItems);

      setCompletedOrder({ ...orderData, items });
      setOrderComplete(true);
      clearCart();
    } catch (error: any) {
      alert(lang === 'hi' ? 'ऑर्डर सेव करने में त्रुटि। कृपया सहायता से संपर्क करें।' : 'Failed to save order. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadBill = () => {
    if (!completedOrder) return;

    const billContent = generateBillHTML(completedOrder);
    const blob = new Blob([billContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vedasach_Invoice_${completedOrder.order_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateBillHTML = (order: any) => {
    const date = new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <title>vedasach Invoice - ${order.order_number}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
    h1 { color: #C49A6C; border-bottom: 2px solid #C49A6C; padding-bottom: 10px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
    .invoice-info { text-align: right; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f8f8; font-weight: bold; }
    .totals { margin-top: 20px; text-align: right; }
    .totals p { margin: 5px 0; }
    .grand-total { font-size: 1.3em; font-weight: bold; color: #C49A6C; border-top: 2px solid #333; padding-top: 10px; }
    .address-block { background: #f8f8f8; padding: 15px; margin: 20px 0; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
    .paid-badge { background: #22c55e; color: white; padding: 5px 15px; border-radius: 4px; display: inline-block; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>vedasach</h1>
      <p>Wellness, Ayurveda & Natural Health</p>
      <p>India's Trusted Wellness Platform</p>
    </div>
    <div class="invoice-info">
      <h2>TAX INVOICE</h2>
      <p><strong>Invoice No:</strong> ${order.order_number}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p class="paid-badge">PAID</p>
    </div>
  </div>

  <div class="address-block">
    <h3>Shipping Address</h3>
    <p>${order.shipping_address.full_name}</p>
    <p>${order.shipping_address.address_line1}</p>
    ${order.shipping_address.address_line2 ? `<p>${order.shipping_address.address_line2}</p>` : ''}
    <p>${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}</p>
    <p>Phone: ${order.shipping_address.phone}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item: any) => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">₹${item.price.toLocaleString()}</td>
          <td style="text-align:right">₹${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <p><strong>Subtotal:</strong> ₹${order.subtotal?.toLocaleString() || subtotal.toLocaleString()}</p>
    ${order.discount > 0 ? `<p><strong>Discount:</strong> -₹${order.discount?.toLocaleString()}</p>` : ''}
    <p><strong>Shipping:</strong> ${order.shipping_amount === 0 ? 'Free' : `₹${order.shipping_amount}`}</p>
    <div class="grand-total">Grand Total: ₹${order.total_amount.toLocaleString()}</div>
  </div>

  <p style="margin-top:20px"><strong>Payment Method:</strong> Razorpay</p>
  <p><strong>Payment ID:</strong> ${order.razorpay_payment_id}</p>

  <div class="footer">
    <p>Thank you for shopping with vedasach!</p>
    <p>For any queries, contact us at support@vedasach.in</p>
    <p>© ${new Date().getFullYear()} vedasach. All rights reserved.</p>
  </div>
</body>
</html>
    `;
  };

  if (!mounted) return null;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-xl font-semibold mb-4">{lang === 'hi' ? 'आपका कार्ट खाली है' : 'Your cart is empty'}</h2>
        <Link href="/shop" className="text-brand font-body font-semibold underline">{lang === 'hi' ? 'खरीदारी शुरू करें' : 'Start shopping'}</Link>
      </div>
    );
  }

  if (orderComplete && completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border border-[#E8E8E8] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#111] mb-2">
            {lang === 'hi' ? 'ऑर्डर सफल!' : 'Order Placed Successfully!'}
          </h1>
          <p className="text-[#666] font-body mb-6">
            {lang === 'hi' ? `आपका ऑर्डर ${completedOrder.order_number} पुष्टि हो गई है।` : `Your order #${completedOrder.order_number} has been confirmed.`}
          </p>

          <div className="bg-[#F8F8F8] p-4 mb-6 text-left">
            <div className="flex justify-between text-sm font-body mb-2">
              <span className="text-[#666]">{lang === 'hi' ? 'कुल राशि' : 'Total Amount'}</span>
              <span className="font-bold text-brand">₹{completedOrder.total_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-[#666]">{lang === 'hi' ? 'भुगतान स्थिति' : 'Payment Status'}</span>
              <span className="font-semibold text-green-600">{lang === 'hi' ? 'भुगतान हो गया' : 'Paid'}</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={downloadBill} className="flex items-center gap-2 bg-brand text-white px-6 py-3 font-body font-semibold hover:bg-brand/90 transition-colors">
              <Download size={16} /> {lang === 'hi' ? 'इनवॉइस डाउनलोड करें' : 'Download Invoice'}
            </button>
            <Link href="/shop" className="flex items-center gap-2 bg-[#F8F8F8] border border-[#E8E8E8] px-6 py-3 font-body font-semibold hover:border-brand transition-colors">
              {lang === 'hi' ? 'और खरीदें' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/cart" className="hover:text-brand">{lang === 'hi' ? 'कार्ट' : 'Cart'}</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">{lang === 'hi' ? 'चेकआउट' : 'Checkout'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-[#111] mb-8">
          {lang === 'hi' ? 'चेकआउट' : 'Checkout'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shipping Address Form */}
          <div className="flex-1">
            <div className="bg-white border border-[#E8E8E8] p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-brand" size={20} />
                <h2 className="font-display text-lg font-bold">{lang === 'hi' ? 'शिपिंग पता' : 'Shipping Address'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'फ़ोन नंबर *' : 'Phone Number *'}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" placeholder="10 digit mobile" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'ईमेल *' : 'Email *'}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'पता पंक्ति 1 *' : 'Address Line 1 *'}</label>
                  <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" placeholder="House no, Building, Street" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'पता पंक्ति 2' : 'Address Line 2'}</label>
                  <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" placeholder="Area, Landmark (optional)" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'शहर *' : 'City *'}</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'राज्य *' : 'State *'}</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-[#666] mb-1">{lang === 'hi' ? 'पिनकोड *' : 'Pincode *'}</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#E8E8E8] font-body text-sm focus:border-brand focus:outline-none" maxLength={6} required />
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white border border-[#E8E8E8] p-6 mt-6">
              <h2 className="font-display text-lg font-bold mb-4">{lang === 'hi' ? 'ऑर्डर आइटम' : 'Order Items'}</h2>
              <div className="divide-y divide-[#F5F5F5]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-[#F5F5F5]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-[#111] line-clamp-1">{item.name}</p>
                      <p className="text-sm text-[#666] font-body">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-body font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:w-80">
            <div className="bg-white border border-[#E8E8E8] p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-brand" size={20} />
                <h2 className="font-display text-lg font-bold">{lang === 'hi' ? 'भुगतान' : 'Payment'}</h2>
              </div>

              <div className="space-y-3 font-body text-sm mb-6">
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
                  <span className="font-bold text-[#111]">{lang === 'hi' ? 'कुल' : 'Total'}</span>
                  <span className="font-bold text-xl text-brand">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={processing || !razorpayLoaded}
                className="w-full border border-brand bg-brand text-black py-3 font-body font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    {lang === 'hi' ? 'प्रोसेसिंग...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {lang === 'hi' ? 'अभी भुगतान करें' : 'Pay Now'} ₹{total.toLocaleString()}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center gap-2 justify-center text-xs text-[#999]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                {lang === 'hi' ? '100% सुरक्षित भुगतान' : '100% Secure Payment'}
              </div>

              <div className="mt-4 flex justify-center gap-2 opacity-50">
                <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-4 w-auto grayscale" />
                <span className="text-xs font-body text-[#999]">Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
