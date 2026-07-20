'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, Eye, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

interface WorldArticle {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  image_url: string;
  image_alt: string | null;
  category: string;
  published_at: string;
  read_count: number;
}

const CATEGORY_SLUGS: Record<string, string> = {
  'Dream Meanings': 'dreams',
  'Health & Wellness': 'health',
  'Ayurveda': 'ayurveda',
  'Yoga & Meditation': 'yoga',
  'Beauty': 'beauty',
  'Nutrition': 'nutrition',
  'Spirituality': 'spirituality',
  'Home Remedies': 'home-remedies',
  'World': 'world',
  'FIFA World Cup': 'fifa-world-cup',
  'Lifestyle': 'lifestyle',
  'Religion': 'religion',
  'Business': 'business',
  'Entertainment': 'entertainment',
  'Real Estate': 'real-estate',
  'Legal': 'legal',
  'Tech': 'tech',
  'Education': 'education',
};

function getCatSlug(cat: string) {
  return CATEGORY_SLUGS[cat] || cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

export default function WorldTop({ initialArticles }: { initialArticles: WorldArticle[] }) {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<WorldArticle[]>(initialArticles);
  const [loading, setLoading] = useState(false);

  const t = {
    worldTop: isHi ? 'विश्व समाचार' : 'World Top',
    searchPlaceholder: isHi ? 'लेख खोजें... (जैसे sapne me cow, गाय)' : 'Search articles... (e.g. sapne me cow)',
    noResults: isHi ? 'कोई लेख नहीं मिला। कृपया अन्य शब्द खोजें।' : 'No articles found. Try different keywords.',
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(initialArticles);
      return;
    }
    setLoading(true);
    try {
      const words = q.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
      if (words.length === 0) { setResults(initialArticles); return; }

      // Build OR conditions across English AND Hindi fields
      const conditions: string[] = [];
      for (const word of words) {
        conditions.push(`title.ilike.%${word}%`);
        conditions.push(`title_hi.ilike.%${word}%`);
        conditions.push(`excerpt.ilike.%${word}%`);
        conditions.push(`excerpt_hi.ilike.%${word}%`);
        conditions.push(`category.ilike.%${word}%`);
        conditions.push(`subcategory.ilike.%${word}%`);
      }
      const orFilter = conditions.join(',');

      const { data } = await supabase
        .from('articles')
        .select('id,slug,title,title_hi,image_url,image_alt,category,published_at,read_count')
        .eq('is_published', true)
        .or(orFilter)
        .order('read_count', { ascending: false })
        .limit(20);

      setResults((data as WorldArticle[]) || []);
    } catch {
      setResults(initialArticles);
    }
    setLoading(false);
  }, [initialArticles]);

  useEffect(() => {
    const timer = setTimeout(() => performSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const leftArticles = results.slice(0, 5);
  const rightArticles = results.slice(5, 10);

  return (
    <section className="bg-[#F8F8F8] border-y border-[#E8E8E8] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="divider-title flex-1 mb-0">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand" /> {t.worldTop}
            </h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
            />
            {loading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand animate-spin" />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left 5 */}
          <div className="space-y-4">
            {leftArticles.map((a) => {
              const title = isHi && a.title_hi ? a.title_hi : a.title;
              return (
                <Link
                  key={a.id}
                  href={`/${getCatSlug(a.category)}/${a.slug}${isHi ? '?lang=hi' : ''}`}
                  className="flex gap-4 group pb-4 border-b border-[#E8E8E8] last:border-0"
                >
                  <img
                    src={a.image_url}
                    alt={a.image_alt || title}
                    className="w-24 h-20 object-cover rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body">
                      {a.category}
                    </span>
                    <h3 className="text-sm font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug line-clamp-2 font-body mt-0.5">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[#AAA] font-body">
                      <Clock size={9} /> {formatDate(a.published_at)}
                      <span>•</span>
                      <Eye size={9} /> {a.read_count}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right 5 */}
          <div className="space-y-4">
            {rightArticles.map((a) => {
              const title = isHi && a.title_hi ? a.title_hi : a.title;
              return (
                <Link
                  key={a.id}
                  href={`/${getCatSlug(a.category)}/${a.slug}${isHi ? '?lang=hi' : ''}`}
                  className="flex gap-4 group pb-4 border-b border-[#E8E8E8] last:border-0"
                >
                  <img
                    src={a.image_url}
                    alt={a.image_alt || title}
                    className="w-24 h-20 object-cover rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body">
                      {a.category}
                    </span>
                    <h3 className="text-sm font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug line-clamp-2 font-body mt-0.5">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[#AAA] font-body">
                      <Clock size={9} /> {formatDate(a.published_at)}
                      <span>•</span>
                      <Eye size={9} /> {a.read_count}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search size={36} className="mx-auto text-[#DDD] mb-3" />
            <p className="text-sm text-[#999] font-body">{t.noResults}</p>
          </div>
        )}
      </div>
    </section>
  );
}