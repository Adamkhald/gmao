-- ==========================================
-- 1. CLEANUP & SCHEMA SETUP
-- ==========================================

-- Drop everything to start fresh
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create a table for public profiles (extending auth.users)
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text,
  role text CHECK (role IN ('manager', 'technician')) DEFAULT 'technician',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create a table for tasks
CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES public.profiles(id),
  created_by uuid REFERENCES public.profiles(id),
  status text CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies for tasks
CREATE POLICY "Managers can do everything on tasks" ON tasks FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'manager')
);
CREATE POLICY "Technicians can view their assigned tasks" ON tasks FOR SELECT USING (auth.uid() = assigned_to);
CREATE POLICY "Technicians can update status of their assigned tasks" ON tasks FOR UPDATE USING (auth.uid() = assigned_to) WITH CHECK (auth.uid() = assigned_to);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'technician');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. SEEDING USERS
-- ==========================================

-- Helper to create users in auth.users
-- Password for all users will be: password123

-- A. CREATE MANAGER (admin@gmao.com)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
  'admin@gmao.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@gmao.com"}', 'email', NOW(), NOW(), NOW());

-- B. CREATE TECHNICIAN 1 (tech1@gmao.com)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
  'tech1@gmao.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '{"sub":"b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12","email":"tech1@gmao.com"}', 'email', NOW(), NOW(), NOW());

-- C. CREATE TECHNICIAN 2 (tech2@gmao.com)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
  'tech2@gmao.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (gen_random_uuid(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '{"sub":"c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13","email":"tech2@gmao.com"}', 'email', NOW(), NOW(), NOW());


-- ==========================================
-- 3. FINAL ROLE ADJUSTMENTS
-- ==========================================

-- The trigger created 'technician' for everyone.
-- We MUST update the admin to be 'manager'.
UPDATE public.profiles SET role = 'manager' WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Success Message
-- Everything is set!
