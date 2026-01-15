# 🛠️ Dashboard Setup & Role Guide

Follow these steps to initialize your fresh database and access the different roles.

## 1. Initialize Database & Users
Copy and paste the entire content of the code block below into your **Supabase Studio SQL Editor** (look for the `>_` icon on the left) and click **Run**.

```sql
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
INSERT INTO auth.identities (id, user_id, identity_data, provider)
VALUES (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@gmao.com"}', 'email') ON CONFLICT DO NOTHING;

-- Technicians
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'authenticated', 'authenticated', 'tech1@gmao.com', crypt('password123', gen_salt('bf')), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO auth.identities (id, user_id, identity_data, provider)
VALUES (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '{"sub":"b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12","email":"tech1@gmao.com"}', 'email') ON CONFLICT DO NOTHING;

-- Force Manager Role
UPDATE public.profiles SET role = 'manager' WHERE email = 'admin@gmao.com';
```

## 2. Test the Roles

| Role | Email | Password | What they see |
| :--- | :--- | :--- | :--- |
| **Manager** | `admin@gmao.com` | `password123` | Full Dashboard, Charts, KPI Calculators, Task Management |
| **Technician** | `tech1@gmao.com` | `password123` | Only "My Tasks", AI Chat, and Documentation |

## 3. How to create more users?
- **Manual Signup**: Click the "Sign Up" button on the login page.
- **Auto-Role**: Any new user created this way will **automatically** be assigned the **Technician** role.
- **Change Role**: If you want to make a technician a manager, run this:
  ```sql
  UPDATE profiles SET role = 'manager' WHERE email = 'USER_EMAIL';
  ```
