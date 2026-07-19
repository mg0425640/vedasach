'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, CircleCheck as CheckCircle, Circle as XCircle, Reply, Send, Clock } from 'lucide-react';

interface Comment {
  id: string;
  article_id: string;
  article_slug: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'replied'>('pending');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const loadComments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    setComments((data as Comment[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadComments(); }, [loadComments]);

  const filtered = comments.filter(c => {
    if (filter === 'pending') return !c.approved;
    if (filter === 'approved') return c.approved;
    if (filter === 'replied') return c.admin_reply;
    return true;
  });

  const handleApprove = async (id: string, approve: boolean) => {
    await supabase.from('comments').update({ approved: approve }).eq('id', id);
    loadComments();
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    await supabase.from('comments').update({
      admin_reply: replyText,
      admin_reply_at: new Date().toISOString(),
      approved: true,
    }).eq('id', id);
    setSending(false);
    setReplyingTo(null);
    setReplyText('');
    loadComments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    await supabase.from('comments').delete().eq('id', id);
    loadComments();
  };

  const pendingCount = comments.filter(c => !c.approved).length;
  const repliedCount = comments.filter(c => c.admin_reply).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center"><Clock className="w-5 h-5 text-orange-600" /></div><div><p className="text-2xl font-bold font-heading">{pendingCount}</p><p className="text-xs text-[#999]">Pending Approval</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div><div><p className="text-2xl font-bold font-heading">{comments.filter(c => c.approved).length}</p><p className="text-xs text-[#999]">Approved</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Reply className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold font-heading">{repliedCount}</p><p className="text-xs text-[#999]">Replied</p></div></div></div>
      </div>

      <div className="flex gap-2">
        {(['pending', 'approved', 'replied', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-[#E84E1B] text-white' : 'bg-white border border-[#E8E8E8] text-[#666]'}`}>
            {f === 'pending' ? 'Pending' : f === 'approved' ? 'Approved' : f === 'replied' ? 'Replied' : 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? <div className="text-center py-8 text-[#999]">Loading...</div> :
         filtered.length === 0 ? <div className="text-center py-8 text-[#999]">No comments found</div> :
         filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-[#F0F0F0] p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-sm font-bold text-[#E84E1B] flex-shrink-0">
                {c.author_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-[#1A1A1A]">{c.author_name}</span>
                  <span className="text-xs text-[#CCC]">{c.author_email}</span>
                  <span className="text-xs text-[#CCC]">· {new Date(c.created_at).toLocaleDateString()}</span>
                  {!c.approved && <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-xs">Pending</span>}
                  {c.approved && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">Approved</span>}
                </div>
                <p className="text-sm text-[#333] mb-2">{c.content}</p>
                {c.article_slug && <p className="text-xs text-[#CCC] mb-2">On article: <span className="text-[#E84E1B]">/{c.article_slug}</span></p>}

                {c.admin_reply && (
                  <div className="mt-3 bg-[#FFF8F6] border border-[#FFE8E0] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-[#E84E1B] flex items-center justify-center text-xs text-white font-bold">A</div>
                      <span className="text-xs font-bold text-[#E84E1B]">Admin Reply</span>
                      {c.admin_reply_at && <span className="text-xs text-[#CCC]">· {new Date(c.admin_reply_at).toLocaleDateString()}</span>}
                    </div>
                    <p className="text-sm text-[#333]">{c.admin_reply}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {!c.approved && <button onClick={() => handleApprove(c.id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100"><CheckCircle className="w-3 h-3" /> Approve</button>}
                  {c.approved && <button onClick={() => handleApprove(c.id, false)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-100"><XCircle className="w-3 h-3" /> Unapprove</button>}
                  <button onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(c.admin_reply || ''); }} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"><Reply className="w-3 h-3" /> {c.admin_reply ? 'Edit Reply' : 'Reply'}</button>
                  <button onClick={() => handleDelete(c.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100"><XCircle className="w-3 h-3" /> Delete</button>
                </div>

                {replyingTo === c.id && (
                  <div className="mt-3 space-y-2">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" />
                    <div className="flex gap-2">
                      <button onClick={() => handleReply(c.id)} disabled={sending || !replyText.trim()} className="flex items-center gap-1 px-4 py-2 bg-[#E84E1B] text-white rounded-lg text-sm hover:bg-[#d44416] disabled:opacity-50"><Send className="w-3 h-3" /> {sending ? 'Sending...' : 'Send Reply'}</button>
                      <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-4 py-2 border border-[#E8E8E8] rounded-lg text-sm text-[#666]">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
