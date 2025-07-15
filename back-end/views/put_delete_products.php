<?php
include '../config.php';

// Fungsi generate kode produk otomatis
function generateKodeProduk($conn) {
    $prefix = "PRD";
    $query = "SELECT MAX(kode) AS kode_terbesar FROM products";
    $result = $conn->query($query);
    $data = $result->fetch_assoc();
    $angka = $data['kode_terbesar'] ? (int)substr($data['kode_terbesar'], 3) + 1 : 1;
    return $prefix . str_pad($angka, 3, '0', STR_PAD_LEFT);
}

// --- Hapus Produk ---
if (isset($_GET['hapus'])) {
    $id = $_GET['hapus'];
    $conn->query("DELETE FROM products WHERE id = $id");
    header("Location: put_delete_products.php");
    exit;
}

// --- Update Produk ---
if (isset($_POST['update_id'])) {
    $id = $_POST['update_id'];
    $nama = $_POST['update_nama'];
    $harga = $_POST['update_harga'];
    $category_id = $_POST['update_category_id'];

    $stmt = $conn->prepare("UPDATE products SET nama = ?, harga = ?, category_id = ? WHERE id = ?");
    $stmt->bind_param("siii", $nama, $harga, $category_id, $id);
    $stmt->execute();
    $stmt->close();

    header("Location: put_delete_products.php");
    exit;
}

// --- Tambah produk baru ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nama'], $_POST['harga'], $_POST['category_id']) && !isset($_POST['update_id'])) {
    $kode = generateKodeProduk($conn);
    $nama = $_POST['nama'];
    $harga = $_POST['harga'];
    $category_id = $_POST['category_id'];
    $gambar = '';

    $kategoriQuery = $conn->prepare("SELECT nama FROM categories WHERE id = ?");
    $kategoriQuery->bind_param("i", $category_id);
    $kategoriQuery->execute();
    $kategoriResult = $kategoriQuery->get_result();
    $kategoriData = $kategoriResult->fetch_assoc();
    $kategoriFolder = strtolower($kategoriData['nama']);

    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
        $gambar = basename($_FILES['gambar']['name']);
        $targetDir = "../images/$kategoriFolder/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        move_uploaded_file($_FILES['gambar']['tmp_name'], $targetDir . $gambar);
    }

    $stmt = $conn->prepare("INSERT INTO products (kode, nama, harga, category_id, gambar) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiis", $kode, $nama, $harga, $category_id, $gambar);
    $stmt->execute();
    $stmt->close();

    header("Location: put_delete_products.php");
    exit;
}

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
    <title>Manajemen Produk</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { margin-top: 40px; }
        .product-container { display: flex; flex-wrap: wrap; gap: 20px; }
        .product { border: 1px solid #ccc; padding: 10px; width: 260px; border-radius: 8px; background: #f9f9f9; }
        .product img { max-width: 100%; height: auto; margin-bottom: 10px; border-radius: 4px; }
        form { margin-bottom: 20px; padding: 15px; border: 1px solid #aaa; border-radius: 8px; max-width: 400px; }
        .btn-delete { background: red; color: white; border: none; padding: 6px 10px; border-radius: 4px; }
        .btn-update { background: green; color: white; border: none; padding: 6px 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Manajemen Produk</h1>
    <a href="../index.php">← Kembali ke Home</a>
    <br><br>

    <!-- Form Tambah Produk -->
    <h2>Tambah Produk Baru</h2>
    <form method="POST" enctype="multipart/form-data">
        <label>Nama Produk:</label><br>
        <input type="text" name="nama" required><br><br>

        <label>Harga (Rp):</label><br>
        <input type="number" name="harga" required><br><br>

        <label>Kategori:</label><br>
        <select name="category_id" required>
            <option value="">-- Pilih Kategori --</option>
            <?php
            $kategoriResult = $conn->query("SELECT id, nama FROM categories");
            while ($kat = $kategoriResult->fetch_assoc()):
            ?>
                <option value="<?= $kat['id'] ?>"><?= htmlspecialchars($kat['nama']) ?></option>
            <?php endwhile; ?>
        </select><br><br>

        <label>Gambar (opsional):</label><br>
        <input type="file" name="gambar" accept="image/*"><br><br>

        <button type="submit">Tambah Produk</button>
    </form>

    <!-- Daftar Produk per Kategori -->
    <?php foreach ($kategoriProduk as $kategoriNama => $produkList): ?>
        <h2>Kategori: <?= htmlspecialchars($kategoriNama) ?></h2>
        <div class="product-container">
            <?php foreach ($produkList as $row): ?>
                <div class="product">
                    <h3><?= htmlspecialchars($row['nama']) ?></h3>
                    <p><strong>Harga:</strong> Rp<?= number_format($row['harga'], 0, ',', '.') ?></p>
                    <?php if (!empty($row['gambar'])): ?>
                        <?php
                            $kategoriFolder = strtolower($row['kategori_nama']);
                            $gambarPath = "../images/{$kategoriFolder}/" . htmlspecialchars($row['gambar']);
                        ?>
                        <img src="<?= $gambarPath ?>" alt="<?= htmlspecialchars($row['nama']) ?>">
                    <?php endif; ?>

                    <!-- Tombol Hapus -->
                    <form method="GET" action="">
                        <input type="hidden" name="hapus" value="<?= $row['id'] ?>">
                        <button type="submit" class="btn-delete" onclick="return confirm('Yakin hapus produk ini?')">Hapus</button>
                    </form>

                    <!-- Form Update -->
                    <form method="POST" action="">
                        <input type="hidden" name="update_id" value="<?= $row['id'] ?>">
                        <label>Nama:</label><br>
                        <input type="text" name="update_nama" value="<?= htmlspecialchars($row['nama']) ?>"><br>
                        <label>Harga:</label><br>
                        <input type="number" name="update_harga" value="<?= $row['harga'] ?>"><br>
                        <label>Kategori:</label><br>
                        <select name="update_category_id">
                            <?php
                            $allKategori = $conn->query("SELECT id, nama FROM categories");
                            while ($kat = $allKategori->fetch_assoc()):
                            ?>
                                <option value="<?= $kat['id'] ?>" <?= ($kat['id'] == $row['category_id']) ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($kat['nama']) ?>
                                </option>
                            <?php endwhile; ?>
                        </select><br><br>
                        <button type="submit" class="btn-update">Update</button>
                    </form>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endforeach; ?>

<?php $conn->close(); ?>
</body>
</html>
