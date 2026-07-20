import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/dashboard', '/dashboard/', '/cart', '/checkout', '/api/'],
    },
    sitemap: 'https://vedawell.in/sitemap.xml',
    host: 'https://vedawell.in',
  };
}
