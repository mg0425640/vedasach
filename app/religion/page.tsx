import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Religion – VedaWell',
  description: 'Religion news, spiritual guidance, and articles on faith traditions.',
};

export default function ReligionPage() {
  return <CategoryPageLayout title="Religion" title_hi="धर्म" description="Religion news, spiritual guidance, and articles on faith traditions." description_hi="धर्म समाचार, आध्यात्मिक मार्गदर्शन और आस्था परंपराओं पर लेख।" icon="🕉️" slug="religion" />;
}
