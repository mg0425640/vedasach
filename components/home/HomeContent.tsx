'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Flame, BookOpen, ShoppingBag } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import ProductCard from '@/components/products/ProductCard';
import AdBanner from '@/components/ads/AdBanner';
import HomeSearch from '@/components/home/HomeSearch';
import TopNews from '@/components/home/TopNews';
import WorldTop from '@/components/home/WorldTop';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/lib/types';

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

const STATIC_CATEGORIES = [
  { name: 'Dream Meanings', name_hi: 'स्वप्न अर्थ', slug: 'dreams', icon: '🌙' },
  { name: 'Health & Wellness', name_hi: 'स्वास्थ्य', slug: 'health', icon: '❤️' },
  { name: 'Ayurveda', name_hi: 'आयुर्वेद', slug: 'ayurveda', icon: '🌿' },
  { name: 'Yoga & Meditation', name_hi: 'योग और ध्यान', slug: 'yoga', icon: '🧘' },
  { name: 'Beauty', name_hi: 'सौंदर्य', slug: 'beauty', icon: '💄' },
  { name: 'Nutrition', name_hi: 'पोषण', slug: 'nutrition', icon: '🥗' },
  { name: 'Spirituality', name_hi: 'अध्यात्म', slug: 'spirituality', icon: '🙏' },
  { name: 'Home Remedies', name_hi: 'घरेलू उपाय', slug: 'home-remedies', icon: '🏠' },
];

