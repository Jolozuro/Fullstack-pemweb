<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT");

require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$pesanan_id = $data['pesanan_id'];
$product_id = $data['product_id'];
$jumlah = $data['jumlah'];

$stmt = $conn->prepare("SELECT harga FROM products WHERE id = ?");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$stmt->bind_result($harga);
$stmt->fetch();
$stmt->close();

$total_harga = $harga * $jumlah;

// Update detail
$stmt = $conn->prepare("UPDATE pesanan_detail SET jumlah = ?, total_harga = ? WHERE pesanan_id = ? AND product_id = ?");
$stmt->bind_param("iiii", $jumlah, $total_harga, $pesanan_id, $product_id);
$stmt->execute();
$stmt->close();

// Update total pesanan
$stmt = $conn->prepare("SELECT SUM(total_harga) FROM pesanan_detail WHERE pesanan_id = ?");
$stmt->bind_param("i", $pesanan_id);
$stmt->execute();
$stmt->bind_result($total_bayar);
$stmt->fetch();
$stmt->close();

$stmt = $conn->prepare("UPDATE pesanans SET total_bayar = ? WHERE id = ?");
$stmt->bind_param("ii", $total_bayar, $pesanan_id);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "success"]);
$conn->close();
