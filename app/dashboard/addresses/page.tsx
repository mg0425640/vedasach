'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin, Star, Loader2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Address {
  id: string; label: string; full_name: string; mobile: string;
  address_line1: string; address_line2: string | null;
  city: string; state: string; pincode: string; country: string; is_default: boolean;
}

const BLANK: Omit<Address, 'id' | 'is_default'> = {
  label: 'Home', full_name: '', mobile: '', address_line1: '',
  address_line2: '', city: '', state: '', pincode: '', country: 'India',
};

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh'];

export default function AddressesPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('user_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    setAddresses((data as Address[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ ...BLANK }); setShowForm(true); };
  const openEdit = (addr: Address) => { setEditing(addr); setForm({ label: addr.label, full_name: addr.full_name, mobile: addr.mobile, address_line1: addr.address_line1, address_line2: addr.address_line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country }); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (addresses.length >= 5 && !editing) { setError(lang === 'hi' ? 'आप अधिकतम 5 पते सहेज सकते हैं।' : 'You can save a maximum of 5 addresses.'); return; }
    setSaving(true); setError('');
    if (editing) {
      await supabase.from('user_addresses').update({ ...form }).eq('id', editing.id);
    } else {
      await supabase.from('user_addresses').insert({ ...form, user_id: user.id });
    }
    await load();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('user_addresses').delete().eq('id', id);
    await load();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
    await load();
  };

  return (
    <DashboardLayout>
      <div className="bg-white border border-[#E8E8E8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#111]">
            {lang === 'hi' ? 'सहेजे गए पते' : 'Saved Addresses'}
          </h2>
          <button onClick={openAdd} disabled={addresses.length >= 5} className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
            <Plus size={14} />
            {lang === 'hi' ? 'पता जोड़ें' : 'Add Address'}
          </button>
        </div>

        {addresses.length >= 5 && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 font-body">
            <AlertCircle size={14} />
            {lang === 'hi' ? 'अधिकतम 5 पते सहेजे जा सकते हैं।' : 'Maximum 5 addresses allowed.'}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[#999] font-body"><Loader2 size={20} className="animate-spin" /></div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin size={48} className="text-[#DDD] mx-auto mb-3" />
            <p className="text-[#999] font-body">{lang === 'hi' ? 'कोई पता नहीं जोड़ा गया।' : 'No addresses saved yet.'}</p>
            <button onClick={openAdd} className="btn-primary mt-4 text-sm">{lang === 'hi' ? 'पहला पता जोड़ें' : 'Add Your First Address'}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className={`border p-4 relative ${addr.is_default ? 'border-brand bg-[#FFF8F6]' : 'border-[#E8E8E8]'}`}>
                {addr.is_default && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-brand font-body">
                    <Star size={9} fill="currentColor" />
                    Default
                  </span>
                )}
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#999] font-body border border-[#E8E8E8] px-2 py-0.5 mr-2">{addr.label}</span>
                </div>
                <p className="font-body font-bold text-sm text-[#111]">{addr.full_name}</p>
                <p className="text-xs text-[#666] font-body mt-0.5">{addr.mobile}</p>
                <p className="text-xs text-[#555] font-body mt-1 leading-relaxed">
                  {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
                  {addr.city}, {addr.state} – {addr.pincode}<br />
                  {addr.country}
                </p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F0F0F0]">
                  <button onClick={() => openEdit(addr)} className="text-[11px] font-semibold text-brand hover:underline font-body flex items-center gap-1"><Pencil size={11} />Edit</button>
                  <button onClick={() => handleDelete(addr.id)} className="text-[11px] font-semibold text-red-500 hover:underline font-body flex items-center gap-1"><Trash2 size={11} />Delete</button>
                  {!addr.is_default && <button onClick={() => handleSetDefault(addr.id)} className="text-[11px] font-semibold text-[#555] hover:text-brand font-body ml-auto">Set Default</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="font-display text-xl font-bold text-[#111] mb-4">
                {editing ? (lang === 'hi' ? 'पता संपादित करें' : 'Edit Address') : (lang === 'hi' ? 'नया पता जोड़ें' : 'Add New Address')}
              </h3>
              {error && <p className="text-sm text-red-600 font-body mb-3 flex items-center gap-1"><AlertCircle size={13} />{error}</p>}
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">Label</label>
                  <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body">
                    {['Home', 'Work', 'Other'].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">Full Name *</label>
                    <input required type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">Mobile *</label>
                    <input required type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">Address Line 1 *</label>
                  <input required type="text" value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">Address Line 2</label>
                  <input type="text" value={form.address_line2 || ''} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">City *</label>
                    <input required type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">State *</label>
                    <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body">
                      <option value="">Select</option>
                      {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1">Pincode *</label>
                    <input required type="text" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} className="w-full px-3 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    {lang === 'hi' ? 'सहेजें' : 'Save Address'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 border border-[#E8E8E8] text-sm text-[#555] hover:border-[#999] font-body transition-colors">
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
