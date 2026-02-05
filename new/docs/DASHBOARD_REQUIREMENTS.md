# LLMCtrl Dashboard - Especificaciones de Maquetación

**Proyecto:** LLMCtrl - Monitor de Visibilidad de Marca en LLMs
**Versión:** 1.0
**Fecha:** 27 Enero 2026
**Cliente:** Betfair (Flutter Entertainment)
**Equipo:** Marco Mei, Miguel Angel Almela, Javier Gazquez, Jesus Ruiz, Nelly

---

## 1. CONTEXTO DEL PROYECTO

LLMCtrl es un sistema que monitoriza cómo los LLMs (ChatGPT, Perplexity, etc.) responden preguntas sobre una marca específica. El sistema procesa respuestas y las clasifica en:

- **CRITICAL**: Problemas graves que requieren atención inmediata
- **WARNING**: Situaciones que necesitan seguimiento
- **OPPORTUNITY**: Menciones positivas o neutras

El dashboard debe permitir a un CMO (Chief Marketing Officer) revisar rápidamente el estado de la marca en cualquier momento del día, desde cualquier dispositivo.

---

## 2. REQUISITOS TÉCNICOS BASE

### 2.1 Stack Recomendado

```
Frontend:    Next.js 14+ / React 18+
Styling:     Tailwind CSS 3.x
Components:  shadcn/ui (componentes accesibles y minimalistas)
Charts:      Recharts / Chart.js
Icons:       Lucide React
State:       Zustand o React Context
Auth:        Simple password gate (no sistema de login completo)
```

### 2.2 Requisitos No Funcionales

| Requisito | Especificación |
|-----------|----------------|
| **Responsive** | Mobile-first, funcional desde 320px |
| **Performance** | First Contentful Paint < 1.5s |
| **Accesibilidad** | WCAG 2.1 AA mínimo |
| **Dark Mode** | Obligatorio, toggle manual + preferencia sistema |
| **Protección** | Password simple al entrar (no auth completa) |

---

## 3. ESTRUCTURA DE DATOS

El dashboard consume un JSON con la siguiente estructura por registro:

```json
{
  "id": "2581",
  "question_text": "Is Betfair a trustworthy betting site?",
  "category": 1,
  "category_name": "Brand",
  "mention": true,
  "position": null,
  "triggers_detected": ["regulatory action", "security incident", "scam"],
  "triggers_detail": [
    {
      "trigger": "regulatory action",
      "type": "CRITICAL",
      "context": "Betfair received regulatory action...",
      "reason": "trigger + brand en misma oración"
    }
  ],
  "citations": ["trustpilot", "gambling commission"],
  "classification": "CRITICAL",
  "classification_reason": "SPEC 3.2: Trigger crítico detectado",
  "answer_preview": "Yes Betfair is generally regarded as..."
}
```

### Campos Clave para UI:

| Campo | Uso en UI |
|-------|-----------|
| `classification` | Color/badge del registro |
| `category_name` | Filtro y agrupación |
| `triggers_detected` | Pills/tags en cada registro |
| `question_text` | Título clickeable |
| `answer_preview` | Preview expandible |
| `citations` | Links de fuentes |

### Estadísticas Agregadas:

```
Total registros:     258
CRITICAL:            47 (18.2%)
WARNING:            147 (57.0%)
OPPORTUNITY:         64 (24.8%)

Por categoría:
- Brand (1):              45 registros
- Comparativa General (2): 89 registros
- Por Competidor (3):     28 registros
- Comerciales (4):        52 registros
- Transaccionales (5):    44 registros
```

---

## 4. DIRECTRICES DE DISEÑO

### 4.1 Filosofía Visual

> "Cuando sea critical sea de verdad y lo marquemos, pero de una manera muy sutil, sin tanto colorín que distraiga." — Miguel Angel Almela

- **Minimalismo**: Interfaz limpia, sin elementos decorativos
- **Sutileza**: Los CRITICAL se marcan con indicadores claros pero no alarmantes
- **Profesional**: Aspecto de herramienta de trabajo, no de app consumer
- **Referencia visual**: La interfaz debe sentirse familiar como ChatGPT

