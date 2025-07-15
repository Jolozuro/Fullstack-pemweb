<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'config.php';

$response = [];
$namaProduk = isset($_GET['nama']) ? $_GET['nama'] : null;

if ($namaProduk) {
    // Ambil produk berdasarkan nama
    $stmt = $conn->prepare("
        SELECT p.*, c.nama AS kategori_nama
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.nama = ?
    ");
    $stmt->bind_param("s", $namaProduk);
    $stmt->execute();
    $result = $stmt->get_result();

    $produkList = [];
    while ($produk = $result->fetch_assoc()) {
        $kategoriFolder = strtolower($produk['kategori_nama']);
        $gambarPath = $produk['gambar']
            ? "http://localhost/kasir-api/images/{$kategoriFolder}/" . $produk['gambar']
            : null;

        $produkList[] = [
            "id" => (int)$produk['id'],
            "kode" => $produk['kode'],
            "nama" => $produk['nama'],
            "harga" => (int)$produk['harga'],
            "gambar" => $gambarPath,
            "kategori_nama" => $produk['kategori_nama'],
        ];
    }

    $response = [
        "status" => "success",
        "data" => $produkList,
    ];

    $stmt->close();
} else {
    // Ambil semua kategori dan produk
    $kategoriQuery = "SELECT id, nama FROM categories";
    $kategoriResult = $conn->query($kategoriQuery);

    $kategoriProduk = [];

    if ($kategoriResult && $kategoriResult->num_rows > 0) {
        while ($kategori = $kategoriResult->fetch_assoc()) {
            $catId = $kategori['id'];
            $catNama = $kategori['nama'];
            $kategoriFolder = strtolower($catNama);

            $stmt = $conn->prepare("
                SELECT id, kode, nama, harga, gambar
                FROM products
                WHERE category_id = ?
            ");
            $stmt->bind_param("i", $catId);
            $stmt->execute();
            $result = $stmt->get_result();

            $produkList = [];
            while ($produk = $result->fetch_assoc()) {
                $gambarPath = $produk['gambar']
                    ? "http://localhost/kasir-api/images/{$kategoriFolder}/" . $produk['gambar']
                    : null;

                $produkList[] = [
                    "id" => (int)$produk['id'],
                    "kode" => $produk['kode'],
                    "nama" => $produk['nama'],
                    "harga" => (int)$produk['harga'],
                    "gambar" => $gambarPath,
                ];
            }

            $kategoriProduk[] = [
                "kategori_id" => (int)$catId,
                "kategori_nama" => $catNama,
                "produk" => $produkList,
            ];

            $stmt->close();
        }

        $response = [
            "status" => "success",
            "data" => $kategoriProduk,
        ];
    } else {
        $response = [
            "status" => "error",
            "message" => "Kategori tidak ditemukan",
        ];
    }
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$conn->close();
