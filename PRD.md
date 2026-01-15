🥂 SalonOS — Product Requirements Document (PRD)

Exclusive Studio Management & CRM EngineVersión: 1.0Estado: Documento Maestro de Planificación

Este documento constituye la especificación definitiva del producto SalonOS. Consolida la visión de negocio, las reglas operativas, la experiencia de usuario y la arquitectura técnica. Funciona como contrato de alineación entre la dueña del negocio y el equipo de diseño y desarrollo.

1. Visión y Propósito del Proyecto

SalonOS no es una agenda digital. Es un sistema de gestión de activos, exclusividad y control operativo diseñado para estudios de belleza premium.

1.1 Propósito Dual

Para la Clienta

Experiencia de reserva privada, rápida y sin fricción.

Sensación de pertenencia a un círculo exclusivo.

Interfaz minimalista estilo Townhouse Beauty.

Para el Negocio

Maximizar la rentabilidad por metro cuadrado.

Optimizar el uso de recursos físicos y humanos.

Proteger la base de datos de clientes ante rotación de personal.

2. Experiencia de Usuario (UX) y Filosofía de Diseño

2.1 The Boutique — Interfaz de Clienta

Principios

Minimalismo extremo.

Eliminación total de fricción.

Diseño aspiracional, no comercial.

Características Clave

Tipografía serif premium.

Espacios amplios y navegación guiada.

Sin contraseñas: autenticación vía Magic Links (Email / SMS).

Flujo Lineal de Reserva

Selección de sucursal.

Selección de servicio(s).

Asignación de staff.

Selección de horario.

Pago de depósito.

Confirmación.

No existen bifurcaciones innecesarias.

2.2 The HQ — Dashboard Administrativo

Principios

Claridad operativa.

Control visual inmediato.

Optimizado para escritorio y tablet.

Características

Estética SquareUI.

Calendario multi-columna:

Columnas: profesionales.

Filas: bloques de 15 minutos.

Vista tipo Fresha, sin sobrecarga visual.

3. Módulos y Lógica de Negocio

3.1 Motor de Disponibilidad "Double-Lock"

Una cita solo puede existir si se validan simultáneamente dos capas:

Capa Humana

Colaboradora activa.

Dentro de horario laboral.

Sin conflicto en Google Calendar personal.

Capa Física

Recurso físico requerido disponible.

Sin colisión con otra reserva.

Regla de Prioridad Dinámica
Si existen más colaboradoras que estaciones físicas, el sistema limita la agenda según el recurso disponible.

3.2 Servicios Express (Dual Staff)

Servicios simultáneos diseñados para optimizar el tiempo de la clienta.

Reglas

Requiere dos colaboradoras disponibles en el mismo rango.

Uso obligatorio del Sillón de Pedicura para Mani + Pedi.

La mesa de manicura queda liberada para otra venta.

Se aplica automáticamente un Premium Fee.

El sistema trata el servicio dual como una sola entidad lógica.

3.3 Ecosistema de Exclusividad (Invite-Only)

No existe registro abierto.

Reglas de Acceso

Agenda solo disponible con código de invitación válido.

Cuotas por Tier

Regular: 2 invitaciones (lifetime).

Gold: 5 invitaciones nuevas por mes.

VIP: Ilimitadas.

Tier Especial

Believer: Clientas fundadoras.

Ascienden a Gold con solo 2 citas completadas.

3.4 Blindaje y Privacidad de Datos

Vista del Staff

Nombre de la clienta.

Tier.

Historial técnico.

Información Oculta al Staff

Teléfono.

Email.

Historial financiero.

Audit Trail

Toda acción queda registrada:

Usuario.

Timestamp.

Motivo del cambio.

4. Gestión Financiera y Depósitos Dinámicos

4.1 Booking Fees

Días Valle (Dom–Mié)

Depósito fijo: $200 MXN.

Días Premium (Jue–Sáb)

Anticipo: 50% del total.

Cada cita genera un Short ID de 6 caracteres, que funciona como:

Referencia de pago.

Identificador operativo.

4.2 Política No-Show

Captura de tarjeta vía Stripe.

Ventana de cancelación: 12 horas.

Penalización automática si no cumple.

Condonación manual solo por Admin.

5. Operación de Staff — The Vault

Al cerrar una cita, la documentación es obligatoria.

Contenido

Fórmulas técnicas.

Productos utilizados.

Fotos Antes / Después.

Traspaso de Personal

Módulo para mover colaboradoras entre sucursales.

Reasignación automática de citas.

La información pertenece al negocio, no al staff.

6. Arquitectura Técnica

6.1 Stack

Frontend: Next.js 14 + Tailwind CSS + Framer Motion.

Backend: Supabase (PostgreSQL + Auth + RLS).

Pagos: Stripe SDK.

Calendario: Google Calendar API v3 (Service Account).

Notificaciones: WhatsApp API (Twilio / Meta).

Storage: Supabase Storage (Buckets privados).

7. Esquema de Base de Datos (Sugerido)

locations

resources

staff

services

customers

invitations

bookings

audit_logs

Todas las tablas protegidas mediante Row Level Security.

8. Roadmap de Desarrollo

Fase 1 — Cimientos (Semanas 1–2)

DB y Auth.

Invitaciones.

Tiers.

Short IDs.

Fase 2 — Motor de Agenda (Semanas 3–5)

Doble Capa.

Servicios Express.

Google Calendar Sync.

Fase 3 — Pagos (Semanas 6–7)

Depósitos dinámicos.

No-show logic.

Fase 4 — HQ Dashboard (Semanas 8–9)

Calendario multi-columna.

Gestión de recursos.

The Vault.

Fase 5 — Lanzamiento (Semana 10)

WhatsApp.

Landing Believers.

9. Resumen de Valor para la Dueña

SalonOS entrega:

Blindaje total del negocio.

Optimización real del espacio físico.

Crecimiento orgánico controlado.

Protección financiera ante cancelaciones.

Este documento define la visión técnica oficial de SalonOS. Cualquier modificación posterior al inicio de la Fase 1 impacta alcance, tiempos y costos.

Proyecto: soul23


