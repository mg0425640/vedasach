import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/shop`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/careers`, priority: 0.6, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/contact`, priority: 0.5, changeFrequency: 'monthly' },

    { url: `${SITE_URL}/dreams`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/health`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/ayurveda`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/yoga`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/beauty`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/nutrition`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/spirituality`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/home-remedies`, priority: 0.8, changeFrequency: 'weekly' },

    { url: `${SITE_URL}/world`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${SITE_URL}/fifa-world-cup`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${SITE_URL}/lifestyle`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/religion`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/business`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${SITE_URL}/entertainment`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${SITE_URL}/real-estate`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/legal`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/tech`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${SITE_URL}/education`, priority: 0.7, changeFrequency: 'weekly' },

    { url: `${SITE_URL}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/disclaimer`, priority: 0.3, changeFrequency: 'yearly' },
  ];

  // Fetch published and indexable articles from Supabase
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      canonical_url,
      published_at,
      last_updated,
      is_published,
      status,
      noindex
    `)
    .eq('is_published', true)
    .eq('status', 'published')
    .eq('noindex', false);

  // If Supabase fails, still return the static sitemap
  if (error) {
    console.error('Sitemap: Failed to fetch articles from Supabase:', error);
    return staticPages;
  }

  // Convert database articles into sitemap URLs
  const articlePages: MetadataRoute.Sitemap = (articles ?? [])
    .filter((article) => article.canonical_url)
    .map((article) => ({
      url: article.canonical_url,
      lastModified: article.last_updated || article.published_at || undefined,
      priority: 0.8,
      changeFrequency: 'weekly',
    }));

  // Return static pages + dynamic article pages
  return [...staticPages, ...articlePages];
}