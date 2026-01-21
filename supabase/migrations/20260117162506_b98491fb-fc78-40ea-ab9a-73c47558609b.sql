
-- Create branches table (e.g., MCA, BCA, etc.)
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic years table
CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table (linked to branch and year)
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  total_modules INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(branch_id, academic_year_id, code)
);

-- Create modules table (linked to subjects)
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subject_id, module_number)
);

-- Create notes table (linked to modules)
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question papers table (linked to branch and year)
CREATE TABLE public.question_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  exam_year INTEGER NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'Regular',
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Public read access for students (authenticated users can view)
CREATE POLICY "Anyone can view branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Anyone can view academic years" ON public.academic_years FOR SELECT USING (true);
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Anyone can view question papers" ON public.question_papers FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admins can manage branches" ON public.branches FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage notes" ON public.notes FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage question papers" ON public.question_papers FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('question-papers', 'question-papers', true);

-- Storage policies for notes bucket
CREATE POLICY "Anyone can view notes files" ON storage.objects FOR SELECT USING (bucket_id = 'notes');
CREATE POLICY "Admins can upload notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update notes" ON storage.objects FOR UPDATE USING (bucket_id = 'notes' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete notes" ON storage.objects FOR DELETE USING (bucket_id = 'notes' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for question papers bucket
CREATE POLICY "Anyone can view question papers files" ON storage.objects FOR SELECT USING (bucket_id = 'question-papers');
CREATE POLICY "Admins can upload question papers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'question-papers' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update question papers" ON storage.objects FOR UPDATE USING (bucket_id = 'question-papers' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete question papers" ON storage.objects FOR DELETE USING (bucket_id = 'question-papers' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_question_papers_updated_at BEFORE UPDATE ON public.question_papers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default academic years
INSERT INTO public.academic_years (year_number, name) VALUES 
  (1, '1st Year'),
  (2, '2nd Year'),
  (3, '3rd Year'),
  (4, '4th Year');
