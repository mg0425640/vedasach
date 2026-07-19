'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Tag, Share2, Heart, Bookmark, Eye, Loader as Loader2, Facebook, Twitter } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import PromotedContent from '@/components/shared/PromotedContent';
import Sidebar from '@/components/layout/Sidebar';
import ArticleCard from '@/components/articles/ArticleCard';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { useArticleInteractions } from '@/hooks/useArticleInteractions';

interface Article {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  excerpt: string;
  excerpt_hi: string | null;
  content: string;
  content_hi: string | null;
  category: string;
  subcategory: string | null;
  subcategory_hi: string | null;
  image_url: string;
  author: string;
  author_image: string | null;
  published_at: string;
  read_time: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  view_count: number;
  read_count: number;
  like_count: number;
  share_count: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
}

interface ArticleDetailLayoutProps {
  slug: string;
  categorySlug: string;
  categoryLabel: string;
  fallbackContent?: string;
}

const ARTICLE_TO_PRODUCT_CATEGORY: Record<string, string[]> = {
  'Ayurveda': ['Supplements', 'Wellness'],
  'Yoga & Meditation': ['Yoga Accessories', 'Wellness'],
  'Beauty': ['Skin Care', 'Hair Care'],
  'Health & Wellness': ['Supplements', 'Wellness', 'Organic Foods'],
  'Nutrition': ['Organic Foods', 'Supplements'],
  'Spirituality': ['Spirituality', 'Wellness'],
  'Home Remedies': ['Supplements', 'Wellness', 'Organic Foods'],
  'Dream Meanings': ['Wellness', 'Spirituality'],
};

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  rating: number;
  review_count: number;
  badge: string | null;
  discount: number | null;
  in_stock: boolean;
}

