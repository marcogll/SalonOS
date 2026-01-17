-- Add category column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'General';