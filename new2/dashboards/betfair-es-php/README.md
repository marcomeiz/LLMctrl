# Betfair ES Dashboard - PHP Version

Dashboard de monitorización de respuestas de LLMs sobre Betfair España.

## Requisitos

- PHP 7.4 o superior
- Servidor web (Apache, Nginx, o PHP built-in server)

## Instalación

1. Copiar todos los archivos a tu servidor web
2. Asegurarse de que la carpeta `data/` tenga permisos de lectura
3. Configurar el servidor web para que apunte a esta carpeta

## Desarrollo Local

Para probar localmente, usar el servidor integrado de PHP:

```bash
cd dashboards/betfair-es-php
php -S localhost:8000
```

Luego abrir http://localhost:8000 en el navegador.

## Credenciales

- **Password:** `llmctrl2026`

## Estructura de Archivos

```
betfair-es-php/
├── index.php           # Redirect inicial
├── login.php           # Página de login
├── logout.php          # Cerrar sesión
├── home.php            # Dashboard principal
├── list.php            # Listado de registros
├── detail.php          # Detalle de registro
├── analysis.php        # Análisis por categoría
├── includes/
│   ├── config.php      # Configuración
│   ├── auth.php        # Funciones de autenticación
│   ├── data.php        # Funciones de carga de datos
│   ├── header.php      # Cabecera HTML
│   ├── footer.php      # Pie de página HTML
│   └── navigation.php  # Navegación
├── data/
│   └── betfair_es_evaluated.json  # Datos del dashboard
└── .htaccess           # Configuración Apache
```

## Actualizar Datos

Para actualizar los datos del dashboard, simplemente reemplazar el archivo:
`data/betfair_es_evaluated.json`

## Características

- Autenticación con contraseña
- Modo oscuro por defecto
- Responsive (móvil y desktop)
- Filtros por clasificación y categoría
- Búsqueda en preguntas, respuestas y triggers
- Vista detallada con triggers completos (nunca truncados)
- Análisis por categoría con gráficos

## Estilos

El dashboard usa Tailwind CSS via CDN. No requiere compilación ni instalación de dependencias.