interface CommentRow {
  id: string;
  author_name: string;
  author_email: string;
  content: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

export default function ArticleDetailLayout({ slug, categorySlug, categoryLabel, fallbackContent }: ArticleDetailLayoutProps) {
  const { lang } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareToast, setShareToast] = useState('');
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  const {
    isLiked, isBookmarked, stats,
    checkInteractions, incrementReadCount,
    handleLike, handleShare, handleBookmark,
  } = useArticleInteractions(article?.id || '', {
    like_count: article?.like_count || 0,
    share_count: article?.share_count || 0,
    read_count: article?.read_count || 0,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (data) {
        setArticle(data as Article);

        // Load related
        const { data: rel } = await supabase
          .from('articles')
          .select('id,slug,title,title_hi,excerpt,excerpt_hi,image_url,category,subcategory,subcategory_hi,author,published_at,read_time,read_count,like_count,share_count,view_count,featured,trending,tags')
          .eq('category', data.category)
          .neq('id', data.id)
          .eq('is_published', true)
          .order('read_count', { ascending: false })
          .limit(3);

        setRelatedArticles((rel as Article[]) || []);

        // Load related products based on article category
        const productCats = ARTICLE_TO_PRODUCT_CATEGORY[data.category] || ['Wellness'];
        const { data: prods } = await supabase
          .from('products')
          .select('id,slug,name,price,original_price,image_url,category,rating,review_count,badge,discount,in_stock')
          .in('category', productCats)
          .eq('in_stock', true)
          .order('rating', { ascending: false })
          .limit(4);
        setRelatedProducts((prods as RelatedProduct[]) || []);

        // Load approved comments for this article
        const { data: commentsData } = await supabase
          .from('comments')
          .select('id, author_name, author_email, content, admin_reply, admin_reply_at, created_at')
          .eq('article_slug', slug)
          .eq('approved', true)
          .order('created_at', { ascending: false });
        setComments((commentsData as CommentRow[]) || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (article?.id) {
      checkInteractions();
      incrementReadCount();
    }
  }, [article?.id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const doShare = async (platform: string) => {
    await handleShare();
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl).catch(() => {});
      setShareToast(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!');
      setTimeout(() => setShareToast(''), 2500);
      return;
    }
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(displayTitle)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(displayTitle + ' ' + shareUrl)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-[#111] mb-3">Article Not Found</h1>
        <p className="text-[#666] font-body mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href={`/${categorySlug}`} className="btn-primary">{lang === 'hi' ? 'वापस जाएं' : 'Go Back'}</Link>
      </div>
    );
  }

  const displayTitle = lang === 'hi' && article.title_hi ? article.title_hi : article.title;
  const displayExcerpt = lang === 'hi' && article.excerpt_hi ? article.excerpt_hi : article.excerpt;
  const displayContent = lang === 'hi' && article.content_hi ? article.content_hi : (article.content || fallbackContent || '');
  const displaySubcat = lang === 'hi' && article.subcategory_hi ? article.subcategory_hi : article.subcategory;
  const publishDate = new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const isHealthCategory = ['health', 'home-remedies', 'ayurveda'].includes(categorySlug);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999] flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span>›</span>
          <Link href={`/${categorySlug}`} className="hover:text-brand">{categoryLabel}</Link>
          {displaySubcat && <><span>›</span><Link href={`/${categorySlug}?sub=${article.subcategory}`} className="hover:text-brand">{displaySubcat}</Link></>}
          <span>›</span>
          <span className="text-[#111] line-clamp-1 max-w-xs">{displayTitle}</span>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="banner-1" category={categorySlug} showGoogleFallback />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Article Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link href={`/${categorySlug}`} className="tag-pill">{categoryLabel}</Link>
                {displaySubcat && (
                  <Link href={`/${categorySlug}?sub=${article.subcategory}`} className="text-[10px] text-[#999] font-body uppercase tracking-wider hover:text-brand">
                    {displaySubcat}
                  </Link>
                )}
                {article.trending && <span className="text-[9px] font-bold uppercase tracking-wider bg-brand text-white px-2 py-0.5 font-body">Trending</span>}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#111] leading-tight mb-4">
                {displayTitle}
              </h1>
              <p className="text-lg text-[#555] font-body leading-relaxed mb-4">{displayExcerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#999] font-body mb-4">
                <span className="flex items-center gap-1.5">
                  <img
                    src={article.author_image || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50'}
                    alt={article.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {article.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={11} />{article.read_time} min read</span>
                <span>•</span>
                <span>{publishDate}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye size={11} />{stats.read_count}</span>
              </div>

              {/* Share + Engage Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-t border-b border-[#F0F0F0] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#999] font-body">{lang === 'hi' ? 'शेयर करें:' : 'Share:'}</span>
                  {[
                    { id: 'facebook', label: 'Facebook', color: 'hover:bg-blue-600 hover:text-white hover:border-blue-600' },
                    { id: 'twitter', label: 'Twitter', color: 'hover:bg-sky-500 hover:text-white hover:border-sky-500' },
                    { id: 'whatsapp', label: 'WhatsApp', color: 'hover:bg-green-500 hover:text-white hover:border-green-500' },
                    { id: 'copy', label: lang === 'hi' ? 'कॉपी' : 'Copy', color: 'hover:bg-[#111] hover:text-white hover:border-[#111]' },
                  ].map((s) => (
                    <button key={s.id} onClick={() => doShare(s.id)} className={`flex items-center gap-1 px-3 py-1 text-[10px] font-semibold border border-[#E8E8E8] text-[#555] transition-all font-body ${s.color}`}>
                      <Share2 size={9} />{s.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold border transition-all font-body ${isLiked ? 'bg-red-50 border-red-400 text-red-500' : 'border-[#E8E8E8] text-[#555] hover:border-red-400 hover:text-red-500'}`}
                  >
                    <Heart size={11} fill={isLiked ? 'currentColor' : 'none'} />
                    {stats.like_count}
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold border transition-all font-body ${isBookmarked ? 'bg-brand/10 border-brand text-brand' : 'border-[#E8E8E8] text-[#555] hover:border-brand hover:text-brand'}`}
                  >
                    <Bookmark size={11} fill={isBookmarked ? 'currentColor' : 'none'} />
                    {lang === 'hi' ? 'सेव' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Share toast */}
              {shareToast && (
                <div className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-3 py-2 font-body mb-4">
                  {shareToast}
                </div>
              )}
            </div>

            {/* Hero Image */}
            {article.image_url && (
              <div className="mb-6 overflow-hidden">
                <img src={article.image_url} alt={displayTitle} className="w-full h-64 md:h-96 object-cover" />
                <p className="text-[10px] text-[#AAA] font-body mt-1">{categoryLabel} | vedasach</p>
              </div>
            )}

            {/* Medical Disclaimer */}
            {isHealthCategory && (
              <div className="bg-[#FFF8F6] border border-[#FECDD3] p-4 mb-6 text-[12px] text-[#888] font-body leading-relaxed">
                <strong className="text-[#E84E1B]">{lang === 'hi' ? 'चिकित्सा अस्वीकरण:' : 'Medical Disclaimer:'}</strong>{' '}
                {lang === 'hi'
                  ? 'यह लेख केवल सूचनात्मक उद्देश्यों के लिए है। किसी भी नए उपचार, आहार या स्वास्थ्य नियम शुरू करने से पहले हमेशा एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श करें।'
                  : 'This article is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before starting any new treatment, diet, or health regimen.'
                }
              </div>
            )}

            {/* Mid Banner Ad (before content) */}
            <AdBanner slot="banner-2" category={categorySlug} className="mb-6" showGoogleFallback />

            {/* Article Content */}
            <div className="article-body mb-8" dangerouslySetInnerHTML={{ __html: displayContent }} />

            {/* Bottom Banner Ad */}
            <AdBanner slot="banner-3" category={categorySlug} className="my-6" showGoogleFallback />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="flex items-center gap-1 px-3 py-1 border border-[#E8E8E8] text-xs text-[#555] hover:border-brand hover:text-brand transition-all font-body">
                    <Tag size={10} />{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Box */}
            <div className="flex items-start gap-4 p-6 bg-[#F8F8F8] border border-[#E8E8E8] mb-8">
              <img
                src={article.author_image || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt={article.author}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand font-body mb-0.5">{lang === 'hi' ? 'द्वारा लिखित' : 'Written by'}</div>
                <h4 className="font-display text-base font-bold text-[#111]">{article.author}</h4>
                <p className="text-xs text-[#666] font-body mt-1">{lang === 'hi' ? 'आयुर्वेद, प्राकृतिक स्वास्थ्य और समग्र जीवन में गहरे ज्ञान के साथ विशेषज्ञ वेलनेस लेखक।' : 'Expert wellness writer and researcher with deep knowledge in Ayurveda, natural health, and holistic living.'}</p>
              </div>
            </div>

            {/* Promoted Content Widget */}
            {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <div className="divider-title mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {lang === 'hi' ? 'संबंधित उत्पाद' : 'Related Products'}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((p) => {
                  const product: Product = {
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    price: Number(p.price),
                    originalPrice: p.original_price ? Number(p.original_price) : undefined,
                    image: p.image_url,
                    category: p.category,
                    rating: Number(p.rating),
                    reviews: p.review_count,
                    badge: p.badge as Product['badge'],
                    discount: p.discount || undefined,
                    inStock: p.in_stock,
                  };
                  return <ProductCard key={p.id} product={product} />;
                })}
              </div>
            </div>
          )}

          {/* Promoted Content */}
          <PromotedContent category={categorySlug} limit={6} />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mb-8">
                <div className="divider-title mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest">{lang === 'hi' ? 'आपको यह भी पसंद आ सकता है' : 'You May Also Like'}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div>
              <div className="divider-title mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest">{lang === 'hi' ? `टिप्पणियाँ (${comments.length})` : `Comments (${comments.length})`}</h2>
              </div>

              {/* Existing Comments */}
              {comments.length > 0 && (
                <div className="space-y-4 mb-6">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-white p-4 border border-[#E8E8E8]">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FFF0EB] flex items-center justify-center text-sm font-bold text-brand flex-shrink-0">
                          {c.author_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-[#111] font-body">{c.author_name}</span>
                            <span className="text-[10px] text-[#999] font-body">{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <p className="text-sm text-[#333] font-body leading-relaxed">{c.content}</p>
                          {c.admin_reply && (
                            <div className="mt-3 bg-[#FFF8F6] border border-[#FFE8E0] p-3 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-[10px] text-white font-bold">A</div>
                                <span className="text-xs font-bold text-brand font-body">Admin Reply</span>
                              </div>
                              <p className="text-sm text-[#333] font-body">{c.admin_reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <div className="bg-[#F8F8F8] p-6 border border-[#E8E8E8]">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{lang === 'hi' ? 'टिप्पणी करें' : 'Leave a Comment'}</h3>
                {commentSuccess ? (
                  <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-body">
                    {lang === 'hi' ? 'आपकी टिप्पणी सफलतापूर्वक सबमिट हो गई है। अनुमोदन के बाद दिखाई देगी।' : 'Your comment has been submitted successfully. It will appear after approval.'}
                  </div>
                ) : (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
                      setCommentError(lang === 'hi' ? 'कृपया सभी फ़ील्ड भरें।' : 'Please fill in all fields.');
                      return;
                    }
                    setSubmittingComment(true);
                    setCommentError('');
                    const { error } = await supabase.from('comments').insert({
                      article_id: article?.id || null,
                      article_slug: slug,
                      author_name: commentForm.name.trim(),
                      author_email: commentForm.email.trim(),
                      content: commentForm.content.trim(),
                      approved: false,
                    });
                    setSubmittingComment(false);
                    if (error) {
                      setCommentError(lang === 'hi' ? 'टिप्पणी पोस्ट करने में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error posting comment. Please try again.');
                    } else {
                      setCommentSuccess(true);
                      setCommentForm({ name: '', email: '', content: '' });
                      setTimeout(() => setCommentSuccess(false), 5000);
                    }
                  }}>
                    {commentError && (
                      <div className="mb-3 bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-body">{commentError}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input type="text" required value={commentForm.name} onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })} placeholder={lang === 'hi' ? 'आपका नाम' : 'Your Name'} className="px-4 py-3 border border-[#E8E8E8] text-sm bg-white focus:outline-none focus:border-brand font-body" />
                      <input type="email" required value={commentForm.email} onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })} placeholder={lang === 'hi' ? 'आपका ईमेल' : 'Your Email'} className="px-4 py-3 border border-[#E8E8E8] text-sm bg-white focus:outline-none focus:border-brand font-body" />
                    </div>
                    <textarea rows={4} required value={commentForm.content} onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })} placeholder={lang === 'hi' ? 'अपने विचार साझा करें...' : 'Share your thoughts...'} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm bg-white focus:outline-none focus:border-brand mb-4 font-body resize-none" />
                    <button type="submit" disabled={submittingComment} className="btn-primary disabled:opacity-50">
                      {submittingComment ? (lang === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...') : (lang === 'hi' ? 'टिप्पणी पोस्ट करें' : 'Post Comment')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky-sidebar space-y-6">
              <Sidebar />
              <AdBanner slot="side-image-1" category={categorySlug} showGoogleFallback />
              <AdBanner slot="side-image-2" category={categorySlug} showGoogleFallback />
              <AdBanner slot="side-image-3" category={categorySlug} showGoogleFallback />
            </div>
          </div>
        </div>
      </div>

      {/* Global bottom ad */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner isGlobal slot="global" showGoogleFallback />
      </div>
    </>
  );
}
