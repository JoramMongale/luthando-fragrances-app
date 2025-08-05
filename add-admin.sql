-- Insert a test admin user (replace with your email)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'admin@luthandofragrances.co.za',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
