# PLAYBOOK: Creación de Baterías de Preguntas para Evaluación de Visibilidad en LLMs

**Guía Metodológica Completa**

Versión 1.1 | Febrero 2026

---

## ÍNDICE

1. [Introducción y Contexto](#1-introducción-y-contexto)
2. [Conceptos Fundamentales](#2-conceptos-fundamentales)
3. [Estructura de una Batería de Preguntas](#3-estructura-de-una-batería-de-preguntas)
4. [Proceso de Creación Paso a Paso](#4-proceso-de-creación-paso-a-paso)
5. [Herramientas de Investigación](#5-herramientas-de-investigación)
6. [Identificación de Competidores](#6-identificación-de-competidores)
7. [Categorías de Preguntas](#7-categorías-de-preguntas)
8. [Dimensiones de Evaluación](#8-dimensiones-de-evaluación)
9. [Redacción de Preguntas Efectivas](#9-redacción-de-preguntas-efectivas)
10. [Adaptación por Industria (B2B vs B2C)](#10-adaptación-por-industria-b2b-vs-b2c)
11. [Adaptación por Mercado Geográfico](#11-adaptación-por-mercado-geográfico)
12. [Sistema de Evaluación y Métricas](#12-sistema-de-evaluación-y-métricas)
13. [Checklist de Calidad](#13-checklist-de-calidad)
14. [Errores Comunes a Evitar](#14-errores-comunes-a-evitar)
15. [Plantillas y Ejemplos](#15-plantillas-y-ejemplos)

---

## 1. Introducción y Contexto

Este playbook documenta la metodología completa para crear baterías de preguntas que evalúan el posicionamiento de una marca en las respuestas de Large Language Models (LLMs) como ChatGPT, Claude, Perplexity y Gemini.

### 1.1 ¿Por qué es importante?

Los LLMs están cambiando fundamentalmente cómo los usuarios buscan información y toman decisiones de compra. A diferencia del SEO tradicional donde competimos por posiciones en resultados de búsqueda, en LLMs competimos por:

- Ser mencionados en la respuesta
- La posición relativa frente a competidores
- El tono con el que se habla de la marca (positivo, neutro, negativo)
- La recomendación explícita o implícita

### 1.2 Diferencia con SEO Tradicional

| Aspecto | SEO Tradicional | LLM Optimization |
|---------|-----------------|------------------|
| Fuente de verdad | Páginas indexadas | Knowledge base + fuentes externas |
| Competencia | Top 10 resultados | Mención o no mención |
| Métricas | Posición, CTR, tráfico | Mención, posición, tono, recomendación |
| Control | On-page + Off-page | Narrativa en fuentes citadas |
| Actualización | Crawling continuo | Cortes de conocimiento + búsqueda en tiempo real |

### 1.3 Objetivo de las Baterías

Una batería de preguntas bien diseñada permite:

1. Diagnosticar el estado actual de la marca en respuestas de LLMs
2. Identificar brechas críticas donde la marca no aparece
3. Detectar narrativas negativas que afectan la conversión
4. Medir el progreso de estrategias de optimización
5. Priorizar acciones por impacto en el negocio

---

## 2. Conceptos Fundamentales

### 2.1 Inside vs Outside the Node

Este es un concepto crítico para entender cómo funcionan los LLMs:

| Concepto | Descripción | Implicación |
|----------|-------------|-------------|
| **Inside the Node** | Información con la que fue entrenado el modelo | No cambia sin re-entrenamiento |
| **Outside the Node** | Información que el modelo busca en tiempo real (Google, Bing, etc.) | Puede actualizarse constantemente |

> ⚠️ **IMPORTANTE:** Cuando se usa la API sin búsqueda web habilitada, los LLMs solo acceden a información "inside the node". Las respuestas pueden diferir significativamente de las que ve un usuario real en la interfaz web.

### 2.2 El Funnel de Decisión del Usuario

Las preguntas que hace un usuario a un LLM siguen un patrón mental similar al funnel de compra:

| Etapa | Mentalidad del Usuario | Tipo de Pregunta |
|-------|------------------------|------------------|
| 1. Awareness | ¿Esto es legítimo? ¿Puedo confiar? | ¿Es [marca] fiable/segura/legal? |
| 2. Consideración | ¿Cuáles son mis opciones? | ¿Cuál es el mejor [producto]? |
| 3. Comparación | ¿Cuál es mejor para mí? | ¿Qué es mejor, [A] o [B]? |
| 4. Decisión | ¿Debería comprar esto? | ¿Me recomiendas [marca]? |
| 5. Transacción | ¿Cómo procedo? | ¿Cómo me registro en [marca]? |

> 💡 **TIP:** Una batería completa debe cubrir TODAS las etapas del funnel, no solo las comparativas.

### 2.3 Triggers y Alertas

Los "triggers" son palabras o frases en las respuestas del LLM que indican riesgo para la marca:

- **Triggers de seguridad:** 'scam', 'fraude', 'estafa', 'cuidado'
- **Triggers regulatorios:** 'multa', 'sanción', 'investigación', 'denuncia'
- **Triggers de servicio:** 'quejas', 'problemas', 'mal servicio', 'no responden'
- **Triggers de producto:** 'limitado', 'caro', 'peor que', 'anticuado'

---

## 3. Estructura de una Batería de Preguntas

### 3.1 Componentes Obligatorios

Toda batería debe contener estos elementos:

| Componente | Descripción | Ubicación |
|------------|-------------|-----------|
| Resumen/Overview | Objetivo, competidores verificados, exclusiones justificadas | Hoja 1 |
| Preguntas Directas de Marca | Evalúan conocimiento base sobre la marca | Hoja 2 |
| Comparativas Generales | Sin nombrar competidor específico | Hoja 3 |
| Comparativas por Competidor | Head-to-head vs cada competidor | Hoja 4 |
| Preguntas Comerciales | Usuario genérico buscando producto/servicio | Hoja 5 |
| Preguntas Transaccionales | Usuario ya interesado en la marca | Hoja 6 |
| Plantilla de Evaluación | Métricas y guía de scoring | Hoja 7 |

### 3.2 Volumen de Preguntas

> ⚠️ **PRINCIPIO FUNDAMENTAL:** El volumen NO tiene límites rígidos. Una batería puede tener 300, 500 o 1000 preguntas - **tantas como sean necesarias** para cubrir completamente el territorio de evaluación.

#### Guía orientativa por categoría:

| Categoría | Orientación | Factores que aumentan el volumen |
|-----------|-------------|----------------------------------|
| Directas de Marca | 40-80 | Marca con muchos productos/servicios, USPs múltiples |
| Comparativas Generales | 20-40 | Mercado fragmentado, múltiples segmentos |
| Comparativas por Competidor | 8-15 por competidor | Más dimensiones de comparación, más competidores |
| Comerciales | 25-40 | Múltiples casos de uso, segmentos de usuario |
| Transaccionales | 25-50 | Funnel de compra complejo, múltiples productos |
| Específicas por Modelo/Producto | Variable | Depende del catálogo de la marca |

#### Qué determina el volumen adecuado:

1. **Complejidad del sector:** Automoción con múltiples modelos > SaaS con un solo producto
2. **Número de competidores:** Más competidores = más comparativas
3. **Profundidad del USP:** Diferenciadores complejos requieren más preguntas
4. **Amplitud del catálogo:** Más productos/servicios = más preguntas específicas
5. **Diversidad de usuarios:** Múltiples perfiles = variaciones de tono e intención

> 💡 **TIP:** No te preocupes por "demasiadas preguntas". Preocúpate por cubrir completamente el territorio. Es mejor tener 500 preguntas relevantes que 250 con huecos de cobertura.

---

## 4. Proceso de Creación Paso a Paso

### PASO 1: Investigación Inicial (2-4 horas)

Antes de escribir una sola pregunta, recopila información:

#### 1.1 Sobre la marca:
- ¿Qué productos/servicios ofrece?
- ¿Cuál es su propuesta de valor única (USP)?
- ¿Cuáles son sus fortalezas reconocidas?
- ¿Qué debilidades o críticas comunes tiene?
- ¿Ha tenido problemas regulatorios, legales o de PR?
- ¿En qué mercados geográficos opera?

#### 1.2 Sobre el sector:
- ¿Quiénes son los competidores directos?
- ¿Cómo se segmenta el mercado?
- ¿Qué aspectos son más importantes para los compradores?
- ¿Hay regulaciones específicas del sector?
- ¿Cuáles son las tendencias actuales?

#### 1.3 Fuentes de investigación:
- **Reddit:** subreddits relevantes del sector (opiniones reales)
- **Foros especializados** del sector
- **Google "People Also Ask"** (PAA)
- **Reviews** en Trustpilot, G2, Capterra, etc.
- **Noticias recientes** sobre la marca
- **Competidores:** sus webs, sus claims, sus comparativas

> ⚠️ **IMPORTANTE:** Reddit y foros son oro puro. Aquí es donde los usuarios expresan sus verdaderas preocupaciones, no las que los marketers creen que tienen.

---

### PASO 2: Definición de Competidores (1-2 horas)

La selección de competidores es crítica. Sigue este proceso:

#### 2.1 Criterios de inclusión:
1. Opera en el mismo mercado geográfico
2. Ofrece productos/servicios similares
3. Compite por los mismos clientes
4. Tiene presencia suficiente para ser mencionado por LLMs

#### 2.2 Criterios de exclusión (documentar siempre):
- No opera legalmente en el mercado (sin licencia, offshore)
- Escala muy diferente (demasiado pequeño o demasiado grande)
- Categoría diferente (ej: proveedor de juegos vs plataforma)
- No es competencia directa (ej: afiliado vs operador)

> 💡 **TIP:** Siempre documenta POR QUÉ excluyes un competidor potencial. Esto evita cuestionamientos posteriores.

#### 📝 EJEMPLO: Competidores - Betfair España

```
INCLUIDOS (con licencia DGOJ):
• Bet365 - Líder del mercado online
• Codere - Marca española histórica
• Sportium - Joint venture Ladbrokes-Cirsa
• William Hill - Operador británico con presencia

EXCLUIDOS (justificación):
• Pinnacle - Sin licencia DGOJ, no opera legalmente
• Casinos online - No son sportsbooks, categoría diferente
```

---

### PASO 3: Definición de Subcategorías (1 hora)

Las subcategorías organizan las preguntas directas de marca y deben adaptarse al sector:

#### 📝 EJEMPLO: Subcategorías - Sector Betting

```
• Confianza y Reputación (trust, seguridad, licencias)
• Cuotas y Valor (odds, value, promotions)
• Deportes y Mercados (cobertura, sports, events)
• Funcionalidad Única (exchange, lay betting, trading)
• Experiencia de Usuario (app, web, usability)
• Pagos (deposits, withdrawals, methods)
• Promociones (bonuses, offers, loyalty)
• Atención al Cliente (support, contact)
• Juego Responsable (limits, self-exclusion)
```

#### 📝 EJEMPLO: Subcategorías - Sector Automoción

```
• Fiabilidad y Reputación
• Diseño y Estética
• Tecnología y Conectividad
• Seguridad (Euro NCAP, ADAS)
• Motorización (eléctrico, híbrido, gasolina)
• Autonomía y Carga (para EVs)
• Relación Calidad-Precio
• Garantía y Servicio Postventa
• Experiencia de Conducción
```

---

### PASO 4: Redacción de Preguntas (4-8 horas)

Este es el paso más importante y que más tiempo consume.

> ⚠️ **REGLA DE ORO:** Cada pregunta debe sonar como algo que un usuario REAL escribiría en ChatGPT, no como una keyword de SEO.

#### 4.1 Principios de redacción:
- Usar lenguaje natural y coloquial
- Incluir variaciones de la misma intención
- Mezclar preguntas largas y cortas
- Incluir errores ortográficos comunes (opcional)
- Adaptar al mercado local (expresiones, referencias)

#### 4.2 Variaciones de una misma intención:

**📝 EJEMPLO: Intención "¿Es la marca confiable?"**

```
• ¿Es [marca] fiable?
• ¿Es [marca] de confianza?
• ¿Puedo fiarme de [marca]?
• ¿Es seguro usar [marca]?
• ¿[Marca] es legítimo?
• ¿[Marca] es un scam?
• ¿Me puedo fiar de [marca]?
• ¿Qué tan confiable es [marca]?
```

---

### PASO 5: Organización y Numeración (1 hora)

Una vez redactadas las preguntas, organiza:

1. Numera todas las preguntas secuencialmente
2. Agrupa por categoría/subcategoría
3. Verifica que no haya duplicados
4. Equilibra el volumen entre categorías

---

### PASO 6: Revisión y Validación (1-2 horas)

Antes de entregar, verifica:

- ¿Cubren todas las etapas del funnel?
- ¿Incluyen la propuesta de valor única de la marca?
- ¿Están adaptadas al mercado geográfico?
- ¿Suenan naturales, como las haría un usuario real?
- ¿Incluyen tanto preguntas favorables como desfavorables?
- ¿Los competidores están todos incluidos en comparativas?

---

## 5. Herramientas de Investigación

Esta sección documenta las herramientas disponibles para realizar la investigación previa a la creación de baterías y cómo utilizarlas de forma efectiva.

### 5.1 Herramientas Disponibles

| Herramienta | Función | Uso Principal |
|-------------|---------|---------------|
| **WebSearch** | Búsqueda web en tiempo real | Encontrar fuentes, competidores, noticias, discusiones |
| **WebFetch** | Extracción de contenido de URLs | Leer páginas específicas, reviews, foros, artículos |

### 5.2 Estrategias de Búsqueda por Fuente

#### 5.2.1 Reddit (Opiniones Reales de Usuarios)

Reddit es **oro puro** para entender las preocupaciones reales de los usuarios. Queries recomendadas:

```
[marca] site:reddit.com
[marca] vs site:reddit.com
best [producto] site:reddit.com
[marca] problems site:reddit.com
[marca] review site:reddit.com
r/[subreddit del sector] [marca]
```

**Subreddits útiles por sector:**

| Sector | Subreddits |
|--------|------------|
| Betting | r/sportsbook, r/betting, r/gambling |
| Automoción | r/cars, r/electricvehicles, r/whatcarshouldibuy |
| SaaS B2B | r/startups, r/entrepreneur, r/saas |
| Finanzas | r/personalfinance, r/investing, r/CreditCards |
| Gaming | r/gaming, r/pcgaming, r/games |

#### 5.2.2 Reviews y Opiniones

**B2C:**
```
[marca] site:trustpilot.com
[marca] reviews
[marca] opiniones
[marca] quejas
[marca] problemas
```

**B2B:**
```
[marca] site:g2.com
[marca] site:capterra.com
[marca] site:trustradius.com
[marca] review enterprise
```

#### 5.2.3 Google People Also Ask (PAA)

Buscar queries genéricas del sector para descubrir preguntas reales:

```
best [producto] [año]
[producto] vs
is [marca] good
[marca] worth it
[producto] comparison
```

> 💡 **TIP:** Los resultados de PAA revelan exactamente qué preguntas hacen los usuarios reales. Úsalas como base para tus preguntas.

#### 5.2.4 Noticias y PR

```
[marca] news [año]
[marca] lawsuit
[marca] fine
[marca] controversy
[marca] acquisition
[marca] funding (para startups)
```

#### 5.2.5 Competidores

```
[marca] competitors
[marca] alternatives
companies like [marca]
[marca] vs [competidor]
best [producto] companies
```

### 5.3 Workflow de Investigación Recomendado

```
FASE 1: Descubrimiento (WebSearch)
├── Buscar marca + sector para contexto general
├── Identificar competidores principales
├── Encontrar subreddits y foros relevantes
└── Localizar fuentes de reviews del sector

FASE 2: Profundización (WebFetch)
├── Leer threads de Reddit más relevantes
├── Extraer reviews de Trustpilot/G2
├── Analizar páginas de competidores
└── Revisar noticias recientes

FASE 3: Síntesis
├── Listar pain points recurrentes
├── Identificar lenguaje natural de usuarios
├── Mapear competidores verificados
└── Documentar USP y diferenciadores
```

### 5.4 Ejemplos de Queries por Sector

#### Betting (B2C)
```
WebSearch: "best betting site UK 2026 site:reddit.com"
WebSearch: "betfair vs bet365 reddit"
WebSearch: "betfair site:trustpilot.com"
WebSearch: "betting exchange problems"
WebFetch: [URL de thread de Reddit relevante]
```

#### Automoción (B2C)
```
WebSearch: "KIA EV6 problems site:reddit.com"
WebSearch: "KIA reliability 2026"
WebSearch: "KIA vs Toyota reddit"
WebSearch: "best electric SUV 2026"
WebFetch: [URL de review en medio especializado]
```

#### iGaming B2B
```
WebSearch: "best iGaming platform provider 2026"
WebSearch: "BetConstruct vs EveryMatrix"
WebSearch: "iGaming CMS comparison site:g2.com"
WebSearch: "BetConstruct review operator"
WebFetch: [URL de comparativa en medio B2B]
```

### 5.5 Qué Extraer de Cada Fuente

| Fuente | Qué Extraer |
|--------|-------------|
| **Reddit** | Quejas reales, comparaciones naturales, jerga del sector, preguntas frecuentes |
| **Trustpilot/G2** | Pain points, puntos fuertes mencionados, triggers negativos |
| **Noticias** | Problemas de PR, multas, adquisiciones, cambios importantes |
| **Webs competidores** | Claims de marketing, diferenciadores, precios |
| **Foros especializados** | Preguntas técnicas, comparativas detalladas |

> ⚠️ **IMPORTANTE:** El objetivo NO es copiar preguntas literalmente, sino entender el LENGUAJE y las PREOCUPACIONES reales de los usuarios para crear preguntas naturales.

---

## 6. Identificación de Competidores

### 6.1 Número Óptimo de Competidores

| Tamaño del mercado | Nº Competidores | Justificación |
|--------------------|-----------------|---------------|
| Mercado pequeño/nicho | 5-8 | Pocos jugadores relevantes |
| Mercado medio | 8-12 | Balance entre cobertura y manejabilidad |
| Mercado grande/fragmentado | 12-15 | Máximo manejable sin perder foco |

### 6.2 Tipos de Competidores a Incluir

- **Líder del mercado:** El competidor #1 que define el estándar
- **Competidores directos:** Misma categoría, mismo target
- **Competidores aspiracionales:** Marcas premium a las que se compara
- **Competidores alternativos:** Ofrecen solución diferente al mismo problema
- **Disruptores:** Nuevos entrantes que están cambiando el mercado

### 6.3 Proceso de Validación

Para cada competidor potencial, verifica:

1. ¿Aparece en búsquedas de Google para keywords principales?
2. ¿Es mencionado en Reddit/foros cuando se pregunta por alternativas?
3. ¿Tiene presencia suficiente para que los LLMs lo conozcan?
4. ¿Compite realmente por los mismos clientes?

---

## 7. Categorías de Preguntas

### 7.1 Preguntas Directas de Marca

**Objetivo:** Extraer lo que el LLM "sabe" sobre la marca específica.

#### Características:
- Siempre mencionan la marca en la pregunta
- Evalúan diferentes aspectos del conocimiento
- Incluyen tanto aspectos positivos como potenciales negativos

#### 📝 EJEMPLO: Preguntas Directas - Formatos

```
CONFIANZA:
• ¿Es [marca] fiable?
• ¿Es seguro usar [marca]?
• ¿Qué reputación tiene [marca]?

PRODUCTO:
• ¿Qué productos ofrece [marca]?
• ¿Es bueno el [producto] de [marca]?
• ¿Qué características tiene [producto] de [marca]?

DEBILIDADES (necesarias para detectar narrativas negativas):
• ¿Tiene problemas [marca]?
• ¿Hay quejas sobre [marca]?
• ¿Qué desventajas tiene [marca]?
```

---

### 7.2 Preguntas Comparativas Generales

**Objetivo:** Ver si la marca aparece cuando el usuario NO la menciona.

#### Características:
- NO mencionan ninguna marca específica
- Son preguntas genéricas de categoría
- Simulan el inicio del customer journey

#### 📝 EJEMPLO: Comparativas Generales - Formatos

```
MEJORES:
• ¿Cuál es el mejor [producto] en [mercado]?
• ¿Cuáles son los mejores [productos] de [año]?
• ¿Qué [producto] me recomiendas?

POR ATRIBUTO:
• ¿Cuál es el [producto] con mejor [atributo]?
• ¿Qué [producto] tiene la mejor [característica]?

POR SEGMENTO:
• ¿Cuál es el mejor [producto] para [segmento]?
• ¿Qué [producto] es mejor para [necesidad]?
```

> ⚠️ **IMPORTANTE:** Estas preguntas son CRÍTICAS. Si la marca no aparece aquí, el usuario nunca sabrá que existe.

---

### 7.3 Preguntas Comparativas por Competidor

**Objetivo:** Comparación directa head-to-head con cada competidor.

#### Estructura multiplicativa:
```
N competidores × M dimensiones = Total de preguntas
```

#### Dimensiones estándar (adaptar según sector):

| Dimensión | Ejemplo de pregunta |
|-----------|---------------------|
| General/Overall | ¿Qué es mejor, [marca] o [competidor]? |
| Precio/Valor | ¿Quién tiene mejor relación calidad-precio, [marca] o [competidor]? |
| Producto/Funcionalidades | ¿Quién tiene más funcionalidades, [marca] o [competidor]? |
| Servicio/Soporte | ¿Quién tiene mejor atención al cliente, [marca] o [competidor]? |
| Para caso de uso específico | ¿Quién es mejor para [uso], [marca] o [competidor]? |

#### 📝 EJEMPLO: Matriz Comparativa - Betting

```
Competidores: Bet365, William Hill, Codere (3)
Dimensiones: Overall, Cuotas, App, Fútbol, Promociones (5)

Total: 3 × 5 = 15 preguntas por formato

Si usamos 2 formatos por dimensión:
Total: 3 × 5 × 2 = 30 preguntas
```

---

### 7.4 Preguntas Comerciales

**Objetivo:** Simular un usuario genérico buscando solución, sin conocimiento previo de la marca.

#### Características:
- Usuario no conoce la marca
- Busca solución a un problema/necesidad
- Está en etapa de exploración

#### 📝 EJEMPLO: Preguntas Comerciales - Formatos

```
NECESIDAD GENÉRICA:
• Quiero [hacer algo], ¿qué me recomiendas?
• Busco [producto] para [necesidad], ¿cuál es mejor?
• Necesito [solución], ¿por dónde empiezo?

CONTEXTO ESPECÍFICO:
• Quiero [acción] esta noche, ¿dónde puedo?
• Soy principiante en [área], ¿qué [producto] uso?

CON RESTRICCIÓN:
• Busco [producto] por menos de [precio]
• Quiero [producto] que [restricción específica]
```

---

### 7.5 Preguntas Transaccionales

**Objetivo:** El usuario YA conoce la marca y está evaluando si comprar.

#### Características:
- Mencionan la marca específicamente
- Están en la última etapa del funnel
- Buscan confirmación o descubrir problemas

#### 📝 EJEMPLO: Preguntas Transaccionales - Formatos

```
CONFIRMACIÓN:
• Estoy pensando en comprar [marca], ¿debería?
• ¿Merece la pena [marca]?
• Convénceme de usar [marca]

COMPARACIÓN FINAL:
• Estoy entre [marca] y [competidor], ¿cuál elijo?
• ¿Es [marca] mejor que [competidor] para [mi caso]?

OBJECIONES:
• ¿Qué debería saber antes de comprar [marca]?
• ¿Hay algo malo que deba saber sobre [marca]?
• ¿Cuáles son las desventajas de [marca]?
```

> 💡 **TIP:** Las preguntas transaccionales son las más cercanas a la conversión. Un resultado negativo aquí tiene impacto directo en ventas.

---

## 8. Dimensiones de Evaluación

Las dimensiones son los aspectos específicos que evaluamos en las comparativas.

### 8.1 Dimensiones Universales

Aplican a prácticamente cualquier sector:

- **Overall/General:** Comparación global
- **Precio/Valor:** Relación calidad-precio
- **Calidad:** Del producto o servicio
- **Atención al cliente:** Soporte, servicio post-venta
- **Reputación:** Confianza, fiabilidad

### 8.2 Dimensiones por Sector

| Sector | Dimensiones Específicas |
|--------|-------------------------|
| Betting/Gaming | Cuotas, Mercados, App, Promociones, Streaming, Cash Out |
| Automoción | Seguridad, Diseño, Consumo, Autonomía, Tecnología, Garantía |
| Software B2B | Funcionalidades, Integraciones, Escalabilidad, Compliance, API |
| E-commerce | Envío, Devoluciones, Catálogo, Precios, App móvil |
| Finanzas | Comisiones, Rentabilidad, Seguridad, App, Atención |

### 8.3 Dimensiones según el USP de la Marca

Si la marca tiene un diferenciador único, DEBE haber preguntas específicas sobre él:

#### 📝 EJEMPLO: USP - Betfair Exchange

```
Betfair tiene un diferenciador único: el Exchange (apostar entre usuarios)

Dimensiones específicas a crear:
• Exchange vs Bookmaker tradicional
• Lay betting (apostar en contra)
• Trading deportivo
• Comisiones del Exchange
• Liquidez de mercados

Estas dimensiones son TERRITORIO PROPIO donde afiliados no compiten bien.
```

---

## 9. Redacción de Preguntas Efectivas

### 9.1 El Principio del Usuario Real

> ⚠️ **REGLA DE ORO:** Cada pregunta debe pasar este test: **"¿Un usuario real escribiría esto EXACTAMENTE así en ChatGPT?"**

El tono debe ser como **realmente pregunta la gente**, no como escribe un marketero o un departamento de comunicación corporativa.

### 9.2 Transformación de Tono: Formal → Natural

Este es el error más común y más crítico. Las preguntas deben sonar como conversación real, no como copy de marketing.

#### 📝 EJEMPLOS EXTENSIVOS: Transformación de Tono

| ❌ FORMAL/CORPORATIVO | ✅ NATURAL/COLOQUIAL | Por qué falla el original |
|----------------------|---------------------|---------------------------|
| Is BYD a trustworthy car brand? | Is BYD any good? | Demasiado formal, nadie dice "trustworthy" |
| What are the primary advantages of BYD vehicles? | What's good about BYD cars? | "Primary advantages" es lenguaje de presentación |
| Is BYD a reliable manufacturer for EVs? | Are BYD cars reliable? | Simplificar, directo al grano |
| What distinguishes BYD from competitors? | What makes BYD different? | "Distinguishes" es demasiado formal |
| How does BYD's warranty compare to industry standards? | Is BYD's warranty any good? | Nadie habla de "industry standards" |
| What are customers' main concerns about BYD? | What's the catch with BYD? | Así pregunta la gente de verdad |
| Is purchasing a BYD vehicle recommended? | Should I buy a BYD? | Directo, personal |
| How does BYD perform in safety evaluations? | Is BYD safe? | Simplificar |
| What is the optimal BYD model for urban commuting? | Best BYD for city driving? | Natural, fragmentado |
| Are there documented issues with BYD vehicles? | Any problems with BYD cars? | Como lo diría un amigo |

#### 📝 EJEMPLOS POR MERCADO: UK vs España

**UK English - Natural:**
```
• Is BYD any good?
• What's the deal with BYD?
• BYD - yay or nay?
• Are BYD cars rubbish or decent?
• What's the catch with Chinese EVs?
• Worth getting a BYD Dolphin?
• BYD vs MG - which one's better?
```

**Spanish - Natural:**
```
• ¿BYD está bien o qué?
• ¿Qué tal son los BYD?
• ¿Me compro un BYD o paso?
• ¿Los BYD son fiables o una basura?
• ¿Qué pega tiene BYD?
• ¿Vale la pena el BYD Dolphin?
• ¿BYD o MG, cuál me pillo?
```

### 9.3 Errores Comunes de Redacción

| ❌ MAL | ✅ BIEN | Por qué |
|--------|---------|---------|
| ¿Cuál es la comparativa entre Betfair y Bet365? | ¿Qué es mejor, Betfair o Bet365? | Nadie dice "comparativa" |
| ¿Cuáles son las características del producto X? | ¿Qué tiene el producto X? | Demasiado formal |
| Evalúa la fiabilidad de marca Y | ¿Es fiable marca Y? | Nadie "evalúa" en chat |
| best betting site UK 2026 | ¿Cuál es la mejor casa de apuestas en UK? | No es una keyword, es una pregunta |
| Betfair pros cons | ¿Cuáles son los pros y contras de Betfair? | Pregunta completa, no keywords |

### 9.4 Niveles de Formalidad

Incluir variaciones de formalidad para capturar diferentes perfiles:

#### 📝 EJEMPLO: Niveles de formalidad - misma intención

```
Muy informal: ¿Betfair es buen rollo o qué?
Informal: ¿Qué tal es Betfair?
Neutro: ¿Es Betfair una buena opción?
Formal: ¿Es Betfair una plataforma recomendable?
Muy formal: ¿Cuál es su valoración de Betfair como plataforma de apuestas?
```

### 9.5 Longitud de Preguntas

Mezclar diferentes longitudes:

- **Cortas (3-6 palabras):** ¿Es Betfair fiable?
- **Medias (7-12 palabras):** ¿Qué es mejor para apostar al fútbol, Betfair o Bet365?
- **Largas (13+ palabras):** Estoy pensando en abrir una cuenta en Betfair para apostar a La Liga, ¿me lo recomiendas?

---

## 10. Adaptación por Industria (B2B vs B2C)

### 10.1 Diferencias Fundamentales

| Aspecto | B2C | B2B |
|---------|-----|-----|
| Decisor | Usuario individual | Comité/múltiples stakeholders |
| Ciclo de venta | Corto (minutos a días) | Largo (semanas a meses) |
| Factores clave | Precio, UX, emociones | ROI, compliance, integración |
| Volumen de compra | Muchos clientes, ticket bajo | Pocos clientes, ticket alto |
| Lenguaje | Coloquial, emocional | Técnico, profesional |

### 10.2 Adaptación de Preguntas B2C

#### 📝 EJEMPLO: Preguntas B2C - Betting

```
• ¿Qué casa de apuestas tiene la mejor app?
• ¿Dónde puedo ver partidos gratis y apostar?
• ¿Cuál es el mejor bono de bienvenida?
• Quiero apostar al Madrid esta noche, ¿dónde?
• ¿Merece la pena Betfair o es un rollo?
```

### 10.3 Adaptación de Preguntas B2B

#### 📝 EJEMPLO: Preguntas B2B - Plataforma iGaming

```
• ¿Qué plataforma B2B es mejor para lanzar un casino online?
• ¿BetConstruct cumple con regulaciones de UK y Malta?
• ¿Cuál es el TCO de BetConstruct vs EveryMatrix?
• ¿Qué integraciones de proveedores de juegos tiene BetConstruct?
• ¿Cuánto tiempo tarda el time-to-market con BetConstruct?
```

### 10.4 Categorías Específicas B2B

En B2B añadir estas categorías:

- **Compliance y Seguridad:** Certificaciones, licencias, GDPR
- **Integración:** APIs, conectores, compatibilidad
- **Escalabilidad:** Rendimiento, capacidad, SLA
- **Soporte técnico:** Niveles de soporte, tiempos de respuesta
- **Pricing modelo:** Licencia, revenue share, setup fees

---

## 11. Adaptación por Mercado Geográfico

### 11.1 Elementos a Adaptar

Cuando se replica una batería para otro mercado:

| Elemento | Ejemplo UK → España |
|----------|---------------------|
| Idioma | English → Español |
| Competidores | Bet365, William Hill → Bet365, Codere, Sportium |
| Regulación | UKGC → DGOJ |
| Métodos de pago | PayPal, Debit Card → Bizum, PayPal, Tarjeta |
| Referencias culturales | Premier League, Grand National → La Liga, El Clásico |
| Moneda | £ → € |
| Expresiones locales | Punter, bookmaker → Apostador, casa de apuestas |

### 11.2 NO es Solo Traducción

> ⚠️ **IMPORTANTE:** Una batería traducida literalmente NO funciona. Cada mercado tiene sus propios competidores, referencias culturales y forma de expresarse.

#### 📝 EJEMPLO: Adaptación UK → España - NO literal

```
UK: Which betting site is best for the Grand National?

❌ MAL (traducción literal):
¿Qué casa de apuestas es mejor para el Grand National?

✅ BIEN (adaptación cultural):
¿Qué casa de apuestas es mejor para el Clásico?
¿Qué casa de apuestas es mejor para La Liga?
¿Qué casa de apuestas es mejor para la Champions?
```

### 11.3 Checklist de Adaptación Geográfica

- [ ] ¿Están todos los competidores locales incluidos?
- [ ] ¿Se han eliminado competidores que no operan en el mercado?
- [ ] ¿Las referencias culturales son relevantes localmente?
- [ ] ¿Los métodos de pago son los usados localmente?
- [ ] ¿El lenguaje suena natural para un nativo?
- [ ] ¿Se menciona el regulador local donde aplica?

---

## 12. Sistema de Evaluación y Métricas

### 12.1 Métricas Principales

Para cada pregunta evaluamos:

| Métrica | Valores | Descripción |
|---------|---------|-------------|
| ¿Menciona la marca? | Sí / No | ¿Aparece la marca en la respuesta? |
| Posición | 1º-3º / 4º-6º / 7º+ / No aparece | ¿En qué posición relativa? |
| Tono | Positivo / Neutro / Negativo | ¿Cómo habla de la marca? |
| ¿Recomienda? | Sí / No / N/A | ¿Recomienda explícitamente la marca? |

### 12.2 Sistema de Severidad

Clasificamos los resultados en tres niveles:

| Nivel | Criterio | Acción |
|-------|----------|--------|
| 🔴 CRÍTICO | No menciona cuando debería, narrativa muy negativa, recomienda competidor | Prioridad máxima, acción inmediata |
| 🟡 WARNING | Posición baja (4º-6º), tono neutro cuando debería ser positivo | Monitorizar, plan de mejora |
| 🟢 OPORTUNIDAD | Bien posicionado, tono positivo, recomendado | Mantener, potenciar |

### 12.3 Triggers de Alerta

Palabras que disparan alerta automática:

#### 📝 EJEMPLO: Triggers por categoría

```
SEGURIDAD: scam, fraude, estafa, cuidado, alerta, sospechoso
REGULATORIO: multa, sanción, investigación, ilegal, sin licencia
SERVICIO: quejas, problemas, no responden, mal servicio, denuncia
PRODUCTO: caro, limitado, peor que, anticuado, básico
REPUTACIÓN: polémico, controvertido, dudoso, cuestionable
```

### 12.4 Análisis desde Perspectiva Humana

Además de las métricas objetivas, analizamos:

- ¿Cómo se sentiría un usuario leyendo esta respuesta?
- ¿La respuesta genera confianza o dudas?
- ¿Motiva a comprar o a buscar alternativas?
- ¿El "pero" o "sin embargo" anula lo positivo?

---

## 13. Checklist de Calidad

Antes de entregar una batería, verifica todos estos puntos:

### 13.1 Estructura
- [ ] Tiene hoja de Overview/Resumen
- [ ] Tiene las 5 categorías de preguntas
- [ ] Tiene plantilla de evaluación
- [ ] Todas las preguntas están numeradas
- [ ] No hay preguntas duplicadas

### 13.2 Competidores
- [ ] Lista de competidores verificada y completa
- [ ] Exclusiones justificadas documentadas
- [ ] Todos los competidores tienen preguntas comparativas
- [ ] Número de competidores es manejable (8-15)

### 13.3 Contenido
- [ ] Cubre todas las etapas del funnel
- [ ] Incluye la propuesta de valor única (USP)
- [ ] Mezcla preguntas favorables y desfavorables
- [ ] Incluye preguntas sobre debilidades conocidas
- [ ] Las preguntas suenan naturales

### 13.4 Adaptación
- [ ] Idioma correcto y natural
- [ ] Referencias culturales locales
- [ ] Competidores del mercado específico
- [ ] Reguladores y métodos de pago locales

### 13.5 Volumen y Cobertura
- [ ] Tantas preguntas como sean necesarias (sin límites artificiales)
- [ ] Cobertura completa de todas las etapas del funnel
- [ ] Todos los modelos/productos relevantes tienen preguntas específicas
- [ ] Distribución proporcional entre categorías
- [ ] Suficientes dimensiones en comparativas para cada competidor
- [ ] Variaciones de tono (informal, neutro, directo) en cada categoría

---

## 14. Errores Comunes a Evitar

### 14.1 Errores de Concepción

| Error | Por qué es malo | Solución |
|-------|-----------------|----------|
| Solo preguntas positivas | No detectas narrativas negativas | Incluir preguntas sobre problemas, quejas, desventajas |
| Solo comparativas | Pierdes el diagnóstico de awareness | Incluir directas de marca y comerciales |
| Ignorar el USP | No mides tu diferenciador | Crear categoría específica para el USP |
| Copiar batería de otro sector | Las dimensiones no aplican | Adaptar dimensiones al sector específico |

### 14.2 Errores de Redacción

| Error | Ejemplo malo | Ejemplo correcto |
|-------|--------------|------------------|
| Lenguaje de SEO | best betting odds UK | ¿Qué casa tiene las mejores cuotas en UK? |
| Demasiado formal | ¿Podría evaluar la fiabilidad de...? | ¿Es fiable...? |
| Preguntas compuestas | ¿Es bueno y barato? | ¿Es bueno? + ¿Es barato? (separadas) |
| Sesgo obvio | ¿Por qué es Betfair el mejor? | ¿Es Betfair buena opción? |

### 14.3 Errores de Proceso

- No investigar el sector antes de escribir
- No validar los competidores con el cliente
- Traducir literalmente sin adaptar
- No revisar duplicados
- Entregar sin verificar el checklist

---

## 15. Plantillas y Ejemplos

### 15.1 Plantilla de Hoja Overview

```
BATERÍA DE EVALUACIÓN LLM - [MARCA]

Objetivo: Evaluar el posicionamiento de [MARCA] en las respuestas
         de LLMs (Claude, ChatGPT, Perplexity, Gemini) en [MERCADO]

Categorías:
1. Preguntas Directas Marca
2. Comparativas - General
3. Comparativas - Por Competidor
4. Preguntas Comerciales
5. Preguntas Transaccionales

Competidores Verificados:
[Lista con breve descripción de cada uno]

Excluidos (justificación):
[Lista con razón de exclusión]
```

### 15.2 Plantilla de Evaluación

Columnas obligatorias:

| Columna | Descripción |
|---------|-------------|
| Nº | Número de pregunta |
| Categoría | Tipo de pregunta |
| Pregunta | Texto exacto |
| LLM | Qué modelo se está evaluando |
| ¿Menciona marca? | Sí/No |
| Posición | 1º-3º / 4º-6º / No aparece |
| Tono | Positivo / Neutro / Negativo |
| ¿Recomienda? | Sí / No / N/A |
| Notas | Observaciones adicionales |

### 15.3 Ejemplo de Matriz Comparativa

| Nº | Competidor | Dimensión | Pregunta |
|----|------------|-----------|----------|
| 1 | Bet365 | Overall | ¿Qué es mejor, Betfair o Bet365? |
| 2 | Bet365 | Overall | Betfair vs Bet365: ¿cuál debería elegir? |
| 3 | Bet365 | Cuotas | ¿Quién tiene mejores cuotas, Betfair o Bet365? |
| 4 | Bet365 | App | ¿Quién tiene mejor app, Betfair o Bet365? |
| 5 | William Hill | Overall | ¿Qué es mejor, Betfair o William Hill? |
| ... | ... | ... | ... |

---

## FIN DEL PLAYBOOK

*Para dudas o actualizaciones, contactar al equipo de LLM Control*
