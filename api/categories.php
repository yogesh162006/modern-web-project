<?php
// =============================================================================
// Dhanam Organics - Categories REST API
// Endpoints for Managing Product Categories with Dependency Validation
// =============================================================================

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($pdo === null) {
    jsonResponse([
        'status' => 'error',
        'message' => 'Database connection not available.'
    ], 503);
}

try {
    // -------------------------------------------------------------------------
    // GET: List All Categories with Product Counts
    // -------------------------------------------------------------------------
    if ($method === 'GET') {
        $stmt = $pdo->query("
            SELECT c.*, COUNT(p.id) AS product_count 
            FROM categories c
            LEFT JOIN products p ON (p.category_id = c.id OR p.category_slug = c.slug)
            GROUP BY c.id
            ORDER BY c.id ASC
        ");
        $categories = $stmt->fetchAll();

        foreach ($categories as &$cat) {
            $cat['id'] = (int)$cat['id'];
            $cat['product_count'] = (int)$cat['product_count'];
            $cat['is_active'] = (bool)$cat['is_active'];
        }

        jsonResponse([
            'status' => 'success',
            'total' => count($categories),
            'categories' => $categories
        ]);
    }

    // -------------------------------------------------------------------------
    // POST: Create New Category (Requires Admin Auth)
    // -------------------------------------------------------------------------
    if ($method === 'POST') {
        requireAdminAuth();

        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $name = isset($input['name']) ? trim($input['name']) : '';
        $tamilName = isset($input['tamil_name']) ? trim($input['tamil_name']) : (isset($input['tamilName']) ? trim($input['tamilName']) : '');
        $slug = isset($input['slug']) ? trim($input['slug']) : '';

        if (empty($name) || empty($tamilName)) {
            jsonResponse(['status' => 'error', 'message' => 'Category name and Tamil name are required.'], 400);
        }

        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        }

        // Check if slug exists
        $check = $pdo->prepare("SELECT COUNT(*) FROM categories WHERE slug = ?");
        $check->execute([$slug]);
        if ($check->fetchColumn() > 0) {
            jsonResponse(['status' => 'error', 'message' => "A category with slug '{$slug}' already exists."], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO categories (name, tamil_name, slug, is_active) VALUES (?, ?, ?, 1)");
        $stmt->execute([$name, $tamilName, $slug]);

        jsonResponse([
            'status' => 'success',
            'message' => "Category '{$name}' created successfully.",
            'category_id' => (int)$pdo->lastInsertId()
        ], 201);
    }

    // -------------------------------------------------------------------------
    // PUT: Rename / Update Category (Requires Admin Auth)
    // -------------------------------------------------------------------------
    if ($method === 'PUT') {
        requireAdminAuth();

        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($input['id']) ? (int)$input['id'] : 0);

        if ($id <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Invalid category ID.'], 400);
        }

        $name = isset($input['name']) ? trim($input['name']) : '';
        $tamilName = isset($input['tamil_name']) ? trim($input['tamil_name']) : (isset($input['tamilName']) ? trim($input['tamilName']) : '');
        $slug = isset($input['slug']) ? trim($input['slug']) : '';

        if (empty($name) || empty($tamilName)) {
            jsonResponse(['status' => 'error', 'message' => 'Category name and Tamil name are required.'], 400);
        }

        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        }

        $stmt = $pdo->prepare("UPDATE categories SET name = ?, tamil_name = ?, slug = ? WHERE id = ?");
        $stmt->execute([$name, $tamilName, $slug, $id]);

        jsonResponse([
            'status' => 'success',
            'message' => "Category '{$name}' updated successfully."
        ]);
    }

    // -------------------------------------------------------------------------
    // DELETE: Delete Category (Requires Admin Auth & Dependency Check)
    // -------------------------------------------------------------------------
    if ($method === 'DELETE') {
        requireAdminAuth();

        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($id <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Invalid category ID.'], 400);
        }

        // Check if category exists
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $cat = $stmt->fetch();

        if (!$cat) {
            jsonResponse(['status' => 'error', 'message' => 'Category not found.'], 404);
        }

        // Dependency check: prevent deleting if products still use this category
        $countStmt = $pdo->prepare("
            SELECT COUNT(*) FROM products 
            WHERE category_id = ? OR category_slug = ? OR category = ?
        ");
        $countStmt->execute([$id, $cat['slug'], $cat['name']]);
        $productCount = (int)$countStmt->fetchColumn();

        if ($productCount > 0) {
            jsonResponse([
                'status' => 'error',
                'message' => "Cannot delete '{$cat['name']}'. There are {$productCount} product(s) assigned to this category. Reassign or delete them first."
            ], 400);
        }

        $del = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $del->execute([$id]);

        jsonResponse([
            'status' => 'success',
            'message' => "Category '{$cat['name']}' deleted successfully."
        ]);
    }

    jsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);

} catch (PDOException $e) {
    error_log('Categories API Error: ' . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Internal server error.'], 500);
}
