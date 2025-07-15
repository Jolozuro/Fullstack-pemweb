<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE, GET");
header("Access-Control-Allow-Headers: Content-Type");

require 'config.php';

if (!isset($_GET['product_id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Parameter product_id tidak ditemukan",
    ]);
    exit;
}

$productId = (int)$_GET['product_id'];

// Hapus keranjang
$stmt = $conn->prepare("DELETE FROM keranjangs WHERE product_id = ?");
$stmt->bind_param("i", $productId);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Produk dari keranjang berhasil dihapus",
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Gagal menghapus",
    ]);
}

$stmt->close();
$conn->close();
