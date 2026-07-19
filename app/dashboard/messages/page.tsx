'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, Send, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  subject: string;
  message: string;
  category: string | null;
  read: boolean;
  created_at: string;
  replied_at: string | null;
  reply: string | null;
}

const CATEGORY_LABELS: Record<string, { en: string; hi: string }> = {
  general: { en: 'General', hi: 'सामान्य' },
  order: { en: 'Order', hi: 'ऑर्डर' },
  product: { en: 'Product', hi: 'उत्पाद' },
  refund: { en: 'Refund', hi: 'रिफंड' },
  complaint: { en: 'Complaint', hi: 'तकनीकी शिकायत' },
  feedback: { en: 'Feedback', hi: 'प्रतिक्रिया' },
  other: { en: 'Other', hi: 'अन्य' },
};

export default function MessagesPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [formMessage, setFormMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadMessages = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false });
    setMessages((data as Message[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formSubject || !formMessage) return;
    setSending(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email,
      subject: formSubject,
      message: formMessage,
      category: formCategory,
    });
    if (!error) {
      setSuccess(true);
      setFormSubject('');
      setFormCategory('general');
      setFormMessage('');
      await loadMessages();
      setTimeout(() => { setSuccess(false); setShowForm(false); }, 2000);
    }
    setSending(false);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout>
      <div className="bg-white border border-[#E8E8E8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#111]">
            {lang === 'hi' ? 'संदेश' : 'Messages'}
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Send size={14} />
            {lang === 'hi' ? 'नया संदेश' : 'New Message'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-[#F8F8F8] border border-[#E8E8E8]">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">
                    {lang === 'hi' ? 'विषय' : 'Subject'} *
                  </label>
                  <input
                    required
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E8E8] bg-white text-sm font-body focus:outline-none focus:border-brand"
                    placeholder={lang === 'hi' ? 'विषय लिखें' : 'Enter subject'}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">
                    {lang === 'hi' ? 'श्रेणी' : 'Category'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E8E8] bg-white text-sm font-body focus:outline-none focus:border-brand"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{lang === 'hi' ? label.hi : label.en}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">
                  {lang === 'hi' ? 'संदेश' : 'Message'} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E8E8] bg-white text-sm font-body resize-none focus:outline-none focus:border-brand"
                  placeholder={lang === 'hi' ? 'अपना संदेश लिखें...' : 'Write your message...'}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {lang === 'hi' ? 'भेजें' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-[#E8E8E8] text-sm text-[#555] font-body hover:border-[#999] transition-colors"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
            {success && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-body">
                <CheckCircle size={14} />
                {lang === 'hi' ? 'संदेश भेज दिया गया!' : 'Message sent successfully!'}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[#999] font-body">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="text-[#DDD] mx-auto mb-3" />
            <p className="text-[#999] font-body">{lang === 'hi' ? 'कोई संदेश नहीं है।' : 'No messages yet.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const categoryLabel = CATEGORY_LABELS[msg.category || 'other'] || CATEGORY_LABELS.other;
              return (
                <div key={msg.id} className="border border-[#E8E8E8] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${msg.read ? 'bg-[#DDD]' : 'bg-brand'}`} />
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F0F0F0] text-[#666] font-body">
                        {lang === 'hi' ? categoryLabel.hi : categoryLabel.en}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#999] font-body">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="font-body font-semibold text-sm text-[#111] mb-1">{msg.subject}</p>
                  <p className="text-xs text-[#666] font-body leading-relaxed">{msg.message}</p>
                  {msg.reply && (
                    <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand font-body mb-1">
                        {lang === 'hi' ? 'हमारा उत्तर:' : 'Our Reply:'}
                      </p>
                      <p className="text-xs text-[#555] font-body leading-relaxed bg-green-50 p-2 border border-green-100">{msg.reply}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
