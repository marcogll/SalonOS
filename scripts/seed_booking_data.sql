-- Seed data for testing booking flow
-- Execute in Supabase Dashboard: Database > SQL Editor

-- Get active locations
DO $$
DECLARE
    v_location_id UUID;
    v_staff_id UUID;
    v_resource_id UUID;
    v_service_id UUID;
BEGIN
    -- Get first active location
    SELECT id INTO v_location_id FROM locations WHERE is_active = true LIMIT 1;
    
    IF v_location_id IS NULL THEN
        RAISE NOTICE 'No active locations found';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using location: %', v_location_id;
    
    -- Insert sample staff if none exists
    INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active, is_available_for_booking, work_hours_start, work_hours_end, work_days)
    SELECT 
        gen_random_uuid(),
        v_location_id,
        'artist',
        'Artista Demo',
        '+52 844 123 4567',
        true,
        true,
        '10:00'::TIME,
        '19:00'::TIME,
        'MON,TUE,WED,THU,FRI,SAT'
    WHERE NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artista Demo' AND location_id = v_location_id)
    RETURNING id INTO v_staff_id;
    
    IF v_staff_id IS NOT NULL THEN
        RAISE NOTICE 'Created staff: %', v_staff_id;
    ELSE
        SELECT id INTO v_staff_id FROM staff WHERE display_name = 'Artista Demo' AND location_id = v_location_id;
        RAISE NOTICE 'Using existing staff: %', v_staff_id;
    END IF;
    
    -- Insert sample resources if none exists
    INSERT INTO resources (location_id, name, type, capacity, is_active)
    SELECT 
        v_location_id,
        'Estación Demo',
        'station',
        1,
        true
    WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'Estación Demo' AND location_id = v_location_id)
    RETURNING id INTO v_resource_id;
    
    IF v_resource_id IS NOT NULL THEN
        RAISE NOTICE 'Created resource: %', v_resource_id;
    ELSE
        SELECT id INTO v_resource_id FROM resources WHERE name = 'Estación Demo' AND location_id = v_location_id;
        RAISE NOTICE 'Using existing resource: %', v_resource_id;
    END IF;
    
    -- Check if we have services
    SELECT id INTO v_service_id FROM services WHERE is_active = true LIMIT 1;
    
    IF v_service_id IS NOT NULL THEN
        RAISE NOTICE 'Using service: %', v_service_id;
    END IF;
    
    RAISE NOTICE 'Seed data completed';
END $$;

-- Verify results
SELECT 
    'Locations' as type, COUNT(*)::text as count FROM locations WHERE is_active = true
UNION ALL
SELECT 'Staff', COUNT(*)::text FROM staff WHERE is_active = true
UNION ALL
SELECT 'Resources', COUNT(*)::text FROM resources WHERE is_active = true
UNION ALL
SELECT 'Services', COUNT(*)::text FROM services WHERE is_active = true;
