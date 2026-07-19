-- ─── ENHANCE ARTICLES TABLE ──────────────────────────────────────────────────
DO $$
BEGIN
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
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='meta_title') THEN
    ALTER TABLE articles ADD COLUMN meta_title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='meta_description') THEN
    ALTER TABLE articles ADD COLUMN meta_description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='meta_keywords') THEN
    ALTER TABLE articles ADD COLUMN meta_keywords text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='meta_title_hi') THEN
    ALTER TABLE articles ADD COLUMN meta_title_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='meta_description_hi') THEN
    ALTER TABLE articles ADD COLUMN meta_description_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='read_count') THEN
    ALTER TABLE articles ADD COLUMN read_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='like_count') THEN
    ALTER TABLE articles ADD COLUMN like_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='share_count') THEN
    ALTER TABLE articles ADD COLUMN share_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='canonical_url') THEN
    ALTER TABLE articles ADD COLUMN canonical_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='og_image') THEN
    ALTER TABLE articles ADD COLUMN og_image text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='is_published') THEN
    ALTER TABLE articles ADD COLUMN is_published boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- Backfill SEO fields from existing data
UPDATE articles SET
  meta_title = COALESCE(meta_title, title),
  meta_description = COALESCE(meta_description, excerpt),
  meta_keywords = COALESCE(meta_keywords, tags),
  og_image = COALESCE(og_image, image_url),
  read_count = COALESCE(read_count, (random() * 500 + 100)::integer),
  like_count = COALESCE(like_count, (random() * 50 + 5)::integer),
  share_count = COALESCE(share_count, (random() * 30 + 3)::integer),
  subcategory_hi = CASE subcategory
    WHEN 'Animals' THEN 'जानवर'
    WHEN 'Elements' THEN 'तत्व'
    WHEN 'Herbs' THEN 'जड़ी-बूटियां'
    WHEN 'Yoga for Pain' THEN 'दर्द के लिए योग'
    WHEN 'Eye Care' THEN 'आंखों की देखभाल'
    WHEN 'Morning Yoga' THEN 'सुबह का योग'
    WHEN 'Superfoods' THEN 'सुपरफूड'
    WHEN 'Cold & Cough' THEN 'सर्दी और खांसी'
    WHEN 'Mantras' THEN 'मंत्र'
    WHEN 'Diabetes' THEN 'मधुमेह'
    ELSE subcategory
  END
WHERE meta_title IS NULL OR subcategory_hi IS NULL;

-- ─── article_interactions TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS article_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'share', 'bookmark', 'view')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_article_interactions_article ON article_interactions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_interactions_user ON article_interactions(user_id) WHERE user_id IS NOT NULL;

ALTER TABLE article_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "interactions_select_public" ON article_interactions;
CREATE POLICY "interactions_select_public" ON article_interactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "interactions_insert_auth" ON article_interactions;
CREATE POLICY "interactions_insert_auth" ON article_interactions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "interactions_insert_anon" ON article_interactions;
CREATE POLICY "interactions_insert_anon" ON article_interactions FOR INSERT
  TO anon WITH CHECK (session_id IS NOT NULL);

-- ─── CATEGORY_ADS TABLE ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS category_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_hi text,
  description text DEFAULT '',
  description_hi text,
  image_url text NOT NULL DEFAULT '',
  link_url text,
  slot text NOT NULL CHECK (slot IN ('banner-1','banner-2','banner-3','side-image-1','side-image-2','side-image-3')),
  target_all_categories boolean NOT NULL DEFAULT false,
  target_health boolean NOT NULL DEFAULT false,
  target_ayurveda boolean NOT NULL DEFAULT false,
  target_yoga boolean NOT NULL DEFAULT false,
  target_beauty boolean NOT NULL DEFAULT false,
  target_nutrition boolean NOT NULL DEFAULT false,
  target_home_remedies boolean NOT NULL DEFAULT false,
  target_spirituality boolean NOT NULL DEFAULT false,
  target_dreams boolean NOT NULL DEFAULT false,
  target_blog boolean NOT NULL DEFAULT false,
  target_weight_loss boolean NOT NULL DEFAULT false,
  target_skin_care boolean NOT NULL DEFAULT false,
  target_hair_care boolean NOT NULL DEFAULT false,
  target_meditation boolean NOT NULL DEFAULT false,
  target_herbs boolean NOT NULL DEFAULT false,
  target_diet boolean NOT NULL DEFAULT false,
  target_mental_health boolean NOT NULL DEFAULT false,
  show_on_article_pages boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  click_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_category_ads_slot ON category_ads(slot) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_category_ads_health ON category_ads(target_health) WHERE is_active = true;

