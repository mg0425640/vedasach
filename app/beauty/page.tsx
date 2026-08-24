// app/beauty/page.tsx
import { Metadata } from 'next';
import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Natural Beauty Tips, DIY Skincare & Ayurvedic Secrets',
  description: 'Discover natural beauty tips, homemade DIY face packs, organic skincare routines, and Ayurvedic beauty secrets for a healthy, radiant glow.',
  keywords: [
    'beauty tips',
    'natural skincare',
    'DIY face packs',
    'ayurvedic beauty secrets',
    'organic glow',
    'सौंदर्य टिप्स',
    'घरेलू नुस्खे',
    'त्वचा की देखभाल'
  ],
  alternates: {
    canonical: 'https://www.vedasach.com/beauty',
  },
  openGraph: {
    title: 'Natural Beauty Tips & DIY Skincare Secrets | Vedasach',
    description: 'Explore natural beauty tips, DIY face packs, and organic skincare routines for a radiant glow.',
    url: 'https://www.vedasach.com/beauty',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Natural Beauty Tips and Skincare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natural Beauty Tips & DIY Skincare Secrets',
    description: 'Explore natural beauty tips, DIY face packs, and organic skincare routines for a radiant glow.',
  },
};

export default function BeautyPage() {
  return (
    <CategoryPageLayout
      title="Beauty"
      title_hi="सौंदर्य"
      description="Natural beauty tips, DIY face packs, and Ayurvedic skincare secrets for a radiant glow."
      description_hi="प्राकृतिक सौंदर्य टिप्स, DIY फेस पैक, और त्वचा की चमक के लिए आयुर्वेदिक रहस्य।"
      icon="💄"
      slug="beauty"
    />
  );
}