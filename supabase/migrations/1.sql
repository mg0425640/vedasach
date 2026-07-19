/*
# VedaWell Initial Schema

## Overview
Creates the full database schema for the VedaWell content commerce platform.
This is a public content site — no authentication required for reading; 
writes (comments, newsletter) are open to anon users.

## New Tables

### 1. categories
Stores content categories like Dream Meanings, Ayurveda, Yoga, etc.
- id (uuid, PK)
- name (text) — Display name e.g. "Dream Meanings"
- slug (text, unique) — URL-safe identifier e.g. "dreams"
- description (text)
- icon (text) — Emoji icon
- article_count (int) — Cached count of articles
- color (text) — Hex color for UI
- image_url (text)
- created_at (timestamptz)

### 2. articles
Stores all content articles across all categories.
- id (uuid, PK)
- slug (text, unique) — SEO-friendly URL slug
- title (text)
- excerpt (text)
- content (text) — Full article HTML/markdown content
- category (text) — Category name
- subcategory (text, nullable)
- image_url (text)
- author (text)
- author_image (text, nullable)
- published_at (timestamptz)
- read_time (int) — Estimated read time in minutes
- tags (text[]) — Array of tags
- featured (boolean) — Whether to feature on homepage
- trending (boolean)
- lucky_number (int, nullable) — For dream articles
- lucky_color (text, nullable) — For dream articles
- view_count (int) — Article view counter
- created_at (timestamptz)

### 3. products
Stores wellness products sold in the shop.
- id (uuid, PK)
- slug (text, unique)
- name (text)
- description (text)
- price (numeric) — Price in INR
- original_price (numeric, nullable) — Original price before discount
- image_url (text)
- images (text[]) — Additional product images
- category (text) — Product category
- rating (numeric) — Average rating out of 5
- review_count (int)
- badge (text, nullable) — 'NEW', 'SALE', 'HOT'
- discount (int, nullable) — Discount percentage
- in_stock (boolean)
- tags (text[])
- created_at (timestamptz)

### 4. newsletter_subscribers
Stores email newsletter subscriptions.
- id (uuid, PK)
- email (text, unique)
- subscribed_at (timestamptz)
- active (boolean) — Whether subscription is active

### 5. comments
Stores user comments on articles.
- id (uuid, PK)
- article_id (uuid, FK → articles.id)
- article_slug (text) — Denormalized for easy querying
- author_name (text)
- author_email (text)
- content (text)
- approved (boolean) — Moderation flag
- created_at (timestamptz)

### 6. contact_messages
Stores messages submitted through the contact form.
- id (uuid, PK)
- name (text)
- email (text)
- subject (text)
- category (text, nullable)
- message (text)
- read (boolean)
- created_at (timestamptz)

## Security
- RLS enabled on all tables
- Public read-only access on articles, products, categories (anon + authenticated)
- Public write access on newsletter_subscribers, comments, contact_messages
- Comments require moderation (approved = false by default)

## Notes
- No user authentication required for this schema
- All policies use TO anon, authenticated for maximum accessibility
- Articles and products are public content — intentionally readable by all
*/

-- ─── CATEGORIES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '📄',
  article_count int NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#E84E1B',
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ─── ARTICLES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL,
  subcategory text,
  image_url text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'VedaWell Team',
  author_image text,
  published_at timestamptz NOT NULL DEFAULT now(),
  read_time int NOT NULL DEFAULT 5,
  tags text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  trending boolean NOT NULL DEFAULT false,
  lucky_number int,
  lucky_color text,
  view_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_trending ON articles(trending) WHERE trending = true;

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_articles" ON articles;
CREATE POLICY "anon_select_articles" ON articles FOR SELECT
  TO anon, authenticated USING (true);

-- ─── PRODUCTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  image_url text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  rating numeric(3,1) NOT NULL DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  badge text CHECK (badge IN ('NEW', 'SALE', 'HOT')),
  discount int,
  in_stock boolean NOT NULL DEFAULT true,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock) WHERE in_stock = true;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ─── NEWSLETTER SUBSCRIBERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ─── COMMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved) WHERE approved = true;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_comments" ON comments;
