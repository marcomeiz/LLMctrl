<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/data.php';

requireAuth();

$pageTitle = 'Records - ' . SITE_TITLE;

// Get filter parameters
$searchQuery = $_GET['q'] ?? '';
$classificationFilter = $_GET['classification'] ?? 'ALL';
$categoryFilter = $_GET['category'] ?? 'ALL';

// Get filtered records
$records = searchRecords($searchQuery, $classificationFilter, $categoryFilter);
$totalResults = count($records);

include 'includes/header.php';
include 'includes/navigation.php';
?>

<main class="flex-1 pb-20 sm:pb-6">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <!-- Page title -->
        <div class="mb-6">
            <div class="flex items-center gap-2">
                <h1 class="text-lg font-semibold text-text sm:text-xl">Records</h1>
                <span class="text-lg">🇪🇸</span>
            </div>
            <p class="text-sm text-text-muted">
                <?php echo $totalResults; ?> records found
            </p>
        </div>

        <!-- Filters -->
        <form method="GET" class="mb-6 space-y-4">
            <!-- Search -->
            <div class="relative">
                <input
                    type="text"
                    name="q"
                    value="<?php echo htmlspecialchars($searchQuery); ?>"
                    placeholder="Search in questions, answers or triggers..."
                    class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 text-sm text-text placeholder-text-muted focus:border-text-muted focus:outline-none focus:ring-1 focus:ring-text-muted"
                >
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>

            <!-- Filter buttons -->
            <div class="flex flex-wrap gap-2">
                <!-- Classification filters -->
                <div class="flex gap-1 rounded-lg border border-border p-1">
                    <button type="submit" name="classification" value="ALL" class="rounded px-3 py-1 text-xs font-medium transition-colors <?php echo $classificationFilter === 'ALL' ? 'bg-text text-background' : 'text-text-muted hover:text-text'; ?>">
                        All
                    </button>
                    <button type="submit" name="classification" value="CRITICAL" class="rounded px-3 py-1 text-xs font-medium transition-colors <?php echo $classificationFilter === 'CRITICAL' ? 'bg-red-500 text-white' : 'text-red-500 hover:bg-red-500/10'; ?>">
                        Critical
                    </button>
                    <button type="submit" name="classification" value="WARNING" class="rounded px-3 py-1 text-xs font-medium transition-colors <?php echo $classificationFilter === 'WARNING' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-500/10'; ?>">
                        Warnings
                    </button>
                    <button type="submit" name="classification" value="OPPORTUNITY" class="rounded px-3 py-1 text-xs font-medium transition-colors <?php echo $classificationFilter === 'OPPORTUNITY' ? 'bg-green-500 text-white' : 'text-green-500 hover:bg-green-500/10'; ?>">
                        Opportunities
                    </button>
                </div>

                <!-- Preserve current classification when clicking category -->
                <input type="hidden" name="classification" value="<?php echo htmlspecialchars($classificationFilter); ?>">

                <!-- Category filter -->
                <select name="category" onchange="this.form.submit()" class="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-muted focus:outline-none focus:ring-1 focus:ring-text-muted cursor-pointer">
                    <option value="ALL" <?php echo $categoryFilter === 'ALL' ? 'selected' : ''; ?>>All categories</option>
                    <?php foreach (CATEGORY_NAMES as $id => $name): ?>
                        <option value="<?php echo $id; ?>" <?php echo $categoryFilter == $id ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </form>

        <!-- Records list -->
        <div class="space-y-3">
            <?php if (empty($records)): ?>
                <div class="rounded-lg border border-border bg-surface p-8 text-center">
                    <p class="text-text-muted">No records found</p>
                </div>
            <?php else: ?>
                <?php foreach ($records as $record): ?>
                    <a href="detail.php?id=<?php echo urlencode($record['id']); ?>" class="block rounded-lg border border-border bg-surface p-4 hover:border-text-muted transition-colors">
                        <!-- Question -->
                        <p class="text-sm text-text mb-1 line-clamp-2">
                            <?php echo htmlspecialchars($record['question_text']); ?>
                        </p>
                        <?php if (!empty($record['question_text_en'])): ?>
                            <p class="text-xs text-text-muted/70 italic mb-3 line-clamp-2">
                                <?php echo htmlspecialchars($record['question_text_en']); ?>
                            </p>
                        <?php else: ?>
                            <div class="mb-3"></div>
                        <?php endif; ?>

                        <!-- Meta row -->
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-2 flex-wrap">
                                <?php echo getClassificationBadge($record['classification']); ?>
                                <span class="text-xs text-text-muted">
                                    <?php echo htmlspecialchars($record['category_name']); ?>
                                </span>
                            </div>

                            <!-- Triggers preview -->
                            <?php if (!empty($record['triggers_detected'])): ?>
                                <div class="hidden sm:flex items-center gap-1">
                                    <?php
                                    $triggerCount = count($record['triggers_detected']);
                                    $showTriggers = array_slice($record['triggers_detected'], 0, 2);
                                    foreach ($showTriggers as $trigger):
                                    ?>
                                        <span class="text-xs text-text-muted bg-border/50 px-2 py-0.5 rounded">
                                            <?php echo htmlspecialchars($trigger); ?>
                                        </span>
                                    <?php endforeach; ?>
                                    <?php if ($triggerCount > 2): ?>
                                        <span class="text-xs text-text-muted">
                                            +<?php echo $triggerCount - 2; ?>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <!-- Answer preview -->
                        <p class="text-xs text-text-muted mt-3 line-clamp-2">
                            <?php echo htmlspecialchars($record['answer_preview']); ?>
                        </p>
                    </a>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>
