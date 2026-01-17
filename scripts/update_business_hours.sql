-- Update business_hours with correct structure and values
-- Execute in Supabase Dashboard: Database > SQL Editor

-- First, check current state
SELECT 
    id, 
    name, 
    business_hours->>'monday' as monday_check,
    (business_hours->'monday'->>'open') as monday_open_check,
    (business_hours->'monday'->>'close') as monday_close_check
FROM locations 
LIMIT 1;

-- Update with correct structure - Monday to Friday 10-7, Saturday 10-6, Sunday closed
UPDATE locations
SET business_hours = '{
  "monday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "tuesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "wednesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "thursday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "friday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "saturday": {"open": "10:00", "close": "18:00", "is_closed": false},
  "sunday": {"is_closed": true}
}'::jsonb;

-- Verify the update
SELECT 
    id, 
    name, 
    timezone,
    business_hours
FROM locations 
LIMIT 1;

-- Test extraction for different days
SELECT 
    'Monday' as day,
    (business_hours->'monday'->>'open')::TIME as open_time,
    (business_hours->'monday'->>'close')::TIME as close_time,
    business_hours->'monday'->>'is_closed' as is_closed
FROM locations
UNION ALL
SELECT 
    'Saturday' as day,
    (business_hours->'saturday'->>'open')::TIME as open_time,
    (business_hours->'saturday'->>'close')::TIME as close_time,
    business_hours->'saturday'->>'is_closed' as is_closed
FROM locations
UNION ALL
SELECT 
    'Sunday' as day,
    (business_hours->'sunday'->>'open')::TIME as open_time,
    (business_hours->'sunday'->>'close')::TIME as close_time,
    business_hours->'sunday'->>'is_closed' as is_closed
FROM locations;

-- Test the get_detailed_availability function
SELECT * FROM get_detailed_availability(
    (SELECT id FROM locations LIMIT 1),
    (SELECT id FROM services WHERE is_active = true LIMIT 1),
    CURRENT_DATE,
    60
);
