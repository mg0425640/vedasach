/*
# VedaWell Auth & User Extension Tables

## Overview
Adds all user-related tables for authentication, dashboard, orders, 
wishlist, notifications, cookie consent, and Hindi language support.

## New Tables

### 1. user_profiles
Extended profile data linked to Supabase auth.users.
Columns: id (FK to auth.users), username, full_name, full_name_hi,
email, mobile, avatar_url, email_verified, mobile_verified,
preferred_language, bio, created_at, updated_at

### 2. user_addresses
Shipping addresses for users (max 5 enforced in application layer).
Columns: id, user_id, label, full_name, mobile, address_line1,
address_line2, city, state, pincode, country, is_default, created_at

### 3. orders
Product orders placed by users.
Columns: id, user_id, order_number, status, status_hi, total_amount,
shipping_address (jsonb), payment_method, payment_status, tracking_number,
courier_name, notes, cancellation_reason, cancelled_at, delivered_at, created_at

### 4. order_items
Line items for each order.
Columns: id, order_id, product_id, product_name, product_name_hi,
product_image, quantity, price, created_at

### 5. wishlist_items
User's wishlist/liked products.
Columns: id, user_id, product_id, created_at. Unique on (user_id, product_id)

### 6. refunds
Refund requests for cancelled orders.
Columns: id, order_id, user_id, amount, status, status_hi, reason, notes,
processed_at, created_at

### 7. notifications (global)
Platform-wide notifications shown to users.
Columns: id, title, title_hi, message, message_hi, type, target_all,
image_url, action_url, expires_at, created_at

### 8. user_notification_reads
Tracks which notifications each user has read.
Columns: id, user_id, notification_id, read_at. Unique on (user_id, notification_id)

### 9. cookie_consents
Stores visitor cookie consent preferences.
Columns: id, session_id, user_id (nullable), consent_type, created_at

## Modified Tables

### articles
Added Hindi language columns: title_hi, excerpt_hi, content_hi, subcategory_hi

### categories  
Added Hindi language column: name_hi, description_hi

## Security
- RLS enabled on all new tables
- user_profiles, addresses, orders, wishlist, refunds, notifications scoped to authenticated users
- cookie_consents allows anon inserts
- notifications allows anon read (public announcements)
*/

-- ─── UPDATE ARTICLES: Add Hindi columns ───────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='title_hi') THEN
    ALTER TABLE articles ADD COLUMN title_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='excerpt_hi') THEN
    ALTER TABLE articles ADD COLUMN excerpt_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='content_hi') THEN
    ALTER TABLE articles ADD COLUMN content_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='subcategory_hi') THEN
    ALTER TABLE articles ADD COLUMN subcategory_hi text;
  END IF;
END $$;

-- ─── UPDATE CATEGORIES: Add Hindi columns ─────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='name_hi') THEN
    ALTER TABLE categories ADD COLUMN name_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='description_hi') THEN
    ALTER TABLE categories ADD COLUMN description_hi text;
  END IF;
END $$;

-- Seed Hindi category names
UPDATE categories SET name_hi = 'स्वप्न अर्थ', description_hi = 'हिंदू, इस्लामी और बाइबिल परंपराओं में अपने सपनों का प्रतीकवाद जानें।' WHERE slug = 'dreams';
UPDATE categories SET name_hi = 'स्वास्थ्य और कल्याण', description_hi = 'वजन घटाने, मधुमेह, पाचन और अधिक पर साक्ष्य-आधारित स्वास्थ्य मार्गदर्शन।' WHERE slug = 'health';
UPDATE categories SET name_hi = 'आयुर्वेद', description_hi = 'प्राचीन आयुर्वेदिक ज्ञान — जड़ी-बूटियां, उपचार और जीवनशैली प्रथाएं।' WHERE slug = 'ayurveda';
UPDATE categories SET name_hi = 'योग और ध्यान', description_hi = 'मन-शरीर संतुलन के लिए योगासन, प्राणायाम और ध्यान।' WHERE slug = 'yoga';
UPDATE categories SET name_hi = 'सौंदर्य', description_hi = 'प्राकृतिक सौंदर्य युक्तियां, DIY फेस पैक और आयुर्वेदिक स्किनकेयर रहस्य।' WHERE slug = 'beauty';
UPDATE categories SET name_hi = 'पोषण', description_hi = 'भोजन ही औषधि — फल, सब्जियां, सुपरफूड और संतुलित आहार पर मार्गदर्शन।' WHERE slug = 'nutrition';
UPDATE categories SET name_hi = 'अध्यात्म', description_hi = 'मंत्र, ध्यान, वास्तु शास्त्र, ज्योतिष और वैदिक ज्ञान।' WHERE slug = 'spirituality';
UPDATE categories SET name_hi = 'घरेलू उपचार', description_hi = 'आपकी रसोई से प्राकृतिक इलाज — आम बीमारियों के लिए प्राकृतिक समाधान।' WHERE slug = 'home-remedies';

