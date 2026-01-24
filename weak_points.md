# Puntos Débiles y Oportunidades de Refactorización en AnchorOS

Este documento detalla los puntos débiles, áreas de mejora y oportunidades de refactorización identificadas en la base de código de AnchorOS. El objetivo es proporcionar una guía clara para futuras tareas de mantenimiento y mejora de la calidad del software.

## 1. Gestión de Dependencias

Se ha identificado que el proyecto tiene una gran cantidad de dependencias desactualizadas o faltantes, según el resultado del comando `npm outdated`.

### Riesgos Asociados

- **Vulnerabilidades de Seguridad:** Las versiones antiguas de los paquetes pueden contener vulnerabilidades conocidas que ya han sido corregidas en versiones más recientes.
- **Bugs y Problemas de Compatibilidad:** Las nuevas versiones de las dependencias suelen incluir correcciones de errores y mejoras de rendimiento. Mantener las dependencias desactualizadas puede provocar un comportamiento inesperado y problemas de compatibilidad.
- **Dificultad en el Mantenimiento:** Un gran número de dependencias desactualizadas dificulta la actualización del proyecto y la adopción de nuevas funcionalidades.

### Recomendación

- **Actualizar Dependencias:** Se recomienda actualizar todas las dependencias a sus últimas versiones estables.
- **Utilizar `npm install`:** Para asegurar que todas las dependencias declaradas en `package.json` estén correctamente instaladas.
- **Integrar Renovate o Dependabot:** Para automatizar el proceso de actualización de dependencias y mantener el proyecto al día.

## 2. Ausencia de Estrategia de Pruebas Automatizadas

El `package.json` no contiene scripts para ejecutar pruebas automatizadas, y la sección de "Tests unitarios" en el `README.md` está marcada como pendiente.

### Riesgos Asociados

- **Regresiones:** Sin pruebas automatizadas, es muy probable que los nuevos cambios introduzcan errores en funcionalidades existentes.
- **Dificultad para Refactorizar:** La falta de pruebas genera incertidumbre al momento de refactorizar o mejorar el código, ya que no hay una forma rápida de verificar que todo sigue funcionando correctamente.
- **Baja Calidad del Código:** La ausencia de pruebas puede llevar a un código más frágil y difícil de mantener.

### Recomendación

- **Integrar un Framework de Pruebas:** Se recomienda integrar herramientas como Jest y React Testing Library para escribir pruebas unitarias y de integración.
- **Desarrollar una Cultura de Pruebas:** Fomentar la escritura de pruebas como parte del proceso de desarrollo.
- **Implementar Pruebas E2E:** Para los flujos críticos de la aplicación, se podrían implementar pruebas End-to-End con herramientas como Cypress o Playwright.

## 3. Scripts Personalizados: Riesgos de Mantenibilidad y Seguridad

El directorio `scripts/` contiene una gran cantidad de scripts (`.js`, `.sql`, `.sh`) sin una estructura o propósito unificado. El análisis del script `scripts/verify-admin-user.js` revela problemas significativos a nivel técnico, de diseño y de seguridad.

### Razones Técnicas

- **Valores Hardcodeados:** El script contiene valores fijos (ej. `email = 'marco.gallegos@anchor2na'`). Esto lo hace inflexible y obliga a modificar el código fuente para verificar otros usuarios, aumentando el riesgo de errores.
- **Manejo de Errores Simplista:** El uso de `process.exit(1)` detiene la ejecución de forma abrupta. Un manejo de errores más robusto permitiría una integración más limpia con otros sistemas o flujos de trabajo automatizados.
- **Falta de Documentación:** La ausencia de comentarios JSDoc o bloques de descripción dificulta entender el propósito y el funcionamiento del script sin leerlo en su totalidad.

### Razones de Diseño

- **Falta de Reutilización:** El diseño del script impide su reutilización. Un enfoque mejor sería aceptar parámetros desde la línea de comandos (ej. `node verify-admin-user.js --email=test@example.com`).
- **Proliferación de Scripts:** La existencia de docenas de scripts individuales para tareas específicas sugiere la falta de una herramienta de línea de comandos (CLI) centralizada. Un buen diseño consolidaría estas operaciones en un único punto de entrada, mejorando la cohesión y el descubrimiento de funcionalidades.

### Razones de Seguridad

