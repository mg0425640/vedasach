// app/real-estate/page.tsx
import { Metadata } from 'next';
import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Real Estate News, Property Market Trends & Investment Analysis',
  description: 'Stay updated with the latest real estate news, property market trends, housing prices, buying and selling guides, and expert investment analysis.',
  keywords: [
    'real estate news',
    'property market trends',
    'housing prices',
    'buy property',
    'property investment',
    'commercial real estate',
    'residential properties',
    'रियल एस्टेट समाचार',
    'संपत्ति बाजार'
  ],
  alternates: {
    canonical: 'https://www.vedasach.com/real-estate',
  },
  openGraph: {
    title: 'Real Estate News & Property Market Trends | Vedasach',
    description: 'Explore the latest real estate news, property market updates, and expert investment analysis.',
    url: 'https://www.vedasach.com/real-estate',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop', // Optional: add a high-quality real estate banner image
        width: 1200,
        height: 630,
        alt: 'Real Estate News and Property Updates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate News & Property Market Trends',
    description: 'Explore the latest real estate news, property market updates, and expert investment analysis.',
  },
};

export default function RealEstatePage() {
  return (
    <CategoryPageLayout
      title="Real Estate"
      title_hi="रियल एस्टेट"
      description="Real estate news, property updates, and market analysis."
      description_hi="रियल एस्टेट समाचार, संपत्ति अपडेट, और बाजार विश्लेषण।"
      icon="🏠"
      slug="real-estate"
    />
  );
}