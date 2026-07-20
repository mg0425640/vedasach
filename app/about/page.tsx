'use client';

import Link from 'next/link';
import { CircleCheck as CheckCircle, Users, BookOpen, Heart, TrendingUp, Award } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { useLanguage } from '@/context/LanguageContext';

const team = [
  {
    name: 'Dr. Priya Sharma',
    name_hi: 'डॉ. प्रिया शर्मा',
    role: 'Chief Dream Analyst & Spiritual Researcher',
    role_hi: 'मुख्य स्वप्न विश्लेषक और आध्यात्मिक शोधकर्ता',
    bio: 'Certified dream analyst with 15+ years of experience in Vedic astrology and symbolic interpretation. Published author of three books on dream psychology.',
    bio_hi: 'वैदिक ज्योतिष और प्रतीकात्मक व्याख्या में 15+ वर्षों के अनुभव वाले प्रमाणित स्वप्न विश्लेषक। स्वप्न मनोविज्ञान पर तीन पुस्तकों के लेखक।',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Vaidya Rakesh Patel',
    name_hi: 'वैद्य राकेश पटेल',
    role: 'Head of Ayurveda & Herbal Medicine',
    role_hi: 'आयुर्वेद और हर्बल चिकित्सा प्रमुख',
    bio: 'BAMS graduate with specialization in Ayurvedic pharmacology. 20 years of clinical practice and research in traditional Indian medicine.',
    bio_hi: 'आयुर्वेदिक औषधि विज्ञान में विशेषज्ञता के साथ BAMS स्नातक। पारंपरिक भारतीय चिकित्सा में 20 वर्ष का नैदानिक अनुभव और अनुसंधान।',
    image: 'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Ananya Krishnan',
    name_hi: 'अनन्या कृष्णन',
    role: 'Senior Yoga & Meditation Instructor',
    role_hi: 'वरिष्ठ योग और ध्यान प्रशिक्षक',
    bio: 'RYT-500 certified yoga teacher and mindfulness coach. Trained at Rishikesh Yoga Institute. Specializes in therapeutic yoga and pranayama.',
    bio_hi: 'RYT-500 प्रमाणित योग शिक्षक और माइंडफुलनेस कोच। ऋषिकेश योग संस्थान में प्रशिक्षित। चिकित्सीय योग और प्राणायाम में विशेषज्ञ।',
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Dr. Suresh Mehta',
    name_hi: 'डॉ. सुरेश मेहता',
    role: 'Health & Nutrition Consultant',
    role_hi: 'स्वास्थ्य और पोषण सलाहकार',
    bio: 'MD in Internal Medicine with additional training in integrative and functional medicine. Passionate about preventive healthcare and nutrition science.',
    bio_hi: 'आंतरिक चिकित्सा में MD, एकीकृत और कार्यात्मक चिकित्सा में अतिरिक्त प्रशिक्षण। निवारक स्वास्थ्य देखभाल और पोषण विज्ञान के प्रति उत्साही।',
    image: 'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Meera Nair',
    name_hi: 'मीरा नायर',
    role: 'Beauty & Natural Skincare Expert',
    role_hi: 'सौंदर्य और प्राकृतिक त्वचा देखभाल विशेषज्ञ',
    bio: 'Certified aesthetician and Ayurvedic beauty therapist. Expert in natural skincare formulations and Panchakarma beauty treatments.',
    bio_hi: 'प्रमाणित सौंदर्य विशेषज्ञ और आयुर्वेदिक सौंदर्य चिकित्सक। प्राकृतिक त्वचा देखभाल फॉर्मूलेशन और पंचकर्म सौंदर्य उपचार में विशेषज्ञ।',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Swami Yogananda',
    name_hi: 'स्वामी योगानंद',
    role: 'Spirituality & Vedic Knowledge',
    role_hi: 'अध्यात्म और वैदिक ज्ञान',
    bio: 'Vedic scholar and spiritual teacher. Expert in Sanskrit, Vedic texts, mantra shastra, Vastu Shastra, and Jyotish (Vedic astrology).',
    bio_hi: 'वैदिक विद्वान और आध्यात्मिक गुरु। संस्कृत, वैदिक ग्रंथों, मंत्र शास्त्र, वास्तु शास्त्र और ज्योतिष में विशेषज्ञ।',
    image: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

export default function AboutPage() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';

  const values = [
    { Icon: CheckCircle, title: hi ? 'सटीकता और सत्य' : 'Accuracy & Truth', desc: hi ? 'हम सभी स्वास्थ्य दावों को सहकर्मी-समीक्षित शोध के विरुद्ध जांचते हैं। पारंपरिक ज्ञान के लिए, हम विश्वास और वैज्ञानिक साक्ष्य को स्पष्ट रूप से अलग करते हैं।' : "We fact-check all health claims against peer-reviewed research. For traditional knowledge, we clearly distinguish belief from scientific evidence." },
    { Icon: Heart, title: hi ? 'वास्तविक देखभाल' : 'Genuine Care', desc: hi ? 'हर लेख पाठक के कल्याण के साथ लिखा जाता है — क्लिक या उत्पाद बेचने के लिए नहीं, बल्कि वास्तव में मदद करने के लिए।' : "Every article is written with the reader's wellbeing in mind — not to generate clicks or sell products, but to genuinely help." },
    { Icon: BookOpen, title: hi ? 'गहन ज्ञान' : 'Deep Knowledge', desc: hi ? 'हमारी टीम में योग्य आयुर्वेदिक डॉक्टर, योग शिक्षक, पोषण विशेषज्ञ और शोधकर्ता शामिल हैं। गहराई चौड़ाई से ऊपर, हमेशा।' : 'Our team includes qualified Ayurvedic doctors, yoga teachers, nutritionists, and researchers. Depth over breadth, always.' },
    { Icon: Users, title: hi ? 'समुदाय पहले' : 'Community First', desc: hi ? 'vedasach हमारे पाठकों की सेवा के लिए मौजूद है। हम सुनते हैं, हम प्रतिक्रिया देते हैं, और आपकी आवश्यकताओं के आधार पर लगातार सुधार करते हैं।' : 'vedasach exists to serve our readers. We listen, we respond, and we continuously improve based on your needs and feedback.' },
    { Icon: TrendingUp, title: hi ? 'आधुनिक + पारंपरिक' : 'Modern + Traditional', desc: hi ? 'हम प्राचीन ज्ञान को आधुनिक विज्ञान के साथ जोड़ते हैं — परंपरा का सम्मान करते हुए साक्ष्य-आधारित सत्यापन को अपनाते हैं।' : 'We bridge ancient wisdom with modern science — respecting tradition while embracing evidence-based validation.' },
    { Icon: Award, title: hi ? 'गुणवत्ता उत्पाद' : 'Quality Products', desc: hi ? 'हमारा शॉप केवल उन उत्पादों को रखता है जिन्हें हमने गुणवत्ता, प्रामाणिकता और प्रभावशीलता के लिए स्वयं जांचा है।' : "Our shop only carries products we've personally vetted for quality, authenticity, and efficacy. We never compromise on standards." },
  ];

  const stats = [
    { value: '10,000+', label: hi ? 'विशेषज्ञ लेख' : 'Expert Articles', icon: '📝' },
    { value: '50,000+', label: hi ? 'मासिक पाठक' : 'Monthly Readers', icon: '👥' },
    { value: '12', label: hi ? 'विशेषज्ञ लेखक' : 'Expert Authors', icon: '✍️' },
    { value: '5', label: hi ? 'उत्कृष्टता के वर्ष' : 'Years of Excellence', icon: '🏆' },
  ];

  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999]">
          <Link href="/" className="hover:text-brand">{hi ? 'होम' : 'Home'}</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">{hi ? 'हमारे बारे में' : 'About Us'}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#111] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl text-white md:text-5xl font-bold mb-6 leading-tight">
            {hi ? (
              <>हम विश्वास करते हैं<br /><span className="text-brand">प्राचीन ज्ञान</span> + आधुनिक विज्ञान की शक्ति में</>
            ) : (
              <>We Believe in the Power of<br /><span className="text-brand">Ancient Wisdom</span> + Modern Science</>
            )}
          </h1>
          <p className="text-[#AAA] font-body text-lg leading-relaxed max-w-2xl mx-auto">
            {hi
              ? 'vedasach भारत का विश्वसनीय वेलनेस और ज्ञान प्लेटफ़ॉर्म है। हम 5,000 वर्षों की आयुर्वेदिक बुद्धिमत्ता को आधुनिक स्वास्थ्य अनुसंधान के साथ जोड़ते हैं ताकि आप स्वस्थ और अधिक सार्थक जीवन जी सकें।'
              : "vedasach is India's trusted wellness and knowledge platform. We combine 5,000 years of Ayurvedic wisdom with modern health research to help you live a healthier, more meaningful life."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <img src="/logo.svg" alt="vedasach Logo" className="h-10 w-auto brightness-0 invert opacity-80" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E8E8E8] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
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
            <span className="tag-pill mb-4 inline-block">{hi ? 'हमारा मिशन' : 'Our Mission'}</span>
            <h2 className="font-display text-3xl font-bold text-[#111] mb-4 leading-tight">
              {hi ? 'हर भारतीय तक वेलनेस पहुंचाना' : 'Making Wellness Accessible to Every Indian'}
            </h2>
            <p className="text-[#555] font-body leading-relaxed mb-4">
              {hi
                ? 'भारत के पास दुनिया के सबसे धनी वेलनेस ट्रेडिशन में से एक है — आयुर्वेद, योग, ध्यान, और औषधीय पौधों का विशाल भंडार। फिर भी इस ज्ञान का बहुत कुछ अप्राप्य है, संस्कृत के प्राचीन ग्रंथों में बिखरा हुआ है, या गलत सूचना से विकृत है।'
                : 'India has one of the richest wellness traditions in the world — Ayurveda, yoga, meditation, and a vast pharmacopeia of medicinal plants. Yet much of this knowledge is inaccessible, scattered across ancient texts in Sanskrit, or distorted by misinformation.'}
            </p>
            <p className="text-[#555] font-body leading-relaxed mb-4">
              {hi
                ? 'vedasach की स्थापना इसे बदलने के लिए हुई थी। हम योग्य आयुर्वेदिक चिकित्सकों, योग शिक्षकों, पोषण विशेषज्ञों और वेलनेस शोधकर्ताओं के साथ काम करते हैं ताकि सटीक, व्यावहारिक और वास्तव में उपयोगी सामग्री बनाई जा सके।'
                : 'vedasach was founded to change that. We work with qualified Ayurvedic physicians, yoga teachers, nutritionists, and wellness researchers to create content that is accurate, practical, and genuinely helpful.'}
            </p>
            <p className="text-[#555] font-body leading-relaxed">
              {hi
                ? 'हम मानते हैं कि प्राचीन ज्ञान को आधुनिक विज्ञान के साथ जोड़ने से स्वास्थ्य का सबसे शक्तिशाली दृष्टिकोण बनता है — जो गहराई से प्रभावी और लाखों भारतीयों के लिए सांस्कृतिक रूप से प्रासंगिक दोनों है।'
                : 'We believe that combining ancient wisdom with modern science creates the most powerful approach to health — one that is both deeply effective and culturally resonant for millions of Indians.'}
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=700"
              alt={hi ? 'वेलनेस' : 'Wellness'}
              className="w-full h-80 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-brand text-white p-4 hidden md:block">
              <div className="font-display text-2xl font-bold">2019</div>
              <div className="text-xs font-body uppercase tracking-wider">{hi ? 'स्थापना' : 'Founded'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8F8F8] border-y border-[#E8E8E8] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#111] mb-2">{hi ? 'हम किसके लिए खड़े हैं' : 'What We Stand For'}</h2>
            <p className="text-[#888] font-body">{hi ? 'वे मूल्य जो vedasach पर हर लेख, उत्पाद और निर्णय का मार्गदर्शन करते हैं' : 'The values that guide every article, product, and decision at vedasach'}</p>
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
          <h2 className="font-display text-3xl font-bold text-[#111] mb-2">{hi ? 'हमारी विशेषज्ञ टीम' : 'Our Expert Team'}</h2>
          <p className="text-[#888] font-body">{hi ? 'vedasach की विश्वसनीय सामग्री के पीछे के विशेषज्ञों से मिलें' : 'Meet the specialists behind vedasach\'s trusted content'}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center card-hover group">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#F8F8F8] group-hover:border-brand transition-colors">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#111] mb-0.5">{hi ? member.name_hi : member.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand font-body mb-2">{hi ? member.role_hi : member.role}</p>
              <p className="text-sm text-[#666] font-body leading-relaxed">{hi ? member.bio_hi : member.bio}</p>
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
