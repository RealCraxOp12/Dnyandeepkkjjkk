-- Cadets Connectia Schema

-- Roles: 'main_admin', 'sub_admin', 'parent'
CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL, -- In production, this should be hashed.
  role text NOT NULL CHECK (role IN ('main_admin', 'sub_admin', 'parent')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sub-admins (Teachers) Profile
CREATE TABLE public.teachers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text
);

-- Parents Profile
CREATE TABLE public.parents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  teacher_id uuid REFERENCES public.users(id) ON DELETE CASCADE
);

-- Data tables
CREATE TABLE public.notices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  file_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Generic table to support Attendance, Homework, Results, etc.
CREATE TABLE public.module_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  module_name text NOT NULL, -- 'attendance', 'homework', etc.
  title text NOT NULL,
  description text,
  file_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial Main Admin Setup
INSERT INTO public.users (username, password, role) VALUES ('principal', 'admin123', 'main_admin');
