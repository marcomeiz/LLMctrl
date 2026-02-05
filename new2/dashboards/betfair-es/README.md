# Betfair ES Dashboard - Next.js

Dashboard de monitorización de respuestas de LLMs sobre Betfair España.

## Stack Técnico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Despliegue**: Vercel

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir http://localhost:3000

## Build

```bash
npm run build
```

## Despliegue

```bash
vercel --prod
```

## Estructura

```
betfair-es/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Redirect inicial
│   │   ├── login/page.tsx        # Login
│   │   ├── betfair/
│   │   │   ├── page.tsx          # Home/Dashboard
│   │   │   ├── list/page.tsx     # Listado de registros
│   │   │   ├── detail/[id]/page.tsx  # Detalle
│   │   │   └── analysis/page.tsx # Análisis por categoría
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── ClassificationBadge.tsx
│   │   ├── TriggerPill.tsx
│   │   ├── RecordCard.tsx
│   │   ├── ChatGPTResponse.tsx
│   │   └── ConsumerAnalysis.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   └── data.ts               # Carga y procesamiento de datos
│   └── data/
│       └── spain/
│           └── betfair_es_evaluated.json
├── public/
│   └── logos/
├── package.json
└── README.md
```

## Credenciales

- **Password**: `llmctrl2026` (definido en `AuthContext.tsx`)

## Actualizar Datos

1. Reemplazar `src/data/spain/betfair_es_evaluated.json` con el nuevo archivo
2. Hacer build y desplegar:
   ```bash
   vercel --prod
   ```

## Variables de Entorno

No se requieren variables de entorno para el funcionamiento básico.

## URL Producción

https://betfair-es.vercel.app

---

Powered by **Interamplify**
