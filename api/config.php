<?php
// =============================================================================
// Dhanam Organics - API Database & Session Configuration
// Compatible with GoDaddy Shared Hosting (cPanel / Apache / PHP 7.4 - 8.3+)
// =============================================================================

// Start session with secure cookie parameters
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    session_start();
}

// CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =============================================================================
// GoDaddy MySQL Database Credentials
// Update these with your cPanel MySQL Database details
// =============================================================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'dhanam_organics');
define('DB_USER', 'dhanam_user');
define('DB_PASS', 'dhanam_password');
define('DB_CHARSET', 'utf8mb4');

// Default admin fallback credential (if database table not yet populated)
define('DEFAULT_ADMIN_USER', 'admin');
define('DEFAULT_ADMIN_PASS', 'dhanam2026');

/**
 * Returns a singleton PDO database connection.
 * Returns null if the database is not configured or offline.
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('Dhanam Organics DB Connection Error: ' . $e->getMessage());
            return null;
        }
    }
    return $pdo;
}

/**
 * Helper to emit JSON responses and terminate execution.
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit();
}

/**
 * Validates that an active admin session exists.
 * Terminates with 401 Unauthorized if not authenticated.
 */
function requireAdminAuth() {
    if (empty($_SESSION['admin_authenticated']) || empty($_SESSION['admin_user'])) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Unauthorized. Please log in to access the Admin Portal.'
        ], 401);
    }
}
