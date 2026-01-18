-- Create storage buckets for notes and question papers if they don't exist
INSERT INTO storage.buckets (id, name, owner, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
  ('notes', 'notes', NULL, TRUE, FALSE, NULL, NULL),
  ('question-papers', 'question-papers', NULL, TRUE, FALSE, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to notes bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'notes');

-- Allow authenticated users to upload notes
CREATE POLICY "Authenticated users can upload notes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'notes' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete own notes
CREATE POLICY "Users can delete own notes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'notes'
    AND auth.role() = 'authenticated'
  );

-- Allow public read access to question-papers bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'question-papers');

-- Allow authenticated users to upload question papers
CREATE POLICY "Authenticated users can upload papers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'question-papers' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete own question papers
CREATE POLICY "Users can delete own papers" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'question-papers'
    AND auth.role() = 'authenticated'
  );