### 4.2 Paleta de Colores

**Light Mode:**
```css
--background:       #FFFFFF
--surface:          #F9FAFB
--text-primary:     #111827
--text-secondary:   #6B7280
--border:           #E5E7EB

--critical:         #DC2626 (solo texto/borde, NO fondos rojos)
--critical-subtle:  #FEF2F2
--warning:          #D97706
--warning-subtle:   #FFFBEB
--opportunity:      #059669
--opportunity-subtle: #ECFDF5
```

**Dark Mode:**
```css
--background:       #0F0F0F
--surface:          #1A1A1A
--text-primary:     #F9FAFB
--text-secondary:   #9CA3AF
--border:           #2D2D2D

--critical:         #EF4444
--critical-subtle:  #1F1515
--warning:          #F59E0B
--warning-subtle:   #1F1A15
--opportunity:      #10B981
--opportunity-subtle: #151F1A
```

### 4.3 Tipografía

```css
--font-family:      'Inter', system-ui, sans-serif
--font-size-xs:     12px
--font-size-sm:     14px
--font-size-base:   16px
--font-size-lg:     18px
--font-size-xl:     24px
--font-size-2xl:    30px
```

### 4.4 Indicadores de Clasificación

NO usar fondos de color sólido. Usar:

```
CRITICAL:    Dot rojo + texto rojo + borde sutil rojo
WARNING:     Dot amarillo/naranja + texto naranja
OPPORTUNITY: Dot verde + texto verde
```

Ejemplo de badge:
```
┌─────────────────┐
│ ● CRITICAL      │  ← Dot + texto, fondo casi transparente
└─────────────────┘
```

---

## 5. LAS 4 VERSIONES A MAQUETAR

### VERSION 1: Dashboard Ejecutivo (Mobile-First)

**Objetivo:** Vista rápida para CMO en móvil a cualquier hora.

**Pantalla única con:**

```
┌─────────────────────────────────┐
│  LLMCtrl          [Dark] [?]   │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │     47 CRITICAL         │   │
│  │     ● ● ● ● ● ● ●       │   │  ← Indicador visual sutil
│  └─────────────────────────┘   │
│                                 │
│  ┌───────┐ ┌───────┐          │
│  │  147  │ │   64  │          │
│  │WARNING│ │ OPPTY │          │
│  └───────┘ └───────┘          │
│                                 │
│  ───────────────────────────   │
│  Últimos CRITICAL:              │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ● Is Betfair trust...   │   │
│  │   Brand · 4 triggers    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ● What do you think...  │   │
│  │   Brand · 3 triggers    │   │
│  └─────────────────────────┘   │
│                                 │
│  [Ver todos →]                  │
│                                 │
└─────────────────────────────────┘
```

**Interacciones:**
- Tap en número CRITICAL → Lista filtrada de CRITICALs
- Tap en card → Detalle del registro
- Pull-to-refresh en móvil

---

### VERSION 2: Lista Detallada (Tipo ChatGPT)

**Objetivo:** Navegar todos los registros con filtros.

**Referencia visual:** Interfaz de conversaciones de ChatGPT.

