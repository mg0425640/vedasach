/*
# Ads Management and Articles Enhancement

1. New Tables
- `ads` - Advertisements with category/subcategory targeting
  - id (uuid, primary key)
  - title, title_hi, description, description_hi
  - image_url, link_url
  - ad_type (banner/sidebar/in_feed/sticky)
  - position (top/bottom/sidebar/content/footer)
  - size (leaderboard/rectangle/square/mobile)
  - is_active, sort_order, start_date, end_date
  - click_count, view_count
  - Category targeting booleans: target_all, target_health, target_ayurveda, target_yoga, target_beauty, target_nutrition, target_home_remedies, target_spirituality, target_dreams, target_blog, target_shop
  - Subcategory targeting: target_weight_loss, target_skin_care, target_hair_care, target_yoga_beginners, target_meditation, target_herbs, target_diet, target_mental_health
  - created_at

- `article_interactions` - Track likes, shares, bookmarks
  - id, article_id, user_id, session_id, interaction_type, created_at

2. Modified Tables
- `articles` - Added subcategory, subcategory_hi, meta_title, meta_description, meta_keywords, read_count, like_count, share_count

3. Security
- RLS enabled on new tables
- Public read for ads and articles
- Authenticated/anon insert for interactions

4. Indexes for performance
*/

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_hi text,
  description text DEFAULT '',
  description_hi text,
  image_url text DEFAULT '',
  link_url text,
  ad_type text DEFAULT 'banner' CHECK (ad_type IN ('banner', 'sidebar', 'in_feed', 'sticky')),
  position text DEFAULT 'content' CHECK (position IN ('top', 'bottom', 'sidebar', 'content', 'footer')),
  size text DEFAULT 'rectangle' CHECK (size IN ('leaderboard', 'rectangle', 'square', 'mobile')),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  click_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  target_all boolean DEFAULT false,
  target_health boolean DEFAULT false,
  target_ayurveda boolean DEFAULT false,
  target_yoga boolean DEFAULT false,
  target_beauty boolean DEFAULT false,
  target_nutrition boolean DEFAULT false,
  target_home_remedies boolean DEFAULT false,
  target_spirituality boolean DEFAULT false,
  target_dreams boolean DEFAULT false,
  target_blog boolean DEFAULT false,
  target_shop boolean DEFAULT false,
  target_weight_loss boolean DEFAULT false,
  target_skin_care boolean DEFAULT false,
  target_hair_care boolean DEFAULT false,
  target_yoga_beginners boolean DEFAULT false,
  target_meditation boolean DEFAULT false,
  target_herbs boolean DEFAULT false,
  target_diet boolean DEFAULT false,
  target_mental_health boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ads_read_public" ON ads;
CREATE POLICY "ads_read_public" ON ads FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Add columns to articles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'subcategory') THEN
    ALTER TABLE articles ADD COLUMN subcategory text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'subcategory_hi') THEN
    ALTER TABLE articles ADD COLUMN subcategory_hi text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'meta_title') THEN
    ALTER TABLE articles ADD COLUMN meta_title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'meta_description') THEN
    ALTER TABLE articles ADD COLUMN meta_description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'meta_keywords') THEN
    ALTER TABLE articles ADD COLUMN meta_keywords text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'read_count') THEN
    ALTER TABLE articles ADD COLUMN read_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'like_count') THEN
    ALTER TABLE articles ADD COLUMN like_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'share_count') THEN
    ALTER TABLE articles ADD COLUMN share_count integer DEFAULT 0;
  END IF;
END $$;

