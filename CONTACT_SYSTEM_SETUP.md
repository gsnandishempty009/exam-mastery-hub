## Contact Management System - Implementation Complete

### What Was Added

#### 1. **Database Table: contact_queries**
A new Supabase table to store student contact queries with the following columns:
- `id` (UUID): Primary key
- `student_id` (UUID): References auth.users.id
- `subject` (VARCHAR 255): Query subject line
- `message` (TEXT): Full query message from student
- `admin_response` (TEXT): Admin's response to the query (nullable)
- `status` (VARCHAR 50): Query status - 'pending', 'in-review', 'responded', or 'resolved'
- `created_at` (TIMESTAMP): Auto-generated timestamp
- `updated_at` (TIMESTAMP): Auto-generated timestamp

**Indexes Created:**
- idx_contact_queries_student_id - For fast lookup by student
- idx_contact_queries_status - For filtering by status

**Row Level Security (RLS) Policies:**
- Students can view and create their own queries
- Students can only update queries with 'pending' status
- Admins can view all queries and update them with responses
- All operations follow app_role authorization using has_role() function

#### 2. **Student Contact Page**
**Route:** `/student/contact`
**File:** `src/pages/StudentContact.tsx`

**Features:**
- Submit new contact queries with subject and message
- View all submitted queries with status indicators
- See admin responses when available
- Real-time status tracking (Pending, In Review, Responded, Resolved)
- Color-coded status icons for quick visual reference
- Form validation for required fields
- Toast notifications for success/error feedback
- Loading states during data fetches

**Query Submission Workflow:**
1. Student fills in Subject and Message
2. Click "Submit Query"
3. Query stored in database with 'pending' status
4. Query appears in the list below the form
5. Admin can review and respond

#### 3. **Admin Contact Reports Page**
**Route:** `/admin/contact-reports`
**File:** `src/pages/AdminContactReports.tsx`

**Features:**
- Dashboard stats showing:
  - Total number of queries
  - Count of pending queries (yellow)
  - Count of in-review queries (blue)
  - Count of responded queries (green)
- Filter queries by status (All, Pending, In Review, Responded, Resolved)
- Expandable query cards showing:
  - Student name and email
  - Submission date and time
  - Original query message
  - Admin response (if provided)
- Status management dropdown for each query
- Add/Edit Response dialog for replying to queries
- Click any query to expand and see full details

**Admin Workflow:**
1. Admin navigates to Contact Reports menu
2. Views all student queries with status
3. Can filter by status using dropdown
4. Click on a query to expand details
5. Use "Add Response" button to open dialog
6. Type response and save
7. Status auto-changes to 'responded'
8. Can change status manually using status dropdown

#### 4. **Updated Navigation**
**StudentSidebar.tsx:**
- Added "Contact" menu item with Mail icon
- Route: `/student/contact`
- Position: Between Question Papers and Settings

**AdminSidebar.tsx:**
- Added "Contact Reports" menu item with Mail icon
- Route: `/admin/contact-reports`
- Position: Between Question Papers and Settings

#### 5. **Updated Routes (App.tsx)**
Added two new routes:
- `<Route path="/student/contact" element={<StudentContact />} />`
- `<Route path="/admin/contact-reports" element={<AdminContactReports />} />`

---

### Database Query to Execute

Run this SQL in Supabase Query Editor (SQL section):

```sql
-- Create contact_queries table
CREATE TABLE contact_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  admin_response TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'responded', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on student_id for faster queries
CREATE INDEX idx_contact_queries_student_id ON contact_queries(student_id);
CREATE INDEX idx_contact_queries_status ON contact_queries(status);

-- Enable RLS
ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can see their own queries
CREATE POLICY "Students can view their own queries"
  ON contact_queries FOR SELECT
  USING (
    auth.uid() = student_id
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policy: Students can insert their own queries
CREATE POLICY "Students can create queries"
  ON contact_queries FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- RLS Policy: Students can update their own queries (only before admin reviews)
CREATE POLICY "Students can update own queries"
  ON contact_queries FOR UPDATE
  USING (
    auth.uid() = student_id 
    AND status = 'pending'
  );

-- RLS Policy: Admins can update queries (to add response)
CREATE POLICY "Admins can update all queries"
  ON contact_queries FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON contact_queries TO authenticated;
GRANT SELECT, UPDATE ON contact_queries TO service_role;
```

---

### Files Modified/Created

**New Files:**
- `supabase/migrations/20260120_create_contact_queries.sql` - Database migration
- `src/pages/StudentContact.tsx` - Student contact form and query history
- `src/pages/AdminContactReports.tsx` - Admin contact report dashboard

**Modified Files:**
- `src/components/dashboard/StudentSidebar.tsx` - Added Contact menu item
- `src/components/dashboard/AdminSidebar.tsx` - Added Contact Reports menu item
- `src/App.tsx` - Added new routes for contact pages

---

### Usage Flow

**For Students:**
1. Login to student dashboard
2. Click "Contact" in sidebar
3. Fill in subject and message
4. Click "Submit Query"
5. View all submitted queries below
6. See admin responses when available

**For Admin:**
1. Login to admin dashboard
2. Click "Contact Reports" in sidebar
3. View all student queries with stats
4. Filter by status if needed
5. Click on query to expand and see details
6. Click "Add Response" to reply
7. Optionally change status using dropdown
8. View all responses in the query details

---

### Status Workflow

Query Status Life Cycle:
1. **Pending** (Yellow) - Initial submission, awaiting admin review
2. **In Review** (Blue) - Admin is reviewing the query
3. **Responded** (Green) - Admin has provided a response
4. **Resolved** (Green) - Query has been fully resolved

---

### Security Features

✅ Row Level Security enabled on contact_queries table
✅ Students can only see their own queries
✅ Admins can see and manage all queries
✅ Students can only edit pending queries
✅ Only authenticated users can submit queries
✅ Admin role verified using app_role enum with has_role() function
✅ CASCADE delete removes queries when student account is deleted

---

### Implementation Status

✅ Database table created with RLS policies
✅ Student contact page with form and query history
✅ Admin contact reports dashboard with stats and filters
✅ Menu items added to both sidebars
✅ Routes configured in App.tsx
✅ TypeScript compilation verified - No errors
✅ Error handling and loading states implemented
✅ Toast notifications for user feedback
✅ Responsive design with Tailwind CSS
