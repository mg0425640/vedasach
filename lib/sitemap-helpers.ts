import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase-server';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

const SLUG_TO_DB_CATEGORY: Record<string, string> = {
  health: 'Health & Wellness',
  ayurveda: 'Ayurveda',
  yoga: 'Yoga & Meditation',
  beauty: 'Beauty',
  nutrition: 'Nutrition',
  'home-remedies': 'Home Remedies',
  spirituality: 'Spirituality',
  dreams: 'Dream Meanings',
  world: 'World',
  'fifa-world-cup': 'FIFA World Cup',
  lifestyle: 'Lifestyle',
  religion: 'Religion',
  business: 'Business',
  entertainment: 'Entertainment',
  'real-estate': 'Real Estate',
  legal: 'Legal',
  tech: 'Tech',
  education: 'Education',
};

const CATEGORIES_WITH_SLUG_PAGES = new Set([
  'ayurveda', 'beauty', 'dreams',
  'health', 'home-remedies', 'nutrition', 'spirituality', 'yoga',
]);

function getLastModified(a: { last_updated?: string | null; published_at?: string | null }): Date {
  return new Date(a.last_updated || a.published_at || new Date());
}

export async function buildCategorySitemap(categorySlug: string): Promise<MetadataRoute.Sitemap> {
  const staticEntry: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/${categorySlug}`, priority: 0.9, changeFrequency: 'daily', lastModified: new Date() },
  ];

  if (categorySlug === 'shop') return staticEntry;

  // Blog sitemap: include ALL published articles under /blog/[slug]
  if (categorySlug === 'blog') {
    const { data, error } = await supabase
      .from('articles')
      .select('slug,published_at,last_updated')
      .eq('is_published', true)
      .or('noindex.is.false,noindex.is.null');

    if (error || !data || data.length === 0) return staticEntry;

    const articleEntries: MetadataRoute.Sitemap = data.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: getLastModified(a),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    return [...staticEntry, ...articleEntries];
  }

  // Categories with their own [slug] pages: include only their articles
  if (CATEGORIES_WITH_SLUG_PAGES.has(categorySlug)) {
    const dbCategory = SLUG_TO_DB_CATEGORY[categorySlug];
    if (!dbCategory) return staticEntry;

    const { data, error } = await supabase
      .from('articles')
      .select('slug,published_at,last_updated')
      .eq('is_published', true)
      .eq('category', dbCategory)
      .or('noindex.is.false,noindex.is.null');

    if (error || !data || data.length === 0) return staticEntry;

    const articleEntries: MetadataRoute.Sitemap = data.map((a) => ({
      url: `${SITE_URL}/${categorySlug}/${a.slug}`,
      lastModified: getLastModified(a),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    return [...staticEntry, ...articleEntries];
  }

  // Categories without their own [slug] pages (world, business, tech, etc.):
  // their articles are served from /blog/[slug]
  const dbCategory = SLUG_TO_DB_CATEGORY[categorySlug];
  if (!dbCategory) return staticEntry;

  const { data, error } = await supabase
    .from('articles')
    .select('slug,published_at,last_updated')
    .eq('is_published', true)
    .eq('category', dbCategory)
    .or('noindex.is.false,noindex.is.null');

  if (error || !data || data.length === 0) return staticEntry;

  const articleEntries: MetadataRoute.Sitemap = data.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: getLastModified(a),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  return [...staticEntry, ...articleEntries];
}
