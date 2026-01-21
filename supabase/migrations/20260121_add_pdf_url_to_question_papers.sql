-- Add pdf_url column to question_papers table
ALTER TABLE public.question_papers ADD COLUMN pdf_url TEXT;

-- Add pdf_file_name column to question_papers table
ALTER TABLE public.question_papers ADD COLUMN pdf_file_name TEXT;

-- Create index for better query performance
CREATE INDEX idx_question_papers_subject_id ON public.question_papers(subject_id);
CREATE INDEX idx_question_papers_created_at ON public.question_papers(created_at);
