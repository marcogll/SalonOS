-- ============================================
-- SEED DE DATOS - SALONOS (IDEMPOTENTE)
-- Ejecutar múltiples veces sin errores
-- ============================================

-- 1. Crear Locations (solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA') THEN
        INSERT INTO locations (name, timezone, address, phone, is_active)
        VALUES
            ('ANCHOR:23 - Via KLAVA', 'America/Monterrey', 'Blvd. Moctezuma 2370, Los Pinos 2do y 3er Sector, 25204 Saltillo, Coah.', '+52 81 1234 5678', true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM locations WHERE name = 'TEST - Salón Principal') THEN
        INSERT INTO locations (name, timezone, address, phone, is_active)
        VALUES
            ('TEST - Salón Principal', 'America/Monterrey', 'Av. Masaryk 123, Polanco, Ciudad de México', '+52 55 2345 6789', true);
    END IF;
END $$;

-- 2. Crear Resources (solo si no existen)
DO $$
BEGIN
    -- Para ANCHOR:23 - Via KLAVA
    FOR i IN 1..3 LOOP
        IF NOT EXISTS (
            SELECT 1 FROM resources r
            JOIN locations l ON l.id = r.location_id
            WHERE l.name = 'ANCHOR:23 - Via KLAVA' AND r.name = 'Sillón Pedicure ' || i
        ) THEN
            INSERT INTO resources (location_id, name, type, capacity, is_active)
            SELECT id, 'Sillón Pedicure ' || i, 'station', 1, true
            FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
        END IF;
    END LOOP;

    FOR i IN 1..4 LOOP
        IF NOT EXISTS (
            SELECT 1 FROM resources r
            JOIN locations l ON l.id = r.location_id
            WHERE l.name = 'ANCHOR:23 - Via KLAVA' AND r.name = 'Estación Manicure ' || i
        ) THEN
            INSERT INTO resources (location_id, name, type, capacity, is_active)
            SELECT id, 'Estación Manicure ' || i, 'station', 1, true
            FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
        END IF;
    END LOOP;

    IF NOT EXISTS (
        SELECT 1 FROM resources r
        JOIN locations l ON l.id = r.location_id
        WHERE l.name = 'ANCHOR:23 - Via KLAVA' AND r.name = 'Estación Maquillaje'
    ) THEN
        INSERT INTO resources (location_id, name, type, capacity, is_active)
        SELECT id, 'Estación Maquillaje', 'station', 1, true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM resources r
        JOIN locations l ON l.id = r.location_id
        WHERE l.name = 'ANCHOR:23 - Via KLAVA' AND r.name = 'Cama Pestañas'
    ) THEN
        INSERT INTO resources (location_id, name, type, capacity, is_active)
        SELECT id, 'Cama Pestañas', 'station', 1, true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    -- Para TEST - Salón Principal
    FOR i IN 1..3 LOOP
        IF NOT EXISTS (
            SELECT 1 FROM resources r
            JOIN locations l ON l.id = r.location_id
            WHERE l.name = 'TEST - Salón Principal' AND r.name = 'Sillón Pedicure ' || i
        ) THEN
            INSERT INTO resources (location_id, name, type, capacity, is_active)
            SELECT id, 'Sillón Pedicure ' || i, 'station', 1, true
            FROM locations WHERE name = 'TEST - Salón Principal';
        END IF;
    END LOOP;

    FOR i IN 1..4 LOOP
        IF NOT EXISTS (
            SELECT 1 FROM resources r
            JOIN locations l ON l.id = r.location_id
            WHERE l.name = 'TEST - Salón Principal' AND r.name = 'Estación Manicure ' || i
        ) THEN
            INSERT INTO resources (location_id, name, type, capacity, is_active)
            SELECT id, 'Estación Manicure ' || i, 'station', 1, true
            FROM locations WHERE name = 'TEST - Salón Principal';
        END IF;
    END LOOP;

    IF NOT EXISTS (
        SELECT 1 FROM resources r
        JOIN locations l ON l.id = r.location_id
        WHERE l.name = 'TEST - Salón Principal' AND r.name = 'Estación Maquillaje'
    ) THEN
        INSERT INTO resources (location_id, name, type, capacity, is_active)
        SELECT id, 'Estación Maquillaje', 'station', 1, true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM resources r
        JOIN locations l ON l.id = r.location_id
        WHERE l.name = 'TEST - Salón Principal' AND r.name = 'Cama Pestañas'
    ) THEN
        INSERT INTO resources (location_id, name, type, capacity, is_active)
        SELECT id, 'Cama Pestañas', 'station', 1, true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;
