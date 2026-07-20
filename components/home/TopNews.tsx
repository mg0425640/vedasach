'use client';

import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TopNewsArticle {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  excerpt: string;
  excerpt_hi: string | null;
  image_url: string;
  image_alt: string | null;
  category: string;
  author: string;
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

export default function TopNews({ articles }: { articles: TopNewsArticle[] }) {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  if (!articles || articles.length === 0) return null;

  const centerArticle = articles[0];
  const leftArticles = articles.slice(1, 6);
  const rightArticles = articles.slice(6, 11);

  const t = {
    topNews: isHi ? 'मुख्य समाचार' : 'Top News',
    by: isHi ? 'द्वारा' : 'By',
    reads: isHi ? 'बार पढ़ा गया' : 'reads',
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

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="divider-title mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brand" /> {t.topNews}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 5 articles */}
        <div className="lg:col-span-1 space-y-4">
          {leftArticles.map((a) => {
            const title = isHi && a.title_hi ? a.title_hi : a.title;
            return (
              <Link
                key={a.id}
                href={`/${getCatSlug(a.category)}/${a.slug}${isHi ? '?lang=hi' : ''}`}
                className="flex items-center gap-3 group pb-4 border-b border-[#F0F0F0] last:border-0"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-[#E8E8E8]">
                  <img
                    src={a.image_url}
                    alt={a.image_alt || title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body">
                    {a.category}
                  </span>
                  <h3 className="text-[13px] font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug line-clamp-2 font-body mt-0.5">
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

        {/* Center big article */}
        <div className="lg:col-span-2">
          {(() => {
            const centerTitle = isHi && centerArticle.title_hi ? centerArticle.title_hi : centerArticle.title;
            const centerExcerpt = isHi && centerArticle.excerpt_hi ? centerArticle.excerpt_hi : centerArticle.excerpt;
            return (
              <Link
                href={`/${getCatSlug(centerArticle.category)}/${centerArticle.slug}${isHi ? '?lang=hi' : ''}`}
                className="group block"
              >
                <div className="overflow-hidden mb-4 relative rounded-lg">
                  <img
                    src={centerArticle.image_url}
                    alt={centerArticle.image_alt || centerTitle}
                    className="w-full h-72 md:h-96 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                      {centerArticle.category}
                    </span>
                  </div>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-[#111] group-hover:text-brand transition-colors leading-tight mb-2">
                  {centerTitle}
                </h2>
                <p className="text-sm text-[#666] font-body leading-relaxed line-clamp-3 mb-3">
                  {centerExcerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#999] font-body">
                  <span>{t.by} {centerArticle.author}</span>
                  <span>•</span>
                  <span>{formatDate(centerArticle.published_at)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {centerArticle.read_count} {t.reads}
                  </span>
                </div>
              </Link>
            );
          })()}
        </div>

        {/* Right 5 articles */}
        <div className="lg:col-span-1 space-y-4">
          {rightArticles.map((a) => {
            const title = isHi && a.title_hi ? a.title_hi : a.title;
            return (
              <Link
                key={a.id}
                href={`/${getCatSlug(a.category)}/${a.slug}${isHi ? '?lang=hi' : ''}`}
                className="flex items-center gap-3 group pb-4 border-b border-[#F0F0F0] last:border-0"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-[#E8E8E8]">
                  <img
                    src={a.image_url}
                    alt={a.image_alt || title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body">
                    {a.category}
                  </span>
                  <h3 className="text-[13px] font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug line-clamp-2 font-body mt-0.5">
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
    </section>
  );
}