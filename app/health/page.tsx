'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function HealthPage() {
  return (
    <CategoryPageLayout
      title="Health & Wellness"
      title_hi="स्वास्थ्य और कल्याण"
      description="Evidence-based health guidance for weight loss, diabetes, digestion, and more."
      description_hi="वजन घटाने, मधुमेह, पाचन और अधिक के लिए प्रमाण-आधारित स्वास्थ्य मार्गदर्शन।"
      icon="❤️"
      slug="health"
    />
  );
}
