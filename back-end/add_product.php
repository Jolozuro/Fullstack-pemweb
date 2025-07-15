<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

// Validasi input
if (
    isset($data['kode'], $data['nama'], $data['harga'], $data['gambar'], $data['category_id'], $data['is_ready'])
) {
    $stmt = $conn->prepare("INSERT INTO products (kode, nama, harga, gambar, category_id, is_ready) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssdsii",
        $data['kode'],
        $data['nama'],
        $data['harga'],
        $data['gambar'],
        $data['category_id'],
        $data['is_ready']
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Produk berhasil ditambahkan"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menambahkan produk"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
}

$conn->close();
