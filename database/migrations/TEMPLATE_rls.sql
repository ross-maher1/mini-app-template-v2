-- =============================================
-- RLS POLICY TEMPLATE
-- =============================================
-- Copy this file and rename following the convention:
-- YYYYMMDD_HHMMSS_create_<table_name>.sql
--
-- Find and replace:
--   <table_name>  → your table name (e.g., user_tasks)
--   <columns>     → your column definitions
-- =============================================

-- 1. Create the table
CREATE TABLE public.<table_name> (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  <columns>
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;

-- 3. Owner-only policies
CREATE POLICY "Users can view own <table_name>"
  ON public.<table_name> FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own <table_name>"
  ON public.<table_name> FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own <table_name>"
  ON public.<table_name> FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own <table_name>"
  ON public.<table_name> FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Index for performance
CREATE INDEX idx_<table_name>_user_id ON public.<table_name>(user_id);
