-- SQL Script to Update User Role from Student to Admin
-- Run this in your Supabase SQL Editor

-- 1. Update a specific user's role to admin
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'USER_ID_HERE';

-- OR if the user doesn't have a role entry yet, insert it:
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Verify the role was updated
SELECT user_id, role FROM public.user_roles WHERE user_id = 'USER_ID_HERE';

-- 3. To find a user by email and update their role:
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@email.com'
);

-- 4. To promote multiple users to admin:
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('user1@email.com', 'user2@email.com')
);

-- 5. To demote an admin back to student:
UPDATE public.user_roles
SET role = 'student'
WHERE user_id = 'USER_ID_HERE';

-- 6. View all users and their roles:
SELECT 
  au.id,
  au.email,
  ur.role,
  p.full_name,
  ur.created_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC;

-- 7. View only admins:
SELECT 
  au.id,
  au.email,
  p.full_name
FROM auth.users au
INNER JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE ur.role = 'admin';
