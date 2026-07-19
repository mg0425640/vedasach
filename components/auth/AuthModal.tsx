'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, AtSign, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

type Tab = 'login' | 'signup' | 'forgot';

const FALLBACK_AUTH_IMAGE = 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=700';

interface AuthAd {
  image_url: string;
  link_url: string | null;
  title: string;
  title_hi: string | null;
  description: string;
  description_hi: string | null;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
      </g>
    </svg>
  );
}

interface FormMsg { type: 'error' | 'success'; text: string }

function LoginForm({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<FormMsg | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const email = identifier.includes('@') ? identifier : `${identifier}@vedasach.in`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg({ type: 'error', text: error.message });
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {msg && (
        <div className={`flex items-center gap-2 p-3 text-sm font-body rounded-none border ${msg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {msg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          {msg.text}
        </div>
      )}
      <div className="relative">
        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
        <input
          type="text"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={t('username_or_email')}
          className="w-full pl-10 pr-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
        />
      </div>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
        <input
          type={showPwd ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('password')}
          className="w-full pl-10 pr-10 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
        />
        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-brand">
          {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      <button type="button" onClick={() => onTabChange('forgot')} className="text-xs text-brand font-body hover:underline">
        {t('forgot_password')}
      </button>
      <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {t('sign_in')}
      </button>
      <div className="relative flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-[#E8E8E8]" />
        <span className="text-[11px] text-[#999] font-body">{t('or_continue_with')}</span>
        <div className="flex-1 h-px bg-[#E8E8E8]" />
      </div>
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 border border-[#E8E8E8] py-3 text-sm font-semibold font-body text-[#333] hover:border-brand hover:bg-[#FFF8F6] transition-all"
      >
        <GoogleIcon />
        {t('login_with_google')}
      </button>
      <p className="text-center text-xs text-[#888] font-body">
        {t('no_account')}{' '}
        <button type="button" onClick={() => onTabChange('signup')} className="text-brand font-semibold hover:underline">
          {t('create_account')}
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ full_name: '', email: '', username: '', mobile: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<FormMsg | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setMsg({ type: 'error', text: 'Passwords do not match' }); return; }
    if (form.password.length < 8) { setMsg({ type: 'error', text: 'Password must be at least 8 characters' }); return; }
    setLoading(true); setMsg(null);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, username: form.username, mobile: form.mobile } },
    });
    if (error) { setMsg({ type: 'error', text: error.message }); setLoading(false); return; }
    if (data.user) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: form.email,
        full_name: form.full_name,
        username: form.username,
        mobile: form.mobile,
      });
      setMsg({ type: 'success', text: 'Account created! Check your email to verify. You can log in now.' });
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {msg && (
        <div className={`flex items-center gap-2 p-3 text-sm font-body border ${msg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {msg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          {msg.text}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder={t('full_name')} className="w-full pl-9 pr-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
        </div>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('email')} className="w-full pl-9 pr-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })} placeholder={t('username')} className="w-full pl-9 pr-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
        </div>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder={t('mobile')} className="w-full pl-9 pr-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
        </div>
      </div>
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
        <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t('password')} className="w-full pl-9 pr-10 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">{showPwd ? <EyeOff size={14} /> : <Eye size={14} />}</button>
      </div>
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
        <input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder={t('confirm_password')} className="w-full pl-9 pr-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
      </div>
      <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {t('register')}
      </button>
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E8E8E8]" />
        <span className="text-[11px] text-[#999] font-body">{t('or_continue_with')}</span>
        <div className="flex-1 h-px bg-[#E8E8E8]" />
      </div>
      <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-[#E8E8E8] py-2.5 text-sm font-semibold font-body text-[#333] hover:border-brand hover:bg-[#FFF8F6] transition-all">
        <GoogleIcon />
        {t('login_with_google')}
      </button>
      <p className="text-center text-xs text-[#888] font-body">
        {t('already_account')}{' '}
        <button type="button" onClick={() => onTabChange('login')} className="text-brand font-semibold hover:underline">{t('back_to_login')}</button>
      </p>
    </form>
  );
}

function ForgotPasswordForm({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<FormMsg | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    await supabase.from('contact_messages').insert({
      name: 'Password Reset Request',
      email,
      subject: 'Password Reset Request',
      category: 'Password Reset',
      message: `User with email ${email} has requested a password reset. Please verify and reset their password.`,
    });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) setMsg({ type: 'error', text: error.message });
    else setMsg({ type: 'success', text: 'Reset instructions sent to your email! Our team will also review your request.' });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {msg && (
        <div className={`flex items-center gap-2 p-3 text-sm font-body border ${msg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {msg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          {msg.text}
        </div>
      )}
      <p className="text-sm text-[#666] font-body">{t('reset_subtitle')}</p>
      <div className="relative">
        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          className="w-full pl-10 pr-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {t('send_reset')}
      </button>
      <p className="text-center text-xs text-[#888] font-body">
        <button type="button" onClick={() => onTabChange('login')} className="text-brand font-semibold hover:underline">{t('back_to_login')}</button>
      </p>
    </form>
  );
}

export default function AuthModal() {
  const { showAuthModal, authModalTab, closeAuthModal, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>(authModalTab);
  const [authAd, setAuthAd] = useState<AuthAd | null>(null);

  useEffect(() => { setTab(authModalTab); }, [authModalTab]);

  useEffect(() => {
    if (!showAuthModal) return;
    let cancelled = false;
    const modalType = tab === 'signup' ? 'show_on_signup_modal' : 'show_on_login_modal';
    supabase
      .from('auth_popup_ads')
      .select('image_url, link_url, title, title_hi, description, description_hi')
      .eq('is_active', true)
      .eq(modalType, true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (!cancelled && data && data.length > 0) setAuthAd(data[0] as AuthAd);
      });
    return () => { cancelled = true; };
  }, [showAuthModal, tab]);

  useEffect(() => {
    if (showAuthModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showAuthModal]);

  if (!showAuthModal) return null;

  const tabConfig = {
    login: { title: t('welcome_back'), subtitle: t('login_subtitle') },
    signup: { title: t('join_vedasach'), subtitle: t('signup_subtitle') },
    forgot: { title: t('reset_password'), subtitle: t('reset_subtitle') },
  };
  const { title } = tabConfig[tab];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={closeAuthModal}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-3xl flex shadow-2xl overflow-hidden max-h-[90vh]">
          {/* Left Panel – Image */}
          <div className="hidden md:flex md:w-2/5 flex-col relative bg-[#111] overflow-hidden">
            <img
              src={authAd?.image_url || FALLBACK_AUTH_IMAGE}
              alt={authAd?.title || 'Wellness'}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
              <span className="font-display text-2xl font-bold text-white mb-2">
                Veda<span className="text-brand">Well</span>
              </span>
              <h2 className="font-display text-xl font-bold text-white mb-2 leading-tight">
                {tab === 'login' && 'Your Wellness Journey Continues'}
                {tab === 'signup' && 'Start Your Wellness Journey'}
                {tab === 'forgot' && 'Regain Your Access'}
              </h2>
              <p className="text-white/70 text-sm font-body leading-relaxed">
                {tab === 'login' && 'Sign in to access personalized health guides, dream interpretations, and your wellness dashboard.'}
                {tab === 'signup' && 'Join 50,000+ readers exploring Ayurveda, yoga, dream meanings, and natural health.'}
                {tab === 'forgot' && 'We\'ll help you get back into your account safely and securely.'}
              </p>
              {authAd && (
                <a
                  href={authAd.link_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <span className="uppercase tracking-wider">Sponsored</span>
                  <span className="truncate">— {authAd.title}</span>
                </a>
              )}
              <div className="flex gap-2 mt-6">
                {(['login', 'signup', 'forgot'] as Tab[]).map((t) => (
                  <div key={t} className={`h-1 rounded-full transition-all duration-300 ${tab === t ? 'w-8 bg-brand' : 'w-2 bg-white/40'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel – Form */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-6 md:p-8 flex-1">
              {/* Close button */}
              <button onClick={closeAuthModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5] text-[#666] z-10 md:hidden">
                <X size={18} />
              </button>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-[#111]">{title}</h1>
                </div>
                <button onClick={closeAuthModal} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5] text-[#666] hidden md:flex">
                  <X size={18} />
                </button>
              </div>

              {tab === 'login' && <LoginForm onTabChange={setTab} />}
              {tab === 'signup' && <SignupForm onTabChange={setTab} />}
              {tab === 'forgot' && <ForgotPasswordForm onTabChange={setTab} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
