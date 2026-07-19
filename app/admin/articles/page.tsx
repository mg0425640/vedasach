'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, Heart, Share2, Trash2, CreditCard as Edit3, Plus, X, Search, FileText, TrendingUp } from 'lucide-react';

const CATEGORIES = ['Ayurveda', 'Beauty', 'Dream Meanings', 'Health & Wellness', 'Home Remedies', 'Nutrition', 'Spirituality', 'Yoga & Meditation'];

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string | null;
  read_count: number;
  like_count: number;
  share_count: number;
  is_published: boolean;
  featured: boolean;
  trending: boolean;
  created_at: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  read_time: number;
  tags: string[];
  title_hi: string | null;
  excerpt_hi: string | null;
}

const emptyForm = {
  slug: '', title: '', title_hi: '', excerpt: '', excerpt_hi: '', content: '', content_hi: '',
  category: 'Ayurveda', subcategory: '', subcategory_hi: '', image_url: '', author: '', author_image: '',
  read_time: 5, tags: '', featured: false, trending: false, is_published: true,
  published_at: '', lucky_number: '', lucky_color: '', view_count: 0, read_count: 0, like_count: 0, share_count: 0,
  meta_title: '', meta_description: '', meta_keywords: '', meta_title_hi: '', meta_description_hi: '',
  canonical_url: '', og_image: '',
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'analytics'>('list');

  const loadArticles = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles((data as ArticleRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const now = new Date().toISOString();
    const payload = {
      slug,
      title: form.title,
      title_hi: form.title_hi || null,
      excerpt: form.excerpt,
      excerpt_hi: form.excerpt_hi || null,
      content: form.content,
      content_hi: form.content_hi || null,
      category: form.category,
      subcategory: form.subcategory || null,
      subcategory_hi: form.subcategory_hi || null,
      image_url: form.image_url,
      author: form.author || 'vedasach Editorial',
      author_image: form.author_image || null,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : now,
      read_time: Number(form.read_time) || 5,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      featured: form.featured,
      trending: form.trending,
      lucky_number: form.lucky_number ? Number(form.lucky_number) : null,
      lucky_color: form.lucky_color || null,
      view_count: Number(form.view_count) || 0,
      read_count: Number(form.read_count) || 0,
      like_count: Number(form.like_count) || 0,
      share_count: Number(form.share_count) || 0,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      meta_keywords: form.meta_keywords ? form.meta_keywords.split(',').map(t => t.trim()) : null,
      meta_title_hi: form.meta_title_hi || null,
      meta_description_hi: form.meta_description_hi || null,
      canonical_url: form.canonical_url || null,
      og_image: form.og_image || null,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from('articles').update(payload).eq('id', editingId);
    } else {
      await supabase.from('articles').insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadArticles();
  };

  const handleEdit = (a: ArticleRow) => {
    setEditingId(a.id);
    setForm({
      slug: a.slug, title: a.title, title_hi: a.title_hi || '', excerpt: a.excerpt,
      excerpt_hi: a.excerpt_hi || '', content: a.content || '', content_hi: (a as any).content_hi || '',
      category: a.category, subcategory: a.subcategory || '', subcategory_hi: (a as any).subcategory_hi || '',
      image_url: a.image_url || '', author: a.author, author_image: (a as any).author_image || '',
      read_time: a.read_time || 5, tags: (a.tags || []).join(', '),
      featured: a.featured || false, trending: a.trending || false, is_published: a.is_published,
      published_at: (a as any).published_at ? (a as any).published_at.split('T')[0] : '',
      lucky_number: (a as any).lucky_number || '', lucky_color: (a as any).lucky_color || '',
      view_count: (a as any).view_count || 0, read_count: a.read_count || 0,
      like_count: a.like_count || 0, share_count: a.share_count || 0,
      meta_title: (a as any).meta_title || '', meta_description: (a as any).meta_description || '',
      meta_keywords: (a as any).meta_keywords ? (a as any).meta_keywords.join(', ') : '',
      meta_title_hi: (a as any).meta_title_hi || '', meta_description_hi: (a as any).meta_description_hi || '',
      canonical_url: (a as any).canonical_url || '', og_image: (a as any).og_image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    await supabase.from('articles').delete().eq('id', id);
    loadArticles();
  };

  const totalReads = articles.reduce((s, a) => s + (a.read_count || 0), 0);
  const totalLikes = articles.reduce((s, a) => s + (a.like_count || 0), 0);
  const totalShares = articles.reduce((s, a) => s + (a.share_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-[#E84E1B] text-white' : 'bg-white border border-[#E8E8E8] text-[#666]'}`}>All Articles</button>
          <button onClick={() => setView('analytics')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'analytics' ? 'bg-[#E84E1B] text-white' : 'bg-white border border-[#E8E8E8] text-[#666]'}`}>Analytics</button>
        </div>
        <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#E84E1B] text-white rounded-lg text-sm font-medium hover:bg-[#d44416] transition-colors">
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {view === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center"><Eye className="w-5 h-5 text-cyan-600" /></div><div><p className="text-2xl font-bold font-heading">{totalReads.toLocaleString()}</p><p className="text-xs text-[#999]">Total Reads</p></div></div></div>
            <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center"><Heart className="w-5 h-5 text-pink-600" /></div><div><p className="text-2xl font-bold font-heading">{totalLikes.toLocaleString()}</p><p className="text-xs text-[#999]">Total Likes</p></div></div></div>
            <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><Share2 className="w-5 h-5 text-indigo-600" /></div><div><p className="text-2xl font-bold font-heading">{totalShares.toLocaleString()}</p><p className="text-xs text-[#999]">Total Shares</p></div></div></div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#F0F0F0]">
            <h2 className="font-heading font-bold text-base mb-4">Category Performance</h2>
            <div className="space-y-3">
              {CATEGORIES.map(cat => {
                const catArts = articles.filter(a => a.category === cat);
                const reads = catArts.reduce((s, a) => s + (a.read_count || 0), 0);
                const maxReads = Math.max(...CATEGORIES.map(c => articles.filter(a => a.category === c).reduce((s, a) => s + (a.read_count || 0), 0)), 1);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#333]">{cat}</span>
                      <span className="text-xs text-[#999]">{catArts.length} articles · {reads.toLocaleString()} reads</span>
                    </div>
                    <div className="h-2 bg-[#F8F8F8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#E84E1B] rounded-full transition-all" style={{ width: `${(reads / maxReads) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CCC]" />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" />
          </div>

          <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase tracking-wider">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase tracking-wider">Category</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase tracking-wider">Reads</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase tracking-wider">Likes</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-[#999]">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-[#999]">No articles found</td></tr>
                  ) : filtered.map(a => (
                    <tr key={a.id} className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#1A1A1A] max-w-xs truncate">{a.title}</p>
                        <p className="text-xs text-[#CCC]">/{a.slug}</p>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs text-[#666]">{a.category}</span></td>
                      <td className="px-4 py-3 text-center"><span className="text-sm text-[#333] flex items-center justify-center gap-1"><Eye className="w-3 h-3 text-[#CCC]" />{a.read_count}</span></td>
                      <td className="px-4 py-3 text-center"><span className="text-sm text-[#333] flex items-center justify-center gap-1"><Heart className="w-3 h-3 text-[#CCC]" />{a.like_count}</span></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                          {a.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(a)} className="p-1.5 hover:bg-[#FFF0EB] rounded text-[#666] hover:text-[#E84E1B] transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded text-[#666] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#F0F0F0] px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">{editingId ? 'Edit Article' : 'Add New Article'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1 hover:bg-[#F8F8F8] rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Title (Hindi)</label><input value={form.title_hi} onChange={e => setForm({ ...form, title_hi: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Author</label><input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Author Image URL</label><input value={form.author_image} onChange={e => setForm({ ...form, author_image: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Category *</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Subcategory</label><input value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Subcategory (Hindi)</label><input value={form.subcategory_hi} onChange={e => setForm({ ...form, subcategory_hi: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Read Time (min)</label><input type="number" value={form.read_time} onChange={e => setForm({ ...form, read_time: Number(e.target.value) })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Published At</label><input type="date" value={form.published_at} onChange={e => setForm({ ...form, published_at: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Lucky Number</label><input type="number" value={form.lucky_number} onChange={e => setForm({ ...form, lucky_number: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Image URL</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://images.pexels.com/..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Lucky Color</label><input value={form.lucky_color} onChange={e => setForm({ ...form, lucky_color: e.target.value })} placeholder="Red, Blue..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Excerpt *</label><textarea required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Excerpt (Hindi)</label><textarea value={form.excerpt_hi} onChange={e => setForm({ ...form, excerpt_hi: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Content (HTML) *</label><textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} placeholder="<h2>Heading</h2><p>Content...</p>" className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm font-mono focus:outline-none focus:border-[#E84E1B]" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Content (Hindi HTML)</label><textarea value={form.content_hi} onChange={e => setForm({ ...form, content_hi: e.target.value })} rows={6} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm font-mono focus:outline-none focus:border-[#E84E1B]" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Tags (comma-separated)</label><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="ayurveda, herbs, health" className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div className="border-t pt-4 mt-4"><p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-3">SEO & Meta</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Meta Title</label><input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Meta Title (Hindi)</label><input value={form.meta_title_hi} onChange={e => setForm({ ...form, meta_title_hi: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Meta Description</label><textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Meta Description (Hindi)</label><textarea value={form.meta_description_hi} onChange={e => setForm({ ...form, meta_description_hi: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Meta Keywords (comma-separated)</label><input value={form.meta_keywords} onChange={e => setForm({ ...form, meta_keywords: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Canonical URL</label><input value={form.canonical_url} onChange={e => setForm({ ...form, canonical_url: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">OG Image URL</label><input value={form.og_image} onChange={e => setForm({ ...form, og_image: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div className="border-t pt-4 mt-4"><p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-3">Analytics Counters</p></div>
              <div className="grid grid-cols-4 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Views</label><input type="number" value={form.view_count} onChange={e => setForm({ ...form, view_count: Number(e.target.value) })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Reads</label><input type="number" value={form.read_count} onChange={e => setForm({ ...form, read_count: Number(e.target.value) })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Likes</label><input type="number" value={form.like_count} onChange={e => setForm({ ...form, like_count: Number(e.target.value) })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Shares</label><input type="number" value={form.share_count} onChange={e => setForm({ ...form, share_count: Number(e.target.value) })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-[#333]"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="rounded" /> Published</label>
                <label className="flex items-center gap-2 text-sm text-[#333]"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" /> Featured</label>
                <label className="flex items-center gap-2 text-sm text-[#333]"><input type="checkbox" checked={form.trending} onChange={e => setForm({ ...form, trending: e.target.checked })} className="rounded" /> Trending</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-[#E84E1B] text-white rounded-lg text-sm font-medium hover:bg-[#d44416] disabled:opacity-50 transition-colors">{saving ? 'Saving...' : editingId ? 'Update Article' : 'Save Article'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2.5 border border-[#E8E8E8] rounded-lg text-sm font-medium text-[#666] hover:bg-[#F8F8F8]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
