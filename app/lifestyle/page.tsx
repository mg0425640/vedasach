import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Lifestyle – vedasach',
  description: 'Lifestyle tips, trends, and inspiration for modern living.',
};

export default function LifestylePage() {
  return <CategoryPageLayout title="Lifestyle" title_hi="जीवनशैली" description="Lifestyle tips, trends, and inspiration for modern living." description_hi="आधुनिक जीवन के लिए जीवनशैली युक्तियां, रुझान और प्रेरणा।" icon="✨" slug="lifestyle" />;
}
