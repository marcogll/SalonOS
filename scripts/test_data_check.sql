-- Test script to check database data
-- Execute in Supabase Dashboard: Database > SQL Editor

-- Check counts
SELECT 
  'Locations' as table_name, COUNT(*)::text as count FROM locations
UNION ALL
SELECT 'Services', COUNT(*)::text FROM services
UNION ALL
SELECT 'Staff', COUNT(*)::text FROM staff
UNION ALL
SELECT 'Resources', COUNT(*)::text FROM resources
UNION ALL
SELECT 'Bookings', COUNT(*)::text FROM bookings;

-- Show sample data
SELECT id, name, timezone, is_active FROM locations LIMIT 5;
SELECT id, name, duration_minutes, base_price, is_active FROM services LIMIT 5;
SELECT id, display_name, role, is_active, is_available_for_booking FROM staff LIMIT 5;
SELECT id, name, type, capacity, is_active FROM resources LIMIT 5;
