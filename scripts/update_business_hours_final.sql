-- Update business_hours with correct structure and values
-- Execute in Supabase Dashboard: Database > SQL Editor

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
}'::jsonb
WHERE business_hours IS NULL OR business_hours = '{}'::jsonb;

-- Verify update
SELECT 
    id, 
    name, 
    business_hours->>'monday' as monday_check,
    (business_hours->'monday'->>'open')::TIME as monday_open,
    (business_hours->'monday'->>'close')::TIME as monday_close
FROM locations 
LIMIT 1;
