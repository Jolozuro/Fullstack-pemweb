 <?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Content-Type: application/json");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// require_once 'config.php';

// $data = json_decode(file_get_contents("php://input"), true);

// if (!isset($data['id'], $data['jumlah'], $data['total_harga'])) {
//     http_response_code(400);
//     echo json_encode(["error" => "Data tidak lengkap"]);
//     exit();
// }

// $id = intval($data['id']);
// $jumlah = intval($data['jumlah']);
// $total_harga = intval($data['total_harga']);
// $keterangan = isset($data['keterangan']) ? $data['keterangan'] : '';

// try {
//     $stmt = $conn->prepare("UPDATE keranjangs SET jumlah = ?, total_harga = ?, keterangan = ? WHERE id = ?");
//     $stmt->bind_param("iisi", $jumlah, $total_harga, $keterangan, $id);

//     if ($stmt->execute()) {
//         echo json_encode(["message" => "Pesanan berhasil diupdate"]);
//     } else {
//         http_response_code(500);
//         echo json_encode(["error" => "Gagal update"]);
//     }

//     $stmt->close();
//     $conn->close();
// } catch (Exception $e) {
//     http_response_code(500);
//     echo json_encode(["error" => "Terjadi kesalahan: " . $e->getMessage()]);
// }
?> 
