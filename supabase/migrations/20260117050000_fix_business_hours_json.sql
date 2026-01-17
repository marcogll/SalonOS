-- Improved get_detailed_availability with better JSONB handling and debugging

DROP FUNCTION IF EXISTS get_detailed_availability(p_location_id UUID, p_service_id UUID, p_date DATE, p_time_slot_duration_minutes INTEGER) CASCADE;

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
    v_open_time_text TEXT;
    v_close_time_text TEXT;
    v_start_time TIME;
    v_end_time TIME;
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
        COALESCE(business_hours, '{}'::jsonb)
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

    -- Obtener horarios para este día desde JSONB
    v_day_hours := v_business_hours -> v_day_of_week;

    -- Verificar si el lugar está cerrado este día
    IF v_day_hours IS NULL OR v_day_hours->>'is_closed' = 'true' THEN
        RETURN '[]'::JSONB;
    END IF;

    -- Extraer horas de apertura y cierre como TEXT primero
    v_open_time_text := v_day_hours->>'open';
    v_close_time_text := v_day_hours->>'close';

    -- Convertir a TIME, usar defaults si están NULL
    v_start_time := COALESCE(v_open_time_text::TIME, '10:00'::TIME);
    v_end_time := COALESCE(v_close_time_text::TIME, '19:00'::TIME);

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
