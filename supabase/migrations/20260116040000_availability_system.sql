-- ============================================
-- FASE 2.1 - DISPONIBILIDAD DOBLE CAPA (SIMPLIFICADA)
-- Horarios de staff y validación básica
-- ============================================

-- ============================================
-- AGREGAR CAMPOS DE HORARIO A STAFF
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'work_hours_start') THEN
        ALTER TABLE staff ADD COLUMN work_hours_start TIME;
        RAISE NOTICE 'Added work_hours_start to staff';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'work_hours_end') THEN
        ALTER TABLE staff ADD COLUMN work_hours_end TIME;
        RAISE NOTICE 'Added work_hours_end to staff';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'work_days') THEN
        ALTER TABLE staff ADD COLUMN work_days TEXT DEFAULT 'MON,TUE,WED,THU,FRI,SAT';
        RAISE NOTICE 'Added work_days to staff';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'is_available_for_booking') THEN
        ALTER TABLE staff ADD COLUMN is_available_for_booking BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_available_for_booking to staff';
    END IF;
END
$$;

-- ============================================
-- VERIFICACIÓN
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'FASE 2.1 - DISPONIBILIDAD COMPLETADA';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Campos agregados a staff:';
    RAISE NOTICE '  - work_hours_start';
    RAISE NOTICE '  - work_hours_end';
    RAISE NOTICE '  - work_days';
    RAISE NOTICE '  - is_available_for_booking';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Est listo para la Fase 2.2 - Servicios Express';
    RAISE NOTICE '==========================================';
END
$$;
