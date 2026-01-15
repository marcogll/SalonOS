# AGENTS.md — Roles de IA y Responsabilidades

Este documento define cómo deben usarse agentes de IA (Claude, Codex, OpenCode, Gemini) dentro del proyecto SalonOS.

Ningún agente tiene autoridad de producto. Todos ejecutan bajo el PRD.

---

## Principios de Uso de Agentes

* Los agentes **no deciden alcance**.
* Los agentes **no redefinen reglas de negocio**.
* Toda salida debe ser revisable y versionable.
* El PRD es la única fuente de verdad funcional.

---

## Claude — Arquitectura & Lógica

**Rol:** Arquitecto de sistema y reglas de negocio.

**Usar para:**

* Descomposición de lógica compleja.
* Revisión de consistencia con el PRD.
* Diseño de flujos y algoritmos.
* Modelado de estados y edge cases.

**No usar para:**

* Código final sin revisión.
* Decisiones de UX visual.

---

## Codex — Implementación Backend

**Rol:** Ingeniero de backend.

**Usar para:**

* SQL y migraciones.
* Funciones server-side.
* Webhooks (Stripe, WhatsApp).
* Integraciones API.

**Reglas:**

* Todo código debe respetar RLS.
* No hardcodear secretos.

---

## OpenCode — Frontend & Integración

**Rol:** Ingeniero de interfaz y pegamento.

**Usar para:**

* Componentes Next.js.
* Integración frontend ↔ backend.
* Manejo de estados.
* Formularios y flujos.

**Reglas:**

* No exponer datos privados.
* Validaciones críticas en backend.

---

## Gemini — QA & Seguridad

**Rol:** Auditor técnico.

**Usar para:**

* Revisión de RLS.
* Detección de fugas de datos.
* Edge cases de seguridad.
* Validación de flujos críticos.

---

## Flujo de Trabajo Recomendado

1. PRD define la regla.
2. Claude descompone la lógica.
3. Codex implementa backend.
4. OpenCode conecta UI.
5. Gemini audita.

---

## Regla de Oro

Si un agente contradice el PRD, el agente está equivocado.
