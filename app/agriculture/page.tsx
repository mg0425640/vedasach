// app/agriculture/page.tsx
import { Metadata } from 'next';
import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Agriculture News, Farming Updates & Market Analysis',
  description: 'Stay updated with the latest agriculture news, modern farming techniques, crop market prices, government schemes, and expert agricultural analysis.',
  keywords: [
    'agriculture news',
    'farming updates',
    'crop market prices',
    'modern farming techniques',
    'agricultural schemes',
    'agri business',
    'कृषि समाचार',
    'खेती अपडेट',
    'फसल बाजार भाव'
  ],
  alternates: {
    canonical: 'https://www.vedasach.com/agriculture',
  },
  openGraph: {
    title: 'Agriculture News & Farming Updates | Vedasach',
    description: 'Explore the latest agriculture news, farming updates, crop prices, and expert agricultural analysis.',
    url: 'https://www.vedasach.com/agriculture',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Agriculture News and Farming Updates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agriculture News & Farming Updates',
    description: 'Explore the latest agriculture news, farming updates, crop prices, and expert agricultural analysis.',
  },
};

export default function AgriculturePage() {
  return (
    <CategoryPageLayout
      title="Agriculture"
      title_hi="कृषि"
      description="Agriculture news, updates, and analysis."
      description_hi="कृषि समाचार, अपडेट, और विश्लेषण।"
      icon="🏛️"
      slug="agriculture"
    />
  );
}