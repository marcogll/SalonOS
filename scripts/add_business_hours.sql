-- Ejecutar este SQL en Supabase Dashboard: Database > SQL Editor
-- Agrega horarios de atención a la tabla locations

-- Agregar columna business_hours
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{
  "monday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "tuesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "wednesday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "thursday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "friday": {"open": "10:00", "close": "19:00", "is_closed": false},
  "saturday": {"open": "10:00", "close": "18:00", "is_closed": false},
  "sunday": {"is_closed": true}
}'::jsonb;

-- Agregar comentario
COMMENT ON COLUMN locations.business_hours IS 'Horarios de atención por día. Formato JSONB con claves: monday-sunday, cada una con open/close en formato HH:MM e is_closed boolean';

-- Actualizar locations existentes con horarios por defecto
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
WHERE business_hours IS NULL OR business_hours = '{}'::jsonb;

-- Verificar resultados
SELECT id, name, business_hours FROM locations;
