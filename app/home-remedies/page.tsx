'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function HomeRemediesPage() {
  return (
    <CategoryPageLayout
      title="Home Remedies"
      title_hi="घरेलू नुस्खे"
      description="Time-tested natural remedies using ingredients from your kitchen and garden. Safe, effective, side-effect free."
      description_hi="आपकी रसोई और बगीचे की सामग्री से समय-परीक्षित प्राकृतिक उपचार। सुरक्षित और प्रभावी।"
      icon="🏠"
      slug="home-remedies"
    />
  );
}
