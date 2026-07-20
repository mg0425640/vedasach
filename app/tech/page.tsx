import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Tech – VedaWell',
  description: 'Technology news, gadgets, AI, startups, and innovation.',
};

export default function TechPage() {
  return <CategoryPageLayout title="Tech" title_hi="तकनीक" description="Technology news, gadgets, AI, startups, and innovation." description_hi="तकनीक समाचार, गैजेट्स, AI, स्टार्टअप और नवाचार।" icon="💻" slug="tech" />;
}
