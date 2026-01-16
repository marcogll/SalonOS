-- Fix short_id variable name collision to avoid ambiguous column reference
-- This migration fixes the issue where the variable name in generate_short_id()
-- conflicts with the column name in the bookings table

CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS VARCHAR(6) AS $$
DECLARE
    chars VARCHAR(36) := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    v_short_id VARCHAR(6);
    attempts INT := 0;
    max_attempts INT := 10;
BEGIN
    LOOP
        v_short_id := '';
        FOR i IN 1..6 LOOP
            v_short_id := v_short_id || substr(chars, floor(random() * 36 + 1)::INT, 1);
        END LOOP;

        IF NOT EXISTS (SELECT 1 FROM bookings WHERE short_id = v_short_id) THEN
            RETURN v_short_id;
        END IF;

        attempts := attempts + 1;
        IF attempts >= max_attempts THEN
            RAISE EXCEPTION 'Failed to generate unique short_id after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
