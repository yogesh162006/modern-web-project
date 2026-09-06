<?php
// Dhanam Organics - Database Configuration
// Configure these values for your GoDaddy MySQL database in cPanel

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'dhanam_organics');
define('DB_USER', 'dhanam_user');
define('DB_PASS', 'dhanam_password');
define('DB_CHARSET', 'utf8mb4');

// Admin Password for /php/admin.php
define('ADMIN_PASSWORD', 'dhanam2026');

function getDbConnection() {
    static  = null;
    if ( === null) {
         = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
         = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
             = new PDO(, DB_USER, DB_PASS, );
        } catch (PDOException ) {
            // Return null if database is not configured yet
            return null;
        }
    }
    return ;
}
?>
