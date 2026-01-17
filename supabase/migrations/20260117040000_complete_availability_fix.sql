-- Complete fix for all availability functions with proper type casting
-- This replaces all functions to fix type comparison issues

-- Drop all functions first
DROP FUNCTION IF EXISTS check_staff_work_hours(p_staff_id UUID, p_start_time_utc TIMESTAMPTZ, p_end_time_utc TIMESTAMPTZ, p_location_timezone TEXT) CASCADE;
DROP FUNCTION IF EXISTS check_staff_availability(p_staff_id UUID, p_start_time_utc TIMESTAMPTZ, p_end_time_utc TIMESTAMPTZ, p_exclude_booking_id UUID) CASCADE;
DROP FUNCTION IF EXISTS get_detailed_availability(p_location_id UUID, p_service_id UUID, p_date DATE, p_time_slot_duration_minutes INTEGER) CASCADE;

-- ============================================
-- FUNCIÓN: check_staff_work_hours
-- Verifica si el staff está en horario laboral
-- ============================================

CREATE OR REPLACE FUNCTION check_staff_work_hours(
    p_staff_id UUID,
    p_start_time_utc TIMESTAMPTZ,
    p_end_time_utc TIMESTAMPTZ,
    p_location_timezone TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_work_hours_start TIME;
    v_work_hours_end TIME;
    v_work_days TEXT;
    v_day_of_week TEXT;
    v_local_start TIME;
    v_local_end TIME;
BEGIN
    -- Obtener horario del staff
    SELECT 
        work_hours_start,
        work_hours_end,
        work_days
    INTO 
        v_work_hours_start,
        v_work_hours_end,
        v_work_days
    FROM staff
    WHERE id = p_staff_id;

    -- Si no tiene horario definido, asumir disponible 24/7
    IF v_work_hours_start IS NULL OR v_work_hours_end IS NULL THEN
        RETURN true;
    END IF;

    -- Obtener día de la semana en zona horaria local
    v_day_of_week := TO_CHAR(p_start_time_utc AT TIME ZONE p_location_timezone, 'DY');

    -- Verificar si trabaja ese día
    IF v_work_days IS NULL OR NOT (',' || v_work_days || ',') LIKE ('%,' || v_day_of_week || ',%') THEN
        RETURN false;
    END IF;

    -- Convertir horas UTC a horario local
    v_local_start := (p_start_time_utc AT TIME ZONE p_location_timezone)::TIME;
    v_local_end := (p_end_time_utc AT TIME ZONE p_location_timezone)::TIME;

    -- Verificar si está dentro del horario laboral
    RETURN v_local_start >= v_work_hours_start AND v_local_end <= v_work_hours_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: check_staff_availability
-- Verifica disponibilidad completa del staff
-- ============================================

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

    -- Convertir a TIME local para comparación
    v_start_time_local := (p_start_time_utc AT TIME ZONE v_location_timezone)::TIME;
    v_end_time_local := (p_end_time_utc AT TIME ZONE v_location_timezone)::TIME;

    -- Verificar bloques manuales de disponibilidad
    SELECT EXISTS(
        SELECT 1
        FROM staff_availability
        WHERE staff_id = p_staff_id
        AND date = (p_start_time_utc AT TIME ZONE v_location_timezone)::DATE
        AND is_available = false
        AND NOT (v_end_time_local <= end_time OR v_start_time_local >= start_time)
    ) INTO v_has_manual_block;

    IF v_has_manual_block THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: get_detailed_availability
-- Obtiene slots de tiempo disponibles
-- ============================================

CREATE OR REPLACE FUNCTION get_detailed_availability(
    p_location_id UUID,
    p_service_id UUID,
    p_date DATE,
    p_time_slot_duration_minutes INTEGER DEFAULT 60
)
RETURNS JSONB AS $$
DECLARE
    v_service_duration INTEGER;
    v_location_timezone TEXT;
    v_business_hours JSONB;
    v_day_of_week TEXT;
    v_day_hours JSONB;
    v_start_time TIME := '09:00'::TIME;
    v_end_time TIME := '21:00'::TIME;
    v_time_slots JSONB := '[]'::JSONB;
    v_slot_start TIMESTAMPTZ;
    v_slot_end TIMESTAMPTZ;
    v_available_staff_count INTEGER;
    v_day_names TEXT[] := ARRAY['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
BEGIN
    -- Obtener duración del servicio
    SELECT duration_minutes INTO v_service_duration
    FROM services
    WHERE id = p_service_id;

    IF v_service_duration IS NULL THEN
        RETURN '[]'::JSONB;
    END IF;

    -- Obtener zona horaria y horarios de la ubicación
    SELECT 
        timezone,
        business_hours
    INTO 
        v_location_timezone,
        v_business_hours
    FROM locations
    WHERE id = p_location_id;

    IF v_location_timezone IS NULL THEN
        RETURN '[]'::JSONB;
    END IF;

    -- Obtener día de la semana (0 = Domingo, 1 = Lunes, etc.)
    v_day_of_week := v_day_names[EXTRACT(DOW FROM p_date) + 1];

    -- Obtener horarios para este día
    v_day_hours := v_business_hours -> v_day_of_week;

    -- Verificar si el lugar está cerrado este día
    IF v_day_hours->>'is_closed' = 'true' THEN
        RETURN '[]'::JSONB;
    END IF;

    -- Extraer horas de apertura y cierre
    v_start_time := (v_day_hours->>'open')::TIME;
    v_end_time := (v_day_hours->>'close')::TIME;

    -- Generar slots de tiempo para el día
    v_slot_start := (p_date || ' ' || v_start_time::TEXT)::TIMESTAMPTZ
        AT TIME ZONE v_location_timezone;

    v_slot_end := (p_date || ' ' || v_end_time::TEXT)::TIMESTAMPTZ
        AT TIME ZONE v_location_timezone;

    -- Iterar por cada slot
    WHILE v_slot_start < v_slot_end LOOP
        -- Verificar staff disponible para este slot
        SELECT COUNT(*) INTO v_available_staff_count
        FROM (
            SELECT 1
            FROM staff s
            WHERE s.location_id = p_location_id
            AND s.is_active = true
            AND s.is_available_for_booking = true
            AND s.role IN ('artist', 'staff', 'manager')
            AND check_staff_availability(s.id, v_slot_start, v_slot_start + (v_service_duration || ' minutes')::INTERVAL)
        ) AS available_staff;

        -- Agregar slot al resultado
        IF v_available_staff_count > 0 THEN
            v_time_slots := v_time_slots || jsonb_build_object(
                'start_time', v_slot_start::TEXT,
                'end_time', (v_slot_start + (p_time_slot_duration_minutes || ' minutes')::INTERVAL)::TEXT,
                'available', true,
                'available_staff_count', v_available_staff_count
            );
        END IF;

        -- Avanzar al siguiente slot
        v_slot_start := v_slot_start + (p_time_slot_duration_minutes || ' minutes')::INTERVAL;
    END LOOP;

    RETURN v_time_slots;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
