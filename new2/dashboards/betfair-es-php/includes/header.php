<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle ?? SITE_TITLE); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        background: '#0A0A0A',
                        surface: '#141414',
                        border: '#262626',
                        text: '#FAFAFA',
                        'text-muted': '#A1A1A1',
                        critical: '#EF4444',
                        'critical-bg': 'rgba(239, 68, 68, 0.1)',
                        warning: '#F59E0B',
                        'warning-bg': 'rgba(245, 158, 11, 0.1)',
                        opportunity: '#22C55E',
                        'opportunity-bg': 'rgba(34, 197, 94, 0.1)',
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0A0A0A;
            color: #FAFAFA;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</head>
<body class="bg-background text-text min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <!-- Left: Brand logos -->
            <div class="flex items-center gap-4">
                <a href="home.php" class="flex items-center gap-3">
                    <span class="text-lg font-bold text-white">Betfair</span>
                    <span class="hidden text-xs text-text-muted sm:inline">×</span>
                    <span class="hidden text-sm font-medium text-text sm:inline">LLMCtrl</span>
                </a>
            </div>

            <!-- Right: Market badge + Controls -->
            <div class="flex items-center gap-3">
                <!-- Market badge -->
                <span class="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted">
                    🇪🇸 España
                </span>

                <!-- Interamplify -->
                <span class="hidden text-sm font-medium text-text-muted sm:inline">Interamplify</span>

                <!-- Logout -->
                <a href="logout.php" class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface hover:text-text" title="Cerrar sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </a>
            </div>
        </div>
    </header>
