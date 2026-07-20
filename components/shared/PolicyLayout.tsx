'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, FileText, TriangleAlert as AlertTriangle, ChevronRight } from 'lucide-react';

interface Section {
  title: { en: string; hi: string };
  body: { en: string; hi: string };
}

export default function PolicyLayout({
  title,
  icon,
  sections,
}: {
  title: { en: string; hi: string };
  icon: 'shield' | 'file' | 'alert';
  sections: Section[];
}) {
  const { lang } = useLanguage();
  const Icon = icon === 'shield' ? Shield : icon === 'file' ? FileText : AlertTriangle;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E8E8] py-3">
        <div className="max-w-4xl mx-auto px-4 text-xs font-body text-[#999] flex items-center gap-2">
          <Link href="/" className="hover:text-brand">{lang === 'hi' ? 'होम' : 'Home'}</Link>
          <ChevronRight size={12} />
          <span className="text-[#111]">{title[lang]}</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#111] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center">
              <Icon size={24} className="text-brand" />
            </div>
            <h1 className="font-display text-3xl font-bold">{title[lang]}</h1>
          </div>
          <p className="text-[#999] font-body text-sm ml-16">
            {lang === 'hi' ? 'अंतिम अपडेट: जनवरी 2026' : 'Last updated: January 2026'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
          {sections.map((section, idx) => (
            <div key={idx} className={`p-6 ${idx !== sections.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center font-body">
                  {idx + 1}
                </span>
                <h2 className="font-display text-lg font-bold text-[#111] pt-0.5">{section.title[lang]}</h2>
              </div>
              <p className="text-sm text-[#555] font-body leading-relaxed pl-10">{section.body[lang]}</p>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="mt-6 bg-brand/5 border border-brand/20 rounded-xl p-6 text-center">
          <p className="text-sm text-[#666] font-body">
            {lang === 'hi' ? 'कोई प्रश्न? हमसे संपर्क करें:' : 'Questions? Contact us:'}
          </p>
          <a href="mailto:support@vedasach.com" className="text-brand font-bold text-sm hover:underline">support@vedasach.com</a>
        </div>
      </div>
    </div>
  );
}
