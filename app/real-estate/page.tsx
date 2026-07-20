import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Real Estate – VedaWell',
  description: 'Real estate news, property trends, and investment insights.',
};

export default function RealEstatePage() {
  return <CategoryPageLayout title="Real Estate" title_hi="रियल एस्टेट" description="Real estate news, property trends, and investment insights." description_hi="रियल एस्टेट समाचार, संपत्ति रुझान और निवेश जानकारी।" icon="🏠" slug="real-estate" />;
}