-- Create article_interactions table
CREATE TABLE IF NOT EXISTS article_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'share', 'bookmark')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE article_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "interactions_read_public" ON article_interactions;
CREATE POLICY "interactions_read_public" ON article_interactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "interactions_insert_authenticated" ON article_interactions;
CREATE POLICY "interactions_insert_authenticated" ON article_interactions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "interactions_insert_anon" ON article_interactions;
CREATE POLICY "interactions_insert_anon" ON article_interactions FOR INSERT
  TO anon WITH CHECK (session_id IS NOT NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ads_target_all ON ads(target_all) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_subcategory ON articles(subcategory);
CREATE INDEX IF NOT EXISTS idx_articles_read_count ON articles(read_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_article ON article_interactions(article_id);

-- Seed 20 mock ads
INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_health, target_ayurveda, target_nutrition, target_weight_loss, target_herbs, target_diet) VALUES
('Ayurvedic Weight Loss Program', 'आयुर्वेदिक वजन घटाने का कार्यक्रम', 'Natural weight management with ancient herbs', 'प्राचीन जड़ी-बूटियों से प्राकृतिक वजन प्रबंधन', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/weight-loss-kit', 'banner', 'top', 'leaderboard', 1, true, true, true, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_beauty, target_skin_care, target_hair_care) VALUES
('Organic Skincare Collection', 'जैविक त्वचा देखभाल संग्रह', '100% natural ingredients for glowing skin', 'चमकती त्वचा के लिए 100% प्राकृतिक सामग्री', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop/skincare', 'sidebar', 'sidebar', 'rectangle', 2, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_yoga, target_yoga_beginners, target_meditation) VALUES
('Yoga Mat Premium Quality', 'योग मैट प्रीमियम गुणवत्ता', 'Eco-friendly non-slip yoga mat', 'पर्यावरण के अनुकूल गैर-फिसलने वाला योग मैट', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://vedawell.in/shop/yoga-mat', 'banner', 'content', 'rectangle', 3, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_health, target_ayurveda, target_herbs, target_mental_health) VALUES
('Ashwagandha Root Powder', 'अश्वगंधा रूट पाउडर', 'Stress relief and energy booster', 'तनाव मुक्ति और ऊर्जा वर्धक', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/ashwagandha', 'in_feed', 'content', 'rectangle', 4, true, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_beauty, target_hair_care) VALUES
('Hair Growth Oil', 'बाल विकास तेल', 'Natural formula for healthy hair', 'स्वस्थ बालों के लिए प्राकृतिक फॉर्मूला', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop/hair-oil', 'sidebar', 'sidebar', 'rectangle', 5, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_spirituality, target_meditation, target_yoga_beginners) VALUES
('Meditation Course Online', 'ध्यान पाठ्यक्रम ऑनलाइन', 'Learn mindfulness from experts', 'विशेषज्ञों से माइंडफुलनेस सीखें', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://vedawell.in/courses/meditation', 'banner', 'top', 'leaderboard', 6, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_all) VALUES
('Herbal Tea Collection', 'हर्बल चाय संग्रह', 'Detox and wellness teas', 'डिटॉक्स और वेलनेस चाय', 'https://images.pexels.com/photos/159751/brooke-cagle-tea-159751.jpeg', 'https://vedawell.in/shop/herbal-tea', 'in_feed', 'content', 'rectangle', 7, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_dreams) VALUES
('Dream Journal Premium', 'स्वप्न जर्नल प्रीमियम', 'Track and interpret your dreams', 'अपने सपनों को ट्रैक और व्याख्या करें', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/shop/dream-journal', 'sidebar', 'sidebar', 'square', 8, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_health, target_ayurveda, target_home_remedies, target_herbs) VALUES
('Immunity Booster Kit', 'इम्युनिटी बूस्टर किट', 'Strengthen your natural immunity', 'अपनी प्राकृतिक प्रतिरक्षा को मजबूत करें', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/immunity-kit', 'banner', 'top', 'leaderboard', 9, true, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_beauty, target_skin_care) VALUES
('Face Serum Vitamin C', 'फेस सीरम विटामिन सी', 'Brightening anti-aging formula', 'चमकदार एंटी-एजिंग फॉर्मूला', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop/vitamin-c-serum', 'in_feed', 'content', 'rectangle', 10, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_yoga, target_yoga_beginners) VALUES
('Yoga Blocks Set', 'योग ब्लॉक सेट', 'Support your yoga practice', 'अपनी योग प्रथा का समर्थन करें', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://vedawell.in/shop/yoga-blocks', 'sidebar', 'sidebar', 'rectangle', 11, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_health, target_ayurveda, target_nutrition, target_diet) VALUES
('Triphala Churna Organic', 'त्रिफला चूर्ण ऑर्गेनिक', 'Digestive health supplement', 'पाचन स्वास्थ्य सप्लीमेंट', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/triphala', 'in_feed', 'content', 'rectangle', 12, true, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_spirituality, target_meditation) VALUES
('Spiritual Books Collection', 'आध्यात्मिक पुस्तकें संग्रह', 'Explore ancient wisdom', 'प्राचीन ज्ञान का अन्वेषण करें', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/shop/spiritual-books', 'banner', 'bottom', 'leaderboard', 13, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_nutrition, target_diet) VALUES
('Healthy Snacks Box', 'स्वस्थ स्नैक्स बॉक्स', 'Nutritious munching options', 'पौष्टिक मंचने के विकल्प', 'https://images.pexels.com/photos/159751/brooke-cagle-tea-159751.jpeg', 'https://vedawell.in/shop/healthy-snacks', 'sticky', 'bottom', 'mobile', 14, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_home_remedies, target_herbs) VALUES
('Aromatherapy Essential Oils', 'एरोमाथेरेपी एसेंशियल ऑयल्स', 'Relax and rejuvenate', 'आराम और कायाकल्प', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/essential-oils', 'sidebar', 'sidebar', 'square', 15, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_beauty, target_hair_care) VALUES
('Hair Fall Control Kit', 'बाल झड़ने नियंत्रण किट', 'Complete hair care solution', 'पूर्ण बाल देखभाल समाधान', 'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg', 'https://vedawell.in/shop/hair-fall-kit', 'banner', 'content', 'rectangle', 16, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_yoga, target_yoga_beginners, target_meditation) VALUES
('Pranayama Guide Book', 'प्राणायाम गाइड बुक', 'Master breathing techniques', 'श्वास तकनीक में महारत हासिल करें', 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg', 'https://vedawell.in/shop/pranayama-book', 'in_feed', 'content', 'rectangle', 17, true, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_health, target_mental_health) VALUES
('Mental Health Counseling', 'मानसिक स्वास्थ्य परामर्श', 'Online therapy sessions', 'ऑनलाइन थेरेपी सत्र', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/counseling', 'banner', 'top', 'leaderboard', 18, true, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_home_remedies) VALUES
('Home Remedy Recipes eBook', 'घरेलू नुस्खे व्यंजन ईबुक', 'Natural cures for common ailments', 'सामान्य बीमारियों के प्राकृतिक उपचार', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg', 'https://vedawell.in/shop/home-remedies-book', 'sidebar', 'sidebar', 'rectangle', 19, true);

INSERT INTO ads (title, title_hi, description, description_hi, image_url, link_url, ad_type, position, size, sort_order, target_dreams) VALUES
('Dream Interpretation Course', 'स्वप्न व्याख्या पाठ्यक्रम', 'Understand your subconscious', 'अपने अवचेतन को समझें', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg', 'https://vedawell.in/courses/dream-meaning', 'banner', 'content', 'rectangle', 20, true);

-- Update articles with subcategory and SEO data
UPDATE articles SET 
  subcategory = CASE category
    WHEN 'health' THEN 'Mental Health'
    WHEN 'ayurveda' THEN 'Herbs'
    WHEN 'yoga' THEN 'Beginners'
    WHEN 'beauty' THEN 'Skin Care'
    WHEN 'nutrition' THEN 'Diet'
    WHEN 'home-remedies' THEN 'Natural Cures'
    WHEN 'spirituality' THEN 'Meditation'
    ELSE 'General'
  END,
  subcategory_hi = CASE category
    WHEN 'health' THEN 'मानसिक स्वास्थ्य'
    WHEN 'ayurveda' THEN 'जड़ी-बूटियां'
    WHEN 'yoga' THEN 'शुरुआती'
    WHEN 'beauty' THEN 'त्वचा देखभाल'
    WHEN 'nutrition' THEN 'आहार'
    WHEN 'home-remedies' THEN 'प्राकृतिक उपचार'
    WHEN 'spirituality' THEN 'ध्यान'
    ELSE 'सामान्य'
  END,
  meta_title = COALESCE(meta_title, title),
  meta_description = COALESCE(meta_description, excerpt),
  read_count = COALESCE(read_count, floor(random() * 500 + 100)::integer),
  like_count = COALESCE(like_count, floor(random() * 50 + 10)::integer),
  share_count = COALESCE(share_count, floor(random() * 30 + 5)::integer)
WHERE subcategory IS NULL OR subcategory = '';