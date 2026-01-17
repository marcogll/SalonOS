-- Seed data for testing availability
-- Execute in Supabase Dashboard: Database > SQL Editor

-- Insert sample staff if none exists
INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active, is_available_for_booking, work_hours_start, work_hours_end, work_days)
SELECT 
    gen_random_uuid() as user_id,
    id as location_id,
    'artist' as role,
    'Artista Demo' as display_name,
    '+52 844 123 4567' as phone,
    true as is_active,
    true as is_available_for_booking,
    '10:00'::TIME as work_hours_start,
    '19:00'::TIME as work_hours_end,
    'MON,TUE,WED,THU,FRI,SAT' as work_days
FROM locations 
WHERE is_active = true
AND NOT EXISTS (SELECT 1 FROM staff WHERE location_id = locations.id AND display_name = 'Artista Demo')
LIMIT 1;

-- Insert sample resources if none exists
INSERT INTO resources (location_id, name, type, capacity, is_active)
SELECT 
    id as location_id,
    'Estación Demo' as name,
    'station' as type,
    1 as capacity,
    true as is_active
FROM locations 
WHERE is_active = true
AND NOT EXISTS (SELECT 1 FROM resources WHERE location_id = locations.id AND name = 'Estación Demo')
LIMIT 1;

-- Verify results
SELECT 
    'Staff added' as info, 
    COUNT(*)::text as count 
FROM staff 
WHERE display_name = 'Artista Demo'
UNION ALL
SELECT 
    'Resources added', 
    COUNT(*)::text 
FROM resources 
WHERE name = 'Estación Demo';
