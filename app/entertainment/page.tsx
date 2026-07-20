import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'Entertainment – vedasach',
  description: 'Entertainment news, Bollywood, movies, music, and celebrity updates.',
};

export default function EntertainmentPage() {
  return <CategoryPageLayout title="Entertainment" title_hi="मनोरंजन" description="Entertainment news, Bollywood, movies, music, and celebrity updates." description_hi="मनोरंजन समाचार, बॉलीवुड, फिल्में, संगीत और मशहूर हस्तियों के अपडेट।" icon="🎬" slug="entertainment" />;
}
