import ArticleDetailLayout from '@/components/shared/ArticleDetailLayout';
import { createClient } from '@supabase/supabase-js';
import { articleMetadata, articleJsonLd } from '@/lib/seo';

interface Props { params: { slug: string } }

async function getArticle(slug: string) {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from('articles')
    .select('title,excerpt,meta_title,meta_description,meta_keywords,og_image,image_url,author,published_at,last_updated,category,noindex,canonical_url')
    .eq('slug', slug).maybeSingle();
  return data;
}

export async function generateStaticParams() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from('articles').select('slug').eq('is_published', true);
  return (data || []).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const a = await getArticle(params.slug);
  return articleMetadata(params.slug, 'blog', 'Blog', a);
}

export default async function BlogArticlePage({ params }: Props) {
  const a = await getArticle(params.slug);
  const jsonLd = articleJsonLd(params.slug, 'blog', a);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleDetailLayout slug={params.slug} categorySlug="blog" categoryLabel="Blog" />
    </>
  );
}
