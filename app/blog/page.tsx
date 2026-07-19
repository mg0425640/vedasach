'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import ArticleCard from '@/components/articles/ArticleCard';
import AdBanner from '@/components/ads/AdBanner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export default function BlogPage() {
  const [hero, setHero] = useState<any>(null);
  const [sideList, setSideList] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await Promise.all([
        supabase.from('articles').select('*').eq('is_published', true).eq('featured', true).limit(1).maybeSingle(),
        supabase.from('articles').select('*').eq('is_published', true).limit(4),
        supabase.from('articles').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('articles').select('*', { count: 'exact' }).eq('is_published', true).order('created_at', { ascending: false }).range(0, PAGE_SIZE - 1),
      ]);
      const heroData = results[0].data;
      const sideData = results[1].data;
      const latestData = results[2].data;
      const pageData = results[3].data;
      const count = results[3].count;
      setHero(heroData);
      setSideList(sideData || []);
      setLatest(latestData || []);
      setAllArticles(pageData || []);
      setTotal(count || 0);
      setLoading(false);
    })();
  }, []);

  const loadPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);
    setAllArticles(data || []);
    setPage(pageNum);
    setLoading(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 600, behavior: 'smooth' });
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          {hero && <ArticleCard article={hero} variant="featured" />}
        </div>
        <div className="flex flex-col gap-4">
          {sideList.map(a => <ArticleCard key={a.id} article={a} variant="mini" />)}
        </div>
      </section>
      <AdBanner isGlobal showGoogleFallback />

      <section className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {latest.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>

      <AdBanner isGlobal showGoogleFallback />
      <AdBanner isGlobal showGoogleFallback />

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">More Stories</h2>
        {loading && allArticles.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#F8F8F8] h-64 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allArticles.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => loadPage(Math.max(0, page - 1))}
              disabled={page === 0 || loading}
              className="flex items-center gap-1 px-4 py-2 border border-[#E8E8E8] rounded-lg disabled:opacity-40 hover:bg-[#F8F8F8] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => loadPage(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    i === page
                      ? 'bg-[#E84E1B] text-white'
                      : 'border border-[#E8E8E8] hover:bg-[#F8F8F8]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => loadPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1 || loading}
              className="flex items-center gap-1 px-4 py-2 border border-[#E8E8E8] rounded-lg disabled:opacity-40 hover:bg-[#F8F8F8] transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
