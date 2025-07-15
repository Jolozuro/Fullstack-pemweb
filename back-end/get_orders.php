<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
include 'config.php';

// lanjutkan kode...


header('Content-Type: application/json');

$query = "SELECT * FROM pesanans ORDER BY created_at DESC";
$result = $conn->query($query);

$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders);
