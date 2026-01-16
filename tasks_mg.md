# 📋 TASKS MAÑANA - SalonOS

**Fecha:** Viernes 16 de enero, 2026
**Tiempo estimado:** 30-45 minutos
**Modo:** Solo usar Supabase Dashboard (no scripts)

---

## ✅ LO QUE NECESITAS ANTES DE EMPEZAR

- [ ] Laptop con internet
- [ ] Credenciales de Supabase (ya las tienes)
- [ ] Abrir este archivo (`tasks_mg.md`)

---

## 📋 PASO 1: EJECUTAR MIGRACIONES (10 min)

### 1.1 Abrir SQL Editor
1. Ir a: `https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/sql`
2. Clic en "New query"

### 1.2 Copiar y Ejecutar Migración
1. Abrir archivo: `db/migrations/00_FULL_MIGRATION_FINAL.sql`
2. Copiar TODO el contenido (Ctrl+A, Ctrl+C)
3. Pegar en SQL Editor (Ctrl+V)
4. Clic en botón azul "Run"
5. Esperar 10-30 segundos

### 1.3 Verificar que esté correcto
Deberías ver:
```
===========================================
SALONOS - DATABASE MIGRATION COMPLETED
===========================================
✅ Tables created: 8
✅ Functions created: 14
✅ Triggers active: 17+
✅ RLS policies configured: 20+
✅ ENUM types created: 6
===========================================
```

**Si ves ERROR:**
- Lee el mensaje de error
- Probablemente ya se ejecutó (es normal si ya lo hiciste antes)
- Continúa al siguiente paso

---

## 📋 PASO 2: CREAR DATOS DE PRUEBA (15 min)

### 2.1 Crear Locations
1. En el mismo SQL Editor, clic en "New query"
2. Copiar esto y ejecutar:

```sql
INSERT INTO locations (name, timezone, address, phone, is_active)
VALUES
    ('ANCHOR:23 - Via KLAVA', 'America/Monterrey', 'Blvd. Moctezuma 2370, Los Pinos 2do y 3er Sector, 25204 Saltillo, Coah.', '+52 844 123 4567', true),
    ('TEST - Salón Principal', 'America/Monterrey', 'Av. Universidad 456, Zona Centro, 25000 Saltillo, Coah.', '+52 844 234 5678', true);
```

3. Deberías ver: `Success, no rows returned`

### 2.2 Crear Resources (4 estaciones por salón)
1. Nuevo query, copiar y ejecutar:

```sql
-- ANCHOR:23 - Via KLAVA (4 estaciones: 1 maquillaje + 3 pedicure)
INSERT INTO resources (location_id, name, type, capacity, is_active)
SELECT
    (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1),
    'Estación de Maquillaje',
    'station'::resource_type,
    1,
    true
UNION ALL
SELECT
    (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1),
    'Sillón Pedicure ' || generate_series(1, 3)::TEXT,
    'station'::resource_type,
    1,
    true
UNION ALL
-- TEST - Salón Principal (4 estaciones: 1 maquillaje + 3 pedicure)
SELECT
    (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1),
    'Estación de Maquillaje',
    'station'::resource_type,
    1,
    true
UNION ALL
SELECT
    (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1),
    'Sillón Pedicure ' || generate_series(1, 3)::TEXT,
    'station'::resource_type,
    1,
    true;
```

2. Deberías ver: `Success, no rows returned`

### 2.3 Crear Staff (5 empleadas por salón)
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
VALUES
    -- ANCHOR:23 - Via KLAVA (5 empleadas)
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1), 'admin', 'Mariana González', '+52 844 111 2222', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1), 'manager', 'Daniela Sánchez', '+52 844 222 3333', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1), 'artist', 'Karla Rodríguez', '+52 844 333 4444', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1), 'artist', 'Fernanda Martínez', '+52 844 444 5555', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1), 'artist', 'Paola Hernández', '+52 844 555 6666', true),
    
    -- TEST - Salón Principal (5 empleadas)
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1), 'manager', 'Sofía Ramírez', '+52 844 666 7777', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1), 'artist', 'Valeria López', '+52 844 777 8888', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1), 'artist', 'Andrea García', '+52 844 888 9999', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1), 'artist', 'Camila Torres', '+52 844 999 0000', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1), 'artist', 'Regina Flores', '+52 844 000 1111', true);
```

2. Deberías ver: `Success, no rows returned`

### 2.4 Crear Services
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
VALUES
    ('Maquillaje Social', 'Maquillaje para eventos sociales', 45, 450.00, false, false, true),
    ('Maquillaje de Novia', 'Maquillaje profesional para novias', 90, 1200.00, false, true, true),
    ('Pedicure Básico', 'Pedicure con esmaltado tradicional', 45, 300.00, false, false, true),
    ('Pedicure Spa', 'Pedicure con exfoliación y masaje', 60, 450.00, false, false, true),
    ('Pedicure Premium', 'Pedicure completo con tratamiento de parafina', 75, 600.00, false, true, true),
    ('Uñas Acrilicas', 'Aplicación de uñas acrílicas con diseño', 90, 550.00, false, false, true),
    ('Diseño de Uñas', 'Diseño artístico en uñas naturales o acrílicas', 30, 200.00, false, true, true);
```

