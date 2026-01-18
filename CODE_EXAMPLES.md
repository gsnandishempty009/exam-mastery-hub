# Code Examples - Admin Role Management

## Table of Contents
1. [SQL Examples](#sql-examples)
2. [TypeScript Examples](#typescript-examples)
3. [Real-World Scenarios](#real-world-scenarios)

---

## SQL Examples

### 1. Promote Single User to Admin by Email
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'newadmin@exammaster.com'
);
```

### 2. Promote Single User to Admin by User ID
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
```

### 3. Promote Multiple Users to Admin
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'admin1@test.com',
    'admin2@test.com',
    'admin3@test.com'
  )
);
```

### 4. Demote Admin Back to Student
```sql
UPDATE public.user_roles
SET role = 'student'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
```

### 5. View All Users with Their Roles
```sql
SELECT 
  au.id as user_id,
  au.email,
  ur.role,
  p.full_name,
  au.created_at as registration_date,
  au.last_sign_in_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC;
```

### 6. View Only Admin Users
```sql
SELECT 
  au.id,
  au.email,
  p.full_name,
  au.created_at
FROM auth.users au
INNER JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE ur.role = 'admin'
ORDER BY au.created_at DESC;
```

### 7. Count Users by Role
```sql
SELECT 
  ur.role,
  COUNT(*) as count
FROM public.user_roles ur
GROUP BY ur.role;
```

### 8. Find a Specific User by Email
```sql
SELECT 
  au.id,
  au.email,
  p.full_name,
  ur.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'student@test.com';
```

### 9. Get Recently Created Users
```sql
SELECT 
  au.email,
  ur.role,
  p.full_name,
  au.created_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC
LIMIT 10;
```

### 10. Check if a User is Already Admin
```sql
SELECT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@test.com')
  AND role = 'admin'
) as is_admin;
```

---

## TypeScript Examples

### 1. Promote User to Admin
```typescript
import roleManagement from "@/lib/roleManagement";

const promoteUserToAdmin = async (userId: string) => {
  const result = await roleManagement.promoteToAdmin(userId);
  
  if (result.success) {
    console.log('User promoted to admin!', result.data);
  } else {
    console.error('Failed to promote user:', result.error);
  }
};

// Usage
promoteUserToAdmin('550e8400-e29b-41d4-a716-446655440000');
```

### 2. Demote Admin to Student
```typescript
import roleManagement from "@/lib/roleManagement";

const demoteAdminToStudent = async (userId: string) => {
  const result = await roleManagement.demoteToStudent(userId);
  
  if (result.success) {
    console.log('Admin demoted to student!', result.data);
  } else {
    console.error('Failed to demote user:', result.error);
  }
};

// Usage
demoteAdminToStudent('550e8400-e29b-41d4-a716-446655440000');
```

### 3. Check if User is Admin
```typescript
import roleManagement from "@/lib/roleManagement";

const checkAdminStatus = async (userId: string) => {
  const isAdmin = await roleManagement.isUserAdmin(userId);
  
  if (isAdmin) {
    console.log('User is an admin!');
  } else {
    console.log('User is not an admin');
  }
};

// Usage
checkAdminStatus('550e8400-e29b-41d4-a716-446655440000');
```

### 4. Get User's Current Role
```typescript
import roleManagement from "@/lib/roleManagement";

const getUserRole = async (userId: string) => {
  const { role } = await roleManagement.getUserRole(userId);
  console.log(`User role: ${role}`);
  return role;
};

// Usage
const role = await getUserRole('550e8400-e29b-41d4-a716-446655440000');
```

### 5. Get All Admin Users
```typescript
import roleManagement from "@/lib/roleManagement";

const listAllAdmins = async () => {
  const result = await roleManagement.getAllAdmins();
  
  if (result.success) {
    console.log('All admins:', result.data);
  } else {
    console.error('Failed to fetch admins:', result.error);
  }
};

// Usage
listAllAdmins();
```

### 6. Get All Users with Roles
```typescript
import roleManagement from "@/lib/roleManagement";

const listAllUsersWithRoles = async () => {
  const result = await roleManagement.getAllUsersWithRoles();
  
  if (result.success) {
    console.log('All users:', result.data);
  } else {
    console.error('Failed to fetch users:', result.error);
  }
};

// Usage
listAllUsersWithRoles();
```

### 7. In a React Component - Admin Management UI
```typescript
import { useState, useEffect } from 'react';
import roleManagement from "@/lib/roleManagement";
import { Button } from "@/components/ui/button";

const AdminManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const result = await roleManagement.getAllUsersWithRoles();
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handlePromote = async (userId: string) => {
    await roleManagement.promoteToAdmin(userId);
    fetchUsers(); // Refresh list
  };

  const handleDemote = async (userId: string) => {
    await roleManagement.demoteToStudent(userId);
    fetchUsers(); // Refresh list
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user.user_id} className="flex items-center justify-between p-4 border rounded">
          <span>{user.profiles.email}</span>
          <span className="text-sm text-gray-500">{user.role}</span>
          {user.role === 'student' ? (
            <Button onClick={() => handlePromote(user.user_id)}>
              Make Admin
            </Button>
          ) : (
            <Button onClick={() => handleDemote(user.user_id)}>
              Remove Admin
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminManagement;
```

### 8. In useAuth Hook - Check Admin Status
```typescript
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import roleManagement from '@/lib/roleManagement';

const Dashboard = () => {
  const { user, userRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await roleManagement.isUserAdmin(user.id);
        setIsAdmin(adminStatus);
      }
    };
    checkAdmin();
  }, [user]);

  return (
    <div>
      {isAdmin ? (
        <div>Admin Dashboard</div>
      ) : (
        <div>Student Dashboard</div>
      )}
    </div>
  );
};

export default Dashboard;
```

### 9. Form for Promoting Users
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import roleManagement from '@/lib/roleManagement';

const PromoteUserForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // You would need to get userId from email first
      // This is a simplified example
      // const result = await roleManagement.promoteToAdmin(userId);
      // setMessage('User promoted successfully!');
    } catch (error) {
      setMessage('Error promoting user');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        Promote to Admin
      </Button>
      {message && <div className="text-sm text-green-600">{message}</div>}
    </form>
  );
};

export default PromoteUserForm;
```

---

## Real-World Scenarios

### Scenario 1: First Time Setup - Create Your First Admin
**Steps:**
1. Register a new account
2. Get the User ID from Supabase
3. Run this SQL:
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'YOUR_USER_ID';
```
4. Log in to `/admin/login`

### Scenario 2: Bulk Promote Teachers to Admin
**SQL:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE '%@teacher.exammaster.com'
);
```

### Scenario 3: Create Admin Management Page
**Component:**
```typescript
import { useEffect, useState } from 'react';
import roleManagement from '@/lib/roleManagement';
import { Button } from '@/components/ui/button';

const AdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    const result = await roleManagement.getAllAdmins();
    if (result.success) {
      setAdmins(result.data || []);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading admins...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Users ({admins.length})</h2>
      {admins.map((admin) => (
        <div key={admin.user_id} className="p-4 border rounded mb-2">
          <p className="font-semibold">{admin.profiles?.full_name || 'N/A'}</p>
          <p className="text-sm text-gray-600">{admin.profiles?.email}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
```

### Scenario 4: Audit - Find Who Became Admin Recently
**SQL:**
```sql
SELECT 
  au.email,
  p.full_name,
  ur.created_at as admin_since
FROM auth.users au
JOIN public.user_roles ur ON au.id = ur.user_id
JOIN public.profiles p ON au.id = p.user_id
WHERE ur.role = 'admin'
AND ur.created_at > NOW() - INTERVAL '30 days'
ORDER BY ur.created_at DESC;
```

### Scenario 5: Emergency - Restore Admin if Locked Out
**SQL:**
```sql
-- Check if admin exists
SELECT * FROM public.user_roles 
WHERE role = 'admin';

-- If no admins exist, make the first user admin
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1
);
```

---

## Tips & Best Practices

1. **Always backup before bulk changes**
   ```sql
   -- Create a backup of current roles
   SELECT * FROM public.user_roles;
   ```

2. **Test on one user first**
   ```sql
   -- Test promoting one user
   UPDATE public.user_roles SET role = 'admin'
   WHERE user_id = 'test-user-id';
   
   -- Verify
   SELECT * FROM public.user_roles WHERE user_id = 'test-user-id';
   
   -- Revert if needed
   UPDATE public.user_roles SET role = 'student'
   WHERE user_id = 'test-user-id';
   ```

3. **Use transactions for safety**
   ```sql
   BEGIN;
   -- Your updates here
   COMMIT; -- or ROLLBACK; to undo
   ```

4. **Log admin changes for audit trail**
   - Consider adding a trigger to track role changes
   - Store who changed it and when

---

**Last Updated:** January 12, 2026
