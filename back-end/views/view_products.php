<?php
include '../config.php';

// --- Ambil semua kategori dan produk per kategori ---
$kategoriQuery = "SELECT id, nama FROM categories";
$kategoriResult = $conn->query($kategoriQuery);

$kategoriProduk = [];

while ($kategori = $kategoriResult->fetch_assoc()) {
    $catId = $kategori['id'];
    $catNama = $kategori['nama'];

    $stmt = $conn->prepare("
        SELECT products.*, categories.nama AS kategori_nama
        FROM products
        JOIN categories ON products.category_id = categories.id
        WHERE category_id = ?
    ");
    $stmt->bind_param("i", $catId);
    $stmt->execute();
    $result = $stmt->get_result();
    $kategoriProduk[$catNama] = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Daftar Produk per Kategori</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { margin-top: 40px; }
        .product-container { display: flex; flex-wrap: wrap; gap: 20px; }
        .product { border: 1px solid #ccc; padding: 10px; width: 250px; border-radius: 8px; background: #f9f9f9; }
        .product img { max-width: 100%; height: auto; margin-bottom: 10px; border-radius: 4px; }
        form { margin-bottom: 30px; padding: 15px; border: 1px solid #aaa; border-radius: 8px; max-width: 400px; }
    </style>
</head>
<body>
    <h1>Daftar Produk per Kategori</h1>
    <a href="../index.php">← Kembali ke Home</a>
    <br><br>

    <!-- Daftar Produk per Kategori -->
    <?php foreach ($kategoriProduk as $kategoriNama => $produkList): ?>
        <h2>Kategori: <?= htmlspecialchars($kategoriNama) ?></h2>
        <?php if (count($produkList) === 0): ?>
            <p><i>Belum ada produk dalam kategori ini.</i></p>
        <?php else: ?>
            <div class="product-container">
                <?php foreach ($produkList as $row): ?>
                    <div class="product">
                        <h3><?= htmlspecialchars($row['nama']) ?></h3>
                        <p><strong>Harga:</strong> Rp<?= number_format($row['harga'], 0, ',', '.') ?></p>
                        <?php if (!empty($row['gambar'])): ?>
                            <?php
                                // Pastikan path menuju folder gambar sesuai dengan struktur folder di Laragon
                                $kategoriFolder = strtolower($row['kategori_nama']);
                                $gambarPath = "/kasir-api/images/{$kategoriFolder}/" . rawurlencode($row['gambar']);
                            ?>
                            <img src="<?= $gambarPath ?>" alt="<?= htmlspecialchars($row['nama']) ?>">
                        <?php endif; ?>
                        <form method="POST" action="view_keranjang.php">
                            <input type="hidden" name="product_id" value="<?= $row['id'] ?>">
                            <label>Jumlah:</label>
                            <input type="number" name="jumlah" value="1" min="1" required>
                            <br>
                            <label>Keterangan:</label>
                            <input type="text" name="keterangan" placeholder="Contoh: pedas">
                            <br><br>
                            <button type="submit">Tambah ke Keranjang</button>
                        </form>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    <?php endforeach; ?>
    <br><br>
    <a href="put_delete_products.php">Edit / Delete Produk</a>
</body>
</html>

<?php $conn->close(); ?>
