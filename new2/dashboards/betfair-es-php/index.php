<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';

// Redirect based on authentication status
if (isAuthenticated()) {
    header('Location: home.php');
} else {
    header('Location: login.php');
}
exit;
