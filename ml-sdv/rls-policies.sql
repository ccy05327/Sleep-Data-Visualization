-- Row Level Security (RLS) Policies for Sleep Data Visualization
-- Run these commands in your Supabase SQL editor

-- Enable RLS on both tables (if not already enabled)
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Option 1: Allow all operations for authenticated users (simple approach)
-- Uncomment these if you want authenticated users to access all their data

-- CREATE POLICY "Users can insert their own sleep records" ON sleep_records
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can view their own sleep records" ON sleep_records
--   FOR SELECT USING (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can update their own sleep records" ON sleep_records
--   FOR UPDATE USING (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can delete their own sleep records" ON sleep_records
--   FOR DELETE USING (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can insert their own predictions" ON predictions
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can view their own predictions" ON predictions
--   FOR SELECT USING (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can update their own predictions" ON predictions
--   FOR UPDATE USING (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can delete their own predictions" ON predictions
--   FOR DELETE USING (auth.uid() IS NOT NULL);


-- Option 2: Add user_id column and restrict access to own records (recommended)
-- This approach requires adding a user_id column to track ownership

-- Add user_id columns
ALTER TABLE sleep_records ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE predictions ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create policies that check user ownership
CREATE POLICY "Users can insert their own sleep records" ON sleep_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep records" ON sleep_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep records" ON sleep_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep records" ON sleep_records
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own predictions" ON predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions" ON predictions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" ON predictions
  FOR DELETE USING (auth.uid() = user_id);

-- Option 3: Temporarily disable RLS for migration (NOT recommended for production)
-- Only use this during development/testing
-- ALTER TABLE sleep_records DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE predictions DISABLE ROW LEVEL SECURITY;
