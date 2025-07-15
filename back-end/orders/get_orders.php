<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config.php';

$where = "";
$params = [];

if (isset($_GET['id'])) {
    $where = " WHERE p.id = ?";
    $params[] = intval($_GET['id']);
}

$sql = "
SELECT 
    p.id AS pesanan_id, p.total_bayar, p.created_at,
    d.product_id, d.jumlah, d.total_harga,
    pr.nama AS nama_produk
FROM pesanans p
JOIN pesanan_detail d ON p.id = d.pesanan_id
JOIN products pr ON d.product_id = pr.id
$where
ORDER BY p.id DESC
";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param("i", ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['pesanan_id'];
    if (!isset($orders[$id])) {
        $orders[$id] = [
            "id" => $id,
            "tanggal" => $row['created_at'],
            "total_bayar" => (int)$row['total_bayar'],
            "items" => []
        ];
    }

    $orders[$id]["items"][] = [
        "product_id" => $row["product_id"],
        "nama_produk" => $row["nama_produk"],
        "jumlah" => (int)$row["jumlah"],
        "total_harga" => (int)$row["total_harga"]
    ];
}

echo json_encode(array_values($orders), JSON_PRETTY_PRINT);
$conn->close();
