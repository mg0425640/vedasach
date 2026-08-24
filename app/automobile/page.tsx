// app/automobile/page.tsx
import { Metadata } from 'next';
import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Automobile News, Car & Bike Launches, Reviews & EV Updates',
  description: 'Stay ahead with the latest automobile news, new car and bike launches, expert vehicle reviews, electric vehicle (EV) updates, and auto market analysis.',
  keywords: [
    'automobile news',
    'car launches',
    'bike reviews',
    'electric vehicles',
    'EV updates',
    'auto market analysis',
    'car prices India',
    'ऑटोमोबाइल समाचार',
    'कार लॉन्च',
    'बाइक समीक्षा'
  ],
  alternates: {
    canonical: 'https://www.vedasach.com/automobile',
  },
  openGraph: {
    title: 'Automobile News, Car Launches & EV Updates | Vedasach',
    description: 'Explore the latest automobile news, new vehicle launches, expert car and bike reviews, and EV trends.',
    url: 'https://www.vedasach.com/automobile',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Automobile News and Car Launches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automobile News, Car Launches & EV Updates',
    description: 'Explore the latest automobile news, new vehicle launches, expert car and bike reviews, and EV trends.',
  },
};

export default function AutomobilePage() {
  return (
    <CategoryPageLayout
      title="Automobile"
      title_hi="ऑटोमोबाइल"
      description="Automobile news, updates, and analysis."
      description_hi="ऑटोमोबाइल समाचार, अपडेट, और विश्लेषण।"
      icon="🚗"
      slug="automobile"
    />
  );
}