CREATE POLICY "anon_select_comments" ON comments FOR SELECT
  TO anon, authenticated USING (approved = true);

DROP POLICY IF EXISTS "anon_insert_comments" ON comments;
CREATE POLICY "anon_insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  category text,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_messages;
CREATE POLICY "anon_insert_contact" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ─── SEED DATA: CATEGORIES ────────────────────────────────────────────────────
INSERT INTO categories (name, slug, description, icon, article_count, color, image_url)
VALUES
  ('Dream Meanings', 'dreams', 'Explore the symbolism behind your dreams across Hindu, Islamic, and Biblical traditions.', '🌙', 248, '#6366F1', 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Health & Wellness', 'health', 'Evidence-based health guidance for weight loss, diabetes, digestion, and more.', '❤️', 312, '#EF4444', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Ayurveda', 'ayurveda', 'Ancient Ayurvedic wisdom — herbs, treatments, and lifestyle practices.', '🌿', 195, '#10B981', 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Yoga & Meditation', 'yoga', 'Yoga poses, pranayama, and meditation for mind-body balance.', '🧘', 167, '#F59E0B', 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Beauty', 'beauty', 'Natural beauty tips, DIY face packs, and Ayurvedic skincare secrets.', '💄', 221, '#EC4899', 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Nutrition', 'nutrition', 'Food as medicine — guides on fruits, vegetables, superfoods, and balanced diet.', '🥗', 183, '#84CC16', 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Spirituality', 'spirituality', 'Mantras, meditation, Vastu Shastra, astrology, and Vedic wisdom.', '🙏', 142, '#8B5CF6', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Home Remedies', 'home-remedies', 'Natural cures from your kitchen for common everyday ailments.', '🏠', 158, '#F97316', 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600')
ON CONFLICT (slug) DO NOTHING;

-- ─── SEED DATA: ARTICLES ──────────────────────────────────────────────────────
INSERT INTO articles (slug, title, excerpt, category, subcategory, image_url, author, read_time, tags, featured, trending, lucky_number, lucky_color)
VALUES
  ('dream-about-cow-meaning', 'Dreaming of a Cow: Complete Spiritual & Cultural Meaning', 'Cows in dreams are deeply symbolic in Hindu, Biblical, and Islamic traditions. Discover what it truly means when you dream about a cow.', 'Dream Meanings', 'Animals', 'https://images.pexels.com/photos/735968/pexels-photo-735968.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dr. Priya Sharma', 8, ARRAY['cow','dream','spiritual','hinduism'], true, true, 7, 'Green'),
  ('ashwagandha-benefits-dosage', 'Ashwagandha: 12 Proven Benefits, Dosage & Side Effects', 'Ashwagandha (Withania somnifera) is one of the most powerful herbs in Ayurvedic medicine. Modern research confirms many of its traditional uses.', 'Ayurveda', 'Herbs', 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vaidya Rakesh Patel', 12, ARRAY['ashwagandha','ayurveda','stress','adaptogen'], true, true, NULL, NULL),
  ('yoga-for-back-pain-beginners', '10 Best Yoga Poses for Back Pain Relief (With Instructions)', 'Chronic back pain affects millions. These 10 evidence-backed yoga postures can provide lasting relief when practiced consistently.', 'Yoga & Meditation', 'Yoga for Pain', 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800', 'Ananya Krishnan', 10, ARRAY['yoga','back pain','beginners','wellness'], true, false, NULL, NULL),
  ('remove-dark-circles-naturally', 'How to Remove Dark Circles Naturally: 15 Proven Home Remedies', 'Dark circles under eyes can be caused by fatigue, genetics, or lifestyle. These natural remedies can help reduce them significantly.', 'Beauty', 'Eye Care', 'https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=800', 'Meera Nair', 7, ARRAY['dark circles','beauty','home remedies','eyes'], false, true, NULL, NULL),
  ('dream-about-snake-meaning', 'Dream About Snake: What Does It Really Mean?', 'Snake dreams are among the most common and significant. Understand the symbolism across cultures and what your subconscious is telling you.', 'Dream Meanings', 'Animals', 'https://images.pexels.com/photos/2062316/pexels-photo-2062316.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dr. Priya Sharma', 9, ARRAY['snake','dream','spiritual','subconscious'], false, true, 3, 'Blue'),
  ('giloy-benefits-immunity', 'Giloy (Guduchi): The Ultimate Immunity Booster Explained', 'Giloy is called Amrita — the root of immortality in Sanskrit. Everything you need to know about this miraculous Ayurvedic herb.', 'Ayurveda', 'Herbs', 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vaidya Rakesh Patel', 11, ARRAY['giloy','immunity','ayurveda','herbs'], false, false, NULL, NULL),
  ('diabetes-diet-foods-to-eat-avoid', 'Diabetes Diet: 30 Best Foods to Eat and 10 to Avoid', 'Managing diabetes through diet is powerful. This guide covers glycemic index, portion control, and the best foods for blood sugar control.', 'Health & Wellness', 'Diabetes', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dr. Suresh Mehta', 14, ARRAY['diabetes','diet','blood sugar','health'], false, true, NULL, NULL),
  ('morning-yoga-routine-15-minutes', '15-Minute Morning Yoga Routine to Start Your Day Right', 'A simple, effective morning yoga sequence that energizes the body, clears the mind, and sets a positive tone for the entire day.', 'Yoga & Meditation', 'Morning Yoga', 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=800', 'Ananya Krishnan', 6, ARRAY['yoga','morning','routine','beginners'], false, false, NULL, NULL),
  ('benefits-of-turmeric-milk', 'Golden Milk (Turmeric Latte): 8 Science-Backed Benefits', 'Haldi doodh, or golden milk, has been used for centuries in Indian households. Modern science is now confirming its remarkable health benefits.', 'Nutrition', 'Superfoods', 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800', 'Ritu Agarwal', 8, ARRAY['turmeric','golden milk','nutrition','anti-inflammatory'], false, true, NULL, NULL),
  ('dream-about-water-meaning', 'Dreaming of Water: Spiritual Meaning Across Cultures', 'Water in dreams can represent emotions, the subconscious, or spiritual cleansing. Learn the complete interpretation based on the water''s condition.', 'Dream Meanings', 'Elements', 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dr. Priya Sharma', 7, ARRAY['water','dream','emotions','spiritual'], false, true, 9, 'White'),
  ('home-remedies-for-cold-cough', '12 Effective Home Remedies for Cold and Cough', 'Before reaching for medicine, try these time-tested home remedies that can provide significant relief from cold and cough symptoms naturally.', 'Home Remedies', 'Cold & Cough', 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dr. Anjali Desai', 9, ARRAY['cold','cough','home remedies','natural'], false, false, NULL, NULL),
  ('om-mantra-benefits-chanting', 'The Power of OM: Benefits of Chanting & How to Practice', 'OM is the most sacred sound in Vedic tradition. Modern neuroscience is discovering why chanting it has profound effects on the mind and body.', 'Spirituality', 'Mantras', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800', 'Swami Yogananda', 10, ARRAY['om','mantra','meditation','spirituality'], false, false, NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- ─── SEED DATA: PRODUCTS ──────────────────────────────────────────────────────
INSERT INTO products (slug, name, description, price, original_price, image_url, category, rating, review_count, badge, discount, in_stock, tags)
VALUES
  ('ashwagandha-root-powder', 'Organic Ashwagandha Root Powder', 'Pure organic ashwagandha root powder, KSM-66 standardized extract. Helps reduce stress, improve sleep, and boost immunity.', 599, 799, 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg?auto=compress&cs=tinysrgb&w=600', 'Supplements', 4.8, 234, 'SALE', 25, true, ARRAY['adaptogen','stress','immunity']),
  ('cold-pressed-coconut-oil', 'Cold Pressed Virgin Coconut Oil', 'Cold-pressed, unrefined virgin coconut oil for hair, skin, and cooking. Rich in lauric acid and medium-chain triglycerides.', 399, NULL, 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=600', 'Hair Care', 4.6, 189, 'NEW', NULL, true, ARRAY['coconut oil','hair','skin']),
  ('yoga-mat-premium', 'Premium Non-Slip Yoga Mat', '6mm thick premium eco-friendly yoga mat with alignment lines. Superior grip and cushioning for any yoga style.', 1299, 1799, 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=600', 'Yoga Accessories', 4.7, 156, 'SALE', 28, true, ARRAY['yoga','exercise','fitness']),
  ('triphala-churna', 'Triphala Churna – Digestive Support', 'Traditional Ayurvedic tri-fruit formula. Supports digestion, detoxification, and bowel health naturally.', 299, NULL, 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600', 'Supplements', 4.5, 312, 'HOT', NULL, true, ARRAY['triphala','digestion','detox']),
  ('rosehip-face-serum', 'Rosehip & Vitamin C Face Serum', 'Potent antioxidant serum with 15% Vitamin C and rosehip oil. Brightens skin, fades dark spots, and boosts collagen.', 799, 999, 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600', 'Skin Care', 4.9, 428, 'SALE', 20, true, ARRAY['face serum','vitamin c','brightening']),
  ('organic-shilajit-resin', 'Pure Himalayan Shilajit Resin', 'Authentic Himalayan shilajit resin. High fulvic acid content. Energy, vitality, and cognitive support.', 1499, NULL, 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg?auto=compress&cs=tinysrgb&w=600', 'Supplements', 4.7, 98, 'NEW', NULL, true, ARRAY['shilajit','energy','men health']),
  ('neem-turmeric-face-pack', 'Neem & Turmeric Face Pack', 'Purifying face pack with neem, turmeric, and sandalwood. Clears acne, reduces oiliness, and improves skin tone.', 349, NULL, 'https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=600', 'Skin Care', 4.4, 267, NULL, NULL, true, ARRAY['face pack','neem','acne']),
  ('meditation-mala-beads', 'Rudraksha Meditation Mala Beads', '108 authentic Rudraksha beads mala. Used for mantra chanting and meditation. Promotes mental clarity and spiritual growth.', 899, 1199, 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600', 'Spirituality', 4.8, 142, 'SALE', 25, true, ARRAY['rudraksha','mala','meditation','prayer']),
  ('brahmi-hair-oil', 'Brahmi & Amla Hair Growth Oil', 'Ayurvedic hair oil with Brahmi, Amla, Bhringraj, and Coconut oil. Reduces hair fall and promotes thick, healthy hair growth.', 449, NULL, 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=600', 'Hair Care', 4.6, 389, NULL, NULL, true, ARRAY['hair oil','brahmi','amla','hair fall']),
  ('organic-ghee', 'A2 Cow Ghee – Bilona Method', 'Traditional bilona method A2 ghee from grass-fed cows. Rich in CLA, vitamins A, D, E, K. Best for cooking and Ayurvedic use.', 699, 849, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', 'Organic Foods', 4.9, 521, 'HOT', 18, true, ARRAY['ghee','a2','cooking','ayurveda']),
  ('moringa-powder', 'Organic Moringa Leaf Powder', 'Pure organic moringa powder — the "miracle tree" superfood. Packed with vitamins, minerals, and antioxidants.', 349, NULL, 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=600', 'Supplements', 4.5, 178, 'NEW', NULL, true, ARRAY['moringa','superfood','nutrition']),
  ('copper-water-bottle', 'Pure Copper Water Bottle 1L', 'Pure copper bottle for water storage. Ayurveda recommends drinking copper-infused water for immunity and digestion.', 549, NULL, 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=600', 'Wellness', 4.7, 213, NULL, NULL, true, ARRAY['copper','water bottle','ayurveda','wellness'])
ON CONFLICT (slug) DO NOTHING;
