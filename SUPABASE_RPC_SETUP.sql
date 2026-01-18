-- ============================================
-- SUPABASE RPC FUNCTIONS SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/[your-project]/sql
-- ============================================

-- 1. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- 2. Create function to get all users with roles
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (
  user_id UUID,
  role app_role,
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.user_id,
    ur.role,
    p.id,
    p.email,
    p.full_name,
    p.created_at
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON ur.user_id = p.user_id
$$;

-- 3. Create function to get all admin users
CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS TABLE (
  user_id UUID,
  role app_role,
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.user_id,
    ur.role,
    p.id,
    p.email,
    p.full_name,
    p.created_at
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON ur.user_id = p.user_id
  WHERE ur.role = 'admin'
$$;

-- 4. Create function to get all student users
CREATE OR REPLACE FUNCTION public.get_all_students()
RETURNS TABLE (
  user_id UUID,
  role app_role,
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.user_id,
    ur.role,
    p.id,
    p.email,
    p.full_name,
    p.created_at
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON ur.user_id = p.user_id
  WHERE ur.role = 'student'
$$;

-- 5. Drop and recreate RLS policies for profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin());

-- 6. Drop and recreate RLS policies for user_roles table
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Done! Now test with:
-- SELECT * FROM public.get_all_users_with_roles();
-- SELECT * FROM public.get_all_admins();
-- SELECT * FROM public.get_all_students();
