<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$data = [];

try {
    if (isset($_GET['product_id'])) {
        $product_id = intval($_GET['product_id']);
        $query = "SELECT keranjangs.*, products.nama, products.harga 
                  FROM keranjangs 
                  JOIN products ON keranjangs.product_id = products.id 
                  WHERE keranjangs.product_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $product_id);
    } else {
        $query = "SELECT keranjangs.*, products.nama, products.harga 
                  FROM keranjangs 
                  JOIN products ON keranjangs.product_id = products.id";
        $stmt = $conn->prepare($query);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "id" => (int) $row['id'],
            "product_id" => (int) $row['product_id'],
            "jumlah" => (int) $row['jumlah'],
            "total_harga" => (int) $row['total_harga'],
            "keterangan" => $row['keterangan'],
            "product" => [
                "id" => (int) $row['product_id'],
                "nama" => $row['nama'],
                "harga" => (int) $row['harga']
            ]
        ];
    }

    echo json_encode($data);

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal mengambil data keranjang: " . $e->getMessage()
    ]);
}