END $$;

-- 3. Crear Staff (solo si no existen por display_name)
DO $$
BEGIN
    -- Admin Principal
    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Admin Principal') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'admin', 'Admin Principal', '+52 55 1111 2222', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    -- ANCHOR:23 - Via KLAVA: 1 Staff + 4 Artists + 1 Kiosk
    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Staff KLAVA Coordinadora') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'staff', 'Staff KLAVA Coordinadora', '+52 55 3333 4444', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Kiosk KLAVA Principal') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'kiosk', 'Kiosk KLAVA Principal', '+52 55 3333 0000', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist KLAVA María García') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist KLAVA María García', '+52 55 4444 5555', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist KLAVA Ana Rodríguez') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist KLAVA Ana Rodríguez', '+52 55 5555 6666', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist KLAVA Sofía López') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist KLAVA Sofía López', '+52 55 5555 7777', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist KLAVA Valentina Ruiz') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist KLAVA Valentina Ruiz', '+52 55 5555 8888', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    -- TEST - Salón Principal: 1 Staff + 4 Artists + 1 Kiosk
    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Staff Test Coordinador') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'staff', 'Staff Test Coordinador', '+52 55 6666 1111', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Kiosk Test Principal') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'kiosk', 'Kiosk Test Principal', '+52 55 6666 0000', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist Test Carla López') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist Test Carla López', '+52 55 7777 8888', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist Test Daniela García') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist Test Daniela García', '+52 55 7777 9999', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist Test Andrea Martínez') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist Test Andrea Martínez', '+52 55 7777 0000', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM staff WHERE display_name = 'Artist Test Fernanda Torres') THEN
        INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
        SELECT gen_random_uuid(), id, 'artist', 'Artist Test Fernanda Torres', '+52 55 7777 1111', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;
END $$;

-- 4. Crear Services (solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Corte y Estilizado') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Corte y Estilizado', 'Corte de cabello profesional con lavado y estilizado', 60, 500.00, false, false, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Color Completo') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Color Completo', 'Tinte completo con protección capilar', 120, 1200.00, false, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Balayage Premium') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Balayage Premium', 'Técnica de balayage con productos premium', 180, 2000.00, true, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Tratamiento Kératina') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Tratamiento Kératina', 'Tratamiento de kératina para cabello dañado', 90, 1500.00, false, false, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Peinado Evento') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Peinado Evento', 'Peinado para eventos especiales', 45, 800.00, false, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Pedicure Spa') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Pedicure Spa', 'Pedicure completo con exfoliación y mascarilla', 60, 450.00, false, false, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Manicure Gel') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Manicure Gel', 'Manicure con esmalte de gel duradero', 45, 350.00, false, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Uñas Acrílicas') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Uñas Acrílicas', 'Aplicación de uñas acrílicas con diseño', 120, 800.00, false, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Maquillaje Profesional') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Maquillaje Profesional', 'Maquillaje para eventos especiales', 60, 1200.00, false, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Extensión de Pestañas') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Extensión de Pestañas', 'Aplicación de extensiones pestañas volumen 3D', 90, 1500.00, false, true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Servicio Express (Dual Artist)') THEN
        INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
        VALUES ('Servicio Express (Dual Artist)', 'Servicio rápido con dos artists simultáneas', 30, 600.00, true, true, true);
    END IF;
END $$;

-- 5. Crear Customers (solo si no existen por email)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM customers WHERE email = 'sofia.ramirez@example.com') THEN
        INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
        VALUES (gen_random_uuid(), 'Sofía', 'Ramírez', 'sofia.ramirez@example.com', '+52 55 1111 1111', 'gold', 'Cliente VIP. Prefiere Artists María y Ana.', 15000.00, 25, '2025-12-20', true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM customers WHERE email = 'valentina.hernandez@example.com') THEN
        INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
        VALUES (gen_random_uuid(), 'Valentina', 'Hernández', 'valentina.hernandez@example.com', '+52 55 2222 2222', 'gold', 'Cliente regular. Prefiere horarios de la mañana.', 8500.00, 15, '2025-12-15', true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM customers WHERE email = 'camila.lopez@example.com') THEN
        INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
        VALUES (gen_random_uuid(), 'Camila', 'López', 'camila.lopez@example.com', '+52 55 3333 3333', 'free', 'Nueva cliente. Referida por Valentina.', 500.00, 1, '2025-12-10', true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM customers WHERE email = 'isabella.garcia@example.com') THEN
        INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
        VALUES (gen_random_uuid(), 'Isabella', 'García', 'isabella.garcia@example.com', '+52 55 4444 4444', 'gold', 'Cliente VIP. Requiere servicio de Balayage.', 22000.00, 30, '2025-12-18', true);
    END IF;
