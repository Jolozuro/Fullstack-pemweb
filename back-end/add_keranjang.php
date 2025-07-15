<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$product_id = $data['product_id'];
$jumlah_baru = $data['jumlah'];
$keterangan_baru = isset($data['keterangan']) ? $data['keterangan'] : '';

$queryCek = "SELECT * FROM keranjangs WHERE product_id = ?";
$stmtCek = $conn->prepare($queryCek);
$stmtCek->bind_param("i", $product_id);
$stmtCek->execute();
$resultCek = $stmtCek->get_result();

if ($resultCek->num_rows > 0) {
    $row = $resultCek->fetch_assoc();
    $id = $row['id'];
    $jumlah_lama = $row['jumlah'];
    $harga_satuan = $row['total_harga'] / max($jumlah_lama, 1);

    $jumlah_total = $jumlah_baru;
    $total_harga_baru = $jumlah_total * $harga_satuan;

    $queryUpdate = "UPDATE keranjangs SET jumlah = ?, total_harga = ?, keterangan = ? WHERE id = ?";
    $stmtUpdate = $conn->prepare($queryUpdate);
    $stmtUpdate->bind_param("iisi", $jumlah_total, $total_harga_baru, $keterangan_baru, $id);
    $stmtUpdate->execute();
    $stmtUpdate->close();
} else {
    $queryInsert = "INSERT INTO keranjangs (product_id, jumlah, total_harga, keterangan) VALUES (?, ?, ?, ?)";
    $stmtInsert = $conn->prepare($queryInsert);
    $total_harga = $jumlah_baru * getHargaProduk($product_id, $conn);
    $stmtInsert->bind_param("iiis", $product_id, $jumlah_baru, $total_harga, $keterangan_baru);
    $stmtInsert->execute();
    $stmtInsert->close();
}

echo json_encode(["status" => "success"]);
$conn->close();

function getHargaProduk($id, $conn) {
    $query = "SELECT harga FROM products WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($harga);
    $stmt->fetch();
    $stmt->close();
    return $harga;
}
