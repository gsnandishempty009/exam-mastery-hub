# File Upload Setup Guide

## Problem
PDF and file uploads were failing with "Failed to upload file" error.

## Root Causes
1. Storage buckets "notes" and "question-papers" may not be created
2. Row Level Security (RLS) policies may not be configured
3. Missing proper error handling in upload functions

## Solutions Applied

### 1. Enhanced Error Handling
- Added detailed console logging for upload errors
- Improved error messages shown to users
- Added try-catch blocks for exception handling

### 2. Storage Configuration
Execute the SQL script `STORAGE_SETUP.sql` in Supabase SQL Editor to:
- Create storage buckets for notes and question papers
- Set up RLS policies for public read access
- Allow authenticated users to upload and delete files

## Steps to Fix Upload Issues

### Step 1: Create Storage Buckets in Supabase
1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Create bucket named "notes" (Make public)
4. Create bucket named "question-papers" (Make public)

### Step 2: Run RLS Policy SQL Script
1. Go to Supabase → SQL Editor
2. Create new query
3. Copy and paste content from `STORAGE_SETUP.sql`
4. Execute the query

### Step 3: Verify Configuration
After setup, try uploading a file:
- Open Admin Notes page
- Click "Upload Note"
- Select a PDF file
- Should show success message if configured correctly

## File Upload Features

### Admin Notes Upload
- **Endpoint**: `/admin/notes`
- **Storage Bucket**: `notes`
- **File Types**: PDF, DOC, DOCX, TXT
- **Max Size**: Depends on Supabase plan

### Admin Question Papers Upload
- **Endpoint**: `/admin/question-papers`
- **Storage Bucket**: `question-papers`
- **File Types**: PDF, DOCX, etc.
- **Max Size**: Depends on Supabase plan

## Troubleshooting

If uploads still fail:

1. **Check browser console** (F12) for detailed error messages
2. **Verify RLS policies** in Supabase Storage settings
3. **Check file size** - ensure files aren't too large
4. **Verify authentication** - user must be logged in as admin
5. **Check bucket permissions** - buckets should be public for reading

## Updated Code Changes

### AdminNotes.tsx
- Added error logging to uploadFile function
- Improved error messages with actual error details
- Added cache control headers for uploads
- Added try-catch exception handling

### AdminQuestionPapers.tsx
- Applied same improvements as AdminNotes
- Better error reporting

## Testing Checklist

- [ ] Buckets created in Supabase Storage
- [ ] RLS policies configured
- [ ] Admin can upload PDF files to notes
- [ ] Admin can upload PDF files to question papers
- [ ] Files appear in Supabase storage browser
- [ ] Files can be accessed via public URL
- [ ] Delete functionality works
- [ ] Error messages are clear and helpful
