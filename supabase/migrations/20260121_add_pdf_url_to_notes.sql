-- Add pdf_url column to notes table
ALTER TABLE public.notes ADD COLUMN pdf_url TEXT;

-- Add pdf_file_name column to notes table
ALTER TABLE public.notes ADD COLUMN pdf_file_name TEXT;

-- Create index for better query performance
CREATE INDEX idx_notes_module_id ON public.notes(module_id);
CREATE INDEX idx_notes_created_at ON public.notes(created_at);