```
┌──────────────────────────────────────────────────────────┐
│  LLMCtrl                              [Filtros] [Dark]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ [All] [Critical] [Warning] [Opportunity]           │ │
│  │ [Brand] [Comparativa] [Competidor] [Comercial]...  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  258 registros · 47 critical                             │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ● Is Betfair a trustworthy betting site?           │ │
│  │                                                    │ │
│  │   Brand                                            │ │
│  │   ┌──────────────┐ ┌─────────┐ ┌──────┐          │ │
│  │   │regulatory    │ │security │ │scam  │          │ │
│  │   │action        │ │incident │ │      │          │ │
│  │   └──────────────┘ └─────────┘ └──────┘          │ │
│  │                                                    │ │
│  │   "Yes Betfair is generally regarded as a         │ │
│  │   trustworthy and legitimate betting site..."     │ │
│  │                                         [Ver más] │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ○ What are the best UK betting sites in 2026?     │ │
│  │   Comparativa General · Position: 4               │ │
│  │   ┌──────────┐                                    │ │
│  │   │issues    │                                    │ │
│  │   └──────────┘                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Interacciones:**
- Click en filtro → Actualiza lista instantáneamente
- Click en card → Expande inline o abre modal
- Search con debounce sobre question_text
- Infinite scroll o paginación

---

### VERSION 3: Vista de Detalle de Registro

**Objetivo:** Ver toda la información de un registro específico.

```
┌──────────────────────────────────────────────────────────┐
│  [← Back]                                    ● CRITICAL  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Is Betfair a trustworthy betting site?                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Categoría        Brand                           │   │
│  │ Clasificación    CRITICAL                        │   │
│  │ Razón            SPEC 3.2: Trigger crítico       │   │
│  │ Mención          Sí                              │   │
│  │ Posición         N/A                             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ─── Triggers Detectados ───                             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ● regulatory action                    CRITICAL  │   │
│  │   "Betfair received regulatory action from       │   │
│  │   the UK Gambling Commission..."                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ● security incident                    CRITICAL  │   │
│  │   "Data Security Incident (Historical): In the   │   │
│  │   past, a large data incident at Betfair..."     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ─── Respuesta Completa ───                              │
│                                                          │
│  Yes Betfair is generally regarded as a trustworthy     │
│  and legitimate betting site, especially if you're      │
│  based in the UK or other well-regulated markets...     │
│                                                          │
│  ─── Fuentes Citadas ───                                 │
│                                                          │
│  • trustpilot                                            │
│  • gambling commission                                   │
│  • techradar                                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Interacciones:**
- Swipe left/right para navegar entre registros (móvil)
- Keyboard arrows para navegar (desktop)
- Copy button para copiar respuesta completa

---

### VERSION 4: Análisis por Categoría

**Objetivo:** Vista analítica agrupada por categoría con métricas.

```
┌──────────────────────────────────────────────────────────┐
│  LLMCtrl · Análisis por Categoría             [Dark]     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                    [Bar Chart]                      ││
│  │   Brand        ████████████████░░ 45               ││
│  │   Comparativa  ████████████████████████████░░ 89   ││
│  │   Competidor   ██████████░░░░░░░░ 28               ││
│  │   Comercial    ████████████████░░░░ 52             ││
│  │   Transacc.    ██████████████░░░░░░ 44             ││
│  │                                                     ││
│  │   ■ Critical  ■ Warning  ■ Opportunity             ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Brand (45 registros)                         [→]   ││
│  ├─────────────────────────────────────────────────────┤│
│  │  ● CRITICAL: 12   ○ WARNING: 28   ○ OPPTY: 5      ││
│  │                                                     ││
│  │  Top triggers: regulatory action (8), issues (15)  ││
│  │                                                     ││
│  │  ┌────────────────────────────────────────────┐    ││
│  │  │ ● Is Betfair trustworthy...    CRITICAL   │    ││
│  │  └────────────────────────────────────────────┘    ││
│  │  ┌────────────────────────────────────────────┐    ││
│  │  │ ● What do you think about...   CRITICAL   │    ││
│  │  └────────────────────────────────────────────┘    ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Comparativa General (89 registros)           [→]   ││
│  ├─────────────────────────────────────────────────────┤│
│  │  ● CRITICAL: 21   ○ WARNING: 45   ○ OPPTY: 23     ││
│  │                                                     ││
│  │  Posición promedio cuando aparece: 4.2             ││
│  │  No aparece en: 21 respuestas (23.6%)              ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Interacciones:**
- Click en categoría → Expande/colapsa
- Click en chart bar → Filtra por clasificación en esa categoría
- Hover en chart → Tooltip con detalle

---

## 6. COMPONENTES REUTILIZABLES

### 6.1 ClassificationBadge

```tsx
<ClassificationBadge type="CRITICAL" />
<ClassificationBadge type="WARNING" />
<ClassificationBadge type="OPPORTUNITY" />
```

### 6.2 TriggerPill

```tsx
<TriggerPill trigger="regulatory action" type="CRITICAL" />
<TriggerPill trigger="issues" type="WARNING" />
```

### 6.3 RecordCard

```tsx
<RecordCard
  question="Is Betfair trustworthy?"
  category="Brand"
  classification="CRITICAL"
  triggers={["regulatory action", "scam"]}
  preview="Yes Betfair is generally..."
  onClick={() => openDetail(id)}
