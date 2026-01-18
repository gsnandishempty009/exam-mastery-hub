# Admin Login Implementation - Complete Code Guide

## 1. ADMIN LOGIN PAGE (Already Updated)
**File:** `src/pages/AdminLogin.tsx`

The admin login page now includes:
- Role-based authentication check
- Verification that only admin users can access the admin dashboard
- Automatic redirection for non-admin users
- Full integration with the useAuth hook

## 2. SQL CODE TO UPDATE USER ROLE

### Quick Copy-Paste SQL Commands

**Promote a user to admin by User ID:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'YOUR_USER_ID_HERE';
```

**Promote a user to admin by email:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@email.com'
);
```

**View all users with roles:**
```sql
SELECT 
  au.id,
  au.email,
  ur.role,
  p.full_name
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC;
```

**View only admin users:**
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

## 3. TYPESCRIPT UTILITY FUNCTIONS

**File:** `src/lib/roleManagement.ts`

```typescript
import roleManagement from "@/lib/roleManagement";

// Promote a user to admin
await roleManagement.promoteToAdmin('USER_ID');

// Demote an admin to student
await roleManagement.demoteToStudent('USER_ID');

// Check if user is admin
const isAdmin = await roleManagement.isUserAdmin('USER_ID');

// Get user's role
const role = await roleManagement.getUserRole('USER_ID');

// Get all admins
const admins = await roleManagement.getAllAdmins();

// Get all users with roles
const users = await roleManagement.getAllUsersWithRoles();
```

## 4. HOW TO UPDATE A STUDENT TO ADMIN

### Method A: Using Supabase Dashboard (Easiest)

1. Open your Supabase project dashboard
2. Go to `SQL Editor` on the left sidebar
3. Click `+ New Query`
4. Paste this code:
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'student@email.com'
);
```
5. Replace `student@email.com` with the actual email
6. Click `Run` (Cmd+Enter or Ctrl+Enter)

### Method B: Using User ID (If you have it)

```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = '123e4567-e89b-12d3-a456-426614174000';
```

### Method C: Programmatically from Your App

```typescript
import roleManagement from "@/lib/roleManagement";

// In any component or function
const promoteUser = async () => {
  const result = await roleManagement.promoteToAdmin('USER_ID');
  if (result.success) {
    console.log('User promoted to admin!');
  }
};
```

## 5. STEP-BY-STEP GUIDE TO CREATE FIRST ADMIN

1. **Register a new account:**
   - Go to the app and click "Get Started"
   - Register with email: admin@exammaster.com
   - Password: SecurePassword123

2. **Get the User ID:**
   - Go to Supabase Dashboard
   - Navigate to Authentication → Users
   - Find the user you just created
   - Copy their User ID (long UUID)

3. **Promote to Admin:**
   - Go to SQL Editor in Supabase
   - Run this query:
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'PASTE_YOUR_USER_ID_HERE';
```

4. **Test Admin Login:**
   - Go to Admin Login page: http://localhost:5173/admin-login
   - Enter email: admin@exammaster.com
   - Enter password: SecurePassword123
   - Should redirect to /admin/dashboard

## 6. DATABASE SCHEMA

**user_roles table:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users
- `role` (enum) - Either 'admin' or 'student'

**Roles are checked by:**
- `get_user_role()` function - Gets a user's role
- `has_role()` function - Checks if user has specific role
- RLS Policies - Enforce security at database level

## 7. FILES CREATED/UPDATED

1. ✅ `src/pages/AdminLogin.tsx` - Updated with real auth
2. ✅ `src/lib/roleManagement.ts` - New utility functions
3. ✅ `SQL_ROLE_UPDATE.sql` - SQL commands file
4. ✅ `ADMIN_ROLE_MANAGEMENT.md` - Complete documentation

## 8. NAVBAR UPDATE

The navbar now includes an "Admin" button that links to `/admin-login`:
- Desktop: Small admin button in the nav
- Mobile: "Admin Login" button in mobile menu

## IMPORTANT SECURITY NOTES

⚠️ The Admin Login page will:
- Allow login for any registered user
- Check their role after login
- Only let them access /admin/dashboard if role = 'admin'
- Redirect others back to /login

⚠️ Role management is protected by:
- Supabase RLS (Row Level Security)
- Only admins can update other users' roles
- Regular users can only view their own role

## VERIFICATION

After promoting a user to admin, verify with:
```sql
-- Check if user is now admin
SELECT user_id, role FROM public.user_roles 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@exammaster.com'
);
-- Should return: role = 'admin'
```

## NEXT STEPS

1. Create your first admin account (see step-by-step above)
2. Test the admin login page
3. Build out your admin dashboard at `/admin/dashboard`
4. Use the roleManagement utility for any admin management features

## NEED HELP?

- Check `ADMIN_ROLE_MANAGEMENT.md` for detailed documentation
- Check `SQL_ROLE_UPDATE.sql` for ready-to-use SQL queries
- Check `src/lib/roleManagement.ts` for TypeScript functions
