import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Education – vedasach',
  description: 'Education news, career guidance, exams, and learning resources.',
};

export default function EducationPage() {
  return <CategoryPageLayout title="Education" title_hi="शिक्षा" description="Education news, career guidance, exams, and learning resources." description_hi="शिक्षा समाचार, करियर मार्गदर्शन, परीक्षाएं और सीखने के संसाधन।" icon="📚" slug="education" />;
}