-- Seed Hindi article titles
UPDATE articles SET title_hi = 'गाय का सपना देखना: संपूर्ण आध्यात्मिक और सांस्कृतिक अर्थ', excerpt_hi = 'सपनों में गाय हिंदू, बाइबिल और इस्लामी परंपराओं में गहरी प्रतीकात्मक है। जानें गाय का सपना देखने का वास्तविक अर्थ।' WHERE slug = 'dream-about-cow-meaning';
UPDATE articles SET title_hi = 'अश्वगंधा: 12 सिद्ध फायदे, खुराक और दुष्प्रभाव', excerpt_hi = 'अश्वगंधा (Withania somnifera) आयुर्वेदिक चिकित्सा की सबसे शक्तिशाली जड़ी-बूटियों में से एक है।' WHERE slug = 'ashwagandha-benefits-dosage';
UPDATE articles SET title_hi = 'साँप का सपना देखना: वास्तव में क्या मतलब है?', excerpt_hi = 'साँप के सपने सबसे आम और महत्वपूर्ण हैं। विभिन्न संस्कृतियों में प्रतीकवाद को समझें।' WHERE slug = 'dream-about-snake-meaning';

-- ─── USER PROFILES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  full_name_hi text,
  email text NOT NULL,
  mobile text,
  avatar_url text,
  email_verified boolean NOT NULL DEFAULT false,
  mobile_verified boolean NOT NULL DEFAULT false,
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
  bio text,
  bio_hi text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_profile" ON user_profiles;
CREATE POLICY "users_select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own_profile" ON user_profiles;
CREATE POLICY "users_insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;
CREATE POLICY "users_update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── USER ADDRESSES ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  full_name text NOT NULL,
  mobile text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addresses" ON user_addresses;
CREATE POLICY "select_own_addresses" ON user_addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON user_addresses;
CREATE POLICY "insert_own_addresses" ON user_addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON user_addresses;
CREATE POLICY "update_own_addresses" ON user_addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON user_addresses;
CREATE POLICY "delete_own_addresses" ON user_addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  order_number text UNIQUE NOT NULL DEFAULT 'VW-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','dispatched','out_for_delivery','delivered','cancelled','refund_initiated','refunded')),
  status_hi text NOT NULL DEFAULT 'लंबित',
  total_amount numeric(10,2) NOT NULL,
  shipping_address jsonb NOT NULL DEFAULT '{}',
  payment_method text NOT NULL DEFAULT 'cod',
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  tracking_number text,
  courier_name text,
  notes text,
  cancellation_reason text,
  cancelled_at timestamptz,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_name_hi text,
  product_image text NOT NULL DEFAULT '',
  quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ─── WISHLIST ITEMS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlist_items;
CREATE POLICY "select_own_wishlist" ON wishlist_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlist_items;
CREATE POLICY "insert_own_wishlist" ON wishlist_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlist_items;
CREATE POLICY "delete_own_wishlist" ON wishlist_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── REFUNDS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','processed')),
  status_hi text NOT NULL DEFAULT 'लंबित',
  reason text,
  notes text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);

ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_refunds" ON refunds;
CREATE POLICY "select_own_refunds" ON refunds FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_refunds" ON refunds;
CREATE POLICY "insert_own_refunds" ON refunds FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_hi text,
  message text NOT NULL,
  message_hi text,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','error','promo','order')),
  target_all boolean NOT NULL DEFAULT true,
  image_url text,
  action_url text,
  action_label text,
  action_label_hi text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT
  TO anon, authenticated USING (
    target_all = true AND (expires_at IS NULL OR expires_at > now())
  );

-- ─── USER NOTIFICATION READS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_notification_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id uuid NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

CREATE INDEX IF NOT EXISTS idx_user_notif_reads_user ON user_notification_reads(user_id);

ALTER TABLE user_notification_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notif_reads" ON user_notification_reads;
CREATE POLICY "select_own_notif_reads" ON user_notification_reads FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notif_reads" ON user_notification_reads;
CREATE POLICY "insert_own_notif_reads" ON user_notification_reads FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ─── COOKIE CONSENTS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cookie_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  consent_type text NOT NULL CHECK (consent_type IN ('all','necessary','declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cookie_consents_session ON cookie_consents(session_id);

ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_cookie_consent" ON cookie_consents;
CREATE POLICY "anon_insert_cookie_consent" ON cookie_consents FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ─── SEED: Sample notifications ──────────────────────────────────────────────
INSERT INTO notifications (title, title_hi, message, message_hi, type, action_url, action_label, action_label_hi)
VALUES
  ('Welcome to VedaWell!', 'वेदावेल में आपका स्वागत है!', 'Explore thousands of wellness articles, Ayurvedic guides, and natural health solutions.', 'हजारों कल्याण लेख, आयुर्वेदिक गाइड और प्राकृतिक स्वास्थ्य समाधान देखें।', 'info', '/', 'Explore Now', 'अभी देखें'),
  ('New Dream Meanings Added', 'नए स्वप्न अर्थ जोड़े गए', '50+ new dream interpretations have been added to our encyclopedia!', 'हमारे विश्वकोश में 50+ नए सपनों के अर्थ जोड़े गए हैं!', 'success', '/dreams', 'View Dreams', 'सपने देखें'),
  ('Summer Wellness Sale', 'ग्रीष्मकालीन कल्याण बिक्री', 'Get up to 30% off on selected Ayurvedic supplements and wellness products.', 'चुने हुए आयुर्वेदिक सप्लीमेंट और वेलनेस उत्पादों पर 30% तक की छूट पाएं।', 'promo', '/shop', 'Shop Now', 'अभी खरीदें')
ON CONFLICT DO NOTHING;
