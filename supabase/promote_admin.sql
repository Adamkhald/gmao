-- Promote the test user to manager
UPDATE public.profiles 
SET role = 'manager' 
WHERE email = 'admin@gmao.com';
