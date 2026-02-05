# LLMCtrl - Dashboard de Monitorización de LLMs

Sistema de dashboards para monitorizar y analizar las respuestas de Large Language Models (LLMs) sobre marcas específicas.

## Descripción

LLMCtrl permite visualizar y analizar cómo los principales LLMs (ChatGPT, Gemini, Claude, Perplexity) responden a preguntas relacionadas con una marca. El sistema clasifica las respuestas en tres categorías:

- **CRITICAL**: Respuestas que pueden dañar la reputación de la marca
- **WARNING**: Respuestas con información que requiere atención
- **OPPORTUNITY**: Respuestas favorables o neutrales

## Estructura del Proyecto

```
LLMctrl/
├── dashboards/
│   ├── betfair/              # Dashboard original (UK multi-mercado)
│   ├── betfair-es/           # Dashboard Betfair España (Next.js)
│   └── betfair-es-php/       # Dashboard Betfair España (PHP)
└── README.md
```

## Dashboards Disponibles

### Betfair España (Next.js)
- **Tecnología**: Next.js 16, React, Tailwind CSS
- **URL Producción**: https://betfair-es.vercel.app
- **Ubicación**: `dashboards/betfair-es/`

### Betfair España (PHP)
- **Tecnología**: PHP 7.4+, Tailwind CSS (CDN)
- **Ubicación**: `dashboards/betfair-es-php/`

## Características

- 🔐 Autenticación con contraseña
- 🌙 Modo oscuro por defecto
- 📱 Diseño responsive (móvil y desktop)
- 🔍 Búsqueda y filtros avanzados
- 📊 Análisis por categoría
- 🎯 Triggers detectados con contexto completo
- 🧠 Análisis de impacto psicológico (Interamplify Analysis)

## Inicio Rápido

### Next.js

```bash
cd dashboards/betfair-es
npm install
npm run dev
```

Abrir http://localhost:3000

### PHP

```bash
cd dashboards/betfair-es-php
php -S localhost:8000
```

Abrir http://localhost:8000

## Credenciales

- **Password**: `llmctrl2026`

## Formato de Datos

Los dashboards consumen archivos JSON con el siguiente formato:

```json
{
  "id": 1,
  "question_text": "¿Cuál es la mejor casa de apuestas?",
  "answer": "Respuesta completa del LLM...",
  "category": 1,
  "category_name": "Marca",
  "mention": true,
  "position": 1,
  "ranking_list": ["betfair", "bet365", "codere"],
  "triggers_detected": [
    {
      "trigger": "COMPETITOR_PREFERRED",
      "type": "WARNING",
      "context": "Contexto donde aparece el trigger...",
      "reason": "Razón de la detección"
    }
  ],
  "citations": ["fuente1.com", "fuente2.com"],
  "classification": "WARNING",
  "classification_reason": "Razón de la clasificación",
  "psychological_impact": "Análisis del impacto psicológico..."
}
```

## Categorías

| ID | Nombre |
|----|--------|
| 1 | Marca |
| 2 | Comparación General |
| 3 | Por Competidor |
| 4 | Comercial |
| 5 | Transaccionales |
| 6 | Transaccionales |

## Despliegue

### Vercel (Next.js)

```bash
cd dashboards/betfair-es
vercel --prod
```

### Servidor PHP

Copiar el contenido de `dashboards/betfair-es-php/` a cualquier servidor con PHP 7.4+.

## Arquitectura

El sistema está diseñado para mantener dashboards independientes por marca y mercado:

- Cada dashboard es completamente independiente
- Los cambios en un dashboard no afectan a otros
- Fácil de replicar para nuevas marcas/mercados

## Desarrollo

### Crear nuevo dashboard

1. Copiar el dashboard existente más similar
2. Actualizar el archivo de datos JSON
3. Ajustar textos y configuración según el mercado
4. Desplegar de forma independiente

## Licencia

Propiedad de Interamplify. Todos los derechos reservados.

---

Powered by **Interamplify**
