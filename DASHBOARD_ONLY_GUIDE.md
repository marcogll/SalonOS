# 🚨 PUERTO 5432 BLOQUEADO - SOLUCIÓN SIMPLE

## ✅ SOLUCIÓN: USAR SUPABASE DASHBOARD

No necesitas scripts ni línea de comandos. Solo usa el navegador.

---

## 📋 PASO 1: EJECUTAR MIGRACIONES

### 1.1 Abrir Supabase SQL Editor

```
https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/sql
```

### 1.2 Copiar Migración Completa

Copia el contenido de este archivo:
```
db/migrations/00_FULL_MIGRATION_FINAL.sql
```

### 1.3 Ejecutar

1. Pega el contenido en el SQL Editor
2. Haz clic en **"Run"** (botón azul arriba a la derecha)
3. Espera 10-30 segundos

### 1.4 Verificar

Al finalizar deberías ver:
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

---

## 📋 PASO 2: CREAR DATOS DE PRUEBA

### 2.1 Crear Locations

Copia esto en el SQL Editor y ejecuta:

```sql
INSERT INTO locations (name, timezone, address, phone, is_active)
VALUES
    ('Salón Principal - Centro', 'America/Mexico_City', 'Av. Reforma 222', '+52 55 1234 5678', true),
    ('Salón Norte - Polanco', 'America/Mexico_City', 'Av. Masaryk 123', '+52 55 2345 6789', true),
    ('Salón Sur - Coyoacán', 'America/Mexico_City', 'Calle Hidalgo 456', '+52 55 3456 7890', true);
```

### 2.2 Crear Resources

```sql
INSERT INTO resources (location_id, name, type, capacity, is_active)
SELECT
    (SELECT id FROM locations WHERE name = 'Salón Principal - Centro' LIMIT 1),
    'Estación ' || generate_series(1,3)::TEXT,
    'station',
    1,
    true
UNION ALL
SELECT
    (SELECT id FROM locations WHERE name = 'Salón Norte - Polanco' LIMIT 1),
    'Estación ' || generate_series(1,2)::TEXT,
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

### 2.3 Crear Staff

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

### 2.4 Crear Services

```sql
INSERT INTO services (name, description, duration_minutes, base_price, requires_dual_artist, premium_fee_enabled, is_active)
VALUES
    ('Corte y Estilizado', 'Corte de cabello profesional', 60, 500.00, false, false, true),
    ('Color Completo', 'Tinte completo con protección capilar', 120, 1200.00, false, true, true),
    ('Balayage Premium', 'Técnica de balayage premium', 180, 2000.00, true, true, true),
    ('Tratamiento Kératina', 'Tratamiento para cabello dañado', 90, 1500.00, false, false, true),
    ('Peinado Evento', 'Peinado para eventos', 45, 800.00, false, true, true),
    ('Servicio Express (Dual Artist)', 'Servicio rápido con dos artists', 30, 600.00, true, true, true);
```

### 2.5 Crear Customers

```sql
INSERT INTO customers (user_id, first_name, last_name, email, phone, tier, notes, total_spent, total_visits, last_visit_date, is_active)
VALUES
    (uuid_generate_v4(), 'Sofía', 'Ramírez', 'sofia.ramirez@example.com', '+52 55 1111 1111', 'gold', 'Cliente VIP. Prefiere Artists María y Ana.', 15000.00, 25, '2025-12-20', true),
    (uuid_generate_v4(), 'Valentina', 'Hernández', 'valentina.hernandez@example.com', '+52 55 2222 2222', 'gold', 'Cliente regular. Prefiere mañanas.', 8500.00, 15, '2025-12-15', true),
    (uuid_generate_v4(), 'Camila', 'López', 'camila.lopez@example.com', '+52 55 3333 3333', 'free', 'Nueva cliente. Referida por Valentina.', 500.00, 1, '2025-12-10', true),
    (uuid_generate_v4(), 'Isabella', 'García', 'isabella.garcia@example.com', '+52 55 4444 4444', 'gold', 'Cliente VIP. Requiere Balayage.', 22000.00, 30, '2025-12-18', true);
```

### 2.6 Crear Invitaciones (para clientes Gold)

```sql
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'sofia.ramirez@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'valentina.hernandez@example.com' LIMIT 1));
SELECT reset_weekly_invitations_for_customer((SELECT id FROM customers WHERE email = 'isabella.garcia@example.com' LIMIT 1));
```

### 2.7 Crear Bookings

```sql
INSERT INTO bookings (customer_id, staff_id, location_id, resource_id, service_id, start_time_utc, end_time_utc, status, deposit_amount, total_amount, is_paid, payment_reference, notes)
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

