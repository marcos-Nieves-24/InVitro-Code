-- Migration: Add modules table for FastAPI gamification
-- Run this in Supabase SQL Editor for production
-- Date: 2026-09-13

CREATE TABLE IF NOT EXISTS modules (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lesson_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with actual content from src/content/modules/
INSERT INTO modules (slug, name, lesson_count) VALUES
    ('python', 'Python', 17),
    ('ia', 'Fundamentos de IA', 4),
    ('estadistica', 'Estadística', 10),
    ('machine-learning', 'Machine Learning', 10)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS (optional — FastAPI uses service-role for reads)
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read modules
DROP POLICY IF EXISTS "authenticated can read modules" ON modules;
CREATE POLICY "authenticated can read modules"
    ON modules FOR SELECT
    USING ((auth.jwt() ->> 'sub') IS NOT NULL);
