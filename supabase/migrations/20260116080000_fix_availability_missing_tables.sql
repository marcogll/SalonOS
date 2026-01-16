-- ============================================
-- FIX: Actualizar check_staff_availability para ignorar google_calendar_events si no existe
-- ============================================

DROP FUNCTION IF EXISTS check_staff_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID);

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

    -- Verificar conflictos con eventos de calendario solo si la tabla existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'google_calendar_events') THEN
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
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'staff_availability') THEN
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
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
