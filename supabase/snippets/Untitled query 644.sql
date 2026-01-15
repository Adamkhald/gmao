-- Schema & Role Setup
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  role text CHECK (role IN ('manager', 'technician')) DEFAULT 'technician'
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Tasks System
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES public.profiles(id),
  created_by uuid REFERENCES public.profiles(id),
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Managers all" ON tasks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager'));
CREATE POLICY "Techs view" ON tasks FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Techs update" ON tasks FOR UPDATE USING (assigned_to = auth.uid());

-- Trigger for New Signups
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role) VALUES (new.id, new.email, 'technician');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED DATA (PASSWORD: password123)
-- Manager
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'authenticated', 'authenticated', 'admin@gmao.com', crypt('password123', gen_salt('bf')), NOW()) ON CONFLICT DO NOTHING;

-- Technicians
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'authenticated', 'authenticated', 'tech1@gmao.com', crypt('password123', gen_salt('bf')), NOW()) ON CONFLICT DO NOTHING;

-- Force Manager Role
UPDATE public.profiles SET role = 'manager' WHERE email = 'admin@gmao.com';