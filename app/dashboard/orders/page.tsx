'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, MapPin, XCircle, Loader2, AlertCircle, Eye, Clock, CheckCircle, X } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  product_name: string;
  product_name_hi: string | null;
  product_image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  status_hi: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  tracking_number: string | null;
  courier_name: string | null;
  shipping_address: any;
  created_at: string;
  dispatched_at: string | null;
  delivered_at: string | null;
  cancellation_reason: string | null;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string; label_hi: string }> = {
  pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending', label_hi: 'लंबित' },
  confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle, label: 'Confirmed', label_hi: 'पुष्टि' },
  processing: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Package, label: 'Processing', label_hi: 'प्रक्रिया में' },
  dispatched: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Truck, label: 'Dispatched', label_hi: 'भेज दिया गया' },
  out_for_delivery: { color: 'bg-teal-100 text-teal-700 border-teal-200', icon: Truck, label: 'Out for Delivery', label_hi: 'डिलीवरी के लिए भेजा गया' },
  delivered: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Delivered', label_hi: 'डिलीवर हो गया' },
  cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Cancelled', label_hi: 'रद्द' },
  refund_initiated: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle, label: 'Refund Initiated', label_hi: 'रिफंड शुरू' },
  refunded: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: CheckCircle, label: 'Refunded', label_hi: 'रिफंड हो गया' },
};

const CANCEL_REASONS = [
  { en: 'Changed my mind', hi: 'मन बदल गया' },
  { en: 'Found better price elsewhere', hi: 'कहीं और बेहतर कीमत मिली' },
  { en: 'Order took too long', hi: 'ऑर्डर में बहुत देर हो गई' },
  { en: 'Wrong item ordered', hi: 'गलत आइटम ऑर्डर किया' },
  { en: 'Other', hi: 'अन्य' },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOtherReason, setCancelOtherReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders((ordersData as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [user]);

  const canCancel = (status: string) => ['pending', 'confirmed', 'processing'].includes(status);

  const handleCancel = async () => {
    if (!selectedOrder || !cancelReason) return;
    setCancelling(true);
    await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        status_hi: 'रद्द',
        cancellation_reason: cancelReason === 'Other' ? cancelOtherReason : cancelReason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', selectedOrder.id);
    await loadOrders();
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason('');
    setCancelOtherReason('');
    setCancelling(false);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="bg-white border border-[#E8E8E8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#111]">
            {lang === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[#999] font-body">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-[#DDD] mx-auto mb-3" />
            <p className="text-[#999] font-body">{lang === 'hi' ? 'आपके पास कोई ऑर्डर नहीं है।' : 'You have no orders yet.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              return (
                <div key={order.id} className="border border-[#E8E8E8] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-[#F0F0F0]">
                    <div>
                      <p className="font-body font-bold text-sm text-[#111]">{order.order_number}</p>
                      <p className="text-[11px] text-[#999] font-body mt-0.5">
                        {lang === 'hi' ? 'तारीख:' : 'Date:'} {formatDate(order.created_at)}
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 border ${statusConfig.color}`}>
                        <StatusIcon size={10} />
                        {lang === 'hi' ? statusConfig.label_hi : statusConfig.label}
                      </span>
                      {canCancel(order.status) && (
                        <button
                          onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}
                          className="text-[10px] font-semibold text-red-500 hover:underline font-body"
                        >
                          {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 border border-[#E8E8E8] bg-[#F8F8F8] flex-shrink-0 overflow-hidden">
                          {item.product_image && (
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-body font-semibold text-[#111] line-clamp-1">
                            {lang === 'hi' && item.product_name_hi ? item.product_name_hi : item.product_name}
                          </p>
                          <p className="text-[10px] text-[#999] font-body">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-body text-[#666]">
                    <span className="font-semibold text-[#111]">
                      {lang === 'hi' ? 'कुल:' : 'Total:'} {order.total_amount.toLocaleString('en-IN')}
                    </span>
                    <span className="uppercase">{order.payment_method === 'cod' ? 'COD' : order.payment_method}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold ${order.payment_status === 'paid'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : order.payment_status === 'failed'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {order.payment_status}
                    </span>
                    {order.tracking_number && (
                      <span className="flex items-center gap-1 text-brand">
                        <Truck size={11} />
                        {order.tracking_number}
                      </span>
                    )}
                  </div>

                  {order.cancellation_reason && (
                    <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                      <p className="text-[11px] text-red-600 font-body">
                        {lang === 'hi' ? 'रद्द करने का कारण:' : 'Cancellation Reason:'} {order.cancellation_reason}
                      </p>
                    </div>
                  )}

                  {order.tracking_number && order.courier_name && (
                    <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex flex-wrap gap-4 text-[11px] font-body text-[#555]">
                      <span><strong>{lang === 'hi' ? 'कूरियर:' : 'Courier:'}</strong> {order.courier_name}</span>
                      <span><strong>{lang === 'hi' ? 'ट्रैकिंग:' : 'Tracking:'}</strong> {order.tracking_number}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setShowCancelModal(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-[#111]">
                  {lang === 'hi' ? 'ऑर्डर रद्द करें' : 'Cancel Order'}
                </h3>
                <button onClick={() => setShowCancelModal(false)} className="text-[#999] hover:text-[#333]">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-[#666] font-body mb-4">
                {lang === 'hi' ? 'कृपया रद्द करने का कारण चुनें:' : 'Please select a reason for cancellation:'}
              </p>
              <div className="space-y-2 mb-4">
                {CANCEL_REASONS.map((r) => (
                  <label key={r.en} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={r.en}
                      checked={cancelReason === r.en}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-4 h-4 accent-brand"
                    />
                    <span className="text-sm font-body text-[#333]">{lang === 'hi' ? r.hi : r.en}</span>
                  </label>
                ))}
              </div>
              {cancelReason === 'Other' && (
                <textarea
                  value={cancelOtherReason}
                  onChange={(e) => setCancelOtherReason(e.target.value)}
                  placeholder={lang === 'hi' ? 'कारण बताएं...' : 'Specify reason...'}
                  className="w-full px-3 py-2 border border-[#E8E8E8] text-sm font-body mb-4 resize-none"
                  rows={2}
                />
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={cancelling || !cancelReason || (cancelReason === 'Other' && !cancelOtherReason)}
                  className="flex-1 bg-red-500 text-white py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-body flex items-center justify-center gap-2"
                >
                  {cancelling ? <Loader2 size={14} className="animate-spin" /> : null}
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel Order'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2.5 border border-[#E8E8E8] text-sm text-[#555] font-body hover:border-[#999] transition-colors"
                >
                  {lang === 'hi' ? 'वापस' : 'Back'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