ALTER TABLE category_ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "category_ads_read" ON category_ads;
CREATE POLICY "category_ads_read" ON category_ads FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- ─── GLOBAL_ADS TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS global_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_hi text,
  description text DEFAULT '',
  description_hi text,
  image_url text NOT NULL DEFAULT '',
  link_url text,
  show_on_home boolean NOT NULL DEFAULT false,
  show_on_all_pages boolean NOT NULL DEFAULT false,
  show_on_header boolean NOT NULL DEFAULT false,
  show_on_footer boolean NOT NULL DEFAULT false,
  slot text NOT NULL DEFAULT 'leaderboard' CHECK (slot IN ('leaderboard','rectangle','square','mobile-banner','sticky-bottom','sticky-top')),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  click_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE global_ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "global_ads_read" ON global_ads;
CREATE POLICY "global_ads_read" ON global_ads FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- ─── AUTH_POPUP_ADS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_popup_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_hi text,
  description text DEFAULT '',
  description_hi text,
  image_url text NOT NULL DEFAULT '',
  link_url text,
  show_on_login_modal boolean NOT NULL DEFAULT false,
  show_on_signup_modal boolean NOT NULL DEFAULT false,
  show_on_popup boolean NOT NULL DEFAULT false,
  ad_format text NOT NULL DEFAULT 'banner' CHECK (ad_format IN ('banner','inline','card')),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  click_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE auth_popup_ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_popup_ads_read" ON auth_popup_ads;
CREATE POLICY "auth_popup_ads_read" ON auth_popup_ads FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- ─── PROMOTED_CONTENT TABLE ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promoted_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_hi text,
  sponsor_name text NOT NULL,
  sponsor_name_hi text,
  image_url text NOT NULL DEFAULT '',
  link_url text NOT NULL,
  target_all boolean NOT NULL DEFAULT false,
  target_health boolean NOT NULL DEFAULT false,
  target_ayurveda boolean NOT NULL DEFAULT false,
  target_yoga boolean NOT NULL DEFAULT false,
  target_beauty boolean NOT NULL DEFAULT false,
  target_nutrition boolean NOT NULL DEFAULT false,
  target_home_remedies boolean NOT NULL DEFAULT false,
  target_spirituality boolean NOT NULL DEFAULT false,
  target_dreams boolean NOT NULL DEFAULT false,
  target_blog boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  is_video boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  click_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promoted_content_active ON promoted_content(is_active) WHERE is_active = true;

