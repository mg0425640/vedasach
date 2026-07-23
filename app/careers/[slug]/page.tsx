'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Briefcase, Clock, CircleCheck as CheckCircle, Send, ArrowLeft, Loader as Loader2, Building2 } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface JobDetail {
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
  responsibilities: string[];
  responsibilities_hi: string[] | null;
  requirements: string[];
  requirements_hi: string[] | null;
  compensation: string | null;
  compensation_hi: string | null;
  why_join_us: string[];
  why_join_us_hi: string[] | null;
}

const APPLY_TEMPLATE = `Full Name: 
City & State: 
Resume (if available): 
Writing Samples or Published Articles (preferred): 
Languages You Can Write In (Hindi / English): 
Topics You're Interested In: 
Daily Availability: `;

export default function JobDetailPage() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const params = useParams();
  const slug = params.slug as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from('job_openings')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (data) {
        setJob({
          ...data,
          responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
          responsibilities_hi: Array.isArray(data.responsibilities_hi) ? data.responsibilities_hi : null,
          requirements: Array.isArray(data.requirements) ? data.requirements : [],
          requirements_hi: Array.isArray(data.requirements_hi) ? data.requirements_hi : null,
          why_join_us: Array.isArray(data.why_join_us) ? data.why_join_us : [],
          why_join_us_hi: Array.isArray(data.why_join_us_hi) ? data.why_join_us_hi : null,
        });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-brand" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="text-center py-20">
        <p className="text-[#999] font-body text-lg mb-4">{hi ? 'पद नहीं मिला।' : 'Job not found.'}</p>
        <Link href="/careers" className="btn-outline inline-flex items-center gap-2">
          <ArrowLeft size={14} /> {hi ? 'सभी पद देखें' : 'View All Positions'}
        </Link>
      </div>
    );
  }

  const applyUrl = `/contact?apply=1&job=${encodeURIComponent(job.slug)}&title=${encodeURIComponent(job.title)}`;

  const sections = [
    {
      icon: '📝',
      title: hi ? 'भूमिका के बारे में' : 'About the Role',
      content: <p className="text-sm text-[#555] font-body leading-relaxed">{hi && job.about_role_hi ? job.about_role_hi : job.about_role}</p>,
    },
    {
      icon: '📋',
      title: hi ? 'मुख्य जिम्मेदारियां' : 'Key Responsibilities',
      content: (
        <ul className="space-y-2">
          {(hi && job.responsibilities_hi ? job.responsibilities_hi : job.responsibilities).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#555] font-body leading-relaxed">
              <CheckCircle size={16} className="text-brand mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: '✅',
      title: hi ? 'आवश्यकताएं' : 'Requirements',
      content: (
        <ul className="space-y-2">
          {(hi && job.requirements_hi ? job.requirements_hi : job.requirements).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#555] font-body leading-relaxed">
              <CheckCircle size={16} className="text-brand mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: '💰',
      title: hi ? 'पारिश्रमिक' : 'Compensation',
      content: <p className="text-sm text-[#555] font-body leading-relaxed">{hi && job.compensation_hi ? job.compensation_hi : job.compensation || (hi ? 'चर्चा के अनुसार' : 'As per discussion')}</p>,
    },
    {
      icon: '⭐',
      title: hi ? 'हमारे साथ क्यों जुड़ें' : 'Why Join Us',
      content: (
        <ul className="space-y-2">
          {(hi && job.why_join_us_hi ? job.why_join_us_hi : job.why_join_us).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#555] font-body leading-relaxed">
              <CheckCircle size={16} className="text-brand mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999] flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-brand">{hi ? 'होम' : 'Home'}</Link>
          <span className="mx-1">›</span>
          <Link href="/careers" className="hover:text-brand">{hi ? 'भर्ती' : 'Careers'}</Link>
          <span className="mx-1">›</span>
          <span className="text-[#111]">{hi && job.title_hi ? job.title_hi : job.title}</span>
        </div>
      </div>

      {/* Job Header */}
      <section className="bg-[#111] text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-3 py-1 font-body border border-brand/20">{job.department}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#888] font-body">{hi && job.job_type_hi ? job.job_type_hi : job.job_type}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white font-bold mb-4 leading-tight">
            {hi && job.title_hi ? job.title_hi : job.title}
          </h1>
          <div className="flex items-center gap-6 flex-wrap text-sm text-[#AAA] font-body">
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-brand" />
              {hi && job.location_hi ? job.location_hi : job.location}
            </span>
            {job.experience && (
              <span className="flex items-center gap-2">
                <Briefcase size={15} className="text-brand" />
                {hi && job.experience_hi ? job.experience_hi : job.experience}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Building2 size={15} className="text-brand" />
              {job.department}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="job-detail-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{section.icon}</span>
                  <h2 className="font-display text-xl font-bold text-[#111]">{section.title}</h2>
                </div>
                <div className="pl-1">{section.content}</div>
              </div>
            ))}

            {/* How to Apply */}
            <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📧</span>
                <h2 className="font-display text-xl font-bold text-[#111]">{hi ? 'आवेदन कैसे करें' : 'How to Apply'}</h2>
              </div>
              <p className="text-sm text-[#555] font-body leading-relaxed mb-4">
                {hi
                  ? 'आवेदन करने के लिए, कृपया हमारे संपर्क पृष्ठ पर जाएं और "सामान्य पूछताछ" श्रेणी का चयन करें। नीचे दिए गए विवरण को संदेश बॉक्स में भरें और अपना आवेदन जमा करें।'
                  : 'To apply, please go to our Contact page and select "General Inquiry" category. Fill in the details below in the message box and submit your application.'}
              </p>
              <div className="bg-white border border-[#E8E8E8] p-4 mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-2">{hi ? 'संदेश बॉक्स में यह जानकारी दें:' : 'Include this in your message:'}</p>
                <pre className="text-xs text-[#555] font-body whitespace-pre-wrap leading-relaxed">{APPLY_TEMPLATE}</pre>
              </div>
              <Link href={applyUrl} className="btn-primary inline-flex items-center gap-2">
                <Send size={14} />
                {hi ? 'अभी आवेदन करें' : 'Apply Now'}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky-sidebar space-y-6">
              {/* Quick Apply Card */}
              <div className="bg-[#111] text-white p-6">
                <h3 className="font-display text-lg text-white font-bold mb-2">{hi ? 'इस पद के लिए आवेदन करें' : 'Apply for this Position'}</h3>
                <p className="text-sm text-[#AAA] font-body mb-4">
                  {hi ? 'अपना आवेदन संपर्क पृष्ठ के माध्यम से जमा करें।' : 'Submit your application through our contact page.'}
                </p>
                <Link href={applyUrl} className="btn-primary w-full text-center flex items-center justify-center gap-2 mb-3">
                  <Send size={14} />
                  {hi ? 'अभी आवेदन करें' : 'Apply Now'}
                </Link>
                <Link href="/careers" className="block text-center text-xs text-[#888] font-body hover:text-white transition-colors">
                  {hi ? '← सभी पद देखें' : '← View All Positions'}
                </Link>
              </div>

              {/* Job Summary */}
              <div className="bg-[#F8F8F8] border border-[#E8E8E8] p-6">
                <h3 className="font-body text-sm font-bold uppercase tracking-wider text-[#111] mb-4">{hi ? 'पद सारांश' : 'Job Summary'}</h3>
                <div className="space-y-3 text-sm font-body">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#999]">{hi ? 'विभाग' : 'Department'}</span>
                    <span className="text-[#111] font-semibold text-right">{job.department}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#999]">{hi ? 'स्थान' : 'Location'}</span>
                    <span className="text-[#111] font-semibold text-right">{hi && job.location_hi ? job.location_hi : job.location}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#999]">{hi ? 'कार्य प्रकार' : 'Job Type'}</span>
                    <span className="text-[#111] font-semibold text-right">{hi && job.job_type_hi ? job.job_type_hi : job.job_type}</span>
                  </div>
                  {job.experience && (
                    <div className="flex justify-between gap-4">
                      <span className="text-[#999]">{hi ? 'अनुभव' : 'Experience'}</span>
                      <span className="text-[#111] font-semibold text-right">{hi && job.experience_hi ? job.experience_hi : job.experience}</span>
                    </div>
                  )}
                  {job.compensation && (
                    <div className="flex justify-between gap-4">
                      <span className="text-[#999]">{hi ? 'पारिश्रमिक' : 'Compensation'}</span>
                      <span className="text-[#111] font-semibold text-right text-xs">{hi && job.compensation_hi ? job.compensation_hi : job.compensation}</span>
                    </div>
                  )}
                </div>
              </div>

              <AdBanner slot="job-detail-side" size="rectangle" showGoogleFallback />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <AdBanner slot="job-detail-bottom" size="leaderboard" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
