# TASKS.md — Plan de Ejecución por Agentes

Este documento define las tareas ejecutables del proyecto SalonOS, descompuestas para trabajo asistido por modelos (Claude, Codex, OpenCode, Gemini) y desarrollo humano.

Las tareas están alineadas estrictamente con el PRD. No se permite introducir lógica no documentada.

---

## Convenciones

* Cada tarea debe producir artefactos verificables (código, migraciones, tests, docs).
* Las reglas de negocio viven en backend.
* Ningún agente redefine alcance.

---

## FASE 1 — Cimientos y CRM

### 1.1 Infraestructura Base

* Crear proyecto Supabase.
* Configurar Auth (Magic Links Email/SMS).
* Definir RLS global por rol (Admin / Manager / Staff / Customer).

**Output:**

* Supabase project configurado.
* Policies iniciales documentadas.

---

### 1.2 Esquema de Base de Datos Inicial

Tablas:

* locations
* resources
* staff
* services
* customers
* invitations
* bookings
* audit_logs

Tareas:

* Definir migraciones SQL.
* Claves foráneas y constraints.
* Campos de auditoría (`created_at`, `updated_at`).

**Output:**

* Migraciones versionadas.
* Diagrama lógico.

---

### 1.3 Short ID & Invitaciones

* Generador de Short ID (6 chars, collision-safe).
* Generador y validación de códigos de invitación.
* Lógica de cuotas por Tier.

**Output:**

* Funciones backend.
* Tests unitarios.

---

### 1.4 CRM Base (Customers)

* Cálculo automático de Tier.
* Tracking de referidos.
* Perfil privado de cliente.

**Output:**

* Endpoints CRUD.
* Policies RLS por rol.

---

## FASE 2 — Motor de Agendamiento

### 2.1 Disponibilidad Doble Capa

* Validación Staff:

  * Horario laboral.
  * Eventos en Google Calendar.

* Validación Recurso:

  * Disponibilidad de estación física.

* Regla de prioridad dinámica.

**Output:**

* Algoritmo de disponibilidad.
* Tests de colisión.

---

### 2.2 Servicios Express (Dual Staff)

* Búsqueda de dos colaboradoras simultáneas.
* Bloqueo de Sillón de Pedicura.
* Liberación de mesa secundaria.
* Aplicación automática de Premium Fee.

**Output:**

* Lógica de booking dual.
* Casos de prueba.

---

### 2.3 Google Calendar Sync

* Integración vía Service Account.
* Sync bidireccional.
* Manejo de conflictos.

**Output:**

* Servicio de sincronización.
* Logs de errores.

---

## FASE 3 — Pagos y Protección

### 3.1 Stripe — Depósitos Dinámicos

* Regla $200 vs 50%.
* Asociación pago ↔ booking.

**Output:**

* Webhooks Stripe.
* Validación de pagos.

---

### 3.2 No-Show Logic

* Ventana 12h.
* Penalización automática.
* Override Admin.

**Output:**

* Función de penalización.
* Auditoría en `audit_logs`.

---

## FASE 4 — HQ Dashboard

### 4.1 Calendario Multi-Columna

* Vista por staff.
* Bloques de 15 min.

---

### 4.2 Gestión Operativa

* Recursos.
* Staff.
* Traspaso entre sucursales.

---

### 4.3 The Vault

* Upload fotos privadas.
* Formularios técnicos.

---

## FASE 5 — Automatización y Lanzamiento

* WhatsApp confirmaciones.
* Recibos digitales.
* Landing Believers.

---

## Regla Final

Si una tarea no está aquí, no existe.
