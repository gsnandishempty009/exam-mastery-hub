-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS public.issue_reports CASCADE;

-- Create issue_reports table
CREATE TABLE public.issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  issue_title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_issue_reports_student_id ON public.issue_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_issue_reports_status ON public.issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_issue_reports_category ON public.issue_reports(category);
CREATE INDEX IF NOT EXISTS idx_issue_reports_created_at ON public.issue_reports(created_at);

-- Enable RLS
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can insert issue reports (anonymous or authenticated)"
  ON public.issue_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own issue reports"
  ON public.issue_reports
  FOR SELECT
  USING (auth.uid() = student_id OR student_id IS NULL);

CREATE POLICY "Admin can view all issue reports"
  ON public.issue_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update issue reports"
  ON public.issue_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete issue reports"
  ON public.issue_reports
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
