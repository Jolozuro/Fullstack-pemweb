<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$items = $data['items'] ?? [];

if (count($items) === 0) {
    echo json_encode(["status" => "error", "message" => "Items kosong"]);
    exit;
}

$totalBayar = 0;

// Hitung total harga semua item
foreach ($items as $item) {
    $productId = $item['product_id'];
    $jumlah = $item['jumlah'];

    $stmt = $conn->prepare("SELECT harga FROM products WHERE id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $stmt->bind_result($harga);
    $stmt->fetch();
    $stmt->close();

    $totalBayar += $harga * $jumlah;
}

// Simpan ke tabel pesanans
$stmtPesanan = $conn->prepare("INSERT INTO pesanans (total_bayar) VALUES (?)");
$stmtPesanan->bind_param("i", $totalBayar);
$stmtPesanan->execute();
$pesananId = $stmtPesanan->insert_id;
$stmtPesanan->close();

// Simpan ke pesanan_detail
foreach ($items as $item) {
    $productId = $item['product_id'];
    $jumlah = $item['jumlah'];

    $stmt = $conn->prepare("SELECT harga FROM products WHERE id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $stmt->bind_result($harga);
    $stmt->fetch();
    $stmt->close();

    $totalHarga = $harga * $jumlah;

    $stmtDetail = $conn->prepare("INSERT INTO pesanan_detail (pesanan_id, product_id, jumlah, total_harga) VALUES (?, ?, ?, ?)");
    $stmtDetail->bind_param("iiii", $pesananId, $productId, $jumlah, $totalHarga);
    $stmtDetail->execute();
    $stmtDetail->close();
}

echo json_encode(["status" => "success", "pesanan_id" => $pesananId]);
$conn->close();