END $$;

-- 6. Crear Amenities (cortesías para kiosks)
DO $$
BEGIN
    -- ANCHOR:23 - Via KLAVA Amenities
    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Café Americano' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Café Americano', 'Café negro tradicional', 'coffee', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Café Latte' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Café Latte', 'Café con leche vaporizada', 'coffee', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Té Verde' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Té Verde', 'Té verde orgánico', 'coffee', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Cocktail Mojito' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Cocktail Mojito', 'Refresco de menta y limón', 'cocktail', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Mocktail Piña Colada' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Mocktail Piña Colada', 'Bebida tropical sin alcohol', 'mocktail', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Agua Mineral' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Agua Mineral', 'Agua mineral fresca', 'other', true
        FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA';
    END IF;

    -- TEST - Salón Principal Amenities
    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Café Espresso' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Café Espresso', 'Café espresso intenso', 'coffee', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Café Cappuccino' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Café Cappuccino', 'Café con espuma de leche', 'coffee', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Té Chai' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Té Chai', 'Té chai con especias', 'coffee', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Cocktail Margarita' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Cocktail Margarita', 'Cóctel clásico de tequila', 'cocktail', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Mocktail Limonada' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Mocktail Limonada', 'Limonada fresca natural', 'mocktail', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Revista de Moda' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1)) THEN
        INSERT INTO amenities (location_id, name, description, category, is_active)
        SELECT id, 'Revista de Moda', 'Revistas de moda actual', 'other', true
        FROM locations WHERE name = 'TEST - Salón Principal';
    END IF;
END $$;

-- 7. Crear Invitaciones (para clientes Gold)
DO $$
DECLARE
    week_start DATE;
    customer_record RECORD;
BEGIN
    week_start := get_week_start(CURRENT_DATE);

    FOR customer_record IN
        SELECT id FROM customers WHERE tier = 'gold' AND is_active = true
    LOOP
        PERFORM reset_weekly_invitations_for_customer(customer_record.id);
    END LOOP;
END $$;

-- 8. Resumen de datos creados
DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'SALONOS - SEED DE DATOS COMPLETADO';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Locations: %', (SELECT COUNT(*) FROM locations);
    RAISE NOTICE 'Resources: %', (SELECT COUNT(*) FROM resources);
    RAISE NOTICE 'Staff: %', (SELECT COUNT(*) FROM staff);
    RAISE NOTICE 'Services: %', (SELECT COUNT(*) FROM services);
    RAISE NOTICE 'Customers: %', (SELECT COUNT(*) FROM customers);
    RAISE NOTICE 'Amenities: %', (SELECT COUNT(*) FROM amenities);
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Base de datos lista para desarrollo';
    RAISE NOTICE '==========================================';
END
$$;
