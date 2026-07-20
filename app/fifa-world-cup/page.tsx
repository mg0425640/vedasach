import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'FIFA World Cup – VedaWell',
  description: 'FIFA World Cup news, match updates, fixtures, results, and analysis.',
};

export default function FifaWorldCupPage() {
  return <CategoryPageLayout title="FIFA World Cup" title_hi="फीफा विश्व कप" description="FIFA World Cup news, match updates, fixtures, results, and analysis." description_hi="फीफा विश्व कप समाचार, मैच अपडेट, फिक्स्चर, परिणाम और विश्लेषण।" icon="⚽" slug="fifa-world-cup" />;
}
