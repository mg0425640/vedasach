'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function EntertainmentPage() {
  return( 
    <CategoryPageLayout 
      title="Entertainment" 
      title_hi="मनोरंजन" 
      description="Entertainment news, celebrity updates, movie reviews, and more." 
      description_hi="मनोरंजन समाचार, सेलिब्रिटी अपडेट, फिल्म समीक्षाएं, और अधिक।" 
      icon="🎬" 
      slug="entertainment" 
    />
  );
}
