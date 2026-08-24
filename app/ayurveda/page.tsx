// app/ayurveda/page.tsx
import { Metadata } from 'next';
import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Ayurveda Wisdom, Natural Remedies, Herbs & Holistic Health',
  description: 'Explore authentic Ayurvedic wisdom, natural herbal remedies, ancient health treatments, holistic lifestyle practices, and wellness tips for a balanced life.',
  keywords: [
    'ayurveda news',
    'ayurvedic herbs',
    'natural remedies',
    'holistic health',
    'ayurvedic lifestyle',
    'dosha balance',
    'herbal treatments',
    'आयुर्वेद',
    'आयुर्वेदिक जड़ी-बूटियाँ',
    'घरेलू नुस्खे'
  ],
  alternates: {
    canonical: 'https://www.vedasach.com/ayurveda',
  },
  openGraph: {
    title: 'Ayurveda Wisdom, Herbs & Natural Remedies | Vedasach',
    description: 'Explore authentic Ayurvedic wisdom, natural herbal remedies, and holistic wellness lifestyle practices.',
    url: 'https://www.vedasach.com/ayurveda',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Ayurveda and Natural Herbal Remedies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayurveda Wisdom, Herbs & Natural Remedies',
    description: 'Explore authentic Ayurvedic wisdom, natural herbal remedies, and holistic wellness lifestyle practices.',
  },
};

export default function AyurvedaPage() {
  return (
    <CategoryPageLayout
      title="Ayurveda"
      title_hi="आयुर्वेद"
      description="Ancient Ayurvedic wisdom — herbs, treatments, and lifestyle practices for holistic health."
      description_hi="पारंपरिक आयुर्वेदिक ज्ञान — जड़ी-बूटियाँ, उपचार, और समग्र स्वास्थ्य के लिए जीवनशैली।"
      icon="🌿"
      slug="ayurveda"
    />
  );
}