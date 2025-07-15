<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

// DEBUG - simpan ke file untuk pastikan data diterima
file_put_contents("debug.log", print_r($data, true));

if (!isset($data['total_bayar']) || !isset($data['menus']) || !is_array($data['menus']) || count($data['menus']) === 0) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap atau tidak valid"]);
    http_response_code(400);
    exit();
}

$total = (int)$data['total_bayar'];
$tanggal = date("Y-m-d H:i:s");

// Simpan ke tabel pesanans
$insert_pesanan = $conn->query("INSERT INTO pesanans (tanggal, total_bayar) VALUES ('$tanggal', $total)");
if (!$insert_pesanan) {
    echo json_encode(["status" => "error", "message" => "Gagal insert ke pesanans: " . $conn->error]);
    exit();
}

$pesanan_id = $conn->insert_id;

// Simpan ke tabel detail_pesanan
foreach ($data['menus'] as $item) {
    if (!isset($item['product_id'], $item['jumlah'], $item['total_harga'])) {
        echo json_encode(["status" => "error", "message" => "Item pesanan tidak lengkap"]);
        exit();
    }

    $product_id = (int)$item['product_id'];
    $jumlah = (int)$item['jumlah'] ;
    $total_harga = (int)$item['total_harga'];

    $insert_detail = $conn->query("INSERT INTO detail_pesanan (pesanan_id, product_id, jumlah, total_harga)
                                   VALUES ($pesanan_id, $product_id, $jumlah, $total_harga)");
    if (!$insert_detail) {
        echo json_encode(["status" => "error", "message" => "Gagal insert detail: " . $conn->error]);
        exit();
    }
}

echo json_encode([
    "status" => "success",
    "message" => "Order created successfully",
    "pesanan_id" => $pesanan_id
]);
?>
