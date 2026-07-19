import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, TrendingUp, Flame, BookOpen, ShoppingBag } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import ProductCard from '@/components/products/ProductCard';
import AdBanner from '@/components/ads/AdBanner';
import HomeSearch from '@/components/home/HomeSearch';
import { supabase } from '@/lib/supabase-server';
import { Product } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'vedasach – Wellness, Ayurveda, Dream Meanings & Natural Health',
  description: "India's #1 wellness platform. Discover dream meanings, Ayurvedic wisdom, yoga, home remedies, beauty tips, and natural health solutions. Healthy Mind • Healthy Body • Positive Life.",
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'vedasach – Wellness, Ayurveda & Dream Meanings',
    description: "India's #1 wellness platform. Healthy Mind • Healthy Body • Positive Life.",
    url: 'https://vedasach.com',
    images: [{ url: '/logo.svg', width: 180, height: 48, alt: 'vedasach Logo' }],
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

const CATEGORY_SLUGS: Record<string, string> = {
  'Dream Meanings': 'dreams',
  'Health & Wellness': 'health',
  'Ayurveda': 'ayurveda',
  'Yoga & Meditation': 'yoga',
  'Beauty': 'beauty',
  'Nutrition': 'nutrition',
  'Spirituality': 'spirituality',
  'Home Remedies': 'home-remedies',
};

const STATIC_CATEGORIES = [
  { name: 'Dream Meanings', slug: 'dreams', icon: '🌙' },
  { name: 'Health & Wellness', slug: 'health', icon: '❤️' },
  { name: 'Ayurveda', slug: 'ayurveda', icon: '🌿' },
  { name: 'Yoga & Meditation', slug: 'yoga', icon: '🧘' },
  { name: 'Beauty', slug: 'beauty', icon: '💄' },
  { name: 'Nutrition', slug: 'nutrition', icon: '🥗' },
  { name: 'Spirituality', slug: 'spirituality', icon: '🙏' },
  { name: 'Home Remedies', slug: 'home-remedies', icon: '🏠' },
];

