<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// include 'config.php';

// // lanjutkan kode...


// header('Content-Type: application/json');

// if (!isset($_GET['id'])) {
//     http_response_code(400);
//     echo json_encode(["error" => "Parameter 'id' dibutuhkan"]);
//     exit;
// }

// $id = $_GET['id'];

// $query = "
//     SELECT pd.*, p.nama AS nama_produk, p.harga
//     FROM pesanan_detail pd
//     JOIN products p ON pd.product_id = p.id
//     WHERE pd.pesanan_id = '$id'
// ";

// $result = $conn->query($query);
// $data = [];

// while ($row = $result->fetch_assoc()) {
//     $data[] = $row;
// }

// echo json_encode($data);
