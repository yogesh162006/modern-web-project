<?php
// =============================================================================
// Dhanam Organics - Database Installation & Verification Runner
// Run this once via browser or CLI on GoDaddy to create/verify MySQL tables
// =============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if ($pdo === null) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Unable to connect to MySQL database. Please verify credentials in api/config.php.'
    ]));
}

try {
    // 1. Create categories table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(64) NOT NULL UNIQUE,
            name VARCHAR(128) NOT NULL,
            tamil_name VARCHAR(128) NOT NULL,
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 2. Create products table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            tamil_name VARCHAR(255) NOT NULL,
            english_name VARCHAR(255) NOT NULL,
            category_id INT DEFAULT NULL,
            category VARCHAR(128) NOT NULL,
            category_slug VARCHAR(64) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            original_price DECIMAL(10, 2) DEFAULT NULL,
            weight VARCHAR(64) NOT NULL DEFAULT '200g',
            image VARCHAR(255) NOT NULL,
            badge VARCHAR(64) DEFAULT NULL,
            description TEXT,
            tamil_description TEXT,
            ingredients TEXT,
            benefits TEXT,
            usage_instructions TEXT,
            in_stock TINYINT(1) DEFAULT 1,
            is_featured TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_category (category_slug),
            INDEX idx_featured (is_featured),
            INDEX idx_stock (in_stock)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 3. Create admins table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(64) NOT NULL UNIQUE,
            email VARCHAR(128) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            last_login TIMESTAMP NULL DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 4. Seed default admin if missing
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
    $stmt->execute(['admin']);
    if ($stmt->fetchColumn() == 0) {
        $hash = password_hash('dhanam2026', PASSWORD_DEFAULT);
        $insertAdmin = $pdo->prepare("
            INSERT INTO admins (username, email, password_hash)
            VALUES (?, ?, ?)
        ");
        $insertAdmin->execute(['admin', 'admin@dhanamorganics.com', $hash]);
    }

    // 5. Check if schema file exists and execute seed statements if products table is empty
    $count = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    if ($count == 0 && file_exists(__DIR__ . '/schema.sql')) {
        $sql = file_get_contents(__DIR__ . '/schema.sql');
        $pdo->exec($sql);
    }

    // Return success JSON
    echo json_encode([
        'status' => 'success',
        'message' => 'Dhanam Organics MySQL tables and seed data successfully initialized!',
        'total_products' => (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn(),
        'total_categories' => (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn(),
        'admin_user' => 'admin'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database initialization failed: ' . $e->getMessage()
    ]);
}
