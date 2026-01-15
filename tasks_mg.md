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
    ('Salón Principal - Centro', 'America/Mexico_City', 'Av. Reforma 222, Centro Histórico, Ciudad de México', '+52 55 1234 5678', true),
    ('Salón Norte - Polanco', 'America/Mexico_City', 'Av. Masaryk 123, Polanco, Ciudad de México', '+52 55 2345 6789', true),
    ('Salón Sur - Coyoacán', 'America/Mexico_City', 'Calle Hidalgo 456, Coyoacán, Ciudad de México', '+52 55 3456 7890', true);
```

3. Deberías ver: `Success, no rows returned`

### 2.2 Crear Resources
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO resources (location_id, name, type, capacity, is_active)
SELECT
    (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1),
    'Estación ' || generate_series(1, 3)::TEXT,
    'station',
    1,
    true
UNION ALL
SELECT
    (SELECT id FROM locations WHERE name = 'Salón Norte - Polanco' LIMIT 1),
    'Estación ' || generate_series(1, 2)::TEXT,
    'station',
    1,
    true
UNION ALL
SELECT
    (SELECT id FROM locations WHERE name = 'Salón Sur - Coyoacán' LIMIT 1),
    'Estación 1',
    'station',
    1,
    true;
```

2. Deberías ver: `Success, no rows returned`

### 2.3 Crear Staff
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO staff (user_id, location_id, role, display_name, phone, is_active)
VALUES
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1), 'admin', 'Admin Principal', '+52 55 1111 2222', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1), 'manager', 'Manager Centro', '+52 55 2222 3333', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Norte - Polanco' LIMIT 1), 'manager', 'Manager Polanco', '+52 55 6666 7777', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1), 'staff', 'Staff Coordinadora', '+52 55 3333 4444', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1), 'artist', 'Artist María García', '+52 55 4444 5555', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1), 'artist', 'Artist Ana Rodríguez', '+52 55 5555 6666', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Norte - Polanco' LIMIT 1), 'artist', 'Artist Carla López', '+52 55 7777 8888', true),
    (uuid_generate_v4(), (SELECT id FROM locations WHERE name = 'Salón Sur - Coyoacán' LIMIT 1), 'artist', 'Artist Laura Martínez', '+52 55 8888 9999', true);
```

2. Deberías ver: `Success, no rows returned`

### 2.4 Crear Services
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
VALUES
    ('Corte y Estilizado', 'Corte de cabello profesional con lavado y estilizado', 60, 500.00, false, false, true),
    ('Color Completo', 'Tinte completo con protección capilar', 120, 1200.00, false, true, true),
    ('Balayage Premium', 'Técnica de balayage con productos premium', 180, 2000.00, true, true, true),
    ('Tratamiento Kératina', 'Tratamiento de kératina para cabello dañado', 90, 1500.00, false, false, true),
    ('Peinado Evento', 'Peinado para eventos especiales', 45, 800.00, false, true, true),
    ('Servicio Express (Dual Artist)', 'Servicio rápido con dos artists simultáneas', 30, 600.00, true, true, true);
```

2. Deberías ver: `Success, no rows returned`

### 2.5 Crear Customers
1. Nuevo query, copiar y ejecutar:

```sql
INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
VALUES
    (uuid_generate_v4(), 'Sofía', 'Ramírez', 'sofia.ramirez@example.com', '+52 55 1111 1111', 'gold', 'Cliente VIP. Prefiere Artists María y Ana.', 15000.00, 25, '2025-12-20', true),
    (uuid_generate_v4(), 'Valentina', 'Hernández', 'valentina.hernandez@example.com', '+52 55 2222 2222', 'gold', 'Cliente regular. Prefiere horarios de la mañana.', 8500.00, 15, '2025-12-15', true),
    (uuid_generate_v4(), 'Camila', 'López', 'camila.lopez@example.com', '+52 55 3333 3333', 'free', 'Nueva cliente. Referida por Valentina.', 500.00, 1, '2025-12-10', true),
    (uuid_generate_v4(), 'Isabella', 'García', 'isabella.garcia@example.com', '+52 55 4444 4444', 'gold', 'Cliente VIP. Requiere servicio de Balayage.', 22000.00, 30, '2025-12-18', true);
```

