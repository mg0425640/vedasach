import type { Metadata } from 'next';

export const SITE_URL = 'https://www.vedasach.com';
export const SITE_NAME = 'VedaSach';
export const SITE_TAGLINE = 'Wellness, Ayurveda, Dream Meanings & Natural Health';

export const DEFAULT_OG_IMAGE = 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop';

interface CategorySeoConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
}

export const CATEGORY_SEO: Record<string, CategorySeoConfig> = {
  yoga: {
    slug: 'yoga',
    title: 'Yoga & Meditation – Poses, Pranayama, Asanas Guide',
    description: 'Learn yoga poses, pranayama breathing exercises, and meditation techniques for mind-body balance. Step-by-step guides for beginners and advanced practitioners.',
    keywords: ['yoga', 'yoga poses', 'pranayama', 'meditation', 'asanas', 'yoga for beginners', 'yoga benefits', 'mindfulness', 'breathing exercises'],
    ogImage: 'https://images.pexels.com/photos/2985098/pexels-photo-2985098.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  health: {
    slug: 'health',
    title: 'Health & Wellness – Evidence-Based Health Guidance',
    description: 'Evidence-based health guidance for weight loss, diabetes, digestion, immunity, and more. Trusted medical information reviewed by experts.',
    keywords: ['health', 'wellness', 'weight loss', 'diabetes', 'digestion', 'immunity', 'health tips', 'natural health', 'healthy living'],
    ogImage: 'https://images.pexels.com/photos/4662338/pexels-photo-4662338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  beauty: {
    slug: 'beauty',
    title: 'Beauty – Natural Beauty Tips, Ayurvedic Skincare & DIY',
    description: 'Natural beauty tips, DIY face packs, and Ayurvedic skincare secrets for a radiant glow. Home remedies for skin, hair, and overall beauty.',
    keywords: ['beauty', 'skincare', 'natural beauty', 'ayurvedic beauty', 'face packs', 'DIY beauty', 'hair care', 'glowing skin', 'beauty tips'],
    ogImage: 'https://images.pexels.com/photos/3373721/pexels-photo-3373721.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  blog: {
    slug: 'blog',
    title: 'Blog – Wellness Articles, Health Tips & Natural Living',
    description: 'Read our latest wellness articles covering Ayurveda, yoga, dream meanings, home remedies, nutrition, spirituality, and natural health tips.',
    keywords: ['blog', 'wellness blog', 'health articles', 'ayurveda blog', 'natural living', 'wellness tips', 'health blog india'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  dreams: {
    slug: 'dreams',
    title: 'Dream Meanings – Interpret Dreams in Hindu, Islamic & Biblical',
    description: 'Explore the symbolism behind your dreams across Hindu, Islamic, and Biblical traditions. Decode what your dreams mean with expert interpretations.',
    keywords: ['dream meanings', 'dream interpretation', 'dream symbols', 'swapna phal', 'hindu dream meaning', 'islamic dream meaning', 'dream dictionary'],
    ogImage: 'https://images.pexels.com/photos/8185566/pexels-photo-8185566.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  ayurveda: {
    slug: 'ayurveda',
    title: 'Ayurveda – Herbs, Treatments & Holistic Health Wisdom',
    description: 'Ancient Ayurvedic wisdom — herbs, treatments, and lifestyle practices for holistic health. Learn about Ayurvedic remedies for common ailments.',
    keywords: ['ayurveda', 'ayurvedic herbs', 'ayurvedic treatment', 'holistic health', 'natural remedies', 'ayurvedic medicine', 'doshas', 'ayurveda lifestyle'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  nutrition: {
    slug: 'nutrition',
    title: 'Nutrition – Food as Medicine, Diet Plans & Superfoods',
    description: 'Food as medicine — guides on fruits, vegetables, superfoods, and balanced diet. Nutrition tips for weight management, immunity, and healthy living.',
    keywords: ['nutrition', 'diet plan', 'superfoods', 'balanced diet', 'healthy eating', 'nutrition tips', 'food as medicine', 'diet chart'],
    ogImage: 'https://images.pexels.com/photos/8844387/pexels-photo-8844387.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  spirituality: {
    slug: 'spirituality',
    title: 'Spirituality – Mantras, Meditation, Vastu & Astrology',
    description: 'Mantras, meditation, Vastu Shastra, astrology, and Vedic wisdom for inner peace. Explore spiritual practices for daily life.',
    keywords: ['spirituality', 'mantras', 'meditation', 'vastu shastra', 'astrology', 'vedic wisdom', 'inner peace', 'spiritual practices'],
    ogImage: 'https://images.pexels.com/photos/966099/pexels-photo-966099.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  'home-remedies': {
    slug: 'home-remedies',
    title: 'Home Remedies – Natural Remedies from Your Kitchen',
    description: 'Time-tested natural remedies using ingredients from your kitchen and garden. Safe, effective, side-effect free home remedies for common ailments.',
    keywords: ['home remedies', 'natural remedies', 'gharelu nuskhe', 'kitchen remedies', 'home remedies for cold', 'natural cure', 'ayurvedic home remedies'],
    ogImage: 'https://images.pexels.com/photos/5480036/pexels-photo-5480036.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  world: {
    slug: 'world',
    title: 'World News – Latest Global Events & International Affairs',
    description: 'Latest world news, global events, and international affairs from around the globe. Stay updated with breaking world news.',
    keywords: ['world news', 'global news', 'international news', 'world events', 'breaking news', 'global affairs'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  'fifa-world-cup': {
    slug: 'fifa-world-cup',
    title: 'FIFA World Cup – News, Matches, Fixtures & Results',
    description: 'FIFA World Cup news, match updates, fixtures, results, and analysis. Follow your favorite teams and players.',
    keywords: ['fifa world cup', 'football', 'soccer', 'world cup news', 'match results', 'fixtures'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  lifestyle: {
    slug: 'lifestyle',
    title: 'Lifestyle – Tips, Trends & Inspiration for Modern Living',
    description: 'Lifestyle tips, trends, and inspiration for modern living. Discover wellness lifestyle, healthy habits, and mindful living.',
    keywords: ['lifestyle', 'lifestyle tips', 'modern living', 'healthy lifestyle', 'wellness lifestyle', 'mindful living'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  religion: {
    slug: 'religion',
    title: 'Religion – Spiritual Guidance & Faith Traditions',
    description: 'Religion news, spiritual guidance, and articles on faith traditions. Explore Hindu, Islamic, Christian, and other religious teachings.',
    keywords: ['religion', 'spiritual guidance', 'faith', 'hindu religion', 'islamic religion', 'religious articles', 'dharma'],
    ogImage: 'https://images.pexels.com/photos/966099/pexels-photo-966099.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  business: {
    slug: 'business',
    title: 'Business News – Market Updates, Startups & Economy',
    description: 'Business news, market updates, startups, and economic analysis. Stay informed about the latest business trends and opportunities.',
    keywords: ['business news', 'market updates', 'startups', 'economy', 'business trends', 'stock market', 'business india'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  entertainment: {
    slug: 'entertainment',
    title: 'Entertainment – Bollywood, Movies, Music & Celebrity News',
    description: 'Entertainment news, Bollywood, movies, music, and celebrity updates. Get the latest from the world of entertainment.',
    keywords: ['entertainment', 'bollywood', 'movies', 'music', 'celebrity news', 'entertainment news india'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  'real-estate': {
    slug: 'real-estate',
    title: 'Real Estate – Property Trends & Investment Insights',
    description: 'Real estate news, property trends, and investment insights. Make informed property decisions with our expert analysis.',
    keywords: ['real estate', 'property', 'property trends', 'investment', 'real estate india', 'property news'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  legal: {
    slug: 'legal',
    title: 'Legal News – Law Updates, Court Rulings & Legal Analysis',
    description: 'Legal news, law updates, court rulings, and legal analysis. Stay informed about important legal developments.',
    keywords: ['legal news', 'law updates', 'court rulings', 'legal analysis', 'law india', 'legal advice'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  tech: {
    slug: 'tech',
    title: 'Tech News – Gadgets, AI, Startups & Innovation',
    description: 'Technology news, gadgets, AI, startups, and innovation. Latest tech updates and in-depth reviews.',
    keywords: ['tech news', 'technology', 'gadgets', 'ai', 'artificial intelligence', 'startups', 'innovation', 'tech india'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  education: {
    slug: 'education',
    title: 'Education – Career Guidance, Exams & Learning Resources',
    description: 'Education news, career guidance, exams, and learning resources. Expert advice for students and professionals.',
    keywords: ['education', 'career guidance', 'exams', 'learning resources', 'education news india', 'study tips'],
    ogImage: 'https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
  shop: {
    slug: 'shop',
    title: 'Wellness Shop – Ayurvedic Products, Supplements & Organic Foods',
    description: 'Shop curated Ayurvedic supplements, natural beauty products, yoga accessories, and organic foods. Quality products for your wellness journey.',
    keywords: ['wellness shop', 'ayurvedic products', 'supplements', 'organic foods', 'natural beauty products', 'yoga accessories', 'buy wellness products'],
    ogImage: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  },
};

export function categoryMetadata(slug: string): Metadata {
  const cfg = CATEGORY_SEO[slug];
  if (!cfg) {
    return {
      title: `${SITE_NAME} – ${SITE_TAGLINE}`,
      description: "India's trusted wellness platform covering dream meanings, Ayurveda, yoga, home remedies, beauty, nutrition, and spirituality.",
    };
  }

  const url = `${SITE_URL}/${cfg.slug}`;
  return {
    title: cfg.title,
    description: cfg.description,
    keywords: cfg.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: cfg.title,
      description: cfg.description,
      url,
      images: [{ url: cfg.ogImage, width: 1200, height: 630, alt: cfg.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.title,
      description: cfg.description,
      images: [cfg.ogImage],
    },
  };
}

export const CATEGORY_SLUG_MAP: Record<string, string> = {
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

export const ALL_CATEGORY_SLUGS = Object.keys(CATEGORY_SEO).filter((s) => s !== 'shop');

interface ArticleSeoData {
  title: string | null;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image: string | null;
  image_url: string | null;
  author?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  category?: string | null;
}

export function articleMetadata(slug: string, categorySlug: string, categoryLabel: string, data: ArticleSeoData | null): Metadata {
  const url = `${SITE_URL}/${categorySlug}/${slug}`;
  const title = data?.meta_title || data?.title || `${categoryLabel} Article – ${SITE_NAME}`;
  const description = data?.meta_description || data?.excerpt || `${categoryLabel} articles on ${SITE_NAME}.`;
  const imageUrl = data?.og_image || data?.image_url || CATEGORY_SEO[categorySlug]?.ogImage || DEFAULT_OG_IMAGE;
  const keywords = Array.isArray(data?.meta_keywords) && data!.meta_keywords!.length > 0
    ? data!.meta_keywords!.join(', ')
    : CATEGORY_SEO[categorySlug]?.keywords.join(', ');

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      publishedTime: data?.published_at || undefined,
      modifiedTime: data?.updated_at || undefined,
      authors: data?.author ? [data.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function articleJsonLd(slug: string, categorySlug: string, data: ArticleSeoData | null): Record<string, unknown> {
  const url = `${SITE_URL}/${categorySlug}/${slug}`;
  const title = data?.meta_title || data?.title || `${SITE_NAME} Article`;
  const description = data?.meta_description || data?.excerpt || '';
  const imageUrl = data?.og_image || data?.image_url || CATEGORY_SEO[categorySlug]?.ogImage || DEFAULT_OG_IMAGE;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    url,
    author: {
      '@type': 'Organization',
      name: data?.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    datePublished: data?.published_at || new Date().toISOString(),
    dateModified: data?.updated_at || data?.published_at || new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
