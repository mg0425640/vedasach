'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function NutritionPage() {
  return (
    <CategoryPageLayout
      title="Nutrition"
      title_hi="पोषण"
      description="Food as medicine — guides on fruits, vegetables, superfoods, and balanced diet."
      description_hi="भोजन ही औषधि — फल, सब्जियों, सुपरफूड और संतुलित आहार पर मार्गदर्शन।"
      icon="🥗"
      slug="nutrition"
    />
  );
}