/>
```

### 6.4 StatCard

```tsx
<StatCard
  label="CRITICAL"
  value={47}
  trend={+3}  // vs período anterior (futuro)
  color="critical"
/>
```

### 6.5 PasswordGate

```tsx
<PasswordGate
  onSuccess={() => setAuthenticated(true)}
  hint="Contacta a tu administrador"
/>
```

---

## 7. ESTADOS Y EDGE CASES

### 7.1 Estados a Diseñar

| Estado | Descripción |
|--------|-------------|
| Loading | Skeleton placeholders |
| Empty | "No hay registros que coincidan con los filtros" |
| Error | "Error cargando datos. Reintentar." |
| Password | Pantalla de entrada con input de password |

### 7.2 Edge Cases

- Registro sin triggers: Mostrar badge pero sin pills
- `position: null`: Mostrar "N/A" o no mostrar el campo
- `answer_preview` muy largo: Truncar a 150 chars con "..."
- Muchos triggers (5+): Mostrar 3 + badge "+2 más"

---

## 8. RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
--mobile:   320px - 639px
--tablet:   640px - 1023px
--desktop:  1024px - 1279px
--wide:     1280px+
```

**Adaptaciones por breakpoint:**

| Componente | Mobile | Tablet | Desktop |
|------------|--------|--------|---------|
| Navigation | Bottom bar | Side collapsed | Side expanded |
| Cards | Full width | 2 columns | 3 columns |
| Charts | Simplified | Full | Full + legend |
| Filters | Bottom sheet | Horizontal | Horizontal |

---

## 9. ACCESIBILIDAD

### 9.1 Requisitos Mínimos

- Focus visible en todos los elementos interactivos
- Contraste 4.5:1 mínimo para texto
- Labels en todos los inputs
- Anuncios para screen readers en cambios de estado
- Navegación completa por teclado

### 9.2 ARIA Labels

```html
<button aria-label="Filtrar por clasificación CRITICAL">
<div role="status" aria-live="polite">47 registros encontrados</div>
<nav aria-label="Filtros de categoría">
```

---

## 10. ENTREGABLES ESPERADOS

### Por cada versión:

1. **Mockup estático** (Figma/Sketch)
   - Light mode
   - Dark mode
   - Mobile (375px)
   - Desktop (1440px)

2. **Prototipo interactivo** (opcional)
   - Transiciones entre pantallas
   - Estados hover/active
   - Animaciones de filtrado

3. **Especificaciones de componentes**
   - Medidas exactas
   - Colores en variables CSS
   - Estados (default, hover, active, disabled)

---

## 11. CRITERIOS DE ACEPTACIÓN

| Criterio | Métrica |
|----------|---------|
| Responsive | Funcional en iPhone SE (375px) hasta 4K |
| Performance | Lighthouse Performance > 90 |
| Accesibilidad | Lighthouse Accessibility > 90 |
| Dark Mode | Consistente en todas las pantallas |
| Simplicidad | Usuario puede encontrar un CRITICAL en < 5 segundos |

---

## 12. REFERENCIAS VISUALES

- **ChatGPT**: Estructura de lista de conversaciones
- **Linear**: Estética minimalista y badges sutiles
- **Notion**: Sistema de filtros y vistas
- **Vercel Dashboard**: Uso de colores y estados

---

## 13. NOTAS FINALES

> "Tiene que ser algo muy sencillo donde se diga un pequeño resumen de se ha detectado tantas críticas, tantas warnings, y que todo sea muy cliqueable." — Miguel Angel Almela

> "Ultra responsive y tiene que verse muy bien en el móvil." — Miguel Angel Almela

**Prioridades:**
1. Claridad sobre decoración
2. Mobile sobre desktop
3. Velocidad de acceso a CRITICALs
4. Dark mode funcional

---

**Documento preparado para revisión con el equipo de desarrollo.**
**Próximo paso:** Seleccionar versión principal tras revisar los 4 mockups.
