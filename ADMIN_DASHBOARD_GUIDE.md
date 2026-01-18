# 🎛️ ADMIN DASHBOARD - COMPLETE GUIDE

## Overview

The Admin Dashboard is a comprehensive user management system that allows admins to:
- View all users and their roles
- Promote students to admin
- Demote admins to students
- Search and filter users
- Monitor user statistics

---

## Features Implemented

### ✅ User Management
- View all users with their roles
- Filter by role (All, Admins, Students)
- Search by email or name
- Promote/demote users with one click
- Real-time updates

### ✅ Statistics
- Total users count
- Total admin count
- Total student count
- Live data display

### ✅ User Interface
- Clean, modern dashboard
- Responsive design
- Search functionality
- Filter tabs
- Action buttons
- Avatar initials

### ✅ Security
- Admin-only access
- Role verification on page load
- Automatic redirection for non-admins
- Protected functions

---

## How to Access

### Step 1: Login as Admin
```
URL: http://localhost:5173/admin/login
Email: your-admin-email@example.com
Password: your-password
```

### Step 2: You'll be redirected to
```
http://localhost:5173/admin/dashboard
```

---

## Using the Admin Dashboard

### View All Users
1. Dashboard loads with all users visible
2. Table shows: User Info, Email, Role, Actions
3. Stats card shows total counts

### Search for a User
1. Enter email or name in search box
2. Table filters in real-time
3. Shows matching results

### Filter by Role
Click tabs to filter:
- **All Users** - Shows everyone
- **Admins** - Shows only admins
- **Students** - Shows only students

Each tab shows count of that role type.

### Promote a Student to Admin
1. Find student in table
2. Click "Make Admin" button
3. Confirmation toast appears
4. Role updates immediately
5. Table refreshes automatically

### Demote an Admin to Student
1. Find admin in table
2. Click "Make Student" button
3. Confirmation toast appears
4. Role updates immediately
5. Table refreshes automatically

### Refresh User List
Click "Refresh Users" button to reload data from database.

---

## Database Integration

The dashboard connects to Supabase and uses the role management utilities:

```typescript
// Imports
import roleManagement from "@/lib/roleManagement";

// Key Functions Used:
roleManagement.getAllUsersWithRoles()  // Fetch all users
roleManagement.promoteToAdmin(userId)  // Make user admin
roleManagement.demoteToStudent(userId) // Make user student
```

---

## Code Structure

### State Management
```typescript
const [users, setUsers] = useState<any[]>([]);
const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [activeTab, setActiveTab] = useState("all");
```

### Main Functions
```typescript
// Fetch users from Supabase
fetchUsersWithRoles()

// Promote user to admin
handlePromoteToAdmin(userId)

// Demote user to student
handleDemoteToStudent(userId)
```

### Effects
```typescript
// Check if user is admin (redirect if not)
useEffect(() => {...}, [userRole, navigate, toast]);

// Fetch users on mount
useEffect(() => {...}, []);

// Filter users based on search and tab
useEffect(() => {...}, [users, searchQuery, activeTab]);
```

---

## User Data Structure

Each user in the table has:
```typescript
{
  user_id: "uuid",
  role: "admin" | "student",
  profiles: {
    email: "user@example.com",
    full_name: "User Name"
  }
}
```

---

## Styling & UI Components

### Components Used
- `Card` - Data containers
- `Button` - Actions and filters
- `Input` - Search box
- `toast` - Notifications

### Icons
- `Users` - Student icon
- `Shield` - Admin icon
- `Plus` - Add icon
- `ArrowRight` - Refresh icon

### Color Scheme
- **Admin Role** - Accent color (cyan)
- **Student Role** - Success color (green)
- **Primary** - Main actions (blue)

---

## Responsive Design

| Screen Size | Layout |
|-------------|--------|
| Mobile | Single column, stacked table |
| Tablet | 2-column grid for stats |
| Desktop | 3-column grid for stats, full table |

The sidebar is hidden on mobile, accessible via hamburger menu.

---

## API Integration

### Fetch Users
```typescript
const result = await roleManagement.getAllUsersWithRoles();
// Returns: { success: boolean, data: Array, error?: any }
```

### Promote User
```typescript
const result = await roleManagement.promoteToAdmin(userId);
// Returns: { success: boolean, data?: any, error?: any }
```

### Demote User
```typescript
const result = await roleManagement.demoteToStudent(userId);
// Returns: { success: boolean, data?: any, error?: any }
```

