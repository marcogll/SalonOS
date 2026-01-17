-- Debug and fix business_hours JSONB extraction
-- Execute in Supabase Dashboard: Database > SQL Editor

-- First, check what's actually stored in business_hours
SELECT 
    id, 
    name, 
    business_hours,
    business_hours->>'monday' as monday_raw,
    business_hours->'monday' as monday_object
FROM locations 
LIMIT 1;

-- Test extraction logic
SELECT 
    '2026-01-20'::DATE as test_date,
    EXTRACT(DOW FROM '2026-01-20'::DATE) as day_of_week_number,
    ARRAY['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][EXTRACT(DOW FROM '2026-01-20'::DATE) + 1] as day_name;

-- Fix: Ensure business_hours is properly formatted
UPDATE locations
SET business_hours = '{
  "monday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "tuesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "wednesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "thursday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "friday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "saturday": {"open": "10:00", "close": "18:00", "is_closed": false},
  "sunday": {"is_closed": true}
}'::jsonb
WHERE business_hours IS NULL OR business_hours = '{}'::jsonb;

-- Verify the update
SELECT 
    id, 
    name, 
    business_hours->>'monday' as monday,
    (business_hours->'monday'->>'open')::TIME as monday_open,
    (business_hours->'monday'->>'close')::TIME as monday_close
FROM locations 
LIMIT 1;
