'use client';

import { useState, useRef } from 'react';
import { Camera, Save, AlertCircle, CheckCircle, Loader2, Mail, Phone } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { t, lang } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    full_name_hi: profile?.full_name_hi || '',
    username: profile?.username || '',
    mobile: profile?.mobile || '',
    bio: profile?.bio || '',
    bio_hi: profile?.bio_hi || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const { error } = await supabase.from('user_profiles').update({
      ...form,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    }).eq('id', user!.id);
    if (error) setMsg({ type: 'error', text: error.message });
    else { setMsg({ type: 'success', text: lang === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!' }); await refreshProfile(); }
    setSaving(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;
    const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(publicUrl);
    }
    setUploading(false);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="bg-white border border-[#E8E8E8] p-8 text-center">
          <p className="text-[#999] font-body">Please log in to view your dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  const initial = form.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <DashboardLayout>
      <div className="bg-white border border-[#E8E8E8] p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold text-[#111] mb-6">{t('my_profile')}</h2>

        {/* Avatar Upload */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-[#E8E8E8]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-brand text-white text-3xl font-bold flex items-center justify-center font-display">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : initial}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-brand text-white flex items-center justify-center shadow-md hover:bg-[#C93D0E] transition-colors"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-body font-bold text-[#111]">{form.full_name || 'Your Name'}</p>
            <p className="text-sm text-[#999] font-body">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`flex items-center gap-1 text-[10px] font-body px-2 py-0.5 ${profile?.email_verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <Mail size={9} />
                {profile?.email_verified ? t('verified') : t('email_pending')}
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-body px-2 py-0.5 ${profile?.mobile_verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <Phone size={9} />
                {profile?.mobile_verified ? t('verified') : t('mobile_pending')}
              </span>
            </div>
          </div>
        </div>

        {msg && (
          <div className={`flex items-center gap-2 p-3 mb-4 text-sm font-body border ${msg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
            {msg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Full Name (English)</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">पूरा नाम (हिंदी)</label>
              <input type="text" value={form.full_name_hi} onChange={(e) => setForm({ ...form, full_name_hi: e.target.value })} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" placeholder="हिंदी में नाम" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Username</label>
              <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Mobile Number</label>
              <input type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Bio (English)</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body resize-none" placeholder="Tell us about yourself..." />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">बायो (हिंदी)</label>
            <textarea rows={3} value={form.bio_hi} onChange={(e) => setForm({ ...form, bio_hi: e.target.value })} className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body resize-none" placeholder="अपने बारे में बताएं..." />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? (lang === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...') : (lang === 'hi' ? 'बदलाव सहेजें' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
