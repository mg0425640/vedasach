'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Eye, Heart } from 'lucide-react';
import { Article, DatabaseArticle } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

type ArticleType = Article | DatabaseArticle;

function isDatabaseArticle(a: ArticleType): a is DatabaseArticle {
  return 'image_url' in a;
}

function getCategorySlug(category: string) {
  const map: Record<string, string> = {
    'Dream Meanings': 'dreams',
    'Health & Wellness': 'health',
    'Ayurveda': 'ayurveda',
    'Yoga & Meditation': 'yoga',
    'Beauty': 'beauty',
    'Nutrition': 'nutrition',
    'Spirituality': 'spirituality',
    'Home Remedies': 'home-remedies',
  };
  return map[category] || category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

interface ArticleCardProps {
  article: ArticleType;
  variant?: 'default' | 'horizontal' | 'mini' | 'featured';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { lang } = useLanguage();
  const href = `/${getCategorySlug(article.category)}/${article.slug}`;

  const image = isDatabaseArticle(article) ? article.image_url : article.image;
  const date = isDatabaseArticle(article) ? new Date(article.published_at).toLocaleDateString() : article.date;
  const title = isDatabaseArticle(article) && lang === 'hi' && article.title_hi ? article.title_hi : article.title;
  const excerpt = isDatabaseArticle(article) && lang === 'hi' && article.excerpt_hi ? article.excerpt_hi : article.excerpt;
  const subcategory = isDatabaseArticle(article) && lang === 'hi' && article.subcategory_hi ? article.subcategory_hi : article.subcategory;

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="flex gap-4 group card-hover">
        <div className="flex-shrink-0 w-28 h-20 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body">{subcategory || article.category}</span>
          <h3 className="text-sm font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug mt-0.5 line-clamp-2 font-body">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#999] font-body">
            <Clock size={10} />
            <span>{date}</span>
            {isDatabaseArticle(article) && (
              <>
                <span>•</span>
                <span className="flex items-center gap-0.5"><Eye size={10} />{article.read_count}</span>
                <span className="flex items-center gap-0.5"><Heart size={10} />{article.like_count}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'mini') {
    return (
      <Link href={href} className="flex gap-3 group py-2 border-b border-[#F5F5F5] last:border-0">
        <div className="flex-shrink-0 w-16 h-12 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div>
          <h4 className="text-[13px] font-medium text-[#111] group-hover:text-brand transition-colors line-clamp-2 leading-snug font-body">{title}</h4>
          <span className="text-[11px] text-[#AAA] font-body">{date}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={href} className="group relative block h-full">
        <div className="overflow-hidden h-full min-h-[400px] relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            style={{ position: 'absolute', inset: 0, minHeight: '400px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="tag-pill mb-2 inline-block">{article.category}</span>
            <h2 className="text-white font-display text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-brand transition-colors">
              {title}
            </h2>
            <div className="flex items-center gap-3 text-white/70 text-xs font-body">
              <span>{article.author}</span>
              <span>•</span>
              <span>{date}</span>
              {isDatabaseArticle(article) && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Eye size={10} />{article.read_count}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block card-hover">
      <div className="overflow-hidden mb-3">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="tag-pill">{subcategory || article.category}</span>
        </div>
        <h3 className="font-display text-base font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-[13px] text-[#666] leading-relaxed mb-3 line-clamp-2 font-body">{excerpt}</p>
        <div className="flex items-center gap-3 text-[11px] text-[#AAA] font-body">
          <span className="flex items-center gap-1"><User size={10} />{article.author}</span>
          <span>•</span>
          <span>{date}</span>
          {isDatabaseArticle(article) && (
            <>
              <span>•</span>
              <span className="flex items-center gap-0.5"><Eye size={10} />{article.read_count}</span>
              <span className="flex items-center gap-0.5"><Heart size={10} />{article.like_count}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
