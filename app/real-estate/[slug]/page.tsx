import ArticleDetailLayout from '@/components/shared/ArticleDetailLayout';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

// Revalidate statically generated pages in the background every hour (optional)
export const revalidate = 3600;
export const dynamicParams = true;

async function getArticle(slug: string) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data } = await sb
    .from('articles')
    .select('title,title_hi,excerpt,excerpt_hi,meta_title,meta_description,meta_keywords,og_image,image_url')
    .eq('slug', slug)
    .maybeSingle();

  return data;
}

export async function generateStaticParams() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await sb
    .from('articles')
    .select('slug')
    .eq('category', 'Real Estate')
    .eq('is_published', true);

  return (data || []).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);

  // If a is null, provide fallback metadata immediately
  if (!a) {
    return {
      title: 'Article Not Found – vedasach',
      description: 'The article you are looking for does not exist.',
    };
  }

  const title = a.meta_title || a.title || 'Real Estate Article – vedasach';
  const description = a.meta_description || a.excerpt || 'Latest real estate news, property updates, and market analysis on vedasach.';
  const imageUrl = a.og_image || a.image_url;

  // Use optional chaining with a fallback for the join
  const keywords = Array.isArray(a.meta_keywords)
    ? a.meta_keywords.join(', ')
    : typeof a.meta_keywords === 'string' 
      ? a.meta_keywords 
      : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function RealEstatePage({ params }: Props) {
  const { slug } = await params;

  return (
    <ArticleDetailLayout
      slug={slug}
      categorySlug="Real-Estate"
      categoryLabel="Real Estate"
    />
  );
}