const AYURVEDA_HERBS = [
  { name: 'Ashwagandha', slug: 'ashwagandha-benefits-dosage', benefit: 'Stress Relief', image: 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Giloy', slug: 'giloy-benefits-immunity', benefit: 'Immunity', image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Turmeric', slug: 'benefits-of-turmeric', benefit: 'Anti-inflammatory', image: 'https://images.pexels.com/photos/1059907/pexels-photo-1059907.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Triphala', slug: 'triphala-benefits', benefit: 'Digestion', image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Brahmi', slug: 'brahmi-benefits', benefit: 'Memory', image: 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Neem', slug: 'neem-benefits', benefit: 'Skin Health', image: 'https://images.pexels.com/photos/4226893/pexels-photo-4226893.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Tulsi', slug: 'tulsi-benefits', benefit: 'Respiratory', image: 'https://images.pexels.com/photos/4226902/pexels-photo-4226902.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Shilajit', slug: 'shilajit-benefits', benefit: 'Energy', image: 'https://images.pexels.com/photos/4226898/pexels-photo-4226898.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

const TRENDING_SEARCHES = [
  'dream about snake',
  'ashwagandha benefits',
  'yoga for back pain',
  'dark circles remedies',
  'immunity boosters',
  'turmeric milk benefits',
];

async function loadData() {
  try {
    const [featured, trending, latest, prods] = await Promise.all([
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
    };
  } catch {
    return { featuredArticles: [], trendingArticles: [], latestArticles: [], products: [] };
  }
}

export default async function HomePage() {
  const { featuredArticles, trendingArticles, latestArticles, products } = await loadData();

  const heroArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1, 4);
  const getCategorySlug = (category: string) => CATEGORY_SLUGS[category] || category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: latestArticles.slice(0, 6).map((a, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://vedasach.in/${getCategorySlug(a.category)}/${a.slug}`,
      name: a.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero Section */}
      <section className="bg-[#F8F8F8] border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="tag-pill mb-4 inline-block">India's #1 Wellness Platform</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-[#111] leading-tight mb-4">
              Healthy Mind.<br className="hidden md:block" />
              Healthy Body. Positive Life.
            </h1>
            <p className="text-[#666] text-base md:text-lg font-body leading-relaxed">
              Discover dream meanings, Ayurvedic wisdom, yoga, home remedies, beauty tips, and natural health solutions.
            </p>
          </div>
          <HomeSearch trending={TRENDING_SEARCHES} />
        </div>
      </section>

      {/* Ad Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="home-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="divider-title">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <BookOpen size={14} className="text-brand" /> Explore Topics
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {STATIC_CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} className="group flex flex-col items-center text-center gap-2 p-4 bg-[#F8F8F8] hover:bg-brand hover:text-brand transition-all duration-300 card-hover">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide font-body leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      {heroArticle && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="divider-title">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Flame size={14} className="text-brand" /> Featured Stories
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><ArticleCard article={heroArticle} variant="featured" /></div>
            <div className="space-y-4">
              {secondaryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* In-feed Ad */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <AdBanner slot="home-infeed-1" size="leaderboard" showGoogleFallback />
      </div>

      {/* Latest + Trending */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="divider-title">
              <h2 className="text-sm font-bold uppercase tracking-widest">Latest Articles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="btn-outline inline-flex items-center gap-2">
                View All Articles <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div>
            <div className="divider-title">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <TrendingUp size={14} className="text-brand" /> Trending
              </h2>
            </div>
            <div className="space-y-5">
              {trendingArticles.map((article, idx) => (
                <Link key={article.id} href={`/${getCategorySlug(article.category)}/${article.slug}`} className="flex gap-4 group">
                  <span className="text-3xl font-bold text-[#EEEEEE] font-display flex-shrink-0 leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <img src={article.image_url} alt={article.image_alt || article.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body">{article.category}</span>
                    <h3 className="text-sm font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug mt-0.5 font-body line-clamp-2">{article.title}</h3>
                    <span className="text-[11px] text-[#AAA] font-body">{article.read_count} reads</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8"><AdBanner slot="side-image-1" size="rectangle" showGoogleFallback /></div>
            <div className="mt-8"><AdBanner slot="side-image-2" size="rectangle" showGoogleFallback /></div>
          </div>
        </div>
      </section>

      {/* Ayurveda Herbs */}
      <section className="bg-[#F8F8F8] border-y border-[#E8E8E8] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="divider-title flex-1">
              <h2 className="text-sm font-bold uppercase tracking-widest">🌿 Ayurvedic Herbs</h2>
            </div>
            <Link href="/ayurveda" className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline ml-4 whitespace-nowrap">View All →</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {AYURVEDA_HERBS.map((herb) => (
              <Link key={herb.slug} href={`/ayurveda/${herb.slug}`} className="group flex flex-col items-center text-center gap-2">
                <div className="w-full aspect-square overflow-hidden rounded-full bg-[#EEE]">
                  <img src={herb.image} alt={herb.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold font-body text-[#111] group-hover:text-brand transition-colors">{herb.name}</p>
                  <p className="text-[10px] text-[#999] font-body">{herb.benefit}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="home-infeed-2" size="leaderboard" showGoogleFallback />
      </div>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="divider-title flex-1">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <ShoppingBag size={14} className="text-brand" /> Wellness Shop
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline ml-4 whitespace-nowrap">Shop All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Dream Meanings Feature */}
      <section className="bg-[#111] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="tag-pill mb-4 inline-block">🌙 Dream Interpretation</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">What Does Your Dream Mean?</h2>
              <p className="text-[#AAA] font-body leading-relaxed mb-6">
                Explore thousands of dream interpretations rooted in Hindu, Islamic, and Biblical traditions. From animals to natural elements — discover the symbolism your subconscious is sending you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dreams" className="btn-primary text-center">Explore Dream Meanings</Link>
                <Link href="/dreams" className="px-6 py-3 text-sm font-semibold uppercase tracking-widest border border-[#333] text-white hover:border-white transition-colors text-center font-body">Browse All Dreams</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Dream About Cow', slug: 'dream-about-cow-meaning', img: 'https://images.pexels.com/photos/735968/pexels-photo-735968.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'Dream About Snake', slug: 'dream-about-snake-meaning', img: 'https://images.pexels.com/photos/2062316/pexels-photo-2062316.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'Dream About Water', slug: 'dream-about-water-meaning', img: 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'Dream About Flying', slug: 'dream-about-flying-meaning', img: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=400' },
              ].map((item) => (
                <Link key={item.slug} href={`/dreams/${item.slug}`} className="group relative overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <p className="text-white text-[12px] font-semibold font-body leading-tight">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#F8F8F8] border-y border-[#E8E8E8] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Expert Articles' },
              { value: '50,000+', label: 'Monthly Readers' },
              { value: '500+', label: 'Dream Meanings' },
              { value: '200+', label: 'Wellness Products' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-[#111] mb-1">{stat.value}</div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#999] font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdBanner slot="home-bottom" size="leaderboard" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
