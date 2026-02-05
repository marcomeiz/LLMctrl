<?php
/**
 * Authentication functions
 */

/**
 * Check if user is authenticated
 */
function isAuthenticated(): bool {
    return isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;
}

/**
 * Attempt to login with password
 */
function login(string $password): bool {
    if ($password === VALID_PASSWORD) {
        $_SESSION['authenticated'] = true;
        return true;
    }
    return false;
}

/**
 * Logout user
 */
function logout(): void {
    $_SESSION['authenticated'] = false;
    session_destroy();
}

/**
 * Require authentication - redirect to login if not authenticated
 */
function requireAuth(): void {
    if (!isAuthenticated()) {
        header('Location: login.php');
        exit;
    }
}
