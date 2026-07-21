'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function BusinessPage() {
  return (
    <CategoryPageLayout
      title="Business"
      title_hi="व्यापार"
      description="Business news, market updates, startups, and economic analysis."
      description_hi="व्यापार समाचार, बाज़ार अपडेट, स्टार्टअप और आर्थिक विश्लेषण।"
      icon="💼"
      slug="business"
    />
  );
}
