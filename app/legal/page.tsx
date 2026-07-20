import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Legal – VedaWell',
  description: 'Legal news, law updates, court rulings, and legal analysis.',
};

export default function LegalPage() {
  return <CategoryPageLayout title="Legal" title_hi="कानूनी" description="Legal news, law updates, court rulings, and legal analysis." description_hi="कानूनी समाचार, कानून अपडेट, न्यायालय फैसले और कानूनी विश्लेषण।" icon="⚖️" slug="legal" />;
}
