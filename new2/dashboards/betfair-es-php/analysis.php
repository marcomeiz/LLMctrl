<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/data.php';

requireAuth();

$pageTitle = 'Analysis - ' . SITE_TITLE;
$summary = getSummary();

// Prepare data for chart
$chartData = [];
foreach ($summary['byCategory'] as $catId => $data) {
    $chartData[] = [
        'id' => $catId,
        'name' => CATEGORY_NAMES[$catId] ?? "Categoría $catId",
        'total' => $data['total'],
        'critical' => $data['critical'],
        'warning' => $data['warning'],
        'opportunity' => $data['opportunity']
    ];
}

// Get top triggers for a category
function getTopTriggersForCategory($categoryId) {
    $records = getRecordsByCategory($categoryId);
    $triggerCounts = [];
    foreach ($records as $r) {
        foreach ($r['triggers_detected'] as $t) {
            if (!isset($triggerCounts[$t])) {
                $triggerCounts[$t] = 0;
            }
            $triggerCounts[$t]++;
        }
    }
    arsort($triggerCounts);
    return array_slice($triggerCounts, 0, 5, true);
}

include 'includes/header.php';
include 'includes/navigation.php';
?>

<main class="flex-1 pb-20 sm:pb-6">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <!-- Page title -->
        <div class="mb-6">
            <div class="flex items-center gap-2">
                <h1 class="text-lg font-semibold text-text sm:text-xl">Category Analysis</h1>
                <span class="text-lg">🇪🇸</span>
            </div>
            <p class="text-sm text-text-muted">
                Classification distribution by question type
            </p>
        </div>

        <!-- Chart (simple bar representation with CSS) -->
        <div class="mb-6 rounded-lg border border-border bg-surface p-4 sm:p-6">
            <h2 class="mb-4 text-sm font-medium text-text">Distribution by Category</h2>

            <div class="space-y-4">
                <?php
                $maxTotal = max(array_column($chartData, 'total'));
                foreach ($chartData as $cat):
                    if ($cat['total'] === 0) continue;
                    $totalWidth = ($cat['total'] / $maxTotal) * 100;
                    $criticalWidth = ($cat['critical'] / $cat['total']) * 100;
                    $warningWidth = ($cat['warning'] / $cat['total']) * 100;
                    $opportunityWidth = ($cat['opportunity'] / $cat['total']) * 100;
                ?>
                    <div class="space-y-1">
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-text"><?php echo htmlspecialchars($cat['name']); ?></span>
                            <span class="text-text-muted"><?php echo $cat['total']; ?></span>
                        </div>
                        <div class="h-6 rounded bg-border/30 overflow-hidden" style="width: <?php echo $totalWidth; ?>%">
                            <div class="h-full flex">
                                <?php if ($cat['critical'] > 0): ?>
                                    <div class="h-full bg-red-500" style="width: <?php echo $criticalWidth; ?>%" title="Critical: <?php echo $cat['critical']; ?>"></div>
                                <?php endif; ?>
                                <?php if ($cat['warning'] > 0): ?>
                                    <div class="h-full bg-amber-500" style="width: <?php echo $warningWidth; ?>%" title="Warning: <?php echo $cat['warning']; ?>"></div>
                                <?php endif; ?>
                                <?php if ($cat['opportunity'] > 0): ?>
                                    <div class="h-full bg-green-500" style="width: <?php echo $opportunityWidth; ?>%" title="Opportunity: <?php echo $cat['opportunity']; ?>"></div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Legend -->
            <div class="mt-6 flex justify-center gap-4">
                <div class="flex items-center gap-1.5">
                    <span class="h-3 w-3 rounded bg-red-500"></span>
                    <span class="text-xs text-text-muted">Critical</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-3 w-3 rounded bg-amber-500"></span>
                    <span class="text-xs text-text-muted">Warning</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-3 w-3 rounded bg-green-500"></span>
                    <span class="text-xs text-text-muted">Opportunity</span>
                </div>
            </div>
        </div>

        <!-- Category breakdown cards -->
        <div class="space-y-4">
            <?php foreach ($chartData as $cat):
                if ($cat['total'] === 0) continue;
                $categoryRecords = getRecordsByCategory($cat['id']);
                $criticalRecords = array_slice(array_filter($categoryRecords, fn($r) => $r['classification'] === 'CRITICAL'), 0, 3);
                $topTriggers = getTopTriggersForCategory($cat['id']);
            ?>
                <details class="rounded-lg border border-border bg-surface group">
                    <summary class="flex w-full cursor-pointer items-center justify-between p-4 text-left list-none">
                        <div>
                            <h3 class="text-sm font-medium text-text"><?php echo htmlspecialchars($cat['name']); ?></h3>
                            <p class="text-xs text-text-muted"><?php echo $cat['total']; ?> records</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <!-- Quick stats -->
                            <div class="hidden items-center gap-3 sm:flex">
                                <span class="text-xs">
                                    <span class="text-red-500"><?php echo $cat['critical']; ?></span>
                                    <span class="text-text-muted"> critical</span>
                                </span>
                                <span class="text-xs">
                                    <span class="text-amber-500"><?php echo $cat['warning']; ?></span>
                                    <span class="text-text-muted"> warning</span>
                                </span>
                                <span class="text-xs">
                                    <span class="text-green-500"><?php echo $cat['opportunity']; ?></span>
                                    <span class="text-text-muted"> opportunity</span>
                                </span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted transition-transform group-open:rotate-180">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </summary>

                    <div class="border-t border-border p-4">
                        <!-- Stats on mobile -->
                        <div class="mb-4 flex items-center gap-3 sm:hidden">
                            <span class="text-xs">
                                <span class="text-red-500"><?php echo $cat['critical']; ?></span>
                                <span class="text-text-muted"> critical</span>
                            </span>
                            <span class="text-xs">
                                <span class="text-amber-500"><?php echo $cat['warning']; ?></span>
                                <span class="text-text-muted"> warning</span>
                            </span>
                            <span class="text-xs">
                                <span class="text-green-500"><?php echo $cat['opportunity']; ?></span>
                                <span class="text-text-muted"> opportunity</span>
                            </span>
                        </div>

                        <!-- Top triggers -->
                        <?php if (!empty($topTriggers)): ?>
                            <div class="mb-4">
                                <span class="text-xs text-text-muted">Top triggers: </span>
                                <span class="text-xs text-text">
                                    <?php
                                    $triggerParts = [];
                                    foreach ($topTriggers as $t => $c) {
                                        $triggerParts[] = htmlspecialchars($t) . " ($c)";
                                    }
                                    echo implode(', ', $triggerParts);
                                    ?>
                                </span>
                            </div>
                        <?php endif; ?>

                        <!-- Critical records preview -->
                        <?php if (!empty($criticalRecords)): ?>
                            <div class="space-y-2">
                                <span class="text-xs font-medium text-text-muted">
                                    Critical records:
                                </span>
                                <?php foreach ($criticalRecords as $record): ?>
                                    <a href="detail.php?id=<?php echo urlencode($record['id']); ?>" class="block rounded-lg border border-border bg-background p-3 hover:border-text-muted transition-colors">
                                        <p class="text-sm text-text line-clamp-2">
                                            <?php echo htmlspecialchars($record['question_text']); ?>
                                        </p>
                                        <?php if (!empty($record['question_text_en'])): ?>
                                            <p class="mt-1 text-xs text-text-muted/70 italic line-clamp-2">
                                                <?php echo htmlspecialchars($record['question_text_en']); ?>
                                            </p>
                                        <?php endif; ?>
                                        <div class="mt-2 flex items-center gap-2">
                                            <?php echo getClassificationBadge($record['classification']); ?>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>

                        <!-- View all link -->
                        <a href="list.php?category=<?php echo $cat['id']; ?>" class="mt-3 inline-block text-xs text-text-muted hover:text-text">
                            View all <?php echo htmlspecialchars($cat['name']); ?> records →
                        </a>
                    </div>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>
