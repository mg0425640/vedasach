import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export const metadata = {
  title: 'World News – VedaSach',
  description: 'Latest world news, global events, and international affairs from around the globe.',
};

export default function WorldPage() {
  return <CategoryPageLayout title="World" title_hi="विश्व" description="Latest world news, global events, and international affairs." description_hi="विश्व भर की ताज़ा खबरें, वैश्विक घटनाक्रम और अंतर्राष्ट्रीय मामले।" icon="🌍" slug="world" />;
}
