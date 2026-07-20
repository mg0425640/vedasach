'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CircleCheck as CheckCircle } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', category: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">Contact</span>
        </div>
      </div>

      <div className="bg-[#111] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-brand font-bold mb-3">Get in Touch</h1>
          <p className="text-[#AAA] font-body">Have a question, feedback, or want to collaborate? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="contact-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-xl font-bold text-[#111] mb-6">Contact Information</h2>
            <div className="space-y-5">
              {[
                { Icon: Mail, title: 'Email', lines: ['Govindsingh747@gmail.com', 'editorial@vedasach.com'] },
                { Icon: Phone, title: 'Phone', lines: ['+91 98731 60180', 'Mon–Fri, 10AM–6PM IST'] },
                { Icon: MapPin, title: 'Office', lines: ['3122, PC-2,', 'NIT Faridabad, Faridabad – 121005', 'Haryana, India'] },
                { Icon: Clock, title: 'Business Hours', lines: ['Monday – Friday: 10AM – 6PM', 'Saturday: 10AM – 2PM', 'Sunday: Closed'] },
              ].map(({ Icon, title, lines }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FFF8F6] border border-[#FECDD3] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-brand" />
                  </div>
                  <div>
                    <h3 className="font-body text-sm font-bold text-[#111] mb-0.5">{title}</h3>
                    {lines.map((line) => (
                      <p key={line} className="text-sm text-[#666] font-body">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-[#F8F8F8] border border-[#E8E8E8]">
              <h3 className="font-body text-sm font-bold text-[#111] mb-2">For Collaborations</h3>
              <p className="text-xs text-[#666] font-body leading-relaxed mb-2">
                Interested in sponsored content, product reviews, affiliate partnerships, or advertising on vedasach?
              </p>
              <a href="mailto:partners@vedasach.in" className="text-xs font-semibold text-brand hover:underline font-body">
                partners@vedasach.in →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h2 className="font-display text-2xl font-bold text-[#111] mb-2">Message Sent!</h2>
                <p className="text-[#666] font-body mb-6">Thank you for reaching out. We typically respond within 1–2 business days.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="font-display text-xl font-bold text-[#111] mb-6">Send Us a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Rajesh Kumar"
                      className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="rajesh@email.com"
                      className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body bg-white"
                  >
                    <option value="">Select a topic...</option>
                    <option>General Inquiry</option>
                    <option>Content Feedback</option>
                    <option>Product/Order Support</option>
                    <option>Advertising & Partnerships</option>
                    <option>Editorial Contribution</option>
                    <option>Technical Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's your message about?"
                    className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] font-body mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please provide as much detail as possible..."
                    className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-brand font-body resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <AdBanner slot="contact-bottom" size="leaderboard" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
