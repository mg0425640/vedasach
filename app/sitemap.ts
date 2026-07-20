import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.vedasach.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${base}/blog`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${base}/shop`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/about`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${base}/contact`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${base}/dreams`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/health`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/ayurveda`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/yoga`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/beauty`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/nutrition`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/spirituality`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/home-remedies`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/world`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${base}/fifa-world-cup`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${base}/lifestyle`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/religion`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/business`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${base}/entertainment`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${base}/real-estate`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/legal`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/tech`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${base}/education`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/disclaimer`, priority: 0.3, changeFrequency: 'yearly' },
  ];

  const categorySlugs: Record<string, string> = {
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

  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, category, updated_at, published_at')
      .eq('is_published', true);

    if (articles) {
      articlePages = articles.map((a: any) => {
        const catSlug = categorySlugs[a.category] || 'blog';
        return {
          url: `${base}/${catSlug}/${a.slug}`,
          priority: 0.7,
          changeFrequency: 'weekly' as const,
          lastModified: a.updated_at || a.published_at ? new Date(a.updated_at || a.published_at) : undefined,
        };
      });
    }
  } catch {}

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .eq('in_stock', true);

    if (products) {
      productPages = products.map((p: any) => ({
        url: `${base}/shop/${p.slug}`,
        priority: 0.6,
        changeFrequency: 'weekly' as const,
      }));
    }
  } catch {}

  return [...staticPages, ...articlePages, ...productPages];
}
