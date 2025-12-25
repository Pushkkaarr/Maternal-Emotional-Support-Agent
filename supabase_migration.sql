-- Add is_super_admin column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- To manually make a user a super admin, run this SQL command:
-- Replace 'your-super-admin-email@example.com' with the actual email
/*
UPDATE profiles
SET is_admin = true, is_super_admin = true
WHERE email = 'your-super-admin-email@example.com';
*/

-- Create or update a function to set the first user as both admin and super admin
CREATE OR REPLACE FUNCTION set_first_user_as_super_admin()
RETURNS trigger AS $$
DECLARE
    user_count integer;
BEGIN
    -- Count existing users
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- If this is the first user, make them super admin
    IF user_count = 1 THEN
        UPDATE profiles
        SET is_admin = true, is_super_admin = true
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS first_user_super_admin ON profiles;
CREATE TRIGGER first_user_super_admin
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_first_user_as_super_admin(); 