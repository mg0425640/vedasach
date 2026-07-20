'use client';

import Link from 'next/link';
import { Search, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeSearch({ trending }: { trending: string[] }) {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const t = {
    placeholder: isHi
      ? 'खोजें "गाय का सपना", "अश्वगंधा के फायदे", "तनाव के लिए योग"...'
      : 'Search "dream about cow", "ashwagandha benefits", "yoga for stress"...',
    searchButton: isHi ? 'खोजें' : 'Search',
    trending: isHi ? 'ट्रेंडिंग:' : 'Trending:',
  };

  return (
    <>
      <form action="/search" className="max-w-2xl mx-auto mb-6">
        <div className="relative flex">
          <input type="hidden" name="source" value="home" />
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#999] z-10" />
          <input
            type="text"
            name="q"
            placeholder={t.placeholder}
            className="flex-1 pl-12 pr-4 py-4 bg-white border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand shadow-sm font-body"
          />
          <button type="submit" className="px-6 bg-brand text-white bg-green-500 text-sm font-semibold hover:bg-[#C93D0E] transition-colors">
            {t.searchButton}
          </button>
        </div>
      </form>

      {trending.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[#999] font-body mr-1 flex items-center gap-1">
            <TrendingUp size={12} /> {t.trending}
          </span>
          {trending.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="text-xs px-3 py-1.5 bg-white border border-[#E8E8E8] text-[#555] hover:border-brand hover:text-brand transition-all font-body"
            >
              {term}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}