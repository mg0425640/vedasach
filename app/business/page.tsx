// app/business/page.tsx
import { Metadata } from 'next';
import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Business News, Market Updates, Startups & Economic Analysis',
  description: 'Stay updated with the latest business news, stock market updates, startup stories, corporate insights, and expert economic analysis.',
  keywords: [
    'business news',
    'market updates',
    'startup news',
    'economic analysis',
    'corporate news',
    'व्यापार समाचार',
    'बाज़ार अपडेट',
    'स्टार्टअप'
  ],
  alternates: {
    canonical: 'https://www.vedasach.com/business',
  },
  openGraph: {
    title: 'Business News, Market Updates & Startups | Vedasach',
    description: 'Explore the latest business news, market updates, startups, and economic analysis.',
    url: 'https://www.vedasach.com/business',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Business News and Market Updates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business News, Market Updates & Startups',
    description: 'Explore the latest business news, market updates, startups, and economic analysis.',
  },
};

export default function BusinessPage() {
  return (
    <CategoryPageLayout
      title="Business"
      title_hi="व्यापार"
      description="Business news, market updates, startups, and economic analysis."
      description_hi="व्यापार समाचार, बाज़ार अपडेट, स्टार्टअप और आर्थिक विश्लेषण।"
      icon="💼"
      slug="business"
    />
  );
}