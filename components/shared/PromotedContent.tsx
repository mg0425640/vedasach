'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Play } from 'lucide-react';

interface PromotedItem {
  id: string;
  title: string;
  title_hi: string | null;
  sponsor_name: string;
  sponsor_name_hi: string | null;
  image_url: string;
  link_url: string;
  is_video: boolean;
  click_count: number;
}

interface PromotedContentProps {
  category?: string;
  limit?: number;
}

export default function PromotedContent({ category, limit = 6 }: PromotedContentProps) {
  const { lang } = useLanguage();
  const [items, setItems] = useState<PromotedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryTargetMap: Record<string, string> = {
    health: 'target_health',
    ayurveda: 'target_ayurveda',
    yoga: 'target_yoga',
    beauty: 'target_beauty',
    nutrition: 'target_nutrition',
    'home-remedies': 'target_home_remedies',
    spirituality: 'target_spirituality',
    dreams: 'target_dreams',
    blog: 'target_blog',
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from('promoted_content')
        .select('id, title, title_hi, sponsor_name, sponsor_name_hi, image_url, link_url, is_video, click_count')
        .eq('is_active', true);

      if (category && categoryTargetMap[category]) {
        const col = categoryTargetMap[category];
        query = query.or(`${col}.eq.true,target_all.eq.true`);
      } else {
        query = query.eq('target_all', true);
      }

      const { data } = await query.order('sort_order').limit(limit);
      setItems((data as PromotedItem[]) || []);
      setLoading(false);
    };
    fetch();
  }, [category, limit]);

  const handleClick = async (item: PromotedItem) => {
    try {
      await supabase
        .from('promoted_content')
        .update({ click_count: item.click_count + 1 })
        .eq('id', item.id);
    } catch {}
    window.open(item.link_url, '_blank', 'noopener,noreferrer');
  };

  if (loading || items.length === 0) return null;

  return (
    <div className="my-8 border-t border-[#E8E8E8] pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#666] font-body">
            {lang === 'hi' ? 'प्रमोटेड कंटेंट' : 'Promoted Content'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#999]">
          {/* Taboola-style icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
      </div>

      {/* Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const title = lang === 'hi' && item.title_hi ? item.title_hi : item.title;
          const sponsor = lang === 'hi' && item.sponsor_name_hi ? item.sponsor_name_hi : item.sponsor_name;

          return (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => handleClick(item)}
            >
              {/* Image */}
              <div className="relative overflow-hidden mb-2 aspect-[16/9]">
                <img
                  src={item.image_url}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.is_video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                      <Play size={20} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Sponsor & Title */}
              <div>
                <p className="text-[11px] text-brand font-semibold font-body mb-0.5">{sponsor}</p>
                <p className="text-sm font-semibold text-[#111] leading-snug font-body line-clamp-2 group-hover:text-brand transition-colors">
                  {title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-[#CCCCCC] font-body mt-3 text-right">Promoted content by vedasach</p>
    </div>
  );
}
