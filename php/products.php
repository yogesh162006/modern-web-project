<?php
// Dhanam Organics - Products API
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($pdo === null) {
    // If database connection is not established yet, return 503 so frontend smoothly uses static data
    http_response_code(503);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection not available. Please configure php/config.php.'
    ]);
    exit();
}

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch();
            if ($product) {
                if (!empty($product['benefits'])) {
                    $product['benefits'] = json_decode($product['benefits'], true);
                }
                echo json_encode(['status' => 'success', 'product' => $product]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Product not found']);
            }
            exit();
        }

        $query = "SELECT * FROM products WHERE in_stock >= 0";
        $params = [];

        if (!empty($_GET['category']) && $_GET['category'] !== 'all') {
            $query .= " AND (category_slug = ? OR category = ?)";
            $params[] = $_GET['category'];
            $params[] = $_GET['category'];
        }

        if (!empty($_GET['search'])) {
            $query .= " AND (name LIKE ? OR tamil_name LIKE ? OR english_name LIKE ? OR description LIKE ?)";
            $searchTerm = '%' . $_GET['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (!empty($_GET['featured'])) {
            $query .= " AND is_featured = 1";
        }

        $query .= " ORDER BY is_featured DESC, id ASC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        foreach ($products as &$p) {
            if (!empty($p['benefits'])) {
                $p['benefits'] = json_decode($p['benefits'], true);
            }
            $p['price'] = (float)$p['price'];
            if ($p['original_price']) {
                $p['original_price'] = (float)$p['original_price'];
            }
            $p['in_stock'] = (bool)$p['in_stock'];
            $p['is_featured'] = (bool)$p['is_featured'];
        }

        echo json_encode([
            'status' => 'success',
            'total' => count($products),
            'products' => $products
        ]);
        exit();
    }

    if ($method === 'POST') {
        // Simple auth check via header or body
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['name']) || empty($data['price'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Name and price are required']);
            exit();
        }

        $stmt = $pdo->prepare("
            INSERT INTO products 
            (name, tamil_name, english_name, category, category_slug, price, original_price, weight, image, badge, description, ingredients, benefits, usage_instructions, in_stock, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['name'],
            $data['tamil_name'] ?? $data['name'],
            $data['english_name'] ?? $data['name'],
            $data['category'] ?? 'Heritage Podis',
            $data['category_slug'] ?? 'heritage-podis',
            $data['price'],
            $data['original_price'] ?? null,
            $data['weight'] ?? '200g',
            $data['image'] ?? './images/products/idli-podi.png',
            $data['badge'] ?? null,
            $data['description'] ?? '',
            $data['ingredients'] ?? '',
            json_encode($data['benefits'] ?? []),
            $data['usage_instructions'] ?? '',
            isset($data['in_stock']) ? (int)$data['in_stock'] : 1,
            isset($data['is_featured']) ? (int)$data['is_featured'] : 0
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Product created successfully',
            'id' => $pdo->lastInsertId()
        ]);
        exit();
    }

    if ($method === 'PUT') {
        if (empty($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
            exit();
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("
            UPDATE products SET
                name = COALESCE(?, name),
                tamil_name = COALESCE(?, tamil_name),
                english_name = COALESCE(?, english_name),
                category = COALESCE(?, category),
                category_slug = COALESCE(?, category_slug),
                price = COALESCE(?, price),
                original_price = ?,
                weight = COALESCE(?, weight),
                image = COALESCE(?, image),
                badge = ?,
                description = COALESCE(?, description),
                ingredients = COALESCE(?, ingredients),
                in_stock = COALESCE(?, in_stock),
                is_featured = COALESCE(?, is_featured)
            WHERE id = ?
        ");
        $stmt->execute([
            $data['name'] ?? null,
            $data['tamil_name'] ?? null,
            $data['english_name'] ?? null,
            $data['category'] ?? null,
            $data['category_slug'] ?? null,
            $data['price'] ?? null,
            $data['original_price'] ?? null,
            $data['weight'] ?? null,
            $data['image'] ?? null,
            $data['badge'] ?? null,
            $data['description'] ?? null,
            $data['ingredients'] ?? null,
            isset($data['in_stock']) ? (int)$data['in_stock'] : null,
            isset($data['is_featured']) ? (int)$data['is_featured'] : null,
            $_GET['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Product updated successfully']);
        exit();
    }

    if ($method === 'DELETE') {
        if (empty($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
            exit();
        }
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode(['status' => 'success', 'message' => 'Product deleted successfully']);
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