---

## Error Handling

The dashboard handles:
- ✅ Loading states (shows "Loading users...")
- ✅ Empty states (shows "No users found")
- ✅ API errors (shows error toast)
- ✅ Access control (redirects non-admins)
- ✅ Network errors (graceful fallbacks)

---

## Toast Notifications

### Success Messages
```
✓ User promoted to admin.
✓ User demoted to student.
```

### Error Messages
```
✗ Failed to promote user.
✗ Failed to demote user.
✗ Access Denied - You don't have admin privileges.
```

---

## Security Features

### Authentication
- ✅ Checks if user is authenticated
- ✅ Verifies user role on page load
- ✅ Redirects non-admins to student dashboard

### Authorization
- ✅ Only admins can access /admin/dashboard
- ✅ Role changes require database verification
- ✅ Supabase RLS policies enforce security

### Data Protection
- ✅ No sensitive data exposed
- ✅ Safe role management
- ✅ Error messages don't leak info

---

## Performance

### Optimizations
- Real-time filtering (client-side)
- Efficient search
- Minimal re-renders
- Lazy component loading

### Data Loading
- Single fetch on component mount
- Optional manual refresh
- Cached user data

---

## Keyboard Shortcuts (Future Enhancement)

Coming soon:
- `Ctrl+K` - Open search
- `Ctrl+R` - Refresh users
- `Tab` - Navigate rows
- `Enter` - Select user

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't access dashboard | Check if you're logged in as admin |
| Users not showing | Click "Refresh Users" button |
| Search not working | Check spelling in search box |
| Role change failed | Check internet connection, try again |
| Page redirected | Verify admin role in database |

---

## Advanced Features (Planned)

- [ ] Bulk role changes
- [ ] User deletion
- [ ] Email verification status
- [ ] Last login time
- [ ] User activity logs
- [ ] Export user list
- [ ] Import users from CSV
- [ ] Two-factor auth management
- [ ] User notes/comments
- [ ] Ban/suspend users

---

## Maintenance

### Regular Tasks
- Monitor user creation rate
- Review admin list monthly
- Check for inactive accounts
- Verify role assignments

### Database Cleanup
```sql
-- View inactive users (no login in 30 days)
SELECT * FROM auth.users 
WHERE last_sign_in_at < NOW() - INTERVAL '30 days';
```

---

## API Reference

### Get All Users with Roles
```typescript
const result = await roleManagement.getAllUsersWithRoles();
// Returns array of users with role and profile info
```

### Promote User
```typescript
const result = await roleManagement.promoteToAdmin(userId);
// Returns updated user role entry
```

### Demote User
```typescript
const result = await roleManagement.demoteToStudent(userId);
// Returns updated user role entry
```

### Check Single Role
```typescript
const isAdmin = await roleManagement.isUserAdmin(userId);
// Returns boolean
```

---

## Styling Guide

### Colors
- Primary (Blue): Main actions
- Accent (Cyan): Admin role
- Success (Green): Student role
- Muted: Inactive/secondary elements

### Spacing
- Cards: 6px padding (24px total)
- Table: 3px padding (12px total)
- Buttons: Small variants for table

---

## File Locations

| File | Purpose |
|------|---------|
| `src/pages/AdminDashboard.tsx` | Main dashboard component |
| `src/lib/roleManagement.ts` | API functions |
| `src/components/dashboard/AdminSidebar.tsx` | Sidebar navigation |
| `src/hooks/useAuth.tsx` | Auth context and verification |

---

## Contributing

To add new features:

1. **Add function to roleManagement.ts**
   ```typescript
   // Example: Delete user
   async deleteUser(userId: string) {
     // Implementation here
   }
   ```

2. **Add UI element in AdminDashboard.tsx**
   ```typescript
   // Add button or action
   <Button onClick={() => handleDeleteUser(userId)}>Delete</Button>
   ```

3. **Handle result in callback**
   ```typescript
   const result = await roleManagement.deleteUser(userId);
   if (result.success) {
     toast({ title: "User deleted" });
     fetchUsersWithRoles();
   }
   ```

---

## Support

For issues or questions:
1. Check `ADMIN_ROLE_MANAGEMENT.md` for role management details
2. Check `CODE_EXAMPLES.md` for code samples
3. Review Supabase documentation
4. Check browser console for errors

---

**Status:** ✅ Complete and tested

**Last Updated:** January 12, 2026

**Next Steps:** Deploy to production and monitor usage