2. Deberías ver: `Success, no rows returned`

### 2.4.1 Agregar Nuevos Tiers de Clientes (IMPORTANTE)
**⚠️ Ejecutar ANTES de crear customers**

1. Nuevo query, copiar y ejecutar:

```sql
-- Agregar 'black' tier
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'black' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'customer_tier')
    ) THEN
        ALTER TYPE customer_tier ADD VALUE 'black';
    END IF;
END $$;

-- Agregar 'VIP' tier
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'VIP' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'customer_tier')
    ) THEN
        ALTER TYPE customer_tier ADD VALUE 'VIP';
    END IF;
END $$;
```

2. Deberías ver: `Success, no rows returned` (dos veces)

### 2.5 Crear Customers
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
VALUES
    (uuid_generate_v4(), 'María José', 'Villarreal', 'mariajose.villarreal@example.com', '+52 844 111 1111', 'gold', 'Cliente VIP. Prefiere maquillaje de novia.', 12000.00, 20, '2026-01-10', true),
    (uuid_generate_v4(), 'Ana Paula', 'Garza', 'anapaula.garza@example.com', '+52 844 222 2222', 'gold', 'Cliente regular. Prefiere pedicure premium.', 8500.00, 15, '2026-01-08', true),
    (uuid_generate_v4(), 'Lucía', 'Treviño', 'lucia.trevino@example.com', '+52 844 333 3333', 'free', 'Nueva cliente. Referida por Ana Paula.', 450.00, 2, '2026-01-05', true),
    (uuid_generate_v4(), 'Gabriela', 'Saldaña', 'gabriela.saldana@example.com', '+52 844 444 4444', 'black', 'Cliente Black. Eventos corporativos.', 25000.00, 35, '2026-01-12', true),
    (uuid_generate_v4(), 'Fernanda', 'Cárdenas', 'fernanda.cardenas@example.com', '+52 844 555 5555', 'VIP', 'Cliente VIP. Requiere atención personalizada.', 45000.00, 50, '2026-01-14', true);
```

2. Deberías ver: `Success, no rows returned`

### 2.6 Crear Invitaciones (solo para clientes Gold)
1. Nuevo query, copiar y ejecutar:

```sql
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'mariajose.villarreal@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'anapaula.garza@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'gabriela.saldana@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'fernanda.cardenas@example.com' LIMIT 1));
```

2. Deberías ver:
```
reset_weekly_invitations_for_customer
-----------------------------------------
5
```
(Por cada cliente Gold, 3 veces = 15 total)

### 2.7 Crear Bookings de Prueba
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO bookings (
    customer_id,
    staff_id,
    location_id,
    resource_id,
    service_id,
    start_time_utc,
    end_time_utc,
    status,
    deposit_amount,
    total_amount,
    is_paid,
    payment_reference,
    notes
)
SELECT
    (SELECT id FROM customers WHERE email = 'mariajose.villarreal@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Karla Rodríguez' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1),
    (SELECT id FROM resources WHERE name = 'Estación de Maquillaje' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Maquillaje de Novia' LIMIT 1),
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day 1 hour 30 minutes',
    'confirmed',
    200.00,
    1200.00,
    true,
    'pay_test_001',
    'Maquillaje de novia para María José'
UNION ALL
SELECT
    (SELECT id FROM customers WHERE email = 'anapaula.garza@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Fernanda Martínez' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1),
    (SELECT id FROM resources WHERE name = 'Sillón Pedicure 1' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Pedicure Premium' LIMIT 1),
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days 1 hour 15 minutes',
    'confirmed',
    100.00,
    600.00,
    true,
    'pay_test_002',
    'Pedicure Premium para Ana Paula'
UNION ALL
SELECT
    (SELECT id FROM customers WHERE email = 'lucia.trevino@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Valeria López' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1),
    (SELECT id FROM resources WHERE name = 'Sillón Pedicure 2' AND location_id = (SELECT id FROM locations WHERE name = 'TEST - Salón Principal' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Pedicure Básico' LIMIT 1),
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days 45 minutes',
    'confirmed',
    50.00,
    300.00,
    true,
    'pay_test_003',
    'Primer pedicure para Lucía'
UNION ALL
SELECT
    (SELECT id FROM customers WHERE email = 'gabriela.saldana@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Paola Hernández' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1),
    (SELECT id FROM resources WHERE name = 'Estación de Maquillaje' AND location_id = (SELECT id FROM locations WHERE name = 'ANCHOR:23 - Via KLAVA' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Maquillaje Social' LIMIT 1),
    NOW() + INTERVAL '4 days',
    NOW() + INTERVAL '4 days 45 minutes',
    'confirmed',
    0.00,
    450.00,
    true,
    'pay_test_004',
    'Maquillaje para evento corporativo';
```

