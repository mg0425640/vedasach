'use client';

import CategoryPageLayout from '@/components/shared/CategoryPageLayout';

export default function WorldPage() {
  return( 
    <CategoryPageLayout 
      title="World News" 
      title_hi="विश्व की खबरें" 
      description="Latest world news, global events, and international affairs." 
      description_hi="विश्व भर की ताज़ा खबरें, वैश्विक घटनाक्रम और अंतर्राष्ट्रीय मामले।" 
      icon="🌍" 
      slug="world" 
    />
  );
}
