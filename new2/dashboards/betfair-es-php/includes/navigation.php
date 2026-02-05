<?php
$currentPage = basename($_SERVER['PHP_SELF'], '.php');
?>
<!-- Desktop Navigation -->
<div class="hidden border-b border-border bg-surface sm:block">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6">
        <ul class="flex gap-6">
            <li>
                <a href="home.php" class="inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors <?php echo $currentPage === 'home' ? 'border-text text-text' : 'border-transparent text-text-muted hover:border-text-muted hover:text-text'; ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Resumen
                </a>
            </li>
            <li>
                <a href="list.php" class="inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors <?php echo $currentPage === 'list' ? 'border-text text-text' : 'border-transparent text-text-muted hover:border-text-muted hover:text-text'; ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Registros
                </a>
            </li>
            <li>
                <a href="analysis.php" class="inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors <?php echo $currentPage === 'analysis' ? 'border-text text-text' : 'border-transparent text-text-muted hover:border-text-muted hover:text-text'; ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Análisis
                </a>
            </li>
        </ul>
    </nav>
</div>

<!-- Mobile Navigation (Bottom) -->
<nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface sm:hidden">
    <ul class="flex justify-around">
        <li>
            <a href="home.php" class="flex flex-col items-center gap-1 px-4 py-3 text-xs <?php echo $currentPage === 'home' ? 'text-text' : 'text-text-muted'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Resumen
            </a>
        </li>
        <li>
            <a href="list.php" class="flex flex-col items-center gap-1 px-4 py-3 text-xs <?php echo $currentPage === 'list' ? 'text-text' : 'text-text-muted'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                Registros
            </a>
        </li>
        <li>
            <a href="analysis.php" class="flex flex-col items-center gap-1 px-4 py-3 text-xs <?php echo $currentPage === 'analysis' ? 'text-text' : 'text-text-muted'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Análisis
            </a>
        </li>
    </ul>
</nav>