- **Uso de Claves con Privilegios Elevados:** El script utiliza la `SUPABASE_SERVICE_ROLE_KEY`. Esta clave tiene acceso de administrador a toda la infraestructura de Supabase y **omite todas las políticas de Row Level Security (RLS)**. Su uso en scripts locales es extremadamente peligroso.
- **Aumento de la Superficie de Ataque:** Cada script que utiliza esta clave privilegiada representa un nuevo vector de ataque. Un bug en cualquiera de estos scripts podría ser explotado para acceder, modificar o eliminar todos los datos de la aplicación.
- **Ausencia de Auditoría:** Los scripts se ejecutan localmente y solo registran en la consola. No existe un registro de auditoría centralizado que indique quién ejecutó un script con privilegios elevados, cuándo lo hizo y con qué parámetros.

### Recomendación

- **Centralizar en una CLI:** Refactorizar los scripts en una única herramienta CLI (ej. con `commander.js` o similar) que gestione los comandos, parámetros y la configuración de forma segura.
- **Limitar el Uso de Claves de Servicio:** El uso de la `SERVICE_ROLE_KEY` debe estar restringido a entornos de backend seguros y controlados, no en scripts de desarrollo. Para tareas específicas, se deberían crear roles de base de datos con permisos limitados.
- **Implementar un Sistema de Auditoría:** Registrar la ejecución de tareas administrativas críticas en una tabla de auditoría en la base de datos para tener un control de cambios y accesos.

## 4. Calidad del Código y Oportunidades de Refactorización

El componente `app/aperture/page.tsx` es un ejemplo de "God Component" que acumula demasiadas responsabilidades, lo que resulta en un código difícil de mantener, probar y razonar.

### Puntos Débiles

- **Componente "God":** El componente maneja el estado, la lógica de fetching y la renderización de múltiples pestañas (`dashboard`, `calendar`, `staff`, `payroll`, etc.), lo que viola el Principio de Responsabilidad Única.
- **Uso de `any` en TypeScript:** Se utiliza el tipo `any` para el estado de `bookings`, `staff`, `resources`, etc. Esto anula las ventajas de TypeScript, como la seguridad de tipos y el autocompletado, y puede ocultar bugs que solo aparecerán en tiempo de ejecución.
- **Lógica de Fetching Centralizada:** Toda la lógica para obtener datos de la API se encuentra en un único componente, lo que dificulta su reutilización y mantenimiento.

### Recomendación

- **Dividir el Componente:** Refactorizar el componente `ApertureDashboard` en componentes más pequeños y especializados. Cada pestaña debería ser un componente independiente con su propia lógica de estado y fetching.
- **Definir Tipos Estrictos:** Reemplazar `any` con tipos o interfaces de TypeScript que modelen la estructura de los datos (ej. `Booking`, `StaffMember`). Esto mejorará la seguridad del código y la experiencia de desarrollo.
- **Co-ubicar el Estado y la Lógica de Fetching:** Mover la lógica de obtención de datos a los componentes que la necesitan, o utilizar un gestor de estado como React Query (TanStack Query) para simplificar el fetching, el cacheo y la sincronización de datos.

## 5. Deuda Técnica y Código Heredado

Se ha identificado una cantidad considerable de deuda técnica y código heredado que podría afectar la estabilidad y el mantenimiento del proyecto.

### Puntos Débiles

- **Comentarios `TODO`:** El comando `grep -r 'TODO' .` reveló una gran cantidad de comentarios `TODO` en el código, lo que indica tareas incompletas o áreas que requieren atención.
- **Código Heredado en `app/hq`:** El directorio `app/hq` contiene una versión antigua del dashboard que ha sido reemplazada por `app/aperture`. Aunque no está directamente en uso, su presencia puede generar confusión y aumentar la complejidad del proyecto.
- **Falta de Estándares de Código:** La inconsistencia en el formato del código, el uso de `any` y la falta de comentarios sugieren la ausencia de un linter y un formateador de código configurados de manera estricta.

### Recomendación

- **Revisar y Abordar los `TODO`:** Crear tareas en el sistema de seguimiento de problemas para cada `TODO` y priorizar su resolución.
- **Eliminar el Código Heredado:** Eliminar el directorio `app/hq` y cualquier otra referencia a él para reducir la complejidad del código base.
- **Implementar Herramientas de Calidad de Código:** Configurar y hacer cumplir el uso de ESLint, Prettier y TypeScript con reglas estrictas para garantizar un estilo de código consistente y de alta calidad.
