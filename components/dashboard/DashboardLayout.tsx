'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, ShoppingBag, Heart, RefreshCw, MessageSquare, LogOut, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const navItems = [
  { icon: User, labelKey: 'my_profile', href: '/dashboard' },
  { icon: ShoppingBag, labelKey: 'my_orders', href: '/dashboard/orders' },
  { icon: MapPin, labelKey: 'my_addresses', href: '/dashboard/addresses' },
  { icon: Heart, labelKey: 'wishlist', href: '/dashboard/wishlist' },
  { icon: RefreshCw, labelKey: 'refund_status', href: '/dashboard/refunds' },
  { icon: MessageSquare, labelKey: 'messages', href: '/dashboard/messages' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const { t, lang } = useLanguage();

  const avatarInitial = profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs font-body text-[#999] flex items-center gap-1">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#111]">{t('dashboard')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white border border-[#E8E8E8] p-5 mb-4 text-center">
              <div className="w-20 h-20 rounded-full bg-brand text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3 font-display overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  avatarInitial
                )}
              </div>
              <p className="font-display font-bold text-[#111] text-lg">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-[#999] font-body mt-0.5 truncate">{user?.email}</p>
              {profile?.username && (
                <p className="text-xs text-[#AAA] font-body mt-0.5">@{profile.username}</p>
              )}
            </div>

            {/* Nav */}
            <nav className="bg-white border border-[#E8E8E8] overflow-hidden">
              {navItems.map(({ icon: Icon, labelKey, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-5 py-3.5 text-sm font-body border-b border-[#F5F5F5] last:border-0 transition-colors ${
                      isActive ? 'bg-[#FFF8F6] text-brand font-semibold border-l-2 border-l-brand' : 'text-[#333] hover:text-brand hover:bg-[#FFF8F6]'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-brand' : 'text-[#999]'} />
                    {t(labelKey)}
                  </Link>
                );
              })}
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-5 py-3.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full font-body"
              >
                <LogOut size={15} />
                {t('logout')}
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
