'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Loader2, AlertCircle, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Refund {
  id: string;
  amount: number;
  status: string;
  status_hi: string;
  reason: string | null;
  notes: string | null;
  processed_at: string | null;
  created_at: string;
  order_id: string;
  orders: {
    order_number: string;
    order_items: { product_name: string; product_name_hi: string | null; product_image: string; quantity: number }[];
  } | null;
}

const REFUND_STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  under_review: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
  approved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  processed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
};

const STATUS_LABELS: Record<string, { en: string; hi: string }> = {
  pending: { en: 'Pending', hi: 'लंबित' },
  under_review: { en: 'Under Review', hi: 'समीक्षा में' },
  approved: { en: 'Approved', hi: 'स्वीकृत' },
  rejected: { en: 'Rejected', hi: 'अस्वीकृत' },
  processed: { en: 'Processed', hi: 'संसाधित' },
};

export default function RefundsPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRefunds = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('refunds')
      .select('id, amount, status, status_hi, reason, notes, processed_at, created_at, order_id, orders(order_number, order_items(product_name, product_name_hi, product_image, quantity))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setRefunds((data as unknown as Refund[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadRefunds(); }, [user]);

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="bg-white border border-[#E8E8E8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#111]">
            {lang === 'hi' ? 'रिफंड स्थिति' : 'Refund Status'}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[#999] font-body">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : refunds.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw size={48} className="text-[#DDD] mx-auto mb-3" />
            <p className="text-[#999] font-body">{lang === 'hi' ? 'कोई रिफंड नहीं मिला।' : 'No refunds found.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {refunds.map((refund) => {
              const statusConfig = REFUND_STATUS_CONFIG[refund.status] || REFUND_STATUS_CONFIG.pending;
              const statusLabels = STATUS_LABELS[refund.status] || STATUS_LABELS.pending;
              const StatusIcon = statusConfig.icon;
              return (
                <div key={refund.id} className="border border-[#E8E8E8] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-[#F0F0F0]">
                    <div>
                      <p className="font-body font-bold text-sm text-[#111]">
                        {lang === 'hi' ? 'रिफंड राशि:' : 'Refund Amount:'} {refund.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-[#999] font-body mt-0.5">
                        {lang === 'hi' ? 'दिनांक:' : 'Date:'} {formatDate(refund.created_at)}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 border ${statusConfig.color}`}>
                      <StatusIcon size={10} />
                      {lang === 'hi' ? statusLabels.hi : statusLabels.en}
                    </span>
                  </div>

                  {refund.orders && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#999] font-body mb-2">
                        {lang === 'hi' ? 'ऑर्डर आइटम:' : 'Order Items:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {refund.orders.order_items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#F8F8F8] px-2 py-1">
                            <div className="w-8 h-8 border border-[#E8E8E8] overflow-hidden">
                              {item.product_image && (
                                <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] font-body font-semibold text-[#111] line-clamp-1">
                                {lang === 'hi' && item.product_name_hi ? item.product_name_hi : item.product_name}
                              </p>
                              <p className="text-[9px] text-[#999] font-body">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {refund.reason && (
                    <div className="pt-3 border-t border-[#F0F0F0]">
                      <p className="text-[11px] font-body text-[#666]">
                        <span className="font-semibold">{lang === 'hi' ? 'कारण:' : 'Reason:'}</span> {refund.reason}
                      </p>
                    </div>
                  )}

                  {refund.notes && (
                    <div className="pt-2">
                      <p className="text-[11px] font-body text-[#666]">
                        <span className="font-semibold">{lang === 'hi' ? 'टिप्पणी:' : 'Notes:'}</span> {refund.notes}
                      </p>
                    </div>
                  )}

                  {refund.processed_at && (
                    <p className="text-[10px] text-[#999] font-body mt-3 pt-2 border-t border-[#F0F0F0]">
                      {lang === 'hi' ? 'संसाधित:' : 'Processed:'} {formatDate(refund.processed_at)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 p-4 bg-[#FFF8F6] border border-[#FECDD3]">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-brand mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-body font-semibold text-[#111]">
                {lang === 'hi' ? 'रिफंड नीति' : 'Refund Policy'}
              </p>
              <p className="text-[11px] text-[#666] font-body mt-1">
                {lang === 'hi'
                  ? 'रिफंड 5-7 कार्य दिवसों में संसाधित होते हैं। किसी भी प्रश्न के लिए हमारी सहायता टीम से संपर्क करें।'
                  : 'Refunds are processed within 5-7 business days. Contact our support team for any queries.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
