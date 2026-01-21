-- Add subject details columns to contact_queries table
ALTER TABLE public.contact_queries ADD COLUMN IF NOT EXISTS subject_code TEXT;
ALTER TABLE public.contact_queries ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE public.contact_queries ADD COLUMN IF NOT EXISTS year TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_queries_subject_code ON public.contact_queries(subject_code);
