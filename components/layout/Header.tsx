'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, ChevronDown, LogOut, LayoutDashboard, Bell, Globe, CircleAlert as AlertCircle, TrendingUp, Shield, FileText, Megaphone, Package, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import NotificationPanel from '@/components/dashboard/NotificationPanel';

const getNavItems = (t: (k: string) => string, lang: string) => [
  { label: t('home'), href: '/' },
  {
    label: t('dreams'), href: '/dreams',
    megaMenu: [
      { label: lang === 'hi' ? 'जानवर' : 'Animals', href: '/dreams?cat=animals', icon: '🐍', desc: lang === 'hi' ? 'जानवरों के स्वप्न' : 'Dream about animals' },
      { label: lang === 'hi' ? 'प्रकृति' : 'Nature', href: '/dreams?cat=nature', icon: '🌳', desc: lang === 'hi' ? 'प्रकृति के स्वप्न' : 'Dream about nature' },
      { label: lang === 'hi' ? 'तत्व' : 'Elements', href: '/dreams?cat=elements', icon: '💧', desc: lang === 'hi' ? 'तत्वों के स्वप्न' : 'Dream about elements' },
      { label: lang === 'hi' ? 'सभी स्वप्न' : 'All Dreams', href: '/dreams', icon: '🌙', desc: lang === 'hi' ? 'सभी स्वप्न देखें' : 'Browse all dreams' },
    ],
    megaMenuAlign: 'left',
  },
  {
    label: t('health'), href: '/health',
    megaMenu: [
      { label: lang === 'hi' ? 'वजन घटाना' : 'Weight Loss', href: '/health/weight-loss', icon: '⚖️', desc: lang === 'hi' ? 'स्वाभाविक रूप से वजन कम करें' : 'Lose weight naturally' },
      { label: lang === 'hi' ? 'मधुमेह आहार' : 'Diabetes Diet', href: '/health/diabetes-diet', icon: '🩺', desc: lang === 'hi' ? 'रक्त शर्करा प्रबंधन' : 'Manage blood sugar' },
      { label: lang === 'hi' ? 'पाचन' : 'Digestion', href: '/health/digestion', icon: '🍃', desc: lang === 'hi' ? 'पाचन में सुधार' : 'Improve gut health' },
      { label: lang === 'hi' ? 'प्रतिरक्षा' : 'Immunity', href: '/health/immunity', icon: '🛡️', desc: lang === 'hi' ? 'रोग प्रतिरक्षा बढ़ाएं' : 'Boost your immunity' },
    ],
    megaMenuAlign: 'left',
  },
  {
    label: t('ayurveda'), href: '/ayurveda',
    megaMenu: [
      { label: 'Ashwagandha', href: '/ayurveda/ashwagandha-benefits-dosage', icon: '🌿', desc: lang === 'hi' ? 'तनाव और ऊर्जा' : 'Stress & energy' },
      { label: 'Giloy', href: '/ayurveda/giloy-benefits-immunity', icon: '🌱', desc: lang === 'hi' ? 'प्रतिरक्षा बढ़ाने वाला' : 'Immunity booster' },
      { label: lang === 'hi' ? 'सभी जड़ी-बूटियां' : 'All Herbs', href: '/ayurveda', icon: '🌾', desc: lang === 'hi' ? 'सभी जड़ी-बूटियां देखें' : 'Browse all herbs' },
    ],
    megaMenuAlign: 'left',
  },
  { label: t('yoga'), href: '/yoga' },
  { label: t('beauty'), href: '/beauty' },
  { label: t('blog'), href: '/blog' },
  { label: t('shop'), href: '/shop' },
  {
    label: t('more'), href: '#',
    megaMenu: [
      { label: t('world'), href: '/world', icon: '🌍', desc: lang === 'hi' ? 'विश्व समाचार' : 'World news' },
      { label: t('fifa_world_cup'), href: '/fifa-world-cup', icon: '⚽', desc: lang === 'hi' ? 'फीफा विश्व कप' : 'FIFA World Cup' },
      { label: t('lifestyle'), href: '/lifestyle', icon: '✨', desc: lang === 'hi' ? 'जीवनशैली' : 'Lifestyle tips' },
      { label: t('religion'), href: '/religion', icon: '🕉️', desc: lang === 'hi' ? 'धर्म' : 'Religion & faith' },
      { label: t('business'), href: '/business', icon: '💼', desc: lang === 'hi' ? 'व्यापार' : 'Business news' },
      { label: t('entertainment'), href: '/entertainment', icon: '🎬', desc: lang === 'hi' ? 'मनोरंजन' : 'Entertainment' },
      { label: t('real_estate'), href: '/real-estate', icon: '🏠', desc: lang === 'hi' ? 'रियल एस्टेट' : 'Real estate' },
      { label: t('legal'), href: '/legal', icon: '⚖️', desc: lang === 'hi' ? 'कानूनी' : 'Legal news' },
      { label: t('tech'), href: '/tech', icon: '💻', desc: lang === 'hi' ? 'तकनीक' : 'Technology' },
      { label: t('education'), href: '/education', icon: '📚', desc: lang === 'hi' ? 'शिक्षा' : 'Education' },
    ],
    megaMenuAlign: 'right',
  },
];

