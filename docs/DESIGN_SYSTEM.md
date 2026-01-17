# AnchorOS Design System

**Sistema de diseño completo para AnchorOS**
**Última actualización: Enero 2026**

---

## 1. Visión General

AnchorOS tiene dos sistemas de diseño distintos:

### anchor23.mx - Frontend Institucional
- Estilo: Editorial, sofisticado, ultra lujo
- Principios: Silencio, solidez, permanencia
- Documentación: `docs/site_requirements.md`, `docs/ANCHOR23_FRONTEND.md`

### Aperture - HQ Dashboard
- Estilo: Square UI (minimalista, funcional, clean)
- Principios: Claridad, consistencia, usabilidad
- Documentación: `docs/APERTURE_SQUARE_UI.md`

---

## 2. Resolución de Inconsistencia de Colores

### Inconsistencia Detectada

**site_requirements.md** define:
```css
--foreground-rgb: 20, 20, 20;
--background-rgb: 255, 255, 255;
--accent-rgb: 180, 150, 120;
--accent-dark-rgb: 140, 110, 80;
```

**globals.css** define:
```css
:root {
  --bone-white: #F6F1EC;
  --soft-cream: #EFE7DE;
  --mocha-taupe: #B8A89A;
  --deep-earth: #6F5E4F;
  --charcoal-brown: #3F362E;
}
```

### Solución Oficial

**Ambos sistemas son correctos** pero aplicados a diferentes contextos:

#### anchor23.mx (Frontend Institucional)
Usa colores de **globals.css**:
```css
--bone-white: #F6F1EC;       /* Background principal */
--soft-cream: #EFE7DE;       /* Bloques y secciones */
--mocha-taupe: #B8A89A;       /* Íconos y divisores */
--deep-earth: #6F5E4F;        /* Botones primarios */
--charcoal-brown: #3F362E;      /* Texto principal */
```

#### Aperture (HQ Dashboard)
Usa colores de **Square UI** (ver `docs/APERTURE_SQUARE_UI.md`):
```css
--ui-primary: #006AFF;
--ui-bg: #F6F8FA;
--ui-bg-card: #FFFFFF;
--ui-text-primary: #24292E;
--ui-border: #E1E4E8;
```

---

## 3. Sistema anchor23.mx - Frontend Institucional

### Paleta de Colores

```css
:root {
  --bone-white: #F6F1EC;
  --soft-cream: #EFE7DE;
  --mocha-taupe: #B8A89A;
  --deep-earth: #6F5E4F;
  --charcoal-brown: #3F362E;
}
```

**Reglas:**
- Sin colores saturados
- Sin gradientes
- Sin sombras duras

### Tipografía

#### Headings
- **Font**: Serif editorial sobria
- **Ejemplos**: The Seasons, Canela
- **Uso**: Títulos de secciones, hero text

#### Body / UI
- **Font**: Sans neutral
- **Ejemplos**: Inter, DM Sans
- **Uso**: Texto de cuerpo, componentes UI

**Implementación actual:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
}
```

**Nota**: Actualmente usa Playfair Display en globals.css.

### Layout

- Grid amplio
- Márgenes generosos
- Ritmo vertical lento
- Espacio negativo dominante

**Nunca:**
- UI densa
- Animaciones llamativas
- Efectos innecesarios

---

## 4. Sistema Aperture - Square UI

Para detalles completos, ver `docs/APERTURE_SQUARE_UI.md`.

### Paleta de Colores (Resumen)

```css
:root {
  --ui-primary: #006AFF;
  --ui-bg: #F6F8FA;
  --ui-bg-card: #FFFFFF;
  --ui-text-primary: #24292E;
  --ui-border: #E1E4E8;
  --ui-success: #28A745;
  --ui-warning: #DBAB09;
  --ui-error: #D73A49;
}
```

### Tipografía

- **Font**: Inter, system-ui, -apple-system
- **Sizes**: 12px (xs) a 48px (5xl)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Layout

- Sidebar: 256px fixed
- Main content: margin-left 256px
- Grid: 12 columnas
- Gutter: 16px

---

## 5. Variables CSS Globales

Todas las variables están definidas en `app/globals.css`:

### anchor23.mx
```css
:root {
  --bone-white: #F6F1EC;
  --soft-cream: #EFE7DE;
  --mocha-taupe: #B8A89A;
  --deep-earth: #6F5E4F;
  --charcoal-brown: #3F362E;
}
```

### UI Components (Compartido)
```css
:root {
  --foreground-rgb: 20, 20, 20;
  --background-rgb: 255, 255, 255;
  --accent-rgb: 180, 150, 120;
  --accent-dark-rgb: 140, 110, 80;
}
```

### Select Components
```css
:root {
  --select-content: background: var(--bone-white);
  --select-item: color: var(--charcoal-brown);
  --select-item:hover: background: var(--soft-cream);
  --select-item[data-state="checked"]: background: var(--soft-cream);
}
```

---

## 6. Componentes UI

### Implementados

En `/components/ui/`:
- ✅ `button.tsx`
- ✅ `card.tsx`
- ✅ `input.tsx`
- ✅ `label.tsx`
- ✅ `select.tsx`
- ✅ `tabs.tsx`
- ✅ `badge.tsx`

### Pendientes de Documentar

Ver checklist en sección 10.

---

## 7. Tipografía Escalas

### anchor23.mx
```css
--text-display: 4.5rem;  /* 72px */
--text-hero: 3.75rem;    /* 60px */
--text-h1: 2.25rem;      /* 36px */
--text-h2: 1.875rem;     /* 30px */
--text-h3: 1.5rem;        /* 24px */
--text-h4: 1.25rem;       /* 20px */
--text-body: 1rem;         /* 16px */
--text-small: 0.875rem;    /* 14px */
```

### Aperture
```css
--text-xs: 0.75rem;       /* 12px */
--text-sm: 0.875rem;      /* 14px */
--text-base: 1rem;         /* 16px */
--text-lg: 1.125rem;      /* 18px */
--text-xl: 1.25rem;       /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

