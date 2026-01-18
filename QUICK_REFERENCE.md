# Quick Reference: Admin Role Update Code

## 🚀 QUICK START - Update Student to Admin

### Option 1: SQL Query (Copy & Paste)
Go to **Supabase Dashboard → SQL Editor** and paste:

**Update by email:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'student@example.com'
);
```

**Update by User ID:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

### Option 2: TypeScript Code
```typescript
import roleManagement from "@/lib/roleManagement";

// Promote to admin
await roleManagement.promoteToAdmin('USER_ID');

// Back to student
await roleManagement.demoteToStudent('USER_ID');

// Check if admin
const isAdmin = await roleManagement.isUserAdmin('USER_ID');
```

---

## 📍 WHERE TO FIND USER ID

1. Open Supabase Dashboard
2. Click **Authentication** → **Users**
3. Find the user → Copy the **ID** column (UUID)

---

## 🧪 TEST ADMIN LOGIN

1. Create account: Sign up on `/register`
2. Promote account: Update role using SQL above
3. Test admin: Go to `/admin/login` and sign in
4. Should redirect to `/admin/dashboard`

---

## 📋 USEFUL SQL QUERIES

**View all users with roles:**
```sql
SELECT au.email, ur.role 
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id;
```

**View only admins:**
```sql
SELECT au.email, p.full_name
FROM auth.users au
JOIN public.user_roles ur ON au.id = ur.user_id
WHERE ur.role = 'admin';
```

**Promote multiple users:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('user1@test.com', 'user2@test.com')
);
```

---

## ⚙️ FILES CREATED

| File | Purpose |
|------|---------|
| `src/pages/AdminLogin.tsx` | Admin login page with role verification |
| `src/lib/roleManagement.ts` | TypeScript utility functions for roles |
| `SQL_ROLE_UPDATE.sql` | Ready-to-use SQL queries |
| `ADMIN_ROLE_MANAGEMENT.md` | Detailed documentation |
| `ADMIN_SETUP_GUIDE.md` | Step-by-step setup guide |

---

## 🔗 ROUTES

- `/` - Home page
- `/login` - Student login
- `/register` - Sign up
- `/admin/login` - Admin login
- `/student/dashboard` - Student dashboard
- `/admin/dashboard` - Admin dashboard

---

## 🛡️ SECURITY

✅ Roles stored in `public.user_roles` table
✅ Protected by Supabase RLS policies
✅ Only admins can manage other roles
✅ Admin login checks role before granting access
✅ New users default to 'student' role

---

## 💡 EXAMPLES

### Make existing account admin
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'john@example.com');
```

### Verify role was updated
```sql
SELECT role FROM public.user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'john@example.com');
```

### Demote admin to student
```sql
UPDATE public.user_roles
SET role = 'student'
WHERE user_id = 'xxxxx-xxxxx-xxxxx-xxxxx-xxxxx';
```

---

## ❌ TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Can't login as admin | Check role in DB, must be 'admin' exactly |
| Role not changing | Clear cache, log out/in again |
| SQL error | Verify correct Supabase project, valid UUID |
| Page not found | Use `/admin/login` not `/admin-login` |

---

## 📞 SUPPORT

Check these files for more info:
- `ADMIN_SETUP_GUIDE.md` - Complete setup
- `ADMIN_ROLE_MANAGEMENT.md` - Detailed docs
- `SQL_ROLE_UPDATE.sql` - All SQL commands