const TRENDING_SEARCHES = [
  'dream about snake', 'ashwagandha benefits', 'yoga for back pain',
  'dark circles remedies', 'weight loss', 'immunity boosters'
];

export default function Header() {
  const { user, profile, signOut, openAuthModal } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = getNavItems(t, lang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatarInitial = profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';
  const pendingVerifications = (!profile?.email_verified || !profile?.mobile_verified) && !!user;

  return (
    <>
      {/* Top Social Bar */}
      <div className="social-bar py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-gray-100">
            <span>{lang === 'hi' ? 'अनुसरण करें:' : 'Follow us:'}</span>
            {['Facebook', 'Instagram', 'YouTube', 'Twitter'].map((s) => (
              <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
            ))}
          </div>
          <div className="text-[11px] text-gray-100">
            {lang === 'hi' ? 'स्वस्थ मन • स्वस्थ शरीर • सकारात्मक जीवन' : 'Healthy Mind • Healthy Body • Positive Life'}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-[#E8E8E8]'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src="/logo.svg" alt="VedaWell – Wellness, Ayurveda & Dream Meanings" className="h-9 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link href={item.href} className="flex items-center gap-0.5 px-3 py-2 nav-link text-[11px]">
                    {item.label}
                    {item.megaMenu && <ChevronDown size={11} className="mt-0.5 opacity-60" />}
                  </Link>
                  {item.megaMenu && activeDropdown === item.label && (
                    <div className={`absolute top-full ${item.megaMenuAlign === 'right' ? 'right-0' : 'left-0'} w-[480px] max-w-[calc(100vw-2rem)] bg-white border border-[#E8E8E8] shadow-2xl z-50 p-6 animate-in fade-in duration-150`}>
                      <div className="grid grid-cols-2 gap-2">
                        {item.megaMenu.map((mi) => (
                          <Link key={mi.href} href={mi.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF8F6] hover:border-brand border border-transparent transition-all group">
                            <span className="text-2xl flex-shrink-0">{mi.icon}</span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#111] group-hover:text-brand transition-colors font-body">{mi.label}</p>
                              <p className="text-[10px] text-[#999] font-body truncate">{mi.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 border border-[#E8E8E8] text-[11px] font-bold uppercase tracking-wider hover:border-brand hover:text-brand transition-all font-body"
                title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              >
                <Globe size={12} />
                {lang === 'en' ? 'हिं' : 'EN'}
              </button>

              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-brand transition-colors" aria-label="Search">
                <Search size={18} />
              </button>

              <Link href="/cart" className="p-2 hover:text-brand transition-colors relative">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-green text-[9px] rounded-full flex items-center justify-center font-bold">{totalItems > 99 ? '99+' : totalItems}</span>
                )}
              </Link>

              {/* Notification Bell */}
              {user && (
                <button onClick={() => setNotifOpen(true)} className="p-2 hover:text-brand transition-colors relative" aria-label="Notifications">
                  <Bell size={18} />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-green text-[9px] rounded-full flex items-center justify-center font-bold">3</span>
                </button>
              )}

              {/* Auth Button / User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-[#E8E8E8] hover:border-brand transition-all"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center font-body">
                        {avatarInitial}
                      </div>
                    )}
                    <span className="text-[12px] font-semibold font-body text-[#111] hidden md:block max-w-[80px] truncate">
                      {profile?.full_name || profile?.username || user.email?.split('@')[0]}
                    </span>
                    {pendingVerifications && (
                      <AlertCircle size={12} className="text-amber-500" />
                    )}
                    <ChevronDown size={12} className="text-[#999]" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-[460px] max-w-[calc(100vw-2rem)] bg-white border border-[#E8E8E8] shadow-xl z-50 py-2">
                      <div className="px-4 py-3 border-b border-[#F0F0F0]">
                        <p className="text-sm font-bold text-[#111] font-body truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-[11px] text-[#999] font-body truncate">{user.email}</p>
                        {pendingVerifications && (
                          <div className="mt-2 space-y-1">
                            {!profile?.email_verified && (
                              <div className="flex items-center gap-1 text-[10px] text-amber-600 font-body bg-amber-50 px-2 py-1">
                                <AlertCircle size={10} />
                                {t('email_pending')}
                              </div>
                            )}
                            {!profile?.mobile_verified && (
                              <div className="flex items-center gap-1 text-[10px] text-amber-600 font-body bg-amber-50 px-2 py-1">
                                <AlertCircle size={10} />
                                {t('mobile_pending')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-1">
                        {[
                          { icon: LayoutDashboard, label: t('my_profile'), href: '/dashboard' },
                          { icon: null, label: t('my_orders'), href: '/dashboard/orders' },
                          { icon: null, label: t('my_addresses'), href: '/dashboard/addresses' },
                          { icon: null, label: t('wishlist'), href: '/dashboard/wishlist' },
                          { icon: null, label: t('refund_status'), href: '/dashboard/refunds' },
                          { icon: null, label: t('messages'), href: '/dashboard/messages' },
                        ].map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:text-brand hover:bg-[#FFF8F6] transition-colors font-body">
                            {item.icon && <item.icon size={14} className="text-[#999]" />}
                            {!item.icon && <div className="w-3.5" />}
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      {profile?.role === 'admin' && (
                        <div className="border-t border-[#F0F0F0] mt-1 pt-1">
                          <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand bg-[#FFF8F6]">
                            Admin Panel
                          </div>
                          <div className="grid grid-cols-2 gap-x-1">
                            <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:text-brand hover:bg-[#FFF8F6] transition-colors font-body">
                              <Shield size={14} className="text-[#999]" /> Dashboard
                            </Link>
                            <Link href="/admin/articles" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:text-brand hover:bg-[#FFF8F6] transition-colors font-body">
                              <FileText size={14} className="text-[#999]" /> Articles
                            </Link>
                            <Link href="/admin/ads" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:text-brand hover:bg-[#FFF8F6] transition-colors font-body">
                              <Megaphone size={14} className="text-[#999]" /> Ads
                            </Link>
                            <Link href="/admin/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:text-brand hover:bg-[#FFF8F6] transition-colors font-body">
                              <Package size={14} className="text-[#999]" /> Orders
                            </Link>
                            <Link href="/admin/comments" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:text-brand hover:bg-[#FFF8F6] transition-colors font-body">
                              <MessageSquare size={14} className="text-[#999]" /> Comments
                            </Link>
                          </div>
                        </div>
                      )}
                      <div className="border-t border-[#F0F0F0] mt-1 pt-1">
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full font-body"
                        >
                          <LogOut size={14} />
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group" onMouseEnter={() => setActiveDropdown('__login')} onMouseLeave={() => setActiveDropdown(null)}>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C93D0E] transition-colors font-body"
                  >
                    {t('login')}
                    <ChevronDown size={11} className="opacity-80" />
                  </button>
                  {activeDropdown === '__login' && (
                    <div className="absolute top-full right-0 w-64 bg-white border border-[#E8E8E8] shadow-2xl z-50 p-4 animate-in fade-in duration-150">
                      <div className="space-y-2">
                        <button onClick={() => openAuthModal('login')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF8F6] border border-transparent hover:border-brand transition-all group">
                          <span className="text-xl">🔑</span>
                          <div className="text-left">
                            <p className="text-sm font-bold text-[#111] group-hover:text-brand font-body">{t('login')}</p>
                            <p className="text-[10px] text-[#999] font-body">{lang === 'hi' ? 'अपने खाते में साइन इन करें' : 'Sign in to your account'}</p>
                          </div>
                        </button>
                        <button onClick={() => openAuthModal('signup')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF8F6] border border-transparent hover:border-brand transition-all group">
                          <span className="text-xl">✨</span>
                          <div className="text-left">
                            <p className="text-sm font-bold text-[#111] group-hover:text-brand font-body">{lang === 'hi' ? 'रजिस्टर करें' : 'Sign Up'}</p>
                            <p className="text-[10px] text-[#999] font-body">{lang === 'hi' ? 'नया खाता बनाएं' : 'Create a new account'}</p>
                          </div>
                        </button>
                        <div className="border-t border-[#F0F0F0] pt-2 mt-2">
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#FFF8F6] transition-all group">
                            <span className="text-xl">📊</span>
                            <div>
                              <p className="text-sm font-bold text-[#111] group-hover:text-brand font-body">{lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</p>
                              <p className="text-[10px] text-[#999] font-body">{lang === 'hi' ? 'अपनी गतिविधि देखें' : 'View your activity'}</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 lg:hidden hover:text-brand transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4 border-t border-[#F0F0F0] pt-3">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F8F8] border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand transition-colors font-body"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                />
                {searchQuery.trim() === '' && (
                  <div className="mt-2 flex flex-wrap gap-1 px-2">
                    <span className="text-[10px] text-[#999] flex items-center gap-1 font-body">
                      <TrendingUp size={10} /> Trending:
                    </span>
                    {TRENDING_SEARCHES.map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        onClick={() => setSearchOpen(false)}
                        className="text-[10px] px-2 py-0.5 bg-white border border-[#E8E8E8] text-[#555] hover:border-brand hover:text-brand transition-all font-body"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E8E8E8] bg-white max-h-[70vh] overflow-y-auto">
            {/* Mobile Lang Toggle */}
            <div className="px-6 py-3 border-b border-[#F5F5F5] flex items-center justify-between">
              <span className="text-xs text-[#999] font-body">Language</span>
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#E8E8E8] text-xs font-bold text-[#333] hover:border-brand"
              >
                <Globe size={12} />
                {lang === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
            {navItems.map((item) => (
              <div key={item.label}>
                {item.megaMenu ? (
                  <div className="border-b border-[#F5F5F5]">
                    <div className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#111] font-body">{item.label}</div>
                    <div className="grid grid-cols-2 pb-3">
                      {item.megaMenu.map((mi) => (
                        <Link key={mi.href} href={mi.href} className="flex items-center gap-2 px-6 py-2 text-xs text-[#555] hover:text-brand font-body" onClick={() => setMobileOpen(false)}>
                          <span>{mi.icon}</span> {mi.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} className="block px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:text-brand hover:bg-[#FFF8F6] border-b border-[#F5F5F5] font-body" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {!user && (
              <div className="px-6 py-4 border-b border-[#F5F5F5]">
                <button onClick={() => { openAuthModal('signup'); setMobileOpen(false); }} className="w-full px-4 py-2.5 bg-brand text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C93D0E] transition-colors font-body mb-2">
                  {lang === 'hi' ? 'रजिस्टर करें' : 'Sign Up'}
                </button>
                <button onClick={() => { openAuthModal('login'); setMobileOpen(false); }} className="w-full px-4 py-2.5 border border-[#E8E8E8] text-[#111] text-[11px] font-bold uppercase tracking-wider hover:border-brand hover:text-brand transition-colors font-body">
                  {t('login')}
                </button>
              </div>
            )}
            {user && (
              <div className="px-6 py-3 border-t border-[#E8E8E8]">
                <Link href="/dashboard" className="block text-sm font-semibold text-[#333] hover:text-brand py-2 font-body" onClick={() => setMobileOpen(false)}>{t('dashboard')}</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="block text-sm font-semibold text-red-600 py-2 font-body">{t('logout')}</button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Notification Panel */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
