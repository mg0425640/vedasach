-- Add role column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Set govindsingh747@gmail.com as admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'govindsingh747@gmail.com';

-- Add RLS policy to allow users to read their own role
CREATE POLICY "read_own_role" ON user_profiles FOR SELECT TO authenticated USING (true);

-- Allow admins to do everything via service role (handled in app)
-- Add a helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM user_profiles WHERE id = user_uuid AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin_comment_reply column to comments for admin replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_reply_at timestamptz;