2. Deberías ver: `Success, no rows returned`

### 2.6 Crear Invitaciones (solo para clientes Gold)
1. Nuevo query, copiar y ejecutar:

```sql
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'sofia.ramirez@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'valentina.hernandez@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'isabella.garcia@example.com' LIMIT 1));
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
    (SELECT id FROM customers WHERE email = 'sofia.ramirez@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Artist María García' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1),
    (SELECT id FROM resources WHERE location_id = (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Balayage Premium' LIMIT 1),
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '4 hours',
    'confirmed',
    200.00,
    2000.00,
    true,
    'pay_test_001',
    'Balayage Premium para Sofía'
UNION ALL
SELECT
    (SELECT id FROM customers WHERE email = 'valentina.hernandez@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Artist Ana Rodríguez' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1),
    (SELECT id FROM resources WHERE location_id = (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Color Completo' LIMIT 1),
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '4 hours',
    'confirmed',
    200.00,
    1200.00,
    true,
    'pay_test_002',
    'Color Completo para Valentina'
UNION ALL
SELECT
    (SELECT id FROM customers WHERE email = 'camila.lopez@example.com' LIMIT 1),
    (SELECT id FROM staff WHERE display_name = 'Artist María García' LIMIT 1),
    (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1),
    (SELECT id FROM resources WHERE location_id = (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1) LIMIT 1),
    (SELECT id FROM services WHERE name = 'Corte y Estilizado' LIMIT 1),
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '1 hour',
    'confirmed',
    50.00,
    500.00,
    true,
    'pay_test_003',
    'Primer corte para Camila';
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
Locations: 3
Resources: 6
Staff: 8
Services: 6
Customers: 4
Invitaciones: 15
Bookings: 3
```

**Si ves números diferentes:**
- Verifica que todos los queries anteriores se ejecutaron correctamente
- Revisa los errores (si hubo)

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
2. Email: `sofia.ramirez@example.com`
3. Password: `Customer123!`
4. **Auto Confirm User:** ON (marcar la casilla)
5. Clic en "Create user"
6. Guardar el **User ID** que aparece

### 3.4 Verificar Usuarios
1. En la página de Auth Users, deberías ver 2 usuarios:
   - admin@salonos.com
   - sofia.ramirez@example.com

---

## 📋 PASO 4: ACTUALIZAR TABLAS CON USER IDS (5 min)

### 4.1 Actualizar Customer con User ID
1. Ir a SQL Editor: `https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/sql`
2. Nuevo query, copiar y ejecutar:

```sql
-- REEMPLAZA [USER_ID_DEL_CUSTOMER] con el ID que copiaste del paso 3.3
UPDATE customers
SET user_id = '[USER_ID_DEL_CUSTOMER]'
WHERE email = 'sofia.ramirez@example.com';
```

3. Ejemplo de cómo debe verse (NO ejecutar esto, es solo ejemplo):
```sql
UPDATE customers
SET user_id = '01234567-89ab-cdef-0123-456789abcdef'
WHERE email = 'sofia.ramirez@example.com';
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
WHERE c.email = 'sofia.ramirez@example.com';
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
- [ ] PASO 2.1: Locations creadas (3)
- [ ] PASO 2.2: Resources creados (6)
- [ ] PASO 2.3: Staff creado (8)
- [ ] PASO 2.4: Services creados (6)
- [ ] PASO 2.5: Customers creados (4)
- [ ] PASO 2.6: Invitaciones creadas (15)
- [ ] PASO 2.7: Bookings creados (3)
- [ ] PASO 2.8: Verificación correcta (3-6-8-6-4-15-3)
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
- Email: `sofia.ramirez@example.com`
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
