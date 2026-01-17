-- Add business hours to locations table
-- Format: JSONB with daily opening/closing times

ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"monday":{"open":"10:00","close":"19:00","is_closed":false},"tuesday":{"open":"10:00","close":"19:00","is_closed":false},"wednesday":{"open":"10:00","close":"19:00","is_closed":false},"thursday":{"open":"10:00","close":"19:00","is_closed":false},"friday":{"open":"10:00","close":"19:00","is_closed":false},"saturday":{"open":"10:00","close":"18:00","is_closed":false},"sunday":{"is_closed":true}}';

-- Add comments
COMMENT ON COLUMN locations.business_hours IS 'Business hours for each day of the week in JSONB format. Keys: monday-sunday with open/close times in HH:MM format and is_closed boolean';

-- Update existing locations with default hours
UPDATE locations 
SET business_hours = '{"monday":{"open":"10:00","close":"19:00","is_closed":false},"tuesday":{"open":"10:00","close":"19:00","is_closed":false},"wednesday":{"open":"10:00","close":"19:00","is_closed":false},"thursday":{"open":"10:00","close":"19:00","is_closed":false},"friday":{"open":"10:00","close":"19:00","is_closed":false},"saturday":{"open":"10:00","close":"18:00","is_closed":false},"sunday":{"is_closed":true}}'
WHERE business_hours IS NULL OR business_hours = '{}'::jsonb;
