<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE");

require_once '../config.php';

if (!isset($_GET['id'])) {
    echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
    exit;
}

$id = intval($_GET['id']);

// Hapus dari pesanan_detail (otomatis jika ada foreign key ON DELETE CASCADE)
$stmt = $conn->prepare("DELETE FROM pesanans WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "success", "message" => "Pesanan berhasil dihapus"]);
$conn->close();
