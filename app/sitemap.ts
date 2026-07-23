import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://vedasach.com';
  const today = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/shop`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    {
      url: `${base}/dreams`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/health`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/ayurveda`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/yoga`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/beauty`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/nutrition`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/spirituality`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/home-remedies`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${base}/world`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/fifa-world-cup`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/business`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/tech`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/politics`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/sports`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/science`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/healthcare`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    {
      url: `${base}/lifestyle`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/religion`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/real-estate`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/legal`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/education`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/travel`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/automobile`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/agriculture`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/environment`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    {
      url: `${base}/about`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/careers`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/contact`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    {
      url: `${base}/privacy`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
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

    'Science': 'science',
    'Sports': 'sports',
    'Travel': 'travel',
    'Healthcare': 'healthcare',
    'Automobile': 'automobile',
    'Agriculture': 'agriculture',
    'Environment': 'environment',
    'Politics': 'politics',
  };

  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, category, updated_at, published_at')
      .eq('is_published', true);

    if (articles) {
      articlePages = articles.map((article: any) => ({
        url: `${base}/${categorySlugs[article.category] || 'blog'}/${article.slug}`,
        lastModified: article.updated_at
          ? new Date(article.updated_at)
          : article.published_at
          ? new Date(article.published_at)
          : today,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error(error);
  }

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('in_stock', true);

    if (products) {
      productPages = products.map((product: any) => ({
        url: `${base}/shop/${product.slug}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : today,
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error(error);
  }

  return [
    ...staticPages,
    ...articlePages,
    ...productPages,
  ];
}