<?php
/**
 * Configuration file for Betfair ES Dashboard
 */

// Session configuration
session_start();

// Password for authentication
define('VALID_PASSWORD', 'llmctrl2026');

// Site configuration
define('SITE_TITLE', 'LLMCtrl - Betfair España');
define('BASE_URL', '');

// Category names
define('CATEGORY_NAMES', [
    1 => 'Marca',
    2 => 'Comparación General',
    3 => 'Por Competidor',
    4 => 'Comercial',
    5 => 'Transaccionales',
    6 => 'Transaccionales'
]);

// Classification colors (for CSS classes)
define('CLASSIFICATION_COLORS', [
    'CRITICAL' => [
        'text' => 'text-red-500',
        'bg' => 'bg-red-500/10',
        'border' => 'border-red-500/20',
        'dot' => 'bg-red-500'
    ],
    'WARNING' => [
        'text' => 'text-amber-500',
        'bg' => 'bg-amber-500/10',
        'border' => 'border-amber-500/20',
        'dot' => 'bg-amber-500'
    ],
    'OPPORTUNITY' => [
        'text' => 'text-green-500',
        'bg' => 'bg-green-500/10',
        'border' => 'border-green-500/20',
        'dot' => 'bg-green-500'
    ]
]);
