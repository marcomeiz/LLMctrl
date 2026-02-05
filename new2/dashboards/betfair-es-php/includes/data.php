<?php
/**
 * Data loading and processing functions
 */

// Cache for records
$_records = null;

/**
 * Load all records from JSON file
 */
function getRecords(): array {
    global $_records;

    if ($_records !== null) {
        return $_records;
    }

    $jsonPath = __DIR__ . '/../data/betfair_es_evaluated.json';
    $jsonContent = file_get_contents($jsonPath);
    $rawData = json_decode($jsonContent, true);

    $_records = array_map(function($r) {
        // Transform triggers_detected from objects to array of trigger names
        $triggersDetail = $r['triggers_detected'] ?? [];
        $triggersNames = array_map(function($t) {
            return $t['trigger'] ?? '';
        }, $triggersDetail);

        return [
            'id' => strval($r['id']),
            'question_text' => $r['question_text'],
            'answer' => $r['answer'],
            'answer_preview' => mb_substr(str_replace("\n", ' ', $r['answer']), 0, 200) . '...',
            'category' => intval($r['category']),
            'category_name' => $r['category_name'],
            'mention' => $r['mention'] ?? false,
            'position' => $r['position'] ?? null,
            'ranking_list' => $r['ranking_list'] ?? [],
            'triggers_detected' => $triggersNames,
            'triggers_detail' => $triggersDetail,
            'citations' => $r['citations'] ?? [],
            'classification' => $r['classification'],
            'classification_reason' => $r['classification_reason'] ?? '',
            'psychological_impact' => $r['psychological_impact'] ?? ''
        ];
    }, $rawData);

    return $_records;
}

/**
 * Get record by ID
 */
function getRecordById(string $id): ?array {
    $records = getRecords();
    foreach ($records as $record) {
        if ($record['id'] === $id) {
            return $record;
        }
    }
    return null;
}

/**
 * Get records by classification
 */
function getRecordsByClassification(string $classification): array {
    $records = getRecords();
    return array_filter($records, function($r) use ($classification) {
        return $r['classification'] === $classification;
    });
}

/**
 * Get records by category
 */
function getRecordsByCategory(int $categoryId): array {
    $records = getRecords();
    return array_values(array_filter($records, function($r) use ($categoryId) {
        return $r['category'] === $categoryId;
    }));
}

/**
 * Search records with filters
 */
function searchRecords(string $query = '', string $classification = 'ALL', $category = 'ALL'): array {
    $records = getRecords();
    $filtered = $records;

    // Filter by classification
    if ($classification !== 'ALL') {
        $filtered = array_filter($filtered, function($r) use ($classification) {
            return $r['classification'] === $classification;
        });
    }

    // Filter by category
    if ($category !== 'ALL') {
        $catId = intval($category);
        $filtered = array_filter($filtered, function($r) use ($catId) {
            return $r['category'] === $catId;
        });
    }

    // Filter by search query
    if (trim($query) !== '') {
        $q = mb_strtolower($query);
        $filtered = array_filter($filtered, function($r) use ($q) {
            if (mb_strpos(mb_strtolower($r['question_text']), $q) !== false) return true;
            if (mb_strpos(mb_strtolower($r['answer']), $q) !== false) return true;
            foreach ($r['triggers_detected'] as $t) {
                if (mb_strpos(mb_strtolower($t), $q) !== false) return true;
            }
            return false;
        });
    }

    return array_values($filtered);
}

/**
 * Get summary statistics
 */
function getSummary(): array {
    $records = getRecords();
    $total = count($records);

    $critical = count(array_filter($records, fn($r) => $r['classification'] === 'CRITICAL'));
    $warning = count(array_filter($records, fn($r) => $r['classification'] === 'WARNING'));
    $opportunity = count(array_filter($records, fn($r) => $r['classification'] === 'OPPORTUNITY'));

    // By category
    $byCategory = [];
    for ($i = 1; $i <= 6; $i++) {
        $catRecords = array_filter($records, fn($r) => $r['category'] === $i);
        $byCategory[$i] = [
            'total' => count($catRecords),
            'critical' => count(array_filter($catRecords, fn($r) => $r['classification'] === 'CRITICAL')),
            'warning' => count(array_filter($catRecords, fn($r) => $r['classification'] === 'WARNING')),
            'opportunity' => count(array_filter($catRecords, fn($r) => $r['classification'] === 'OPPORTUNITY'))
        ];
    }

    // Top triggers
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
    $topTriggers = array_slice($triggerCounts, 0, 10, true);

    return [
        'total' => $total,
        'critical' => $critical,
        'warning' => $warning,
        'opportunity' => $opportunity,
        'byCategory' => $byCategory,
        'topTriggers' => $topTriggers
    ];
}

/**
 * Get previous and next record IDs for navigation
 */
function getNavigation(string $currentId): array {
    $records = getRecords();
    $currentIndex = -1;

    foreach ($records as $index => $record) {
        if ($record['id'] === $currentId) {
            $currentIndex = $index;
            break;
        }
    }

    return [
        'prev' => $currentIndex > 0 ? $records[$currentIndex - 1]['id'] : null,
        'next' => $currentIndex < count($records) - 1 ? $records[$currentIndex + 1]['id'] : null
    ];
}

/**
 * Get classification badge HTML
 */
function getClassificationBadge(string $classification): string {
    $colors = CLASSIFICATION_COLORS[$classification] ?? CLASSIFICATION_COLORS['WARNING'];
    $labels = [
        'CRITICAL' => 'Crítico',
        'WARNING' => 'Advertencia',
        'OPPORTUNITY' => 'Oportunidad'
    ];
    $label = $labels[$classification] ?? $classification;

    return sprintf(
        '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium %s %s">
            <span class="w-1.5 h-1.5 rounded-full %s"></span>
            %s
        </span>',
        $colors['bg'],
        $colors['text'],
        $colors['dot'],
        htmlspecialchars($label)
    );
}

/**
 * Get trigger pill HTML
 */
function getTriggerPill(string $trigger, string $type = 'WARNING'): string {
    $colors = $type === 'CRITICAL'
        ? 'bg-red-500/10 text-red-500 border-red-500/20'
        : 'bg-amber-500/10 text-amber-500 border-amber-500/20';

    return sprintf(
        '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border %s">%s</span>',
        $colors,
        htmlspecialchars($trigger)
    );
}
