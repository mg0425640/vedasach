'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ArticleCard from '@/components/articles/ArticleCard';
import AdBanner from '@/components/ads/AdBanner';
import Sidebar from '@/components/layout/Sidebar';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Flame, Loader as Loader2 } from 'lucide-react';

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  excerpt: string;
  excerpt_hi: string | null;
  image_url: string;
  category: string;
  subcategory: string | null;
  subcategory_hi: string | null;
  author: string;
  published_at: string;
  read_time: number;
  view_count: number;
  read_count: number;
  like_count: number;
  share_count?: number;
  featured: boolean;
  trending: boolean;
  tags: string[];
}

interface CategoryPageLayoutProps {
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  icon: string;
  slug: string;
}

const SLUG_TO_CATEGORY: Record<string, string> = {
  health: 'Health & Wellness',
  ayurveda: 'Ayurveda',
  yoga: 'Yoga & Meditation',
  beauty: 'Beauty',
  nutrition: 'Nutrition',
  'home-remedies': 'Home Remedies',
  spirituality: 'Spirituality',
  dreams: 'Dream Meanings',
};

const PER_PAGE_OPTIONS = [10, 20, 30];
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent', label_hi: 'सबसे हाल का', icon: Clock },
  { value: 'popular', label: 'Most Popular', label_hi: 'सबसे लोकप्रिय', icon: TrendingUp },
  { value: 'trending', label: 'Trending', label_hi: 'ट्रेंडिंग', icon: Flame },
];

