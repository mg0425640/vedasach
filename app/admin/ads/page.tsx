'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Trash2, Edit3, Eye, MousePointerClick, ToggleRight, Megaphone, Lock } from 'lucide-react';

type AdType = 'global' | 'category' | 'popup';

const emptyForm = {
  title: '', title_hi: '', description: '', description_hi: '', image_url: '',
  link_url: '', slot: 'home-top', show_on_home: true, show_on_all_pages: false,
  show_on_header: false, show_on_footer: false, is_active: true, sort_order: 0,
  start_date: '', end_date: '',
  show_on_login_modal: false, show_on_signup_modal: false, show_on_popup: true, ad_format: 'image',
};

export default function AdminAds() {
  const [globalAds, setGlobalAds] = useState<any[]>([]);
  const [categoryAds, setCategoryAds] = useState<any[]>([]);
  const [popupAds, setPopupAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adType, setAdType] = useState<AdType>('global');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadAds = useCallback(async () => {
    setLoading(true);
    const [g, c, p] = await Promise.all([
      supabase.from('global_ads').select('*').order('created_at', { ascending: false }),
      supabase.from('category_ads').select('*').order('created_at', { ascending: false }),
      supabase.from('auth_popup_ads').select('*').order('created_at', { ascending: false }),
    ]);
    setGlobalAds(g.data || []);
    setCategoryAds(c.data || []);
    setPopupAds(p.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAds(); }, [loadAds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const table = adType === 'global' ? 'global_ads' : adType === 'category' ? 'category_ads' : 'auth_popup_ads';
    const payload: any = {
      title: form.title,
      title_hi: form.title_hi || null,
      description: form.description,
      description_hi: form.description_hi || null,
      image_url: form.image_url,
      link_url: form.link_url,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };

    if (adType === 'global') {
      payload.show_on_home = form.show_on_home;
      payload.show_on_all_pages = form.show_on_all_pages;
      payload.show_on_header = form.show_on_header;
      payload.show_on_footer = form.show_on_footer;
      payload.slot = form.slot;
      payload.start_date = form.start_date || null;
      payload.end_date = form.end_date || null;
    } else if (adType === 'category') {
      payload.slot = form.slot;
      payload.target_all_categories = true;
      payload.start_date = form.start_date || null;
      payload.end_date = form.end_date || null;
    } else {
      payload.show_on_login_modal = form.show_on_login_modal;
      payload.show_on_signup_modal = form.show_on_signup_modal;
      payload.show_on_popup = form.show_on_popup;
      payload.ad_format = form.ad_format;
    }

    if (editingId) {
      await supabase.from(table).update(payload).eq('id', editingId);
    } else {
      await supabase.from(table).insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadAds();
  };

  const handleEdit = (ad: any, type: AdType) => {
    setAdType(type);
    setEditingId(ad.id);
    setForm({
      title: ad.title || '', title_hi: ad.title_hi || '', description: ad.description || '',
      description_hi: ad.description_hi || '', image_url: ad.image_url || '', link_url: ad.link_url || '',
      slot: ad.slot || 'home-top', show_on_home: ad.show_on_home || false, show_on_all_pages: ad.show_on_all_pages || false,
      show_on_header: ad.show_on_header || false, show_on_footer: ad.show_on_footer || false,
      is_active: ad.is_active, sort_order: ad.sort_order || 0,
      start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
      end_date: ad.end_date ? ad.end_date.split('T')[0] : '',
      show_on_login_modal: ad.show_on_login_modal || false,
      show_on_signup_modal: ad.show_on_signup_modal || false,
      show_on_popup: ad.show_on_popup || false,
      ad_format: ad.ad_format || 'image',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, type: AdType) => {
    if (!confirm('Delete this ad?')) return;
    const table = type === 'global' ? 'global_ads' : type === 'category' ? 'category_ads' : 'auth_popup_ads';
    await supabase.from(table).delete().eq('id', id);
    loadAds();
  };

  const toggleActive = async (id: string, isActive: boolean, type: AdType) => {
    const table = type === 'global' ? 'global_ads' : type === 'category' ? 'category_ads' : 'auth_popup_ads';
    await supabase.from(table).update({ is_active: !isActive }).eq('id', id);
    loadAds();
  };

  const allAds = [...globalAds, ...categoryAds, ...popupAds];
  const totalViews = allAds.reduce((s, a) => s + (a.view_count || 0), 0);
  const totalClicks = allAds.reduce((s, a) => s + (a.click_count || 0), 0);
  const activeCount = allAds.filter(a => a.is_active).length;

  const renderAdTable = (ads: any[], type: AdType, title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#F0F0F0] bg-[#FAFAFA] flex items-center gap-2">
        {icon}
        <h2 className="font-heading font-bold text-sm">{title}</h2>
        <span className="ml-auto text-xs text-[#999]">{ads.length} ads</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-[#F0F0F0]">
            <th className="text-left px-4 py-2 text-xs font-bold text-[#999] uppercase">Ad</th>
            <th className="text-left px-4 py-2 text-xs font-bold text-[#999] uppercase">Slot</th>
            <th className="text-center px-4 py-2 text-xs font-bold text-[#999] uppercase">Views</th>
            <th className="text-center px-4 py-2 text-xs font-bold text-[#999] uppercase">Clicks</th>
            <th className="text-center px-4 py-2 text-xs font-bold text-[#999] uppercase">Status</th>
            <th className="text-center px-4 py-2 text-xs font-bold text-[#999] uppercase">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-6 text-[#999]">Loading...</td></tr> :
             ads.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-[#999]">No {title.toLowerCase()}</td></tr> :
             ads.map(ad => (
              <tr key={ad.id} className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA]">
                <td className="px-4 py-3"><div className="flex items-center gap-3">{ad.image_url && <img src={ad.image_url} alt="" className="w-10 h-10 rounded object-cover" />}<div><p className="text-sm font-medium text-[#1A1A1A]">{ad.title}</p><p className="text-xs text-[#CCC] truncate max-w-xs">{ad.link_url}</p></div></div></td>
                <td className="px-4 py-3"><span className="text-xs text-[#666]">{ad.slot || ad.ad_format || '-'}</span></td>
                <td className="px-4 py-3 text-center text-sm">{ad.view_count || 0}</td>
                <td className="px-4 py-3 text-center text-sm">{ad.click_count || 0}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => toggleActive(ad.id, ad.is_active, type)}>{ad.is_active ? <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">Active</span> : <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 text-xs">Paused</span>}</button></td>
                <td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><button onClick={() => handleEdit(ad, type)} className="p-1.5 hover:bg-[#FFF0EB] rounded text-[#666] hover:text-[#E84E1B]"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleDelete(ad.id, type)} className="p-1.5 hover:bg-red-50 rounded text-[#666] hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><Megaphone className="w-5 h-5 text-green-600" /></div><div><p className="text-2xl font-bold font-heading">{allAds.length}</p><p className="text-xs text-[#999]">Total Ads</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><ToggleRight className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold font-heading">{activeCount}</p><p className="text-xs text-[#999]">Active</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center"><Eye className="w-5 h-5 text-cyan-600" /></div><div><p className="text-2xl font-bold font-heading">{totalViews.toLocaleString()}</p><p className="text-xs text-[#999]">Total Views</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center"><MousePointerClick className="w-5 h-5 text-orange-600" /></div><div><p className="text-2xl font-bold font-heading">{totalClicks.toLocaleString()}</p><p className="text-xs text-[#999]">Total Clicks</p></div></div></div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => { setEditingId(null); setForm(emptyForm); setAdType('global'); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#E84E1B] text-white rounded-lg text-sm font-medium hover:bg-[#d44416] transition-colors">
          <Plus className="w-4 h-4" /> Add Ad
        </button>
      </div>

      {renderAdTable(globalAds, 'global', 'Global Ads', <Megaphone className="w-4 h-4 text-[#E84E1B]" />)}
      {renderAdTable(categoryAds, 'category', 'Category Ads', <Megaphone className="w-4 h-4 text-blue-500" />)}
      {renderAdTable(popupAds, 'popup', 'Auth Popup Ads', <Lock className="w-4 h-4 text-purple-500" />)}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#F0F0F0] px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">{editingId ? 'Edit Ad' : 'Add New Ad'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1 hover:bg-[#F8F8F8] rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#666] mb-1 block">Ad Type</label>
                <div className="flex gap-2 flex-wrap">
                  <button type="button" onClick={() => setAdType('global')} className={`px-4 py-2 rounded-lg text-sm font-medium ${adType === 'global' ? 'bg-[#E84E1B] text-white' : 'bg-[#F8F8F8] text-[#666]'}`}>Global Ad</button>
                  <button type="button" onClick={() => setAdType('category')} className={`px-4 py-2 rounded-lg text-sm font-medium ${adType === 'category' ? 'bg-[#E84E1B] text-white' : 'bg-[#F8F8F8] text-[#666]'}`}>Category Ad</button>
                  <button type="button" onClick={() => setAdType('popup')} className={`px-4 py-2 rounded-lg text-sm font-medium ${adType === 'popup' ? 'bg-[#E84E1B] text-white' : 'bg-[#F8F8F8] text-[#666]'}`}>Auth Popup Ad</button>
                </div>
              </div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Title (Hindi)</label><input value={form.title_hi} onChange={e => setForm({ ...form, title_hi: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Image URL</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
              <div><label className="text-xs font-medium text-[#666] mb-1 block">Link URL</label><input value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>

              {adType !== 'popup' && (
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Slot</label><input value={form.slot} onChange={e => setForm({ ...form, slot: e.target.value })} placeholder="home-top, banner-1, side-image-1..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
              )}

              {adType === 'global' && (
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_home} onChange={e => setForm({ ...form, show_on_home: e.target.checked })} /> Home</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_all_pages} onChange={e => setForm({ ...form, show_on_all_pages: e.target.checked })} /> All Pages</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_header} onChange={e => setForm({ ...form, show_on_header: e.target.checked })} /> Header</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_footer} onChange={e => setForm({ ...form, show_on_footer: e.target.checked })} /> Footer</label>
                </div>
              )}

              {adType === 'popup' && (
                <>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_login_modal} onChange={e => setForm({ ...form, show_on_login_modal: e.target.checked })} /> Login Modal</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_signup_modal} onChange={e => setForm({ ...form, show_on_signup_modal: e.target.checked })} /> Signup Modal</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_popup} onChange={e => setForm({ ...form, show_on_popup: e.target.checked })} /> Popup</label>
                  </div>
                  <div><label className="text-xs font-medium text-[#666] mb-1 block">Ad Format</label><select value={form.ad_format} onChange={e => setForm({ ...form, ad_format: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm"><option value="image">Image</option><option value="html">HTML</option><option value="video">Video</option></select></div>
                </>
              )}

              {adType !== 'popup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-[#666] mb-1 block">Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                  <div><label className="text-xs font-medium text-[#666] mb-1 block">End Date</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#666] mb-1 block">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                <label className="flex items-end gap-2 text-sm pb-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-[#E84E1B] text-white rounded-lg text-sm font-medium hover:bg-[#d44416] disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update Ad' : 'Save Ad'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2.5 border border-[#E8E8E8] rounded-lg text-sm text-[#666] hover:bg-[#F8F8F8]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
