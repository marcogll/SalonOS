# 🥂 SalonOS

**Exclusive Studio Management & CRM Engine**
Repositorio principal del sistema SalonOS.

Este README es la puerta de entrada técnica al proyecto. Define qué es este repositorio, cómo se estructura y cómo debe ser utilizado por desarrollo, producto y operación.

---

## 1. ¿Qué es SalonOS?

SalonOS es un sistema propietario de gestión operativa y CRM diseñado para estudios de belleza de alta exclusividad. No es una agenda genérica: coordina **personas, recursos físicos, pagos, privilegios y datos** bajo reglas estrictas de control y privacidad.

El sistema está diseñado para:

* Optimizar el uso de estaciones físicas.
* Proteger la base de datos de clientes.
* Controlar el crecimiento mediante invitaciones.
* Garantizar rentabilidad en días de alta demanda.

---

## 2. Alcance de este Repositorio

Este repositorio contiene:

* Frontend de cliente (The Boutique).
* Dashboard administrativo (The HQ).
* Lógica de negocio de agendamiento.
* Integraciones externas (Stripe, Google Calendar, WhatsApp).
* Esquema base de datos y políticas de seguridad.

No contiene:

* Material de marketing.
* Operación manual del salón.
* Datos productivos.

---

## 3. Documentación Oficial

Este proyecto se rige por los siguientes documentos:

* **PRD (Documento Maestro)** → Definición de producto y reglas de negocio.
* **README (este archivo)** → Guía técnica y operativa del repo.

El PRD es la fuente de verdad funcional. El README es la guía de ejecución.

---

## 4. Arquitectura General

### Experiencias

* **The Boutique**: Frontend de reserva para clientas.
* **The HQ**: Dashboard administrativo y CRM interno.

### Principios

* Security by Design.
* Exclusividad curada.
* Optimización de activos.

---

## 5. Stack Tecnológico

* **Frontend**: Next.js 14 (App Router)
* **UI / Estilos**: Tailwind CSS + Framer Motion
* **Backend**: Supabase (PostgreSQL + Auth + RLS)
* **Pagos**: Stripe SDK
* **Calendario**: Google Calendar API v3 (Service Account)
* **Notificaciones**: WhatsApp API (Twilio / Meta)
* **Storage**: Supabase Storage (Buckets privados)

---

## 6. Estructura del Proyecto

```
/salonos
├── app/                # Next.js App Router
│   ├── boutique/       # Frontend clienta
│   ├── hq/             # Dashboard administrativo
│   └── api/            # API routes
├── components/         # Componentes UI reutilizables
├── lib/                # Lógica de negocio y helpers
├── db/                 # Esquemas, migraciones y seeds
├── integrations/       # Stripe, Google, WhatsApp
├── styles/             # Configuración Tailwind
└── docs/               # Documentación adicional
```

---

## 7. Requisitos de Entorno

* Node.js 18+
* Cuenta Supabase
* Cuenta Stripe
* Proyecto Google Cloud (Calendar API)
* Credenciales WhatsApp API

Variables de entorno obligatorias:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
GOOGLE_SERVICE_ACCOUNT_JSON=
WHATSAPP_API_KEY=
```

---

## 8. Setup Local

1. Clonar el repositorio

```
git clone <repo-url>
cd salonos
```

2. Instalar dependencias

```
npm install
```

3. Configurar variables de entorno

* Crear `.env.local`.

4. Levantar entorno local

```
npm run dev
```

---

## 9. Convenciones de Desarrollo

* El PRD define la lógica: no se improvisa comportamiento.
* Toda regla crítica debe vivir en backend.
* RLS obligatorio en todas las tablas sensibles.
* El frontend nunca expone datos privados del cliente.
* Cambios de alcance requieren actualización del PRD.

---

## 10. Estado del Proyecto

* Fase actual: Planificación / Fase 1.
* No apto para producción.
* Migraciones y seeds en evolución.

---

## 11. Filosofía Operativa

SalonOS no busca volumen.

Busca **control, eficiencia y blindaje**.

Este repositorio implementa esa filosofía a nivel de sistema.

---

**Proyecto:

