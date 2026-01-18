# Admin Role Management Guide

## Overview
This guide explains how to manage user roles in the ExamMaster application, specifically how to promote students to admin status.

## Database Schema
The role management system uses two main tables:
- `auth.users` - Supabase authentication users
- `user_roles` - Custom table storing user roles (admin or student)

## Method 1: Using SQL (Recommended for Quick Updates)

### Step 1: Find the User ID
Go to your Supabase Dashboard:
1. Navigate to `Authentication` → `Users`
2. Find the user you want to promote
3. Copy their User ID (UUID format)

### Step 2: Run SQL in Supabase Editor
Go to `SQL Editor` in Supabase and run:

```sql
-- Update role to admin by User ID
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'PASTE_USER_ID_HERE';
```

### Step 3: Verify the Update
```sql
-- Check if the update was successful
SELECT user_id, role FROM public.user_roles 
WHERE user_id = 'PASTE_USER_ID_HERE';
```

## Method 2: Update by Email Address

If you don't have the User ID, use the email address:

```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@email.com'
);
```

## Method 3: Using TypeScript/JavaScript

If you need to update roles programmatically within your app:

```typescript
import roleManagement from "@/lib/roleManagement";

// Promote a user to admin
const result = await roleManagement.promoteToAdmin('USER_ID_HERE');

// Demote an admin to student
const result = await roleManagement.demoteToStudent('USER_ID_HERE');

// Check if a user is admin
const isAdmin = await roleManagement.isUserAdmin('USER_ID_HERE');

// Get all admins
const admins = await roleManagement.getAllAdmins();

// Get user's role
const userRole = await roleManagement.getUserRole('USER_ID_HERE');
```

## Complete Examples

### Promote a New Admin User
```sql
-- Step 1: Find user ID from email
SELECT id FROM auth.users WHERE email = 'newadmin@exammaster.com';

-- Step 2: Promote to admin (replace USER_ID with the result from step 1)
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'USER_ID';

-- Step 3: Verify
SELECT ur.user_id, ur.role, au.email 
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';
```

### Promote Multiple Users to Admin
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('user1@email.com', 'user2@email.com', 'user3@email.com')
);
```

### View All Users and Their Roles
```sql
SELECT 
  au.id as user_id,
  au.email,
  ur.role,
  p.full_name,
  au.created_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC;
```

### View Only Admins
```sql
SELECT 
  au.id,
  au.email,
  p.full_name
FROM auth.users au
INNER JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE ur.role = 'admin';
```

## Important Notes

1. **Role Assignment on Registration**: When a new user registers, they are automatically assigned the 'student' role by the `handle_new_user()` function.

2. **Admin Authentication**: The Admin Login page now checks the user's role from the `user_roles` table and only allows access if the role is 'admin'.

3. **Security**: Role management is protected by Row Level Security (RLS) policies:
   - Users can only view their own role
   - Admins can view and manage all roles
   - Only authenticated users can access role data

4. **Testing**: To test the admin login:
   - Create a new user account through the Register page
   - Promote them to admin using SQL
   - Try logging in through the Admin Login page

## Troubleshooting

### User Can't Login as Admin
- Verify the user ID in the `user_roles` table matches the `auth.users` table
- Check that the role is exactly 'admin' (case-sensitive)
- Ensure RLS policies allow the user to read their own role

### Role Change Not Taking Effect
- Clear browser cache and localStorage
- Log out and log back in
- Check that the update affected the correct user

### SQL Errors
- Make sure you're running SQL in the correct Supabase project
- Verify the User ID format is a valid UUID
- Check that the email address is correct and matches exactly

## Additional Resources
- Supabase Documentation: https://supabase.com/docs
- PostgreSQL JSON Functions: https://www.postgresql.org/docs/current/functions-json.html
