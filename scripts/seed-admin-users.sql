-- Agregar usuarios admin específicos
-- Script para insertar administradores iniciales

-- Primero, verificar que las tablas existen
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
    ) THEN
        RAISE EXCEPTION 'Tabla users no existe';
    END IF;
END $$;

-- Insertar Frida Lara como admin
INSERT INTO users (email, password_hash, role, created_at, updated_at, email_verified)
VALUES (
    'frida.lara@example.com',
    crypt('admin123', gen_salt('bf')),
    'admin',
    NOW(),
    NOW(),
    true
)
ON CONFLICT (email) DO NOTHING;

-- Insertar América de la Cruz como admin
INSERT INTO users (email, password_hash, role, created_at, updated_at, email_verified)
VALUES (
    'america.cruz@example.com',
    crypt('admin123', gen_salt('bf')),
    'admin',
    NOW(),
    NOW(),
    true
)
ON CONFLICT (email) DO NOTHING;

-- Insertar Alejandra Ponce como admin
INSERT INTO users (email, password_hash, role, created_at, updated_at, email_verified)
VALUES (
    'alejandra.ponce@example.com',
    crypt('admin123', gen_salt('bf')),
    'admin',
    NOW(),
    NOW(),
    true
)
ON CONFLICT (email) DO NOTHING;

-- Crear perfiles de staff para estos usuarios
INSERT INTO staff (user_id, display_name, first_name, last_name, role, created_at, updated_at)
SELECT
    u.id,
    u.email,
    CASE
        WHEN u.email = 'frida.lara@example.com' THEN 'Frida'
        WHEN u.email = 'america.cruz@example.com' THEN 'América'
        WHEN u.email = 'alejandra.ponce@example.com' THEN 'Alejandra'
    END,
    CASE
        WHEN u.email = 'frida.lara@example.com' THEN 'Lara'
        WHEN u.email = 'america.cruz@example.com' THEN 'de la Cruz'
        WHEN u.email = 'alejandra.ponce@example.com' THEN 'Ponce'
    END,
    'admin',
    NOW(),
    NOW()
FROM users u
WHERE u.email IN (
    'frida.lara@example.com',
    'america.cruz@example.com',
    'alejandra.ponce@example.com'
)
AND u.role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- Asignar ubicación principal (asumimos location_id = 1)
INSERT INTO staff_locations (staff_id, location_id, created_at, updated_at)
SELECT
    s.id,
    1,
    NOW(),
    NOW()
FROM staff s
JOIN users u ON s.user_id = u.id
WHERE u.email IN (
    'frida.lara@example.com',
    'america.cruz@example.com',
    'alejandra.ponce@example.com'
)
AND NOT EXISTS (
    SELECT 1 FROM staff_locations sl
    WHERE sl.staff_id = s.id
);

-- Confirmación
SELECT
    u.email,
    u.role,
    s.display_name,
    sl.location_id
FROM users u
LEFT JOIN staff s ON s.user_id = u.id
LEFT JOIN staff_locations sl ON sl.staff_id = s.id
WHERE u.email IN (
    'frida.lara@example.com',
    'america.cruz@example.com',
    'alejandra.ponce@example.com'
);
