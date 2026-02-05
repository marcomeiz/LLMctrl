<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/data.php';

requireAuth();

$pageTitle = 'Resumen - ' . SITE_TITLE;
$summary = getSummary();
$criticalRecords = array_slice(getRecordsByClassification('CRITICAL'), 0, 5);

include 'includes/header.php';
include 'includes/navigation.php';
?>

<main class="flex-1 pb-20 sm:pb-6">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <!-- Page title -->
        <div class="mb-6">
            <div class="flex items-center gap-2">
                <h1 class="text-lg font-semibold text-text sm:text-xl">Resumen Ejecutivo</h1>
                <span class="text-lg">🇪🇸</span>
            </div>
            <p class="text-sm text-text-muted">
                Monitorización de respuestas de ChatGPT sobre Betfair
            </p>
        </div>

        <!-- Stats Cards -->
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Total -->
            <div class="rounded-lg border border-border bg-surface p-4">
                <p class="text-xs text-text-muted mb-1">Total Registros</p>
                <p class="text-2xl font-bold text-text"><?php echo $summary['total']; ?></p>
            </div>

            <!-- Critical -->
            <div class="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <p class="text-xs text-text-muted mb-1">Críticos</p>
                <p class="text-2xl font-bold text-red-500"><?php echo $summary['critical']; ?></p>
                <p class="text-xs text-text-muted mt-1">
                    <?php echo round(($summary['critical'] / $summary['total']) * 100, 1); ?>% del total
                </p>
            </div>

            <!-- Warning -->
            <div class="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <p class="text-xs text-text-muted mb-1">Advertencias</p>
                <p class="text-2xl font-bold text-amber-500"><?php echo $summary['warning']; ?></p>
                <p class="text-xs text-text-muted mt-1">
                    <?php echo round(($summary['warning'] / $summary['total']) * 100, 1); ?>% del total
                </p>
            </div>

            <!-- Opportunity -->
            <div class="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <p class="text-xs text-text-muted mb-1">Oportunidades</p>
                <p class="text-2xl font-bold text-green-500"><?php echo $summary['opportunity']; ?></p>
                <p class="text-xs text-text-muted mt-1">
                    <?php echo round(($summary['opportunity'] / $summary['total']) * 100, 1); ?>% del total
                </p>
            </div>
        </div>

        <!-- Two columns layout -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Recent Critical -->
            <div class="rounded-lg border border-border bg-surface">
                <div class="flex items-center justify-between border-b border-border p-4">
                    <h2 class="text-sm font-medium text-text">Registros Críticos Recientes</h2>
                    <a href="list.php?classification=CRITICAL" class="text-xs text-text-muted hover:text-text">
                        Ver todos →
                    </a>
                </div>
                <div class="divide-y divide-border">
                    <?php if (empty($criticalRecords)): ?>
                        <div class="p-4 text-sm text-text-muted">
                            No hay registros críticos
                        </div>
                    <?php else: ?>
                        <?php foreach ($criticalRecords as $record): ?>
                            <a href="detail.php?id=<?php echo urlencode($record['id']); ?>" class="block p-4 hover:bg-surface/50 transition-colors">
                                <p class="text-sm text-text mb-2 line-clamp-2">
                                    <?php echo htmlspecialchars($record['question_text']); ?>
                                </p>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <?php echo getClassificationBadge($record['classification']); ?>
                                    <span class="text-xs text-text-muted">
                                        <?php echo htmlspecialchars($record['category_name']); ?>
                                    </span>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Top Triggers -->
            <div class="rounded-lg border border-border bg-surface">
                <div class="flex items-center justify-between border-b border-border p-4">
                    <h2 class="text-sm font-medium text-text">Top Triggers Detectados</h2>
                </div>
                <div class="p-4">
                    <?php if (empty($summary['topTriggers'])): ?>
                        <p class="text-sm text-text-muted">No hay triggers detectados</p>
                    <?php else: ?>
                        <div class="space-y-3">
                            <?php foreach ($summary['topTriggers'] as $trigger => $count): ?>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-text"><?php echo htmlspecialchars($trigger); ?></span>
                                    <span class="text-xs text-text-muted bg-border/50 px-2 py-0.5 rounded">
                                        <?php echo $count; ?>
                                    </span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- LLMs Monitored -->
        <div class="mt-6 rounded-lg border border-border bg-surface p-4">
            <h2 class="text-sm font-medium text-text mb-4">LLMs Monitoreados</h2>
            <div class="flex flex-wrap gap-3">
                <div class="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span class="text-sm text-green-500">ChatGPT</span>
                    <span class="text-xs text-green-500/70">ON</span>
                </div>
                <div class="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                    <span class="w-2 h-2 rounded-full bg-text-muted"></span>
                    <span class="text-sm text-text-muted">Gemini</span>
                    <span class="text-xs text-text-muted">SOON</span>
                </div>
                <div class="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                    <span class="w-2 h-2 rounded-full bg-text-muted"></span>
                    <span class="text-sm text-text-muted">Claude</span>
                    <span class="text-xs text-text-muted">SOON</span>
                </div>
                <div class="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                    <span class="w-2 h-2 rounded-full bg-text-muted"></span>
                    <span class="text-sm text-text-muted">Perplexity</span>
                    <span class="text-xs text-text-muted">SOON</span>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>
