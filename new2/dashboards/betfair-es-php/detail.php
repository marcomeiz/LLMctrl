<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/data.php';

requireAuth();

$id = $_GET['id'] ?? '';
$record = getRecordById($id);

if (!$record) {
    header('HTTP/1.0 404 Not Found');
    $pageTitle = 'Not found - ' . SITE_TITLE;
    include 'includes/header.php';
    ?>
    <main class="flex-1 flex items-center justify-center">
        <div class="text-center">
            <p class="text-text-muted mb-4">Record not found</p>
            <a href="list.php" class="text-sm text-text hover:underline">← Back to list</a>
        </div>
    </main>
    <?php
    include 'includes/footer.php';
    exit;
}

$pageTitle = 'Detail - ' . SITE_TITLE;
$nav = getNavigation($id);

include 'includes/header.php';
?>

<main class="flex-1 pb-6">
    <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <!-- Navigation header -->
        <div class="mb-6 flex items-center justify-between">
            <a href="list.php" class="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back</span>
            </a>

            <div class="flex items-center gap-2">
                <?php if ($nav['prev']): ?>
                    <a href="detail.php?id=<?php echo urlencode($nav['prev']); ?>" class="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text" title="Previous">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </a>
                <?php endif; ?>
                <?php if ($nav['next']): ?>
                    <a href="detail.php?id=<?php echo urlencode($nav['next']); ?>" class="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text" title="Next">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                <?php endif; ?>
            </div>
        </div>

        <!-- Main content card -->
        <div class="rounded-lg border border-border bg-surface">
            <!-- Header with classification -->
            <div class="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-6">
                <h1 class="text-base font-medium text-text sm:text-lg">
                    <?php echo htmlspecialchars($record['question_text']); ?>
                </h1>
                <?php echo getClassificationBadge($record['classification']); ?>
            </div>

            <!-- Metadata -->
            <div class="grid gap-4 border-b border-border p-4 sm:grid-cols-2 sm:p-6">
                <div>
                    <span class="text-xs text-text-muted">Category</span>
                    <p class="text-sm font-medium text-text"><?php echo htmlspecialchars($record['category_name']); ?></p>
                </div>
                <div>
                    <span class="text-xs text-text-muted">Brand Mentioned?</span>
                    <p class="text-sm font-medium <?php echo $record['mention'] ? 'text-green-500' : 'text-text-muted'; ?>">
                        <?php echo $record['mention'] ? 'Yes' : 'No'; ?>
                    </p>
                </div>
                <div>
                    <span class="text-xs text-text-muted">Ranking Position</span>
                    <?php
                    $pos = array_search('betfair', array_map('strtolower', $record['ranking_list']));
                    if ($pos !== false):
                    ?>
                        <p class="text-lg font-bold text-green-500">
                            #<?php echo $pos + 1; ?>
                            <span class="text-sm font-normal text-text-muted">of <?php echo count($record['ranking_list']); ?></span>
                        </p>
                    <?php else: ?>
                        <p class="text-sm text-text-muted">Not ranked</p>
                    <?php endif; ?>
                </div>
                <div>
                    <span class="text-xs text-text-muted">Classification Reason</span>
                    <p class="text-sm font-medium text-text"><?php echo htmlspecialchars($record['classification_reason']); ?></p>
                </div>

                <?php if (!empty($record['ranking_list'])): ?>
                    <div class="sm:col-span-2">
                        <span class="text-xs text-text-muted">Full Ranking</span>
                        <div class="mt-2 flex flex-wrap gap-2">
                            <?php foreach ($record['ranking_list'] as $i => $brand): ?>
                                <?php $isBetfair = strtolower($brand) === 'betfair'; ?>
                                <span class="rounded-full border px-3 py-1 text-sm <?php echo $isBetfair ? 'border-green-500 bg-green-500/10 font-medium text-green-500' : 'border-border text-text-muted'; ?>">
                                    <?php echo ($i + 1) . '. ' . htmlspecialchars(ucfirst($brand)); ?>
                                </span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Triggers - FULL CONTEXT, NEVER TRUNCATED -->
            <?php if (!empty($record['triggers_detail'])): ?>
                <div class="border-b border-border p-4 sm:p-6">
                    <h2 class="mb-4 text-sm font-medium text-text">
                        Detected Triggers (<?php echo count($record['triggers_detail']); ?>)
                    </h2>
                    <div class="space-y-4">
                        <?php foreach ($record['triggers_detail'] as $trigger): ?>
                            <?php $isCritical = ($trigger['type'] ?? 'WARNING') === 'CRITICAL'; ?>
                            <div class="rounded-lg border p-4 <?php echo $isCritical ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5'; ?>">
                                <div class="mb-2 flex items-center gap-2">
                                    <?php echo getTriggerPill($trigger['trigger'], $trigger['type'] ?? 'WARNING'); ?>
                                    <span class="text-xs text-text-muted"><?php echo htmlspecialchars($trigger['reason'] ?? ''); ?></span>
                                </div>
                                <!-- FULL CONTEXT - NEVER TRUNCATED -->
                                <p class="text-sm leading-relaxed text-text">
                                    "<?php echo htmlspecialchars($trigger['context'] ?? ''); ?>"
                                </p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Response - ChatGPT style -->
            <div class="border-b border-border p-4 sm:p-6">
                <h2 class="mb-4 text-sm font-medium text-text">ChatGPT Response</h2>
                <div class="rounded-lg border border-border bg-background p-4">
                    <!-- Question -->
                    <div class="mb-4 flex items-start gap-3">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-medium">
                            U
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-text"><?php echo htmlspecialchars($record['question_text']); ?></p>
                        </div>
                    </div>
                    <!-- Answer -->
                    <div class="flex items-start gap-3">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-xs font-medium">
                            AI
                        </div>
                        <div class="flex-1">
                            <div class="prose prose-sm prose-invert max-w-none">
                                <?php echo nl2br(htmlspecialchars($record['answer'])); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Interamplify Analysis -->
            <?php if (!empty($record['psychological_impact'])): ?>
                <div class="border-b border-border p-4 sm:p-6">
                    <div class="rounded-xl border border-border bg-surface">
                        <div class="flex items-center justify-between border-b border-border p-4">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted">
                                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                                    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                                    <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                                    <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                                    <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                                </svg>
                                <h2 class="text-sm font-medium text-text">Interamplify Analysis</h2>
                            </div>
                            <?php
                            $impactLevel = $record['classification'] === 'CRITICAL' ? 'high' : ($record['classification'] === 'WARNING' ? 'medium' : 'low');
                            $impactColor = $impactLevel === 'high' ? 'text-red-500' : ($impactLevel === 'medium' ? 'text-amber-500' : 'text-green-500');
                            $impactLabel = $impactLevel === 'high' ? 'High negative impact' : ($impactLevel === 'medium' ? 'Moderate impact' : 'Positive impact');
                            ?>
                            <div class="flex items-center gap-1.5 text-xs <?php echo $impactColor; ?>">
                                <?php if ($impactLevel === 'high'): ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                                        <polyline points="17 18 23 18 23 12"></polyline>
                                    </svg>
                                <?php elseif ($impactLevel === 'medium'): ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                <?php else: ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                        <polyline points="17 6 23 6 23 12"></polyline>
                                    </svg>
                                <?php endif; ?>
                                <span><?php echo $impactLabel; ?></span>
                            </div>
                        </div>
                        <div class="p-4">
                            <p class="text-sm leading-relaxed text-text-muted">
                                <?php echo htmlspecialchars($record['psychological_impact']); ?>
                            </p>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Citations -->
            <?php if (!empty($record['citations'])): ?>
                <div class="p-4 sm:p-6">
                    <h2 class="mb-3 text-sm font-medium text-text">Cited Sources</h2>
                    <div class="flex flex-wrap gap-2">
                        <?php foreach ($record['citations'] as $citation): ?>
                            <span class="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                <?php echo htmlspecialchars($citation); ?>
                            </span>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>
