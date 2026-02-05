<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';

// If already authenticated, redirect to home
if (isAuthenticated()) {
    header('Location: home.php');
    exit;
}

$error = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if (login($password)) {
        header('Location: home.php');
        exit;
    } else {
        $error = 'Contraseña incorrecta';
    }
}
?>
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo SITE_TITLE; ?></title>
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
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-text min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
        <!-- Logo / Title -->
        <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-text mb-2">LLMCtrl</h1>
            <p class="text-sm text-text-muted">Betfair España Dashboard</p>
        </div>

        <!-- Login Card -->
        <div class="rounded-lg border border-border bg-surface p-6">
            <h2 class="text-lg font-medium text-text mb-4">Iniciar sesión</h2>

            <?php if ($error): ?>
                <div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-text-muted mb-2">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        autofocus
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-text placeholder-text-muted focus:border-text-muted focus:outline-none focus:ring-1 focus:ring-text-muted"
                        placeholder="Introduce la contraseña"
                    >
                </div>

                <button
                    type="submit"
                    class="w-full rounded-lg bg-text px-4 py-2.5 text-sm font-medium text-background hover:bg-text/90 transition-colors"
                >
                    Acceder
                </button>
            </form>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-text-muted mt-6">
            Powered by Interamplify
        </p>
    </div>
</body>
</html>
