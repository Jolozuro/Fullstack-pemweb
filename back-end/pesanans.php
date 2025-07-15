<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// require 'config.php';

// // Ambil data dari frontend
// $data = json_decode(file_get_contents("php://input"), true);

// $total_bayar = $data['total_bayar'];
// $menus = $data['menus'];

// // Insert ke tabel pesanans
// $queryPesanan = "INSERT INTO pesanans (total_bayar) VALUES (?)";
// $stmtPesanan = $conn->prepare($queryPesanan);

// if (!$stmtPesanan) {
//     http_response_code(500);
//     echo json_encode(["error" => "Gagal prepare pesanan: " . $conn->error]);
//     exit();
// }

// $stmtPesanan->bind_param("i", $total_bayar);
// if (!$stmtPesanan->execute()) {
//     http_response_code(500);
//     echo json_encode(["error" => "Gagal insert pesanan: " . $stmtPesanan->error]);
//     exit();
// }

// $pesanan_id = $conn->insert_id;
// $stmtPesanan->close();

// // Insert ke tabel pesanan_detail
// foreach ($menus as $menu) {
//     $product_id = $menu['product_id'];
//     $jumlah = $menu['jumlah'];
//     $total_harga = $menu['total_harga'];
//     $keterangan = isset($menu['keterangan']) ? $menu['keterangan'] : '';

//     $queryDetail = "INSERT INTO pesanan_detail (pesanan_id, product_id, jumlah, total_harga, keterangan)
//                     VALUES (?, ?, ?, ?, ?)";
//     $stmtDetail = $conn->prepare($queryDetail);
//     $stmtDetail->bind_param("iiiss", $pesanan_id, $product_id, $jumlah, $total_harga, $keterangan);
//     $stmtDetail->execute();
//     $stmtDetail->close();
// }

// // Kosongkan keranjang
// mysqli_query($conn, "DELETE FROM keranjangs");

// echo json_encode(["message" => "Pesanan berhasil diproses"]);
// $conn->close();
?>
