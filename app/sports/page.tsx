'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function SportsPage() {
  return (
    <CategoryPageLayout
      title="Sports"
      title_hi="खेल"
      description="Sports news, updates, and analysis."
      description_hi="खेल समाचार, अपडेट, और विश्लेषण।"
      icon="🏛️"
      slug="Sports"
    />
  );
}