### 2.8 Verificar Datos Creados

```sql
SELECT 'Locations: ' || COUNT(*) as resumen FROM locations
UNION ALL
SELECT 'Resources: ' || COUNT(*) as resumen FROM resources
UNION ALL
SELECT 'Staff: ' || COUNT(*) as resumen FROM staff
UNION ALL
SELECT 'Services: ' || COUNT(*) as resumen FROM services
UNION ALL
SELECT 'Customers: ' || COUNT(*) as resumen FROM customers
UNION ALL
SELECT 'Invitaciones: ' || COUNT(*) as resumen FROM invitations WHERE status = 'pending'
UNION ALL
SELECT 'Bookings: ' || COUNT(*) as resumen FROM bookings;
```

**Resultado esperado:**
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

---

## 📋 PASO 3: CREAR USUARIOS AUTH

### 3.1 Ir a Supabase Auth

```
https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/auth/users
```

### 3.2 Crear Usuarios (Manual)

Haz clic en **"Add user"** y crea estos usuarios uno por uno:

#### Admin
- **Email:** `admin@salonos.com`
- **Password:** `Admin123!`
- **Auto Confirm User:** ON
- **User Metadata (opcional):**
  ```json
  {"role": "admin", "display_name": "Admin Principal"}
  ```

#### Customer Gold (para probar)
- **Email:** `sofia.ramirez@example.com`
- **Password:** `Customer123!`
- **Auto Confirm User:** ON
- **User Metadata (opcional):**
  ```json
  {"tier": "gold", "display_name": "Sofía Ramírez"}
  ```

### 3.3 Actualizar Tablas con User IDs (Opcional)

Si quieres conectar los usuarios de Auth con las tablas staff/customers:

1. Ve a **Auth → Users**
2. Copia el **User ID** del usuario
3. En el SQL Editor, ejecuta:

```sql
-- Para actualizar customer
UPDATE customers
SET user_id = 'COPIA_EL_USER_ID_AQUI'
WHERE email = 'sofia.ramirez@example.com';
```

---

## 📋 PASO 4: PROBAR FUNCIONALIDADES

### 4.1 Probar Short ID

En el SQL Editor:
```sql
SELECT generate_short_id();
```

**Resultado:** Ej: `A3F7X2`

### 4.2 Probar Código de Invitación

```sql
SELECT generate_invitation_code();
```

**Resultado:** Ej: `X9J4K2M5N8`

### 4.3 Verificar Bookings

```sql
SELECT b.short_id, c.first_name || ' ' || c.last_name as customer, s.display_name as artist, svc.name as service, b.status
FROM bookings b
JOIN customers c ON b.customer_id = c.id
JOIN staff s ON b.staff_id = s.id
JOIN services svc ON b.service_id = svc.id
ORDER BY b.start_time_utc;
```

---

## ✅ CHECKLIST FINAL

- [ ] Migraciones ejecutadas en Supabase Dashboard
- [ ] 8 tablas creadas
- [ ] 14 funciones creadas
- [ ] 17+ triggers activos
- [ ] 20+ políticas RLS configuradas
- [ ] 3 locations creadas
- [ ] 6 resources creados
- [ ] 8 staff creados
- [ ] 6 services creados
- [ ] 4 customers creados
- [ ] 15 invitaciones creadas
- [ ] 3+ bookings creados
- [ ] Usuarios de Auth creados (admin + customer)
- [ ] Short ID generable
- [ ] Código de invitación generable

---

## 🎯 PRÓXIMOS PASOS

Una vez que todo esté completo:

1. ✅ **Fase 1.1 y 1.2 completadas**
2. 🚀 **Continuar con desarrollo del frontend** (The Boutique / The HQ)
3. 🚀 **Implementar Tarea 1.3** (Short ID & Invitaciones - backend)
4. 🚀 **Implementar Tarea 1.4** (CRM Base - endpoints CRUD)

---

## 💡 NOTA FINAL

**No necesitas scripts de línea de comandos.**

Todo lo que necesitas hacer está en **Supabase Dashboard**:

1. Ir a: https://supabase.com/dashboard/project/pvvwbnybkadhreuqijsl/sql
2. Copiar y pegar el SQL
3. Hacer clic en **"Run"**

¡Eso es todo! 🎉