export default function CategoryPageLayout({ title, title_hi, description, description_hi, icon, slug: categorySlug }: CategoryPageLayoutProps) {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [subcategories, setSubcategories] = useState<{ name: string; name_hi: string | null; count: number }[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('recent');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const dbCategory = SLUG_TO_CATEGORY[categorySlug] || categorySlug;

  // Load subcategory list once
  useEffect(() => {
    const loadSubcategories = async () => {
      const { data } = await supabase
        .from('articles')
        .select('subcategory, subcategory_hi')
        .eq('category', dbCategory)
        .eq('is_published', true)
        .not('subcategory', 'is', null);

      if (data) {
        const map = new Map<string, { name: string; name_hi: string | null; count: number }>();
        data.forEach((a) => {
          const key = a.subcategory!;
          const ex = map.get(key);
          if (ex) ex.count++;
          else map.set(key, { name: key, name_hi: a.subcategory_hi, count: 1 });
        });
        setSubcategories(Array.from(map.values()).sort((a, b) => b.count - a.count));
      }
    };
    loadSubcategories();
  }, [dbCategory]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [selectedSubcategory, perPage, sortBy]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select('id,slug,title,title_hi,excerpt,excerpt_hi,image_url,category,subcategory,subcategory_hi,author,published_at,read_time,view_count,read_count,like_count,share_count,featured,trending,tags', { count: 'exact' })
      .eq('category', dbCategory)
      .eq('is_published', true);

    if (selectedSubcategory) query = query.eq('subcategory', selectedSubcategory);

    if (sortBy === 'popular') query = query.order('read_count', { ascending: false });
    else if (sortBy === 'trending') query = query.order('like_count', { ascending: false });
    else query = query.order('published_at', { ascending: false });

    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    const { data, count } = await query;
    if (data) {
      setArticles(data as DbArticle[]);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / perPage));
    }
    setLoading(false);
  }, [categorySlug, selectedSubcategory, page, perPage, sortBy]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const displayTitle = lang === 'hi' && title_hi ? title_hi : title;
  const displayDesc = lang === 'hi' && description_hi ? description_hi : description;
  const featured = articles.find((a) => a.featured) || articles[0];
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">{displayTitle}</span>
          {selectedSubcategory && <><span className="mx-2">›</span><span className="text-brand">{selectedSubcategory}</span></>}
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-[#111] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-3xl mb-3 block">{icon}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{displayTitle}</h1>
          <p className="text-[#AAA] font-body max-w-2xl mx-auto text-sm">{displayDesc}</p>
          <p className="text-[#666] text-xs font-body mt-2">{totalCount} {lang === 'hi' ? 'लेख' : 'Articles'}</p>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="banner-1" category={categorySlug} showGoogleFallback />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Subcategory Pills */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-[#E8E8E8]">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-4 py-2 text-xs font-semibold font-body transition-all ${!selectedSubcategory ? 'bg-brand text-white' : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#333] hover:border-brand hover:text-brand'}`}
            >
              {lang === 'hi' ? 'सभी' : 'All'}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.name}
                onClick={() => setSelectedSubcategory(sub.name)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold font-body transition-all ${selectedSubcategory === sub.name ? 'bg-brand text-white' : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#333] hover:border-brand hover:text-brand'}`}
              >
                {lang === 'hi' && sub.name_hi ? sub.name_hi : sub.name}
                <span className={`${selectedSubcategory === sub.name ? 'text-white/60' : 'text-[#AAA]'}`}>({sub.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Sort + Per-page row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#666] font-body">{lang === 'hi' ? 'क्रमबद्ध:' : 'Sort by:'}</span>
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold font-body transition-all ${sortBy === opt.value ? 'bg-[#111] text-white' : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#333] hover:border-[#111]'}`}
                >
                  <Icon size={11} />{lang === 'hi' ? opt.label_hi : opt.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666] font-body">{lang === 'hi' ? 'दिखाएं:' : 'Show:'}</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setPerPage(n)}
                className={`px-3 py-1.5 text-[11px] font-semibold font-body transition-all ${perPage === n ? 'bg-brand text-white' : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#333] hover:border-brand'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-brand" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#999] font-body text-lg">{lang === 'hi' ? 'कोई लेख नहीं मिला।' : 'No articles found.'}</p>
                {selectedSubcategory && (
                  <button onClick={() => setSelectedSubcategory(null)} className="mt-4 text-brand text-sm font-body underline">
                    {lang === 'hi' ? 'सभी दिखाएं' : 'View all articles'}
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {featured && page === 1 && (
                  <div className="mb-8">
                    <div className="divider-title mb-4">
                      <h2 className="text-sm font-bold uppercase tracking-widest">{lang === 'hi' ? 'विशेष लेख' : 'Featured'}</h2>
                    </div>
                    <ArticleCard article={featured} variant="featured" />
                  </div>
                )}

                {/* Mid banner ad */}
                <AdBanner slot="banner-2" category={categorySlug} subcategory={selectedSubcategory || undefined} className="mb-8" showGoogleFallback />

                {/* Article Grid */}
                <div className="divider-title mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    {selectedSubcategory
                      ? (lang === 'hi' ? `${selectedSubcategory} - लेख` : `${selectedSubcategory} Articles`)
                      : (lang === 'hi' ? 'नवीनतम लेख' : 'Latest Articles')
                    }
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {(page === 1 ? rest : articles).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Bottom banner ad */}
                <AdBanner slot="banner-3" category={categorySlug} className="mb-8" showGoogleFallback />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#E8E8E8]">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold border border-[#E8E8E8] disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand hover:text-brand transition-all font-body"
                    >
                      <ChevronLeft size={14} />{lang === 'hi' ? 'पिछला' : 'Prev'}
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (page <= 3) pageNum = i + 1;
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = page - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-semibold font-body ${pageNum === page ? 'bg-brand text-white' : 'border border-[#E8E8E8] hover:border-brand hover:text-brand'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold border border-[#E8E8E8] disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand hover:text-brand transition-all font-body"
                    >
                      {lang === 'hi' ? 'अगला' : 'Next'}<ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky-sidebar space-y-6">
              <Sidebar />
              <AdBanner slot="side-image-1" category={categorySlug} showGoogleFallback />
              <AdBanner slot="side-image-2" category={categorySlug} showGoogleFallback />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Global Ad */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner slot="global" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
