'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('vw_article_session');
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('vw_article_session', id);
  }
  return id;
}

interface ArticleStats {
  like_count: number;
  share_count: number;
  read_count: number;
}

export function useArticleInteractions(articleId: string, initialStats?: ArticleStats) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [stats, setStats] = useState<ArticleStats>(initialStats || { like_count: 0, share_count: 0, read_count: 0 });
  const [loading, setLoading] = useState(false);

  const checkInteractions = useCallback(async () => {
    if (!articleId) return;
    const sessionId = getSessionId();

    let query = supabase
      .from('article_interactions')
      .select('interaction_type')
      .eq('article_id', articleId);

    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      query = query.eq('session_id', sessionId);
    }

    const { data } = await query;
    if (data) {
      setIsLiked(data.some((d) => d.interaction_type === 'like'));
      setIsBookmarked(data.some((d) => d.interaction_type === 'bookmark'));
    }
  }, [articleId, user]);

  const incrementReadCount = useCallback(async () => {
    if (!articleId) return;

    // Increment read count
    const { data: article } = await supabase
      .from('articles')
      .select('read_count')
      .eq('id', articleId)
      .single();

    if (article) {
      await supabase
        .from('articles')
        .update({ read_count: (article.read_count || 0) + 1 })
        .eq('id', articleId);
    }
  }, [articleId]);

  const handleLike = useCallback(async () => {
    if (loading || !articleId) return;
    setLoading(true);
    const sessionId = getSessionId();

    if (isLiked) {
      // Remove like
      let query = supabase
        .from('article_interactions')
        .delete()
        .eq('article_id', articleId)
        .eq('interaction_type', 'like');
      if (user) query = query.eq('user_id', user.id);
      else query = query.eq('session_id', sessionId);
      await query;

      // Decrement like count
      await supabase
        .from('articles')
        .update({ like_count: Math.max(0, stats.like_count - 1) })
        .eq('id', articleId);

      setStats((s) => ({ ...s, like_count: Math.max(0, s.like_count - 1) }));
      setIsLiked(false);
    } else {
      // Add like
      await supabase.from('article_interactions').insert({
        article_id: articleId,
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        interaction_type: 'like',
      });

      // Increment like count
      await supabase
        .from('articles')
        .update({ like_count: stats.like_count + 1 })
        .eq('id', articleId);

      setStats((s) => ({ ...s, like_count: s.like_count + 1 }));
      setIsLiked(true);
    }
    setLoading(false);
  }, [articleId, user, isLiked, loading, stats.like_count]);

  const handleShare = useCallback(async () => {
    if (!articleId) return;
    const sessionId = getSessionId();

    await supabase.from('article_interactions').insert({
      article_id: articleId,
      user_id: user?.id || null,
      session_id: user ? null : sessionId,
      interaction_type: 'share',
    });

    // Increment share count
    await supabase
      .from('articles')
      .update({ share_count: stats.share_count + 1 })
      .eq('id', articleId);

    setStats((s) => ({ ...s, share_count: s.share_count + 1 }));
  }, [articleId, user, stats.share_count]);

  const handleBookmark = useCallback(async () => {
    if (loading || !articleId) return;
    setLoading(true);
    const sessionId = getSessionId();

    if (isBookmarked) {
      let query = supabase
        .from('article_interactions')
        .delete()
        .eq('article_id', articleId)
        .eq('interaction_type', 'bookmark');
      if (user) query = query.eq('user_id', user.id);
      else query = query.eq('session_id', sessionId);
      await query;
      setIsBookmarked(false);
    } else {
      await supabase.from('article_interactions').insert({
        article_id: articleId,
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        interaction_type: 'bookmark',
      });
      setIsBookmarked(true);
    }
    setLoading(false);
  }, [articleId, user, isBookmarked, loading]);

  return {
    isLiked,
    isBookmarked,
    stats,
    checkInteractions,
    incrementReadCount,
    handleLike,
    handleShare,
    handleBookmark,
  };
}
