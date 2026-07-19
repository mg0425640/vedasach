'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Megaphone, Package, MessageSquare, Eye, Heart, Share2, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    ads: 0,
    orders: 0,
    comments: 0,
    totalReads: 0,
    totalLikes: 0,
    totalShares: 0,
    revenue: 0,
    pendingOrders: 0,
    pendingComments: 0,
    activeAds: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [topArticles, setTopArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [artCount, adsCount, ordCount, comCount, reads, topArt, recentArt, ordSum, pendOrd, pendCom, activeAds] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('global_ads').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('read_count,like_count,share_count'),
        supabase.from('articles').select('id,title,slug,read_count,like_count,share_count,category').order('read_count', { ascending: false }).limit(5),
        supabase.from('articles').select('id,title,slug,category,created_at,read_count').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('approved', false),
        supabase.from('global_ads').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      const readSum = (reads.data || []).reduce((acc: number, a: any) => acc + (a.read_count || 0), 0);
      const likeSum = (reads.data || []).reduce((acc: number, a: any) => acc + (a.like_count || 0), 0);
      const shareSum = (reads.data || []).reduce((acc: number, a: any) => acc + (a.share_count || 0), 0);
      const rev = (ordSum.data || []).reduce((acc: number, o: any) => acc + Number(o.total_amount || 0), 0);

      setStats({
        articles: artCount.count || 0,
        ads: adsCount.count || 0,
        orders: ordCount.count || 0,
        comments: comCount.count || 0,
        totalReads: readSum,
        totalLikes: likeSum,
        totalShares: shareSum,
        revenue: rev,
        pendingOrders: pendOrd.count || 0,
        pendingComments: pendCom.count || 0,
        activeAds: activeAds.count || 0,
      });
      setTopArticles(topArt.data || []);
      setRecentArticles(recentArt.data || []);
      setLoading(false);
    })();
  }, []);

  const statCards = [
    { label: 'Total Articles', value: stats.articles, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Ads', value: stats.activeAds, icon: Megaphone, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: stats.orders, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Comments', value: stats.comments, icon: MessageSquare, color: 'text-orange-600 bg-orange-50' },
    { label: 'Total Reads', value: stats.totalReads, icon: Eye, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'text-pink-600 bg-pink-50' },
    { label: 'Total Shares', value: stats.totalShares, icon: Share2, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  ];

  if (loading) {
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 bg-white rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-[#F0F0F0]">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A] font-heading">{s.value}</p>
            <p className="text-xs text-[#999] font-body mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-base text-[#1A1A1A]">Top Articles by Reads</h2>
            <Link href="/admin/articles" className="text-xs text-[#E84E1B] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {topArticles.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-[#E8E8E8] font-heading w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{a.title}</p>
                  <p className="text-xs text-[#999]">{a.category}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#666]">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.read_count}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{a.like_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-base text-[#1A1A1A]">Recent Articles</h2>
            <Link href="/admin/articles" className="text-xs text-[#E84E1B] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentArticles.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#E84E1B]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{a.title}</p>
                  <p className="text-xs text-[#999]">{new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-[#666] flex items-center gap-1"><Eye className="w-3 h-3" />{a.read_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/articles" className="bg-white rounded-xl p-5 border border-[#F0F0F0] hover:border-[#E84E1B] transition-colors group">
          <FileText className="w-6 h-6 text-[#E84E1B] mb-3" />
          <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-[#E84E1B]">Manage Articles</h3>
          <p className="text-xs text-[#999] mt-1">Add, edit, delete articles</p>
        </Link>
        <Link href="/admin/ads" className="bg-white rounded-xl p-5 border border-[#F0F0F0] hover:border-[#E84E1B] transition-colors group">
          <Megaphone className="w-6 h-6 text-[#E84E1B] mb-3" />
          <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-[#E84E1B]">Manage Ads</h3>
          <p className="text-xs text-[#999] mt-1">{stats.pendingOrders} pending alerts</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-xl p-5 border border-[#F0F0F0] hover:border-[#E84E1B] transition-colors group">
          <ShoppingCart className="w-6 h-6 text-[#E84E1B] mb-3" />
          <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-[#E84E1B]">Manage Orders</h3>
          <p className="text-xs text-[#999] mt-1">{stats.pendingOrders} pending orders</p>
        </Link>
      </div>
    </div>
  );
}
