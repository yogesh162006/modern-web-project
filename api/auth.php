<?php
// =============================================================================
// Dhanam Organics - Authentication API Endpoint
// Handles Admin Login, Logout, Session Verification & Password Changes
// =============================================================================

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : 'session';
$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// Action: session (Check Authentication Status)
// -----------------------------------------------------------------------------
if ($action === 'session' && $method === 'GET') {
    if (!empty($_SESSION['admin_authenticated']) && !empty($_SESSION['admin_user'])) {
        jsonResponse([
            'status' => 'success',
            'authenticated' => true,
            'user' => $_SESSION['admin_user']
        ]);
    } else {
        jsonResponse([
            'status' => 'success',
            'authenticated' => false,
            'user' => null
        ]);
    }
}

// -----------------------------------------------------------------------------
// Action: login
// -----------------------------------------------------------------------------
if ($action === 'login' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';

    if (empty($username) || empty($password)) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Please provide both username/email and password.'
        ], 400);
    }

    $pdo = getDbConnection();
    $adminData = null;

    if ($pdo !== null) {
        try {
            $stmt = $pdo->prepare("
                SELECT * FROM admins 
                WHERE username = ? OR email = ? 
                LIMIT 1
            ");
            $stmt->execute([$username, $username]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password_hash'])) {
                $adminData = [
                    'id' => (int)$admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email']
                ];

                // Update last login timestamp
                $update = $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
                $update->execute([$admin['id']]);
            }
        } catch (PDOException $e) {
            error_log('Auth DB error: ' . $e->getMessage());
        }
    }

    // Fallback: If DB table not ready, allow default admin credentials
    if ($adminData === null) {
        if (($username === DEFAULT_ADMIN_USER || $username === 'admin@dhanamorganics.com') && $password === DEFAULT_ADMIN_PASS) {
            $adminData = [
                'id' => 1,
                'username' => DEFAULT_ADMIN_USER,
                'email' => 'admin@dhanamorganics.com'
            ];
        }
    }

    if ($adminData !== null) {
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['admin_user'] = $adminData;

        jsonResponse([
            'status' => 'success',
            'message' => 'Authentication successful.',
            'user' => $adminData
        ]);
    } else {
        jsonResponse([
            'status' => 'error',
            'message' => 'Invalid username or password. Please try again.'
        ], 401);
    }
}

// -----------------------------------------------------------------------------
// Action: logout
// -----------------------------------------------------------------------------
if ($action === 'logout' && ($method === 'POST' || $method === 'GET')) {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    jsonResponse([
        'status' => 'success',
        'message' => 'Logged out successfully.'
    ]);
}

// -----------------------------------------------------------------------------
// Action: change_password (Requires Auth)
// -----------------------------------------------------------------------------
if ($action === 'change_password' && $method === 'POST') {
    requireAdminAuth();

    $input = json_decode(file_get_contents('php://input'), true);
    $currentPassword = isset($input['current_password']) ? trim($input['current_password']) : '';
    $newPassword = isset($input['new_password']) ? trim($input['new_password']) : '';

    if (strlen($newPassword) < 6) {
        jsonResponse([
            'status' => 'error',
            'message' => 'New password must be at least 6 characters long.'
        ], 400);
    }

    $pdo = getDbConnection();
    if ($pdo === null) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Database connection unavailable.'
        ], 503);
    }

    $adminId = $_SESSION['admin_user']['id'];
    $stmt = $pdo->prepare("SELECT password_hash FROM admins WHERE id = ?");
    $stmt->execute([$adminId]);
    $existing = $stmt->fetch();

    if ($existing && !password_verify($currentPassword, $existing['password_hash'])) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Current password is incorrect.'
        ], 400);
    }

    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
    $updateStmt->execute([$newHash, $adminId]);

    jsonResponse([
        'status' => 'success',
        'message' => 'Password updated successfully.'
    ]);
}

jsonResponse(['status' => 'error', 'message' => 'Invalid action.'], 404);