2. Deberías ver: `Success, no rows returned`

### 2.8 Verificar Datos Creados
1. Nuevo query, copiar y ejecutar:

```sql
SELECT 'Locations: ' || COUNT(*) as resumen FROM locations
UNION ALL
SELECT 'Resources: ' || COUNT(*) FROM resources
UNION ALL
SELECT 'Staff: ' || COUNT(*) FROM staff
UNION ALL
SELECT 'Services: ' || COUNT(*) FROM services
UNION ALL
SELECT 'Customers: ' || COUNT(*) FROM customers
UNION ALL
SELECT 'Invitaciones: ' || COUNT(*) FROM invitations WHERE status = 'pending'
UNION ALL
SELECT 'Bookings: ' || COUNT(*) FROM bookings;
```

2. Deberías ver:
```
resumen
Locations: 2
Resources: 8
Staff: 10
Services: 7
Customers: 5
Invitaciones: 20
Bookings: 4
```

**Si ves números diferentes:**
- Verifica que todos los queries anteriores se ejecutaron correctamente
- Revisa los errores (si hubo)

**Nota:** Las invitaciones solo se crean para clientes Gold, Black y VIP (4 clientes × 5 invitaciones = 20)

---

## 📋 PASO 3: CREAR USUARIOS AUTH (10 min)

### 3.1 Ir a Auth Users
1. Ir a: `https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/auth/users`
2. Clic en botón "Add user"

### 3.2 Crear Usuario Admin
1. Email: `admin@salonos.com`
2. Password: `Admin123!`
3. **Auto Confirm User:** ON (marcar la casilla)
4. Clic en "Create user"
5. Guardar el **User ID** que aparece (clic en el usuario para verlo)

### 3.3 Crear Usuario Customer (para probar)
1. Clic en botón "Add user"
2. Email: `mariajose.villarreal@example.com`
3. Password: `Customer123!`
4. **Auto Confirm User:** ON (marcar la casilla)
5. Clic en "Create user"
6. Guardar el **User ID** que aparece

### 3.4 Verificar Usuarios
1. En la página de Auth Users, deberías ver 2 usuarios:
   - admin@salonos.com
   - mariajose.villarreal@example.com

---

## 📋 PASO 4: ACTUALIZAR TABLAS CON USER IDS (5 min)

### 4.1 Actualizar Customer con User ID
1. Ir a SQL Editor: `https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/sql`
2. Nuevo query, copiar y ejecutar:

```sql
-- REEMPLAZA [USER_ID_DEL_CUSTOMER] con el ID que copiaste del paso 3.3
UPDATE customers
SET user_id = '[USER_ID_DEL_CUSTOMER]'
WHERE email = 'mariajose.villarreal@example.com';
```

3. Ejemplo de cómo debe verse (NO ejecutar esto, es solo ejemplo):
```sql
UPDATE customers
SET user_id = '01234567-89ab-cdef-0123-456789abcdef'
WHERE email = 'mariajose.villarreal@example.com';
```

### 4.2 Verificar Actualización
1. Nuevo query, copiar y ejecutar:

```sql
SELECT
    c.email,
    c.first_name || ' ' || c.last_name as name,
    c.user_id IS NOT NULL as user_id_set,
    au.email as auth_user_email
FROM customers c
LEFT JOIN auth.users au ON c.user_id = au.id
WHERE c.email = 'mariajose.villarreal@example.com';
```

