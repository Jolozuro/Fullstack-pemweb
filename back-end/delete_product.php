<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';

if (!isset($_GET['id'])) {
    echo json_encode(["status" => "error", "message" => "ID produk tidak ditemukan"]);
    exit();
}

$id = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Produk berhasil dihapus"]);
} else {
    echo json_encode(["status" => "error", "message" => "Produk tidak ditemukan atau sudah dihapus"]);
}

$stmt->close();
$conn->close();
?>
