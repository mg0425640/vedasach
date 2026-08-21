import { buildCategorySitemap } from '@/lib/sitemap-helpers';

export default async function sitemap() {
  return buildCategorySitemap('blog');
}
