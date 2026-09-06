<?php
// Dhanam Organics - Product Management Portal
session_start();
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$message = '';
$error = '';

// Auth Check
if (isset($_POST['login'])) {
    if ($_POST['password'] === ADMIN_PASSWORD) {
        $_SESSION['admin_logged'] = true;
    } else {
        $error = 'Invalid password';
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit();
}

$isLogged = !empty($_SESSION['admin_logged']);

if ($isLogged && $pdo) {
    // Add product
    if (isset($_POST['add_product'])) {
        $name = trim($_POST['name']);
        $tamil_name = trim($_POST['tamil_name']);
        $english_name = trim($_POST['english_name']);
        $category = $_POST['category'];
        $category_slug = ($category === 'Herbal & Wellness') ? 'herbal-wellness' : 'heritage-podis';
        $price = (float)$_POST['price'];
        $original_price = !empty($_POST['original_price']) ? (float)$_POST['original_price'] : null;
        $weight = trim($_POST['weight']) ?: '200g';
        $image = trim($_POST['image']) ?: './images/products/idli-podi.png';
        $badge = trim($_POST['badge']) ?: null;
        $description = trim($_POST['description']);
        $ingredients = trim($_POST['ingredients']);
        $in_stock = isset($_POST['in_stock']) ? 1 : 0;
        $is_featured = isset($_POST['is_featured']) ? 1 : 0;

        $stmt = $pdo->prepare("
            INSERT INTO products 
            (name, tamil_name, english_name, category, category_slug, price, original_price, weight, image, badge, description, ingredients, in_stock, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $tamil_name, $english_name, $category, $category_slug, $price, $original_price, $weight, $image, $badge, $description, $ingredients, $in_stock, $is_featured]);
        $message = "Product '$name' added successfully!";
    }

    // Toggle stock
    if (isset($_GET['toggle_stock'])) {
        $id = (int)$_GET['toggle_stock'];
        $pdo->query("UPDATE products SET in_stock = 1 - in_stock WHERE id = $id");
        header('Location: admin.php');
        exit();
    }

    // Delete product
    if (isset($_GET['delete'])) {
        $id = (int)$_GET['delete'];
        $pdo->query("DELETE FROM products WHERE id = $id");
        header('Location: admin.php');
        exit();
    }

    // Fetch all products
    $products = $pdo->query("SELECT * FROM products ORDER BY id DESC")->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dhanam Organics — Product Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --forest: #1b4332;
            --cream: #faf7f2;
            --border: #e2dcd2;
            --charcoal: #1c1e1b;
            --red: #9b2226;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4efe6; color: var(--charcoal); padding: 24px; }
        .container { max-width: 1100px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: #fff; padding: 18px 24px; border-radius: 8px; border: 1px solid var(--border); }
        .header h1 { font-size: 20px; color: var(--forest); display: flex; align-items: center; gap: 10px; }
        .card { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 24px; margin-bottom: 24px; }
        .grid-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #4a5568; }
        input, select, textarea { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; font-family: inherit; }
        button { background: var(--forest); color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        button:hover { background: #143527; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
        th { background: #faf7f2; font-weight: 600; color: #4a5568; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .badge-instock { background: #def7ec; color: #03543f; }
        .badge-outofstock { background: #fde8e8; color: #9b1c1c; }
        .btn-sm { padding: 4px 10px; font-size: 12px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: 600; }
        .btn-toggle { background: #ebf5ff; color: #1e429f; }
        .btn-delete { background: #fde8e8; color: #9b1c1c; margin-left: 6px; }
        .img-thumb { width: 44px; height: 58px; object-fit: contain; border: 1px solid var(--border); border-radius: 4px; background: #fff; }
        .alert-success { background: #def7ec; color: #03543f; padding: 12px; border-radius: 6px; margin-bottom: 16px; }
        .alert-error { background: #fde8e8; color: #9b1c1c; padding: 12px; border-radius: 6px; margin-bottom: 16px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🌿 Dhanam Organics — Product Portal</h1>
        <?php if ($isLogged): ?>
            <div>
                <a href="../" target="_blank" style="margin-right: 16px; color: var(--forest); text-decoration: none; font-weight: 600;">View Live Store ↗</a>
                <a href="?logout=1" style="color: var(--red); text-decoration: none; font-weight: 600;">Logout</a>
            </div>
        <?php endif; ?>
    </div>

    <?php if (!$isLogged): ?>
        <div class="card" style="max-width: 400px; margin: 40px auto;">
            <h2 style="margin-bottom: 16px; font-size: 18px;">Admin Login</h2>
            <?php if ($error): ?><div class="alert-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
            <form method="POST">
                <div style="margin-bottom: 16px;">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter admin password (dhanam2026)" required>
                </div>
                <button type="submit" name="login" style="width: 100%;">Sign In</button>
            </form>
        </div>
    <?php else: ?>
        <?php if ($message): ?><div class="alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>
        
        <!-- Add Product Form -->
        <div class="card">
            <h2 style="margin-bottom: 16px; font-size: 18px; color: var(--forest);">+ Add New Product</h2>
            <form method="POST">
                <div class="grid-form">
                    <div>
                        <label>Product Display Name</label>
                        <input type="text" name="name" placeholder="e.g. பிரண்டை பொடி • Pirandai Podi" required>
                    </div>
                    <div>
                        <label>Tamil Name</label>
                        <input type="text" name="tamil_name" placeholder="e.g. பிரண்டை பொடி" required>
                    </div>
                    <div>
                        <label>English Name</label>
                        <input type="text" name="english_name" placeholder="e.g. Pirandai Bone Health Podi" required>
                    </div>
                    <div>
                        <label>Category</label>
                        <select name="category">
                            <option value="Heritage Podis">Heritage Podis (பாரம்பரிய பொடிகள்)</option>
                            <option value="Herbal & Wellness">Herbal & Wellness (மூலிகை நலம்)</option>
                        </select>
                    </div>
                    <div>
                        <label>Price (₹)</label>
                        <input type="number" step="1" name="price" placeholder="150" required>
                    </div>
                    <div>
                        <label>Original Price (₹) (Optional Discount)</label>
                        <input type="number" step="1" name="original_price" placeholder="175">
                    </div>
                    <div>
                        <label>Weight / Pack Size</label>
                        <input type="text" name="weight" value="200g" placeholder="200g">
                    </div>
                    <div>
                        <label>Image Path</label>
                        <input type="text" name="image" value="./images/products/pirandai-podi.png" placeholder="./images/products/filename.png">
                    </div>
                    <div>
                        <label>Badge (Optional)</label>
                        <input type="text" name="badge" placeholder="e.g. Bestseller, Fresh Batch">
                    </div>
                </div>
                <div style="margin-bottom: 16px;">
                    <label>Description</label>
                    <textarea name="description" rows="2" placeholder="Rich description of the product, ingredients and tradition..."></textarea>
                </div>
                <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 16px;">
                    <label style="margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="in_stock" value="1" checked style="width: auto;"> In Stock
                    </label>
                    <label style="margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="is_featured" value="1" style="width: auto;"> Feature on Homepage
                    </label>
                </div>
                <button type="submit" name="add_product">+ Save Product to Database</button>
            </form>
        </div>

        <!-- Products List -->
        <div class="card">
            <h2 style="margin-bottom: 16px; font-size: 18px;">Existing Products (<?= count($products) ?>)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Pack</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p): ?>
                    <tr>
                        <td><img src="../<?= htmlspecialchars($p['image']) ?>" class="img-thumb" alt=""></td>
                        <td>
                            <strong><?= htmlspecialchars($p['name']) ?></strong><br>
                            <small style="color: #718096;"><?= htmlspecialchars($p['tamil_name']) ?></small>
                        </td>
                        <td><?= htmlspecialchars($p['category']) ?></td>
                        <td>₹<?= number_format($p['price'], 2) ?></td>
                        <td><?= htmlspecialchars($p['weight']) ?></td>
                        <td>
                            <span class="badge <?= $p['in_stock'] ? 'badge-instock' : 'badge-outofstock' ?>">
                                <?= $p['in_stock'] ? 'In Stock' : 'Out of Stock' ?>
                            </span>
                        </td>
                        <td>
                            <a href="?toggle_stock=<?= $p['id'] ?>" class="btn-sm btn-toggle">Toggle Stock</a>
                            <a href="?delete=<?= $p['id'] ?>" class="btn-sm btn-delete" onclick="return confirm('Delete this product?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
