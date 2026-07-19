'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem('vw_session');
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('vw_session', id);
  }
  return id;
}

export default function CookieConsent() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vw_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = async (type: 'all' | 'necessary' | 'declined') => {
    localStorage.setItem('vw_cookie_consent', type);
    setVisible(false);

    try {
      await supabase.from('cookie_consents').insert({
        session_id: getOrCreateSessionId(),
        user_id: user?.id || null,
        consent_type: type,
      });
    } catch {}
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4">
      <div className="max-w-4xl mx-auto bg-white border border-[#E8E8E8] shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-[#FFF8F6] border border-[#FECDD3] flex items-center justify-center flex-shrink-0">
              <Cookie size={18} className="text-brand" />
            </div>
            <div>
              <h3 className="font-body font-bold text-sm text-[#111] mb-1">
                {t('cookie_title')}
              </h3>
              <p className="text-[12px] text-[#666] font-body leading-relaxed">
                {t('cookie_text')}{' '}
                <Link href="/privacy" className="text-brand hover:underline">{lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</Link>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => saveConsent('declined')}
              className="px-4 py-2 text-xs font-semibold border border-[#E8E8E8] text-[#666] hover:border-[#999] transition-all font-body"
            >
              {t('decline')}
            </button>
            <button
              onClick={() => saveConsent('necessary')}
              className="px-4 py-2 text-xs font-semibold border border-[#E8E8E8] text-[#333] hover:border-brand hover:text-brand transition-all font-body"
            >
              {t('necessary_only')}
            </button>
            <button
              onClick={() => saveConsent('all')}
              className="px-4 py-2 text-xs font-bold bg-brand text-white hover:bg-[#C93D0E] transition-colors font-body"
            >
              {t('accept_all')}
            </button>
            <button onClick={() => setVisible(false)} className="p-1.5 text-[#999] hover:text-[#333]">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
