import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { supabase } from '@/lib/supabase-server';
import { Product } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'VedaWell – Wellness, Ayurveda, Dream Meanings & Natural Health',
  description: "India's #1 wellness platform. Discover dream meanings, Ayurvedic wisdom, yoga, home remedies, beauty tips, and natural health solutions. Healthy Mind • Healthy Body • Positive Life.",
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'VedaWell – Wellness, Ayurveda & Dream Meanings',
    description: "India's #1 wellness platform. Healthy Mind • Healthy Body • Positive Life.",
    url: 'https://vedawell.in',
    images: [{ url: '/logo.svg', width: 180, height: 48, alt: 'VedaWell Logo' }],
  },
};

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  excerpt: string;
  excerpt_hi: string | null;
  image_url: string;
  image_alt: string | null;
  category: string;
  subcategory: string | null;
  subcategory_hi: string | null;
  author: string;
  published_at: string;
  read_count: number;
  like_count: number;
  share_count?: number;
  featured: boolean;
  trending: boolean;
}

async function loadData() {
  try {
    const [featured, trending, latest, prods, topNews, worldTop] = await Promise.all([
      supabase.from('articles')
        .select('id,slug,title,title_hi,excerpt,excerpt_hi,image_url,image_alt,category,subcategory,subcategory_hi,author,published_at,read_count,like_count,share_count,featured,trending')
        .eq('is_published', true).eq('featured', true)
        .order('published_at', { ascending: false }).limit(4),
      supabase.from('articles')
        .select('id,slug,title,title_hi,excerpt,excerpt_hi,image_url,image_alt,category,subcategory,subcategory_hi,author,published_at,read_count,like_count,share_count,featured,trending')
        .eq('is_published', true).order('read_count', { ascending: false }).limit(10),
      supabase.from('articles')
        .select('id,slug,title,title_hi,excerpt,excerpt_hi,image_url,image_alt,category,subcategory,subcategory_hi,author,published_at,read_count,like_count,share_count,featured,trending')
        .eq('is_published', true).order('published_at', { ascending: false }).limit(6),
      supabase.from('products')
        .select('id,slug,name,price,original_price,image_url,category,rating,review_count,badge,discount,in_stock')
        .limit(4),
      supabase.from('articles')
        .select('id,slug,title,title_hi,excerpt,excerpt_hi,image_url,image_alt,category,author,published_at,read_count')
        .eq('is_published', true).order('read_count', { ascending: false }).limit(11),
      supabase.from('articles')
        .select('id,slug,title,title_hi,image_url,image_alt,category,published_at,read_count')
        .eq('is_published', true).order('published_at', { ascending: false }).limit(10),
    ]);

    const products: Product[] = (prods.data || []).map((p: any) => ({
      id: p.id, slug: p.slug, name: p.name, price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      image: p.image_url, category: p.category, rating: Number(p.rating),
      reviews: p.review_count, badge: p.badge as 'NEW' | 'SALE' | 'HOT' | undefined,
      discount: p.discount || undefined, inStock: p.in_stock, tags: [],
    }));

    return {
      featuredArticles: (featured.data as DbArticle[]) || [],
      trendingArticles: (trending.data as DbArticle[]) || [],
      latestArticles: (latest.data as DbArticle[]) || [],
      products,
      topNewsArticles: (topNews.data as any[]) || [],
      worldTopArticles: (worldTop.data as any[]) || [],
    };
  } catch {
    return { featuredArticles: [], trendingArticles: [], latestArticles: [], products: [], topNewsArticles: [], worldTopArticles: [] };
  }
}

export default async function HomePage() {
  const data = await loadData();
  return <HomeContent {...data} />;
}
