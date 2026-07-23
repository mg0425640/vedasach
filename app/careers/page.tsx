'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, Search, Loader as Loader2 } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface JobOpening {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  department: string;
  location: string;
  location_hi: string | null;
  job_type: string;
  job_type_hi: string | null;
  experience: string | null;
  experience_hi: string | null;
  about_role: string;
  about_role_hi: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function CareersPage() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from('job_openings')
        .select('id,slug,title,title_hi,department,location,location_hi,job_type,job_type_hi,experience,experience_hi,about_role,about_role_hi,is_active,sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data) setJobs(data as JobOpening[]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const departments = ['all', ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filtered = jobs.filter((j) => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.about_role.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || j.department === deptFilter;
    return matchSearch && matchDept;
  });

  const perks = [
    { icon: '🏠', title: hi ? 'रिमोट कार्य' : 'Remote Work', desc: hi ? 'भारत में कहीं से भी काम करें' : 'Work from anywhere in India' },
    { icon: '⏰', title: hi ? 'लचीले घंटे' : 'Flexible Hours', desc: hi ? 'अपनी खुद की समय-सारिणी' : 'Manage your own schedule' },
    { icon: '🏥', title: hi ? 'स्वास्थ्य बीमा' : 'Health Insurance', desc: hi ? 'आपके और परिवार के लिए' : 'For you and your family' },
    { icon: '🏔️', title: hi ? 'वार्षिक रिट्रीट' : 'Annual Retreat', desc: hi ? 'ऋषिकेश वेलनेस रिट्रीट' : 'Rishikesh wellness retreat' },
  ];

  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">{hi ? 'होम' : 'Home'}</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">{hi ? 'हम भर्ती कर रहे हैं' : 'We Are Hiring'}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#111] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="tag-pill mb-4 inline-block">{hi ? 'करियर' : 'Careers'}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {hi ? (
              <>vedasach में शामिल हों<br /><span className="text-brand">वेलनेस मिशन</span> का हिस्सा बनें</>
            ) : (
              <>Join vedasach<br />Be Part of the <span className="text-brand">Wellness Mission</span></>
            )}
          </h1>
          <p className="text-[#AAA] font-body text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            {hi
              ? 'हम उन विशेषज्ञों की तलाश में हैं जो प्राचीन ज्ञान को आधुनिक विज्ञान के साथ जोड़कर लाखों भारतीयों के जीवन को बेहतर बनाना चाहते हैं।'
              : "We're looking for experts who want to combine ancient wisdom with modern science to improve the lives of millions of Indians."}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-[#888] font-body">
            <Briefcase size={16} className="text-brand" />
            {loading ? '...' : filtered.length} {hi ? 'खुली पद' : 'Open Positions'}
          </div>
        </div>
      </section>

      {/* Perks Bar */}
      <section className="bg-[#F8F8F8] border-y border-[#E8E8E8] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {perks.map((perk) => (
              <div key={perk.title}>
                <div className="text-3xl mb-2">{perk.icon}</div>
                <h3 className="text-sm font-bold text-[#111] font-body mb-0.5">{perk.title}</h3>
                <p className="text-xs text-[#999] font-body">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="careers-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      {/* Search + Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={hi ? 'पद खोजें...' : 'Search positions...'}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 text-[11px] font-semibold font-body transition-all capitalize ${deptFilter === dept ? 'bg-brand text-white' : 'bg-[#F8F8F8] border border-[#E8E8E8] text-[#333] hover:border-brand hover:text-brand'}`}
              >
                {dept === 'all' ? (hi ? 'सभी' : 'All') : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#999] font-body text-lg">{hi ? 'कोई खुली पद नहीं मिला।' : 'No open positions found.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="group bg-white border border-[#E8E8E8] p-6 hover:border-brand hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-[#FFF8F6] px-2 py-0.5 font-body">{job.department}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#999] font-body">{hi && job.job_type_hi ? job.job_type_hi : job.job_type}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#111] group-hover:text-brand transition-colors mb-1">
                      {hi && job.title_hi ? job.title_hi : job.title}
                    </h3>
                    <p className="text-sm text-[#666] font-body line-clamp-2 mb-3">
                      {hi && job.about_role_hi ? job.about_role_hi : job.about_role}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-[#888] font-body">
                        <MapPin size={12} className="text-brand" />
                        {hi && job.location_hi ? job.location_hi : job.location}
                      </span>
                      {job.experience && (
                        <span className="flex items-center gap-1.5 text-xs text-[#888] font-body">
                          <Clock size={12} className="text-brand" />
                          {hi && job.experience_hi ? job.experience_hi : job.experience}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      {hi ? 'विवरण देखें' : 'View Details'}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <AdBanner slot="careers-bottom" size="leaderboard" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
