'use client';

import { useEffect, useState } from 'react';
import { X, Bell, Info, CheckCircle, AlertTriangle, Tag, Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface Notification {
  id: string;
  title: string;
  title_hi: string | null;
  message: string;
  message_hi: string | null;
  type: string;
  image_url: string | null;
  action_url: string | null;
  action_label: string | null;
  action_label_hi: string | null;
  created_at: string;
  isRead?: boolean;
}

const typeConfig: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  error: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  promo: { icon: Tag, color: 'text-brand', bg: 'bg-[#FFF8F6]' },
  order: { icon: Package, color: 'text-[#111]', bg: 'bg-[#F8F8F8]' },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ open, onClose }: Props) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadNotifications();
  }, [open]);

  const loadNotifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setNotifications(data as Notification[]);

    if (user) {
      const { data: reads } = await supabase
        .from('user_notification_reads')
        .select('notification_id')
        .eq('user_id', user.id);
      if (reads) setReadIds(new Set(reads.map((r: any) => r.notification_id)));
    }
    setLoading(false);
  };

  const markRead = async (notifId: string) => {
    if (!user || readIds.has(notifId)) return;
    await supabase.from('user_notification_reads').insert({ notification_id: notifId });
    setReadIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(notifId);
      return newSet;
    });
  };

  const markAllRead = async () => {
    if (!user) return;
    const unread = notifications.filter((n) => !readIds.has(n.id));
    await Promise.all(
      unread.map((n) => supabase.from('user_notification_reads').upsert({ notification_id: n.id, user_id: user.id }))
    );
    const allIds = new Set<string>();
    notifications.forEach((n) => allIds.add(n.id));
    setReadIds(allIds);
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[80] bg-black/30" onClick={onClose} />
      )}

      {/* Panel */}
      <div className={`fixed right-0 top-0 bottom-0 z-[90] w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8] bg-[#111] text-white">
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <span className="font-body font-bold text-sm uppercase tracking-wider">
              {lang === 'hi' ? 'सूचनाएं' : 'Notifications'}
            </span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-brand rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-white/70 hover:text-white font-body">
                {lang === 'hi' ? 'सभी पढ़ें' : 'Mark all read'}
              </button>
            )}
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-[#999] text-sm font-body">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <Bell size={40} className="text-[#DDD] mb-3" />
              <p className="text-[#999] font-body text-sm">
                {lang === 'hi' ? 'कोई सूचना नहीं' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => {
                const config = typeConfig[notif.type] || typeConfig.info;
                const Icon = config.icon;
                const isRead = readIds.has(notif.id);
                const title = lang === 'hi' && notif.title_hi ? notif.title_hi : notif.title;
                const message = lang === 'hi' && notif.message_hi ? notif.message_hi : notif.message;
                const actionLabel = lang === 'hi' && notif.action_label_hi ? notif.action_label_hi : notif.action_label;

                return (
                  <div
                    key={notif.id}
                    className={`flex gap-3 px-5 py-4 border-b border-[#F5F5F5] cursor-pointer transition-colors ${isRead ? 'opacity-70' : `${config.bg}`}`}
                    onClick={() => markRead(notif.id)}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${config.bg} rounded-full mt-0.5`}>
                      <Icon size={14} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#111] font-body">{title}</p>
                        {!isRead && <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-[12px] text-[#666] font-body leading-relaxed mt-0.5">{message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#AAA] font-body">
                          {new Date(notif.created_at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        {notif.action_url && actionLabel && (
                          <Link
                            href={notif.action_url}
                            onClick={onClose}
                            className="text-[11px] font-semibold text-brand hover:underline flex items-center gap-1 font-body"
                          >
                            {actionLabel}
                            <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E8E8] p-4 text-center">
          <p className="text-[11px] text-[#AAA] font-body">
            {lang === 'hi' ? 'केवल नवीनतम 20 सूचनाएं दिखाई जा रही हैं' : 'Showing latest 20 notifications'}
          </p>
        </div>
      </div>
    </>
  );
}
