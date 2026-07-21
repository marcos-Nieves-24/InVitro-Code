-- Run this in your Supabase SQL Editor
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
