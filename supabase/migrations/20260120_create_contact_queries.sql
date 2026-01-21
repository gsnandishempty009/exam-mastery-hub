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