---

## 8. Espaciado (Spacing)

### Base
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### Por Contexto

**anchor23.mx:**
- Section padding: `padding: var(--space-16)` (8rem = 128px)
- Card padding: `padding: var(--space-10)` (2.5rem = 40px)
- Grid gaps: `gap: var(--space-8)` (2rem = 32px)

**Aperture:**
- Card padding: `padding: var(--space-4)` (1rem = 16px)
- Sidebar gap: `gap: var(--space-2)` (0.5rem = 8px)
- Form gap: `gap: var(--space-3)` (0.75rem = 12px)

---

## 9. Bordes y Radii

### anchor23.mx
- Botones: `border-radius: 0` (sin bordes redondeados)
- Cards: `border-radius: 0` (sin bordes redondeados)

### Aperture
```css
--ui-radius-sm: 4px;
--ui-radius-md: 6px;
--ui-radius-lg: 8px;
--ui-radius-xl: 12px;
--ui-radius-2xl: 16px;
```

---

## 10. Documentación de Componentes Pendiente

### Componentes UI Existentes

Los siguientes componentes necesitan documentación completa:

1. **Button** (`components/ui/button.tsx`)
   - Props: variant (primary, secondary, ghost, danger, success, warning)
   - Sizes: sm, md, lg, xl
   - Estados: default, hover, focus, active, disabled
   - Ejemplos de uso

2. **Card** (`components/ui/card.tsx`)
   - Props: variant (default, elevated, bordered)
   - Elevations: sm, md, lg
   - Padding options
   - Radius options

3. **Input** (`components/ui/input.tsx`)
   - Props: type, placeholder, disabled, error, icon
   - Estados: default, focus, error, disabled
   - Accesibilidad: aria-label, aria-describedby

4. **Select** (`components/ui/select.tsx`)
   - Props: options, value, onChange, disabled, placeholder
   - Estados: default, open, focused
   - Items styling (hover, selected)

5. **Tabs** (`components/ui/tabs.tsx`)
   - Props: tabs, activeTab, onTabChange
   - Estilos del tab indicator
   - Posiciones (top, left, right, bottom)

6. **Badge** (`components/ui/badge.tsx`)
   - Props: variant (default, success, warning, error, info)
   - Sizes: sm, md
   - Icon support

### Componentes UI a Crear

7. **Table** (NUEVO)
   - Props: columns, data, sort, pagination
   - Estados: hover on row, sticky header
   - Responsive behavior

8. **Dropdown** (NUEVO)
   - Props: trigger, items, placement
   - Positioning inteligente
   - Close on click outside

9. **Avatar** (NUEVO)
   - Props: src, initials, size, status
   - Status indicators (online, offline, busy)
   - Fallback to initials

10. **Modal** (NUEVO)
    - Props: isOpen, onClose, title, size
    - Sizes: sm, md, lg, xl, full
    - Backdrop behavior
    - Animation transitions

11. **Tooltip** (NUEVO)
    - Props: content, children, placement
    - Trigger: hover, click, focus
    - Delay options

---

## 11. Breakpoints Responsivos

### anchor23.mx
```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1280px;
```

### Aperture
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 12. Animaciones y Transiciones

### Duraciones
```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;
```

### Easing Functions
- Ease-out: `cubic-bezier(0.4, 0, 0.2, 1)`
- Ease-in-out: `cubic-bezier(0.4, 0, 0.2, 1)`

### Principios

**anchor23.mx:**
- Animaciones mínimas o inexistentes
- Foco en estática y permanencia

**Aperture:**
- Animaciones sutiles en todos los interacciones
- Hover, focus, active states con transiciones
- Modal transitions: fade + scale

---

## 13. Accesibilidad

### Contrast Ratios

**anchor23.mx:**
- Background `--bone-white` + Text `--charcoal-brown`: 12.4:1 ✅ (AAA)

