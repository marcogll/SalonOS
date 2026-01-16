-- ============================================
-- FIX: Corregir funciones de disponibilidad para considerar zona horaria
-- ============================================

-- Eliminar funciones antiguas que no consideran zona horaria
DROP FUNCTION IF EXISTS check_staff_work_hours(UUID, TIMESTAMPTZ, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS check_staff_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID);
DROP FUNCTION IF EXISTS check_resource_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID);
DROP FUNCTION IF EXISTS get_available_staff(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID, UUID);

-- Recrear check_staff_work_hours con soporte de zona horaria
CREATE OR REPLACE FUNCTION check_staff_work_hours(
    p_staff_id UUID,
    p_start_time_utc TIMESTAMPTZ,
    p_end_time_utc TIMESTAMPTZ,
    p_location_timezone TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_staff_record RECORD;
    v_start_time TIME;
    v_end_time TIME;
    v_work_days TEXT;
    v_day_of_week INTEGER;
    v_start_local TIMESTAMPTZ;
    v_end_local TIMESTAMPTZ;
BEGIN
    SELECT * INTO v_staff_record
    FROM staff
    WHERE id = p_staff_id;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    IF NOT v_staff_record.is_active THEN
        RETURN false;
    END IF;

    IF NOT v_staff_record.is_available_for_booking THEN
        RETURN false;
    END IF;

    -- Convertir UTC a hora local de la ubicación
    v_start_local := p_start_time_utc AT TIME ZONE p_location_timezone;
    v_end_local := p_end_time_utc AT TIME ZONE p_location_timezone;

    v_start_time := v_start_local::TIME;
    v_end_time := v_end_local::TIME;
    v_work_days := v_staff_record.work_days;

    v_day_of_week := EXTRACT(ISODOW FROM v_start_local);

    IF v_work_days IS NULL THEN
        RETURN true;
    END IF;

    IF v_day_of_week = 1 AND v_work_days LIKE '%MON%' THEN RETURN true; END IF;
    IF v_day_of_week = 2 AND v_work_days LIKE '%TUE%' THEN RETURN true; END IF;
    IF v_day_of_week = 3 AND v_work_days LIKE '%WED%' THEN RETURN true; END IF;
    IF v_day_of_week = 4 AND v_work_days LIKE '%THU%' THEN RETURN true; END IF;
    IF v_day_of_week = 5 AND v_work_days LIKE '%FRI%' THEN RETURN true; END IF;
    IF v_day_of_week = 6 AND v_work_days LIKE '%SAT%' THEN RETURN true; END IF;
    IF v_day_of_week = 7 AND v_work_days LIKE '%SUN%' THEN RETURN true; END IF;

    -- Verificar que el tiempo esté dentro del horario laboral
    IF v_start_time < v_staff_record.work_hours_start OR
       v_end_time > v_staff_record.work_hours_end THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear check_staff_availability con soporte de zona horaria
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
BEGIN
    -- Obtener zona horaria de la ubicación del staff
    SELECT timezone INTO v_location_timezone
    FROM locations
    WHERE id = (SELECT location_id FROM staff WHERE id = p_staff_id);

    v_is_work_hours := check_staff_work_hours(p_staff_id, p_start_time_utc, p_end_time_utc, v_location_timezone);

    IF NOT v_is_work_hours THEN
        RETURN false;
    END IF;

    -- Verificar conflictos con eventos de calendario
    SELECT EXISTS(
        SELECT 1
        FROM google_calendar_events
        WHERE staff_id = p_staff_id
        AND is_blocking = true
        AND NOT (p_end_time_utc <= start_time_utc OR p_start_time_utc >= end_time_utc)
    ) INTO v_has_booking_conflict;

    IF v_has_booking_conflict THEN
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
    ) INTO v_has_manual_block;

    IF v_has_manual_block THEN
        RETURN false;
    END IF;

    -- Verificar bloques manuales de disponibilidad
    SELECT EXISTS(
        SELECT 1
        FROM staff_availability
        WHERE staff_id = p_staff_id
        AND date = (p_start_time_utc AT TIME ZONE v_location_timezone)::DATE
        AND is_available = false
        AND NOT (p_end_time_utc AT TIME ZONE v_location_timezone::TIME <= start_time
               OR p_start_time_utc AT TIME ZONE v_location_timezone::TIME >= end_time)
    ) INTO v_has_manual_block;

    IF v_has_manual_block THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear get_available_staff simplificado
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
