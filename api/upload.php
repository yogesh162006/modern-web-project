<?php
// =============================================================================
// Dhanam Organics - Image Upload API Endpoint
// Handles Secure Product Image Uploads to /uploads/products/
// =============================================================================

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errorMsg = 'No file uploaded or upload error occurred.';
    if (isset($_FILES['image'])) {
        switch ($_FILES['image']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMsg = 'The uploaded file exceeds the maximum allowed size (5MB).';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMsg = 'The file was only partially uploaded.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMsg = 'No file was selected for upload.';
                break;
        }
    }
    jsonResponse(['status' => 'error', 'message' => $errorMsg], 400);
}

$file = $_FILES['image'];

// 1. Validate file size (max 5 MB)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    jsonResponse(['status' => 'error', 'message' => 'Image file size must be less than 5MB.'], 400);
}

// 2. Validate MIME type
$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/jpg'  => 'jpg'
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!array_key_exists($mime, $allowedMimes)) {
    jsonResponse([
        'status' => 'error', 
        'message' => 'Invalid image format. Supported formats are JPG, JPEG, PNG, and WebP.'
    ], 400);
}

$extension = $allowedMimes[$mime];

// 3. Define target directory: uploads/products/ relative to web root
$uploadDir = dirname(__DIR__) . '/uploads/products/';

if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        jsonResponse([
            'status' => 'error', 
            'message' => 'Failed to create upload destination directory on server.'
        ], 500);
    }
}

// 4. Generate clean sanitized filename with random token
$randomToken = bin2hex(random_bytes(8));
$safeFilename = 'product_' . date('Ymd_His') . '_' . $randomToken . '.' . $extension;
$destination = $uploadDir . $safeFilename;

// 5. Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse([
        'status' => 'error', 
        'message' => 'Failed to save image file on server. Check directory write permissions.'
    ], 500);
}

// 6. Return relative image URL
$relativeUrl = './uploads/products/' . $safeFilename;

jsonResponse([
    'status' => 'success',
    'message' => 'Image uploaded successfully.',
    'image_url' => $relativeUrl,
    'filename' => $safeFilename
]);