ALTER TABLE promoted_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "promoted_content_read" ON promoted_content;
CREATE POLICY "promoted_content_read" ON promoted_content FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- ─── SEED: CATEGORY ADS ──────────────────────────────────────────────────────
INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_health, target_weight_loss, sort_order) VALUES
('Ayurvedic Weight Loss Pack', 'आयुर्वेदिक वजन घटाने का पैक', 'Lose weight naturally with Ayurveda', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/weight-loss', 'banner-1', true, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_health, target_mental_health, sort_order) VALUES
('Mental Wellness App', 'मानसिक स्वास्थ्य ऐप', 'Guided meditation for stress relief', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/app', 'banner-2', true, true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_health, sort_order) VALUES
('Immunity Booster Kit', 'इम्युनिटी बूस्टर किट', 'Strengthen your immune system', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/immunity', 'banner-3', true, 3)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_health, sort_order) VALUES
('Health Checkup at Home', 'घर पर स्वास्थ्य जांच', 'Book your home health test', 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg', 'https://vedawell.in/health-test', 'side-image-1', true, 4)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_health, target_diet, sort_order) VALUES
('Diabetic Diet Plan', 'मधुमेह आहार योजना', 'Custom diet for diabetes management', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'https://vedawell.in/diet-plan', 'side-image-2', true, true, 5)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_health, sort_order) VALUES
('VedaWell App Download', 'वेदावेल ऐप डाउनलोड', 'Get health tips on your phone', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/app', 'side-image-3', true, 6)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_ayurveda, target_herbs, sort_order) VALUES
('Ashwagandha KSM-66', 'अश्वगंधा KSM-66', 'Premium ashwagandha supplement', 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg', 'https://vedawell.in/shop/ashwagandha', 'banner-1', true, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_ayurveda, sort_order) VALUES
('Panchakarma Treatment', 'पंचकर्म उपचार', 'Traditional Ayurvedic detox', 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg', 'https://vedawell.in/panchakarma', 'banner-2', true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_ayurveda, target_herbs, sort_order) VALUES
('Herb Garden Kit', 'जड़ी-बूटी बागान किट', 'Grow your own medicinal herbs', 'https://images.pexels.com/photos/6693663/pexels-photo-6693663.jpeg', 'https://vedawell.in/shop/herb-kit', 'side-image-1', true, true, 3)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_yoga, target_meditation, sort_order) VALUES
('Yoga Starter Pack', 'योग स्टार्टर पैक', 'Everything for beginners', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://vedawell.in/shop/yoga-kit', 'banner-1', true, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_yoga, sort_order) VALUES
('Online Yoga Classes', 'ऑनलाइन योग कक्षाएं', 'Live classes with certified instructors', 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg', 'https://vedawell.in/yoga-classes', 'banner-2', true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_beauty, target_skin_care, sort_order) VALUES
('Organic Skin Care Kit', 'जैविक त्वचा देखभाल किट', 'Natural glow with Ayurvedic ingredients', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop/skincare-kit', 'banner-1', true, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_beauty, target_hair_care, sort_order) VALUES
('Hair Fall Solution Kit', 'बाल झड़ने का समाधान', 'Stop hair fall in 30 days', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop/hair-kit', 'banner-2', true, true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_nutrition, target_diet, sort_order) VALUES
('Personalized Diet Plan', 'व्यक्तिगत आहार योजना', 'Diet plan by certified nutritionist', 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg', 'https://vedawell.in/diet-consultation', 'banner-1', true, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_home_remedies, sort_order) VALUES
('Home Remedies eBook', 'घरेलू नुसखे ईबुक', '500+ home remedies in one book', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/ebook', 'banner-1', true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_spirituality, target_meditation, sort_order) VALUES
('Rudraksha Mala', 'रुद्राक्ष माला', '108 bead mala for meditation', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 'https://vedawell.in/shop/mala', 'banner-1', true, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_all_categories, sort_order) VALUES
('VedaWell Premium', 'वेदावेल प्रीमियम', 'Get premium health content', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/premium', 'banner-3', true, 99)
ON CONFLICT DO NOTHING;

INSERT INTO category_ads (title, title_hi, description, image_url, link_url, slot, target_dreams, sort_order) VALUES
('Dream Interpretation Guide', 'स्वप्न व्याख्या गाइड', 'Complete dream dictionary', 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg', 'https://vedawell.in/shop/dream-guide', 'banner-1', true, 1)
ON CONFLICT DO NOTHING;

-- ─── SEED: GLOBAL ADS ────────────────────────────────────────────────────────
INSERT INTO global_ads (title, title_hi, image_url, link_url, show_on_home, show_on_all_pages, slot, sort_order) VALUES
('VedaWell Herbal Store', 'वेदावेल हर्बल स्टोर', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop', true, false, 'leaderboard', 1),
('Download Our App', 'हमारा ऐप डाउनलोड करें', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/app', true, false, 'mobile-banner', 2),
('Wellness Newsletter', 'स्वास्थ्य न्यूज़लेटर', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://vedawell.in/newsletter', false, true, 'rectangle', 3),
('Annual Health Plan', 'वार्षिक स्वास्थ्य योजना', 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg', 'https://vedawell.in/plans', true, true, 'leaderboard', 4)
ON CONFLICT DO NOTHING;

-- ─── SEED: AUTH POPUP ADS ────────────────────────────────────────────────────
INSERT INTO auth_popup_ads (title, title_hi, description, description_hi, image_url, link_url, show_on_login_modal, show_on_signup_modal, ad_format, sort_order) VALUES
('Get Free Health eBook', 'मुफ्त स्वास्थ्य ईबुक पाएं', 'Sign up and get our free wellness guide', 'साइन अप करें और हमारी मुफ्त वेलनेस गाइड पाएं', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/free-ebook', false, true, 'banner', 1),
('Exclusive Member Discount', 'विशेष सदस्य छूट', '20% off on your first order for members', 'सदस्यों के लिए पहले ऑर्डर पर 20% छूट', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop', true, false, 'card', 2),
('VedaWell Premium Trial', 'वेदावेल प्रीमियम ट्रायल', '30-day free premium access', '30 दिन मुफ्त प्रीमियम एक्सेस', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/premium', true, true, 'inline', 3)
ON CONFLICT DO NOTHING;

-- ─── SEED: PROMOTED CONTENT ──────────────────────────────────────────────────
INSERT INTO promoted_content (title, title_hi, sponsor_name, sponsor_name_hi, image_url, link_url, target_all, is_video, sort_order) VALUES
('Best Herbs for Weight Loss in 2026', '2026 में वजन घटाने की सर्वश्रेष्ठ जड़ी-बूटियां', 'NaturalWell', 'नेचुरलवेल', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://naturalwell.in/herbs-weight-loss', true, false, 1),
('Severe Joint Pain? Do This Daily', 'गंभीर जोड़ों का दर्द? यह रोज करें', 'Jonitas Health', 'जोनिटास हेल्थ', 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg', 'https://jonitas.in/joint-pain', true, false, 2),
('Sugar Control Ka Purana Desi Raaz', 'शुगर कंट्रोल का पुराना देसी राज', 'Insulux Diabetic', 'इंसुलक्स डायबेटिक', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'https://insulux.in/sugar-control', true, false, 3),
('Diabetes Ka Natural Ilaaj', 'डायबिटीज का नेचुरल इलाज', 'DiabetesFree', 'डायबिटीजफ्री', 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg', 'https://diabetesfree.in', true, true, 4),
('Skin Glow Secret Revealed', 'त्वचा की चमक का राज़ उजागर', 'GlowWell Beauty', 'ग्लोवेल ब्यूटी', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://glowwell.in/skin-secret', true, false, 5),
('Yoga in 10 Minutes a Day', 'रोज 10 मिनट योग', 'YogaZen', 'योगाज़ेन', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://yogazen.in/10-minute-yoga', true, true, 6),
('Ancient Remedy for Hair Fall', 'बाल झड़ने का प्राचीन उपाय', 'HairRoot', 'हेयररूट', 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg', 'https://hairroot.in/remedy', true, false, 7),
('Gut Health Revolution', 'पेट के स्वास्थ्य की क्रांति', 'GutWell', 'गटवेल', 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg', 'https://gutwell.in', true, false, 8),
('Ayurvedic Sleep Formula', 'आयुर्वेदिक नींद फॉर्मूला', 'SleepVeda', 'स्लीपवेद', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://sleepveda.in', true, false, 9),
('Stress Relief in 5 Minutes', '5 मिनट में तनाव से मुक्ति', 'CalmMind', 'कामइंड', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 'https://calmmind.in', true, true, 10),
('Natural Knee Pain Solution', 'घुटने के दर्द का प्राकृतिक समाधान', 'KneeRelief', 'नीरिलीफ', 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg', 'https://kneerelief.in', true, false, 11),
('Vitamin D Deficiency Signs', 'विटामिन डी की कमी के संकेत', 'VitaPlus', 'विटाप्लस', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vitaplus.in/vitamin-d', true, false, 12)
ON CONFLICT DO NOTHING;