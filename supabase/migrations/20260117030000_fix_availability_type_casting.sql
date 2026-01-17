-- Fix: Remove category references from services and fix type casting in availability functions

-- Check if category column exists and remove it from queries if needed
-- The services table doesn't have a category column, so we need to remove it from any queries

-- Fix type casting in check_staff_availability function
DROP FUNCTION IF EXISTS check_staff_availability(p_staff_id UUID, p_start_time_utc TIMESTAMPTZ, p_end_time_utc TIMESTAMPTZ, p_exclude_booking_id UUID) CASCADE;

CREATE OR REPLACE FUNCTION check_staff_availability(
    p_staff_id UUID,
    p_start_time_utc TIMESTAMPTZ,
    p_end_time_utc TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_work_hours BOOLEAN;
    v_has_booking_conflict BOOLEAN;
    v_has_manual_block BOOLEAN;
    v_location_timezone TEXT;
    v_start_time_local TIME;
    v_end_time_local TIME;
    v_block_start_local TIME;
    v_block_end_local TIME;
BEGIN
    -- Obtener zona horaria de la ubicación del staff
    SELECT timezone INTO v_location_timezone
    FROM locations
    WHERE id = (SELECT location_id FROM staff WHERE id = p_staff_id);

    -- Verificar horario laboral
    v_is_work_hours := check_staff_work_hours(p_staff_id, p_start_time_utc, p_end_time_utc, v_location_timezone);

    IF NOT v_is_work_hours THEN
        RETURN false;
    END IF;

    -- Verificar conflictos con otras reservas
    SELECT EXISTS(
        SELECT 1
        FROM bookings
        WHERE staff_id = p_staff_id
        AND status NOT IN ('cancelled', 'no_show')
        AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
        AND NOT (p_end_time_utc <= start_time_utc OR p_start_time_utc >= end_time_utc)
    ) INTO v_has_booking_conflict;

    IF v_has_booking_conflict THEN
        RETURN false;
    END IF;

    -- Convert times to local TIME for comparison
    v_start_time_local := (p_start_time_utc AT TIME ZONE v_location_timezone)::TIME;
    v_end_time_local := (p_end_time_utc AT TIME ZONE v_location_timezone)::TIME;

    -- Verificar bloques manuales de disponibilidad
    SELECT EXISTS(
        SELECT 1
        FROM staff_availability
        WHERE staff_id = p_staff_id
        AND date = (p_start_time_utc AT TIME ZONE v_location_timezone)::DATE
        AND is_available = false
        AND NOT (v_end_time_local <= start_time OR v_start_time_local >= end_time)
    ) INTO v_has_manual_block;

    IF v_has_manual_block THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
