export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  subcategory?: string;
  image: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  luckyNumber?: number;
  luckyColor?: string;
}

export interface DatabaseArticle {
  id: string;
  slug: string;
  title: string;
  title_hi?: string | null;
  excerpt: string;
  excerpt_hi?: string | null;
  content?: string;
  content_hi?: string | null;
  category: string;
  subcategory?: string | null;
  subcategory_hi?: string | null;
  image_url: string;
  image_alt?: string | null;
  author: string;
  author_image?: string | null;
  published_at: string;
  read_count: number;
  like_count: number;
  share_count?: number;
  tags?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  badge?: 'NEW' | 'SALE' | 'HOT';
  discount?: number;
  description?: string;
  tags?: string[];
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
  color: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface DreamPost extends Article {
  positivemeaning?: string;
  negativemeaning?: string;
  career?: string;
  business?: string;
  loveLife?: string;
  marriage?: string;
  health?: string;
  money?: string;
  luckyNumber?: number;
  luckyColor?: string;
  todaysAdvice?: string;
  precautions?: string;
  faqs?: { q: string; a: string }[];
}
