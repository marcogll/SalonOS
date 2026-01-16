-- ============================================
-- FIX: Corregir función get_available_staff con tipos correctos
-- ============================================

DROP FUNCTION IF EXISTS get_available_staff(UUID, TIMESTAMPTZ, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION get_available_staff(
    p_location_id UUID,
    p_start_time_utc TIMESTAMPTZ,
    p_end_time_utc TIMESTAMPTZ
)
RETURNS TABLE (
    staff_id UUID,
    staff_name TEXT,
    role TEXT,
    work_hours_start TIME,
    work_hours_end TIME,
    work_days TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id::UUID,
        s.display_name::TEXT,
        s.role::TEXT,
        s.work_hours_start::TIME,
        s.work_hours_end::TIME,
        s.work_days::TEXT
    FROM staff s
    WHERE s.location_id = p_location_id
    AND s.is_active = true
    AND s.is_available_for_booking = true
    AND s.role IN ('artist', 'staff', 'manager')
    AND check_staff_availability(s.id, p_start_time_utc, p_end_time_utc)
    ORDER BY
        CASE s.role
            WHEN 'manager' THEN 1
            WHEN 'staff' THEN 2
            WHEN 'artist' THEN 3
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
