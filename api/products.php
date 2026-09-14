<?php
// =============================================================================
// Dhanam Organics - Products REST API
// Endpoints for Public Catalog & Admin Product Management
// =============================================================================

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Graceful response if database is not configured
if ($pdo === null) {
    http_response_code(503);
    jsonResponse([
        'status' => 'error',
        'message' => 'Database connection not available. Please verify api/config.php.'
    ], 503);
}

try {
    // -------------------------------------------------------------------------
    // GET: Fetch Product List or Single Product
    // -------------------------------------------------------------------------
    if ($method === 'GET') {
        // Fetch single product by ID
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
            $stmt->execute([(int)$_GET['id']]);
            $product = $stmt->fetch();

            if ($product) {
                if (!empty($product['benefits']) && is_string($product['benefits'])) {
                    $product['benefits'] = json_decode($product['benefits'], true) ?: [];
                }
                $product['price'] = (float)$product['price'];
                $product['original_price'] = $product['original_price'] ? (float)$product['original_price'] : null;
                $product['in_stock'] = (bool)$product['in_stock'];
                $product['is_featured'] = (bool)$product['is_featured'];

                jsonResponse(['status' => 'success', 'product' => $product]);
            } else {
                jsonResponse(['status' => 'error', 'message' => 'Product not found.'], 404);
            }
        }

        // Check if admin is requesting full catalog (including hidden products)
        $isAdmin = !empty($_SESSION['admin_authenticated']);
        $includeHidden = isset($_GET['include_hidden']) && $_GET['include_hidden'] === '1' && $isAdmin;

        $query = "SELECT * FROM products WHERE 1=1";
        $params = [];

        // For customers: only show active/in_stock products
        if (!$includeHidden) {
            $query .= " AND in_stock = 1";
        }

        // Category filter
        if (!empty($_GET['category']) && $_GET['category'] !== 'all') {
            $query .= " AND (category_slug = ? OR category = ?)";
            $params[] = $_GET['category'];
            $params[] = $_GET['category'];
        }

        // Search query
        if (!empty($_GET['search'])) {
            $query .= " AND (name LIKE ? OR tamil_name LIKE ? OR english_name LIKE ? OR description LIKE ?)";
            $term = '%' . trim($_GET['search']) . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        // Featured filter
        if (!empty($_GET['featured'])) {
            $query .= " AND is_featured = 1";
        }

        $query .= " ORDER BY is_featured DESC, id ASC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        foreach ($products as &$p) {
            if (!empty($p['benefits']) && is_string($p['benefits'])) {
                $p['benefits'] = json_decode($p['benefits'], true) ?: [];
            }
            $p['price'] = (float)$p['price'];
            $p['original_price'] = $p['original_price'] ? (float)$p['original_price'] : null;
            $p['in_stock'] = (bool)$p['in_stock'];
            $p['is_featured'] = (bool)$p['is_featured'];
        }

        jsonResponse([
            'status' => 'success',
            'total' => count($products),
            'products' => $products
        ]);
    }

    // -------------------------------------------------------------------------
    // POST: Create New Product (Requires Admin Auth)
    // -------------------------------------------------------------------------
    if ($method === 'POST') {
        requireAdminAuth();

        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $name = isset($input['name']) ? trim($input['name']) : '';
        $tamilName = isset($input['tamil_name']) ? trim($input['tamil_name']) : (isset($input['tamilName']) ? trim($input['tamilName']) : '');
        $englishName = isset($input['english_name']) ? trim($input['english_name']) : (isset($input['englishName']) ? trim($input['englishName']) : $name);
        $category = isset($input['category']) ? trim($input['category']) : 'Heritage Podis';
        $categorySlug = isset($input['category_slug']) ? trim($input['category_slug']) : (isset($input['categorySlug']) ? trim($input['categorySlug']) : 'heritage-podis');
        $categoryId = isset($input['category_id']) ? (int)$input['category_id'] : 1;
        $price = isset($input['price']) ? (float)$input['price'] : 0;
        $originalPrice = !empty($input['original_price']) ? (float)$input['original_price'] : (!empty($input['originalPrice']) ? (float)$input['originalPrice'] : null);
        $weight = isset($input['weight']) ? trim($input['weight']) : '200g';
        $image = isset($input['image']) ? trim($input['image']) : './images/products/idli-podi.png';
        $badge = isset($input['badge']) ? trim($input['badge']) : null;
        $description = isset($input['description']) ? trim($input['description']) : '';
        $tamilDescription = isset($input['tamil_description']) ? trim($input['tamil_description']) : (isset($input['tamildescription']) ? trim($input['tamildescription']) : '');
        $ingredients = isset($input['ingredients']) ? trim($input['ingredients']) : '';
        $usageInstructions = isset($input['usage_instructions']) ? trim($input['usage_instructions']) : (isset($input['usage']) ? trim($input['usage']) : '');
        $inStock = isset($input['in_stock']) ? (int)$input['in_stock'] : (isset($input['inStock']) ? (int)$input['inStock'] : 1);
        $isFeatured = isset($input['is_featured']) ? (int)$input['is_featured'] : (isset($input['isFeatured']) ? (int)$input['isFeatured'] : 0);

        // Benefits formatting
        $benefits = isset($input['benefits']) ? $input['benefits'] : [];
        if (is_array($benefits)) {
            $benefitsJson = json_encode(array_values(array_filter($benefits)));
        } else {
            $benefitsJson = json_encode([]);
        }

        if (empty($name) || $price <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Product name and a valid positive price are required.'], 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO products 
            (name, tamil_name, english_name, category_id, category, category_slug, price, original_price, weight, image, badge, description, tamil_description, ingredients, benefits, usage_instructions, in_stock, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name, $tamilName, $englishName, $categoryId, $category, $categorySlug,
            $price, $originalPrice, $weight, $image, $badge, $description,
            $tamilDescription, $ingredients, $benefitsJson, $usageInstructions, $inStock, $isFeatured
        ]);

        $newId = (int)$pdo->lastInsertId();

        jsonResponse([
            'status' => 'success',
            'message' => "Product '{$name}' created successfully.",
            'product_id' => $newId
        ], 201);
    }

    // -------------------------------------------------------------------------
    // PUT: Full Update of Product (Requires Admin Auth)
    // -------------------------------------------------------------------------
    if ($method === 'PUT') {
        requireAdminAuth();

        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($input['id']) ? (int)$input['id'] : 0);

        if ($id <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Invalid product ID.'], 400);
        }

        $name = isset($input['name']) ? trim($input['name']) : '';
        $tamilName = isset($input['tamil_name']) ? trim($input['tamil_name']) : (isset($input['tamilName']) ? trim($input['tamilName']) : '');
        $englishName = isset($input['english_name']) ? trim($input['english_name']) : (isset($input['englishName']) ? trim($input['englishName']) : $name);
        $category = isset($input['category']) ? trim($input['category']) : 'Heritage Podis';
        $categorySlug = isset($input['category_slug']) ? trim($input['category_slug']) : (isset($input['categorySlug']) ? trim($input['categorySlug']) : 'heritage-podis');
        $categoryId = isset($input['category_id']) ? (int)$input['category_id'] : 1;
        $price = isset($input['price']) ? (float)$input['price'] : 0;
        $originalPrice = !empty($input['original_price']) ? (float)$input['original_price'] : (!empty($input['originalPrice']) ? (float)$input['originalPrice'] : null);
        $weight = isset($input['weight']) ? trim($input['weight']) : '200g';
        $image = isset($input['image']) ? trim($input['image']) : '';
        $badge = isset($input['badge']) ? trim($input['badge']) : null;
        $description = isset($input['description']) ? trim($input['description']) : '';
        $tamilDescription = isset($input['tamil_description']) ? trim($input['tamil_description']) : (isset($input['tamildescription']) ? trim($input['tamildescription']) : '');
        $ingredients = isset($input['ingredients']) ? trim($input['ingredients']) : '';
        $usageInstructions = isset($input['usage_instructions']) ? trim($input['usage_instructions']) : (isset($input['usage']) ? trim($input['usage']) : '');
        $inStock = isset($input['in_stock']) ? (int)$input['in_stock'] : (isset($input['inStock']) ? (int)$input['inStock'] : 1);
        $isFeatured = isset($input['is_featured']) ? (int)$input['is_featured'] : (isset($input['isFeatured']) ? (int)$input['isFeatured'] : 0);

        $benefits = isset($input['benefits']) ? $input['benefits'] : [];
        $benefitsJson = is_array($benefits) ? json_encode(array_values(array_filter($benefits))) : json_encode([]);

        $stmt = $pdo->prepare("
            UPDATE products SET 
                name = ?, tamil_name = ?, english_name = ?, category_id = ?, category = ?, category_slug = ?,
                price = ?, original_price = ?, weight = ?, image = ?, badge = ?, description = ?, tamil_description = ?,
                ingredients = ?, benefits = ?, usage_instructions = ?, in_stock = ?, is_featured = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $name, $tamilName, $englishName, $categoryId, $category, $categorySlug,
            $price, $originalPrice, $weight, $image, $badge, $description, $tamilDescription,
            $ingredients, $benefitsJson, $usageInstructions, $inStock, $isFeatured, $id
        ]);

        jsonResponse([
            'status' => 'success',
            'message' => "Product '{$name}' updated successfully."
        ]);
    }

    // -------------------------------------------------------------------------
    // PATCH: Partial Update (Quick Price Edit / Quick Status Toggle)
    // -------------------------------------------------------------------------
    if ($method === 'PATCH') {
        requireAdminAuth();

        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($input['id']) ? (int)$input['id'] : 0);

        if ($id <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Invalid product ID.'], 400);
        }

        // Quick Price Edit
        if (isset($input['price'])) {
            $price = (float)$input['price'];
            if ($price <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Price must be greater than zero.'], 400);
            }
            $stmt = $pdo->prepare("UPDATE products SET price = ? WHERE id = ?");
            $stmt->execute([$price, $id]);
            jsonResponse(['status' => 'success', 'message' => 'Price updated successfully.', 'price' => $price]);
        }

        // Quick Status Toggle (Active / Hidden)
        if (isset($input['in_stock']) || isset($input['inStock'])) {
            $inStock = isset($input['in_stock']) ? (int)$input['in_stock'] : (int)$input['inStock'];
            $stmt = $pdo->prepare("UPDATE products SET in_stock = ? WHERE id = ?");
            $stmt->execute([$inStock, $id]);
            jsonResponse([
                'status' => 'success', 
                'message' => $inStock ? 'Product is now visible.' : 'Product is now hidden.',
                'in_stock' => (bool)$inStock
            ]);
        }

        jsonResponse(['status' => 'error', 'message' => 'No valid fields provided for PATCH.'], 400);
    }

    // -------------------------------------------------------------------------
    // DELETE: Permanently Remove Product (Requires Admin Auth)
    // -------------------------------------------------------------------------
    if ($method === 'DELETE') {
        requireAdminAuth();

        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($id <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Invalid product ID.'], 400);
        }

        $stmt = $pdo->prepare("SELECT name FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $prod = $stmt->fetch();

        if (!$prod) {
            jsonResponse(['status' => 'error', 'message' => 'Product not found.'], 404);
        }

        $deleteStmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $deleteStmt->execute([$id]);

        jsonResponse([
            'status' => 'success',
            'message' => "Product '{$prod['name']}' deleted successfully."
        ]);
    }

    jsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);

} catch (PDOException $e) {
    error_log('Products API Error: ' . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Internal server error.'], 500);
}
