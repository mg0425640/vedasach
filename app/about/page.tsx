import Link from 'next/link';
import { CircleCheck as CheckCircle, Users, BookOpen, Heart, TrendingUp, Award } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';

export const metadata = {
  title: 'About Us – vedasach',
  description: 'Learn about vedasach — India\'s trusted wellness platform combining ancient Ayurvedic wisdom with modern health science.',
};

const team = [
  {
    name: 'Dr. Priya Sharma', role: 'Chief Dream Analyst & Spiritual Researcher',
    bio: 'Certified dream analyst with 15+ years of experience in Vedic astrology and symbolic interpretation. Published author of three books on dream psychology.',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Vaidya Rakesh Patel', role: 'Head of Ayurveda & Herbal Medicine',
    bio: 'BAMS graduate with specialization in Ayurvedic pharmacology. 20 years of clinical practice and research in traditional Indian medicine.',
    image: 'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Ananya Krishnan', role: 'Senior Yoga & Meditation Instructor',
    bio: 'RYT-500 certified yoga teacher and mindfulness coach. Trained at Rishikesh Yoga Institute. Specializes in therapeutic yoga and pranayama.',
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Dr. Suresh Mehta', role: 'Health & Nutrition Consultant',
    bio: 'MD in Internal Medicine with additional training in integrative and functional medicine. Passionate about preventive healthcare and nutrition science.',
    image: 'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Meera Nair', role: 'Beauty & Natural Skincare Expert',
    bio: 'Certified aesthetician and Ayurvedic beauty therapist. Expert in natural skincare formulations and Panchakarma beauty treatments.',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Swami Yogananda', role: 'Spirituality & Vedic Knowledge',
    bio: 'Vedic scholar and spiritual teacher. Expert in Sanskrit, Vedic texts, mantra shastra, Vastu Shastra, and Jyotish (Vedic astrology).',
    image: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

const values = [
  { Icon: CheckCircle, title: 'Accuracy & Truth', desc: 'We fact-check all health claims against peer-reviewed research. For traditional knowledge, we clearly distinguish belief from scientific evidence.' },
  { Icon: Heart, title: 'Genuine Care', desc: 'Every article is written with the reader\'s wellbeing in mind — not to generate clicks or sell products, but to genuinely help.' },
  { Icon: BookOpen, title: 'Deep Knowledge', desc: 'Our team includes qualified Ayurvedic doctors, yoga teachers, nutritionists, and researchers. Depth over breadth, always.' },
  { Icon: Users, title: 'Community First', desc: 'vedasach exists to serve our readers. We listen, we respond, and we continuously improve based on your needs and feedback.' },
  { Icon: TrendingUp, title: 'Modern + Traditional', desc: 'We bridge ancient wisdom with modern science — respecting tradition while embracing evidence-based validation.' },
  { Icon: Award, title: 'Quality Products', desc: 'Our shop only carries products we\'ve personally vetted for quality, authenticity, and efficacy. We never compromise on standards.' },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">About Us</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#111] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            We Believe in the Power of<br />
            <span className="text-brand">Ancient Wisdom</span> + Modern Science
          </h1>
          <p className="text-[#AAA] font-body text-lg leading-relaxed max-w-2xl mx-auto">
            vedasach is India's trusted wellness and knowledge platform. We combine 5,000 years of Ayurvedic wisdom with modern health research to help you live a healthier, more meaningful life.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E8E8E8] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Expert Articles', icon: '📝' },
              { value: '50,000+', label: 'Monthly Readers', icon: '👥' },
              { value: '12', label: 'Expert Authors', icon: '✍️' },
              { value: '5', label: 'Years of Excellence', icon: '🏆' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display text-3xl font-bold text-[#111] mb-0.5">{stat.value}</div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#999] font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="about-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag-pill mb-4 inline-block">Our Mission</span>
            <h2 className="font-display text-3xl font-bold text-[#111] mb-4 leading-tight">
              Making Wellness Accessible to Every Indian
            </h2>
            <p className="text-[#555] font-body leading-relaxed mb-4">
              India has one of the richest wellness traditions in the world — Ayurveda, yoga, meditation, and a vast pharmacopeia of medicinal plants. Yet much of this knowledge is inaccessible, scattered across ancient texts in Sanskrit, or distorted by misinformation.
            </p>
            <p className="text-[#555] font-body leading-relaxed mb-4">
              vedasach was founded to change that. We work with qualified Ayurvedic physicians, yoga teachers, nutritionists, and wellness researchers to create content that is accurate, practical, and genuinely helpful.
            </p>
            <p className="text-[#555] font-body leading-relaxed">
              We believe that combining ancient wisdom with modern science creates the most powerful approach to health — one that is both deeply effective and culturally resonant for millions of Indians.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=700"
              alt="Wellness"
              className="w-full h-80 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-brand text-white p-4 hidden md:block">
              <div className="font-display text-2xl font-bold">2026</div>
              <div className="text-xs font-body uppercase tracking-wider">Founded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8F8F8] border-y border-[#E8E8E8] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#111] mb-2">What We Stand For</h2>
            <p className="text-[#888] font-body">The values that guide every article, product, and decision at vedasach</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 border border-[#E8E8E8] card-hover">
                <Icon size={24} className="text-brand mb-3" />
                <h3 className="font-body font-bold text-[#111] mb-2">{title}</h3>
                <p className="text-sm text-[#666] font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-[#111] mb-2">Our Expert Team</h2>
          <p className="text-[#888] font-body">Meet the specialists behind vedasach's trusted content</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center card-hover group">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#F8F8F8] group-hover:border-brand transition-colors">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111] mb-0.5">{member.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand font-body mb-2">{member.role}</p>
              <p className="text-sm text-[#666] font-body leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <AdBanner slot="about-bottom" size="leaderboard" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
