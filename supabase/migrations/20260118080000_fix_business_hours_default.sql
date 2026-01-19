-- ============================================
-- FIX: Corregir horarios de negocio por defecto
-- Date: 20260118
-- Description: Fix business hours that only show 22:00-23:00
-- ============================================

-- Verificar horarios actuales
SELECT id, name, timezone, business_hours FROM locations;

-- Actualizar horarios de negocio a horarios normales
UPDATE locations
SET business_hours = '{
  "monday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "tuesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "wednesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "thursday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "friday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "saturday": {"open": "10:00", "close": "18:00", "is_closed": false},
  "sunday": {"is_closed": true}
}'::jsonb
WHERE business_hours IS NULL 
   OR business_hours = '{}'::jsonb;

-- Verificar que los horarios se actualizaron correctamente
SELECT id, name, timezone, business_hours FROM locations;
