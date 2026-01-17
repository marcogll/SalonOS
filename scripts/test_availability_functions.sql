-- Test the availability functions
-- Execute in Supabase Dashboard: Database > SQL Editor

-- Test check_staff_availability with fixed type casting
SELECT 
  check_staff_availability(
    (SELECT id FROM staff LIMIT 1),
    NOW() + INTERVAL '1 hour',
    NOW() + INTERVAL '2 hours'
  ) as is_available;

-- Test get_detailed_availability with business hours
SELECT * FROM get_detailed_availability(
  (SELECT id FROM locations LIMIT 1),
  (SELECT id FROM services LIMIT 1),
  CURRENT_DATE + INTERVAL '1 day',
  60
);

-- Check business hours structure
SELECT name, business_hours FROM locations LIMIT 1;

-- Check services with category
SELECT id, name, category, is_active FROM services LIMIT 5;