const AYURVEDA_HERBS = [
  { name: 'Ashwagandha', slug: 'ashwagandha-benefits-dosage', benefit: 'Stress Relief', benefit_hi: 'तनाव मुक्ति', image: 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Giloy', slug: 'giloy-benefits-immunity', benefit: 'Immunity', benefit_hi: 'रोग प्रतिरक्षा', image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Turmeric', slug: 'benefits-of-turmeric', benefit: 'Anti-inflammatory', benefit_hi: 'सूजन रोधी', image: 'https://images.pexels.com/photos/1059907/pexels-photo-1059907.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Triphala', slug: 'triphala-benefits', benefit: 'Digestion', benefit_hi: 'पाचन', image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Brahmi', slug: 'brahmi-benefits', benefit: 'Memory', benefit_hi: 'स्मरण शक्ति', image: 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Neem', slug: 'neem-benefits', benefit: 'Skin Health', benefit_hi: 'त्वचा स्वास्थ्य', image: 'https://images.pexels.com/photos/4226893/pexels-photo-4226893.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Tulsi', slug: 'tulsi-benefits', benefit: 'Respiratory', benefit_hi: 'श्वसन', image: 'https://images.pexels.com/photos/4226902/pexels-photo-4226902.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Shilajit', slug: 'shilajit-benefits', benefit: 'Energy', benefit_hi: 'ऊर्जा', image: 'https://images.pexels.com/photos/4226898/pexels-photo-4226898.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

const TRENDING_SEARCHES = [
  'dream about snake',
  'ashwagandha benefits',
  'yoga for back pain',
  'dark circles remedies',
  'immunity boosters',
  'turmeric milk benefits',
];

export default function HomeContent({
  featuredArticles,
  trendingArticles,
  latestArticles,
  products,
  topNewsArticles,
  worldTopArticles,
}: {
  featuredArticles: DbArticle[];
  trendingArticles: DbArticle[];
  latestArticles: DbArticle[];
  products: Product[];
  topNewsArticles: any[];
  worldTopArticles: any[];
}) {
  const { lang, t } = useLanguage();
  const hi = lang === 'hi';

  const heroArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1, 4);
  const getCategorySlug = (category: string) => CATEGORY_SLUGS[category] || category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: latestArticles.slice(0, 6).map((a, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://vedasach.com/${getCategorySlug(a.category)}/${a.slug}`,
      name: a.title,
    })),
  };

  const stats = [
    { value: '1,000+', label: hi ? 'विशेषज्ञ लेख' : 'Expert Articles' },
    { value: '5,000+', label: hi ? 'मासिक पाठक' : 'Monthly Readers' },
    { value: '50+', label: hi ? 'स्वप्न अर्थ' : 'Dream Meanings' },
    { value: '20+', label: hi ? 'वेलनेस उत्पाद' : 'Wellness Products' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero Section */}
      <section className="bg-[#F8F8F8] border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="tag-pill mb-4 inline-block">{hi ? 'भारत का #1 वेलनेस प्लेटफ़ॉर्म' : "India's #1 Wellness Platform"}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-[#111] leading-tight mb-4">
              {hi ? (
                <>स्वस्थ मन।<br className="hidden md:block" /> स्वस्थ शरीर। सकारात्मक जीवन।</>
              ) : (
                <>Healthy Mind.<br className="hidden md:block" /> Healthy Body. Positive Life.</>
              )}
            </h1>
            <p className="text-[#666] text-base md:text-lg font-body leading-relaxed">
              {hi
                ? 'स्वप्न अर्थ, आयुर्वेदिक ज्ञान, योग, घरेलू उपाय, सौंदर्य युक्तियां और प्राकृतिक स्वास्थ्य समाधान खोजें।'
                : 'Discover dream meanings, Ayurvedic wisdom, yoga, home remedies, beauty tips, and natural health solutions.'}
            </p>
          </div>
          <HomeSearch trending={TRENDING_SEARCHES} />
        </div>
      </section>

      {/* Ad Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="home-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      {/* Top News */}
      <TopNews articles={topNewsArticles} />

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="divider-title">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <BookOpen size={14} className="text-brand" /> {hi ? 'विषय खोजें' : 'Explore Topics'}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {STATIC_CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} className="group flex flex-col items-center text-center gap-2 p-4 bg-[#F8F8F8] hover:bg-brand hover:text-brand transition-all duration-300 card-hover">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide font-body leading-tight">{hi ? cat.name_hi : cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* World Top with Search */}
      <WorldTop initialArticles={worldTopArticles} />

      {/* Featured Articles */}
      {heroArticle && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="divider-title mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Flame size={14} className="text-brand" /> {hi ? 'विशेष कहानियां' : 'Featured Stories'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Hero Article (Spans 2 columns) */}
            <div className="lg:col-span-2">
              <ArticleCard article={heroArticle} variant="featured" />
            </div>

            {/* Right side: 4 Secondary Articles */}
            <div className="space-y-4">
              {secondaryArticles.slice(0, 4).map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  variant="horizontal" 
                />
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
              <h2 className="text-sm font-bold uppercase tracking-widest">{hi ? 'नवीनतम लेख' : 'Latest Articles'}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="btn-outline inline-flex items-center gap-2">
                {hi ? 'सभी लेख देखें' : 'View All Articles'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div>
            <div className="divider-title">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <TrendingUp size={14} className="text-brand" /> {hi ? 'ट्रेंडिंग' : 'Trending'}
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
                    <h3 className="text-sm font-semibold text-[#111] group-hover:text-brand transition-colors leading-snug mt-0.5 font-body line-clamp-2">{hi && article.title_hi ? article.title_hi : article.title}</h3>
                    <span className="text-[11px] text-[#AAA] font-body">{article.read_count} {hi ? 'पठन' : 'reads'}</span>
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
              <h2 className="text-sm font-bold uppercase tracking-widest">🌿 {hi ? 'आयुर्वेदिक जड़ी-बूटियां' : 'Ayurvedic Herbs'}</h2>
            </div>
            <Link href="/ayurveda" className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline ml-4 whitespace-nowrap">{hi ? 'सभी देखें →' : 'View All →'}</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {AYURVEDA_HERBS.map((herb) => (
              <Link key={herb.slug} href={`/ayurveda/${herb.slug}`} className="group flex flex-col items-center text-center gap-2">
                <div className="w-full aspect-square overflow-hidden rounded-full bg-[#EEE]">
                  <img src={herb.image} alt={herb.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <p className="text-[12px] font-bold font-body text-[#111] group-hover:text-brand transition-colors">{herb.name}</p>
                  <p className="text-[11px] text-[#999] font-body">{hi ? herb.benefit_hi : herb.benefit}</p>
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
                <ShoppingBag size={14} className="text-brand" /> {hi ? 'वेलनेस शॉप' : 'Wellness Shop'}
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline ml-4 whitespace-nowrap">{hi ? 'सभी खरीदें →' : 'Shop All →'}</Link>
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
              <span className="tag-pill mb-4 inline-block">🌙 {hi ? 'स्वप्न व्याख्या' : 'Dream Interpretation'}</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {hi ? 'आपके स्वप्न का क्या अर्थ है?' : 'What Does Your Dream Mean?'}
              </h2>
              <p className="text-[#AAA] font-body leading-relaxed mb-6">
                {hi
                  ? 'हिंदू, इस्लामी और बाइबिल परंपराओं में निहित हजारों स्वप्न व्याख्याएं खोजें। जानवरों से लेकर प्राकृतिक तत्वों तक — वह प्रतीकवाद खोजें जो आपका अचेतन भेज रहा है।'
                  : 'Explore thousands of dream interpretations rooted in Hindu, Islamic, and Biblical traditions. From animals to natural elements — discover the symbolism your subconscious is sending you.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dreams" className="btn-primary text-center">{hi ? 'स्वप्न अर्थ खोजें' : 'Explore Dream Meanings'}</Link>
                <Link href="/dreams" className="px-6 py-3 text-sm font-semibold uppercase tracking-widest border border-[#333] text-white hover:border-white transition-colors text-center font-body">{hi ? 'सभी स्वप्न देखें' : 'Browse All Dreams'}</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: hi ? 'गाय का स्वप्न' : 'Dream About Cow', slug: 'dream-about-cow-meaning', img: 'https://images.pexels.com/photos/735968/pexels-photo-735968.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: hi ? 'सांप का स्वप्न' : 'Dream About Snake', slug: 'dream-about-snake-meaning', img: 'https://images.pexels.com/photos/2062316/pexels-photo-2062316.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: hi ? 'पानी का स्वप्न' : 'Dream About Water', slug: 'dream-about-water-meaning', img: 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: hi ? 'उड़ने का स्वप्न' : 'Dream About Flying', slug: 'dream-about-flying-meaning', img: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=400' },
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
            {stats.map((stat) => (
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
