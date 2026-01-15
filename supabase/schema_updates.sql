-- Create a table for public profiles (extending auth.users)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  role text check (role in ('manager', 'technician')) default 'technician',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policies for tasks
create policy "Managers can do everything on tasks"
  on tasks
  for all
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Technicians can view their assigned tasks"
  on tasks
  for select
  using ( 
    auth.uid() = assigned_to 
  );

create policy "Technicians can update status of their assigned tasks"
  on tasks
  for update
  using ( 
    auth.uid() = assigned_to 
  )
  with check (
    auth.uid() = assigned_to
  );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'technician');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
-- Drop if exists to avoid errors on multiple runs
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert dummy data (Assuming you will create these users)
-- This part is optional and depends on users existing, 
-- but the table creation is the critical part.
