import ArticleDetailLayout from '@/components/shared/ArticleDetailLayout';
import { createClient } from '@supabase/supabase-js';

interface Props { params: { slug: string } }

async function getArticle(slug: string) {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from('articles').select('title,excerpt,meta_title,meta_description,meta_keywords,og_image,image_url').eq('slug', slug).maybeSingle();
  return data;
}

export async function generateStaticParams() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from('articles').select('slug').eq('category', 'World').eq('is_published', true);
  return (data || []).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const a = await getArticle(params.slug);
  return {
    title: a?.meta_title || a?.title || 'World News – VedaSach',
    description: a?.meta_description || a?.excerpt || 'Latest world news, global events, and international affairs from around the globe.',
    keywords: a?.meta_keywords?.join(', '),
    openGraph: { title: a?.meta_title || a?.title, description: a?.meta_description || a?.excerpt, images: a?.og_image || a?.image_url ? [{ url: (a?.og_image || a?.image_url)! }] : undefined },
    twitter: { card: 'summary_large_image', title: a?.meta_title || a?.title },
  };
}

export default function WorldNewsPage({ params }: Props) {
  return <ArticleDetailLayout slug={params.slug} categorySlug="world" categoryLabel="World" />;
}