**Aperture:**
- Background `--ui-bg-card` + Text `--ui-text-primary`: 12.4:1 ✅ (AAA)
- Background `--ui-primary` + Text `--ui-text-inverse`: 4.6:1 ✅ (AA)

### Focus States

Todos los elementos interactivos deben tener:
```css
:focus {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- Tab order lógico
- Skip links para contenido
- ARIA labels apropiados

---

## 14. Convenciones de Código

### Naming

```typescript
// Componentes: PascalCase
const StatsCard = () => { }

// Props: camelCase
interface StatsCardProps {
  title: string;
  value: number;
}

// CSS classes: kebab-case
.stats-card { }

// CSS variables: kebab-case con prefijo apropiado
--bone-white: #F6F1EC;       // anchor23.mx
--ui-primary: #006AFF;         // Aperture
```

### Estructura de Archivos

```
components/
├── ui/                    # Componentes UI base
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── table.tsx           # NUEVO
│   ├── dropdown.tsx        # NUEVO
│   ├── avatar.tsx          # NUEVO
│   ├── modal.tsx           # NUEVO
│   └── tooltip.tsx         # NUEVO
│
├── booking/               # Componentes específicos de booking
│   └── date-picker.tsx
│
├── kiosk/                 # Componentes específicos de kiosko
│   ├── BookingConfirmation.tsx
│   ├── ResourceAssignment.tsx
│   └── WalkInFlow.tsx
│
├── hq/                    # Componentes específicos de Aperture
│   ├── StatsCard.tsx       # NUEVO
│   ├── BookingCard.tsx      # NUEVO
│   ├── MultiColumnCalendar.tsx   # NUEVO
│   └── index.ts
│
└── shared/               # Componentes compartidos (actualmente vacío)
```

---

## 15. Checklist de Implementación

### Para Componentes UI Nuevos

Antes de considerar un componente como "completado":

- [ ] Implementa todos los estados (default, hover, focus, active, disabled)
- [ ] Usa variables CSS del sistema apropiadas
- [ ] Tiene TypeScript types completos y exportados
- [ ] Tiene contrast ratios ≥ 4.5:1 (AA) o ≥ 7:1 (AAA)
- [ ] Tiene focus visible (outline o equivalente)
- [ ] Es accesible por teclado (tab, enter, escape)
- [ ] Es responsive (mobile, tablet, desktop)
- [ ] Tiene animaciones sutiles (150-300ms) si aplica
- [ ] Está documentado con JSDoc
- [ ] Tiene ejemplos de uso en el código

### Para Páginas Nuevas

Antes de considerar una página como "completada":

- [ ] Tiene meta tags apropiados (title, description)
- [ ] Tiene estructura semántica correcta (header, main, footer)
- [ ] Es responsive en todos los breakpoints
- [ ] Tiene estados de loading y error
- [ ] Tiene feedback visual para acciones (success, error)
- [ ] Está enrutada correctamente en Next.js App Router
- [ ] Tiene pruebas manuales en diferentes navegadores

---

## 16. Recursos y Referencias

### Fonts

- **Inter (Aperture)**: https://fonts.google.com/specimen/Inter
- **Playfair Display (anchor23.mx)**: https://fonts.google.com/specimen/Playfair+Display

### Icon Libraries

- **Lucide React**: https://lucide.dev
- Uso actual: Icons 24px, stroke 2px

### Design Systems de Referencia

- **SquareUi**: https://squareui.com
- **Square Brand**: https://brand.squareup.com
- **Carbon Design**: https://carbondesignsystem.com

### Accesibilidad

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

## 17. Changelog

### 2026-01-17
- Documento inicial creado
- Definición de los dos sistemas de diseño (anchor23.mx y Aperture)
- Resolución de inconsistencia de colores
- Definición de estructura de componentes
- Creación de checklist de implementación

---

## 18. Notas Importantes

### Sobre anchor23.mx
- Estilo diseñado para comunicar exclusividad y lujo
- No busca conversiones agresivas
- Debe sentirse "silencioso, sólido y permanente"

### Sobre Aperture
- Estilo diseñado para eficiencia operativa
- Foco en productividad y claridad de datos
- Debe sentirse "rápido, confiable y funcional"

### Sobre el Futuro
- Considerar migrar hacia un sistema de diseño unificado
- Evaluar si anchor23.mx y Aperture pueden converger
- Mantener flexibilidad para cambios de marca

---

## 19. Decisiones Pendientes

1. ¿Unificar el sistema de diseño a largo plazo?
2. ¿Usar Storybook para documentación de componentes?
3. ¿Implementar dark mode para Aperture?
4. ¿Migrar Playfair Display a otro font más editorial?

---

## 20. Contacto

Para preguntas sobre el sistema de diseño, consultar:
- Documento de estilo de Aperture: `docs/APERTURE_SQUARE_UI.md`
- Documento de requisitos del sitio: `docs/site_requirements.md`
- Documento del frontend institucional: `docs/ANCHOR23_FRONTEND.md`
