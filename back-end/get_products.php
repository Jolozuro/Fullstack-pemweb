<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'config.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("
        SELECT p.*, c.nama AS kategori_nama 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["message" => "Produk tidak ditemukan"]);
    }

    $stmt->close();
} else {
    // Jika tidak pakai ?id=, tampilkan semua
    $query = "
        SELECT p.*, c.nama AS kategori_nama 
        FROM products p
        JOIN categories c ON p.category_id = c.id
    ";
    $result = $conn->query($query);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

$conn->close();