2. Deberías ver `true` en la columna `user_id_set`

---

## 📋 PASO 5: PROBAR FUNCIONALIDADES (5 min)

### 5.1 Probar Short ID
1. En SQL Editor, ejecutar:

```sql
SELECT generate_short_id();
```

2. Deberías ver algo como: `A3F7X2`

### 5.2 Probar Código de Invitación
1. En SQL Editor, ejecutar:

```sql
SELECT generate_invitation_code();
```

2. Deberías ver algo como: `X9J4K2M5N8`

### 5.3 Verificar Políticas RLS (privacidad Artist)
1. En SQL Editor, ejecutar:

```sql
SELECT
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    c.tier
FROM customers c
LIMIT 1;
```

2. Si ves `NULL` en email y phone: ✅ Correcto (política RLS funcionando)
   - Esto es normal si no estás logueado como Admin
   - Solo Admin/Manager/Staff pueden ver email/phone

---

## ✅ CHECKLIST FINAL

**Antes de ir a la junta, marca cada paso:**

- [ ] PASO 1: Migraciones ejecutadas (verificar mensaje "MIGRATION COMPLETED")
- [ ] PASO 2.1: Locations creadas (2 - Saltillo)
- [ ] PASO 2.2: Resources creados (8 - 4 por salón)
- [ ] PASO 2.3: Staff creado (10 - 5 por salón)
- [ ] PASO 2.4: Services creados (7 - maquillaje y pedicure)
- [ ] PASO 2.4.1: Nuevos tiers agregados (black, VIP)
- [ ] PASO 2.5: Customers creados (5 - varios tiers)
- [ ] PASO 2.6: Invitaciones creadas (20 - 4 clientes premium)
- [ ] PASO 2.7: Bookings creados (4)
- [ ] PASO 2.8: Verificación correcta (2-8-10-7-5-20-4)
- [ ] PASO 3.2: Usuario Admin creado
- [ ] PASO 3.3: Usuario Customer creado
- [ ] PASO 3.4: Verificación Auth Users correcta
- [ ] PASO 4.1: Customer actualizado con user_id
- [ ] PASO 5.1: Short ID generable
- [ ] PASO 5.2: Código de invitación generable
- [ ] PASO 5.3: Políticas RLS funcionando

---

## 🚨 SI ALGO FALLA

### Error: "relation already exists"
- Significa que ya se creó
- Ignora y continúa al siguiente paso

### Error: "duplicate key value"
- Significa que ya existe
- Ignora y continúa al siguiente paso

### Error: "column does not exist"
- Significa que la migración no se ejecutó completamente
- Vuelve al PASO 1 y vuelve a ejecutar la migración

### Error: "no rows returned" en PASO 2.8
- Significa que faltan datos
- Revisa los queries anteriores (PASO 2.1 a 2.7)
- Vuelve a ejecutar el que falló

---

## 💾 GUARDAR CREDENCIALES

Guarda esto en un lugar seguro:

**Admin:**
- Email: `admin@salonos.com`
- Password: `Admin123!`

**Customer (para probar):**
- Email: `mariajose.villarreal@example.com`
- Password: `Customer123!`

---

## 📱 GUÍA DE EMERGENCIA

Si no tienes tiempo de terminar mañana:

### Mínimo necesario para continuar:
1. Ejecutar migración (PASO 1)
2. Crear Locations (PASO 2.1)
3. Crear Services (PASO 2.4)
4. Crear 1 Customer (PASO 2.5)

**Con eso puedes empezar a desarrollar el frontend mañana.**

---

## 🎯 TIEMPO ESTIMADO

- **Rápido (solo migración):** 10 minutos
- **Completo (todo el checklist):** 30-45 minutos
- **Con interrupciones:** 1 hora

---

## 📞 SI TIENES DUDAS

1. Revisa el archivo `DASHBOARD_ONLY_GUIDE.md` (está en la carpeta raíz)
2. Revisa los mensajes de error en Supabase Dashboard
3. Si el error es críptico, tómate una foto y guárdala para revisar después

---

## 🎉 TERMINADO

Cuando termines el checklist:

✅ Base de datos lista
✅ Datos de prueba creados
✅ Usuarios Auth creados
✅ Funcionalidades probadas
✅ Listo para continuar desarrollo mañana

**¡Buena suerte en la junta! 📧**

---

**Fecha de creación:** 2026-01-15
**Creado por:** OpenCode - Agente de Frontend e Integración
**Versión:** 1.0
