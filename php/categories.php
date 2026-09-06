<?php
// Dhanam Organics - Categories API
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

if ($pdo === null) {
    http_response_code(503);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection not available.'
    ]);
    exit();
}

try {
    $stmt = $pdo->query("
        SELECT c.slug, c.name, c.tamil_name, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.slug = p.category_slug AND p.in_stock >= 0
        GROUP BY c.slug, c.name, c.tamil_name
        ORDER BY c.id ASC
    ");
    $categories = $stmt->fetchAll();

    $stmtTotal = $pdo->query("SELECT COUNT(*) as total FROM products WHERE in_stock >= 0");
    $totalRow = $stmtTotal->fetch();
    $totalCount = (int)$totalRow['total'];

    $result = [
        ['id' => 'all', 'name' => 'All Products', 'tamilName' => 'அனைத்து பொருட்கள்', 'count' => $totalCount]
    ];

    foreach ($categories as $cat) {
        $result[] = [
            'id' => $cat['slug'],
            'name' => $cat['name'],
            'tamilName' => $cat['tamil_name'],
            'count' => (int)$cat['product_count']
        ];
    }

    echo json_encode(['status' => 'success', 'categories' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
