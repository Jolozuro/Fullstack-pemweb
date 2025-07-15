<?php
require_once '../config.php';

// --- TAMBAH PRODUK KE KERANJANG ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id'])) {
    $product_id = $_POST['product_id'];
    $jumlah_baru = $_POST['jumlah'];
    $keterangan_baru = isset($_POST['keterangan']) ? $_POST['keterangan'] : '';

    $queryCek = "SELECT * FROM keranjangs WHERE product_id = ?";
    $stmtCek = $conn->prepare($queryCek);
    $stmtCek->bind_param("i", $product_id);
    $stmtCek->execute();
    $resultCek = $stmtCek->get_result();

    if ($resultCek->num_rows > 0) {
        $row = $resultCek->fetch_assoc();
        $id = $row['id'];
        $jumlah_lama = $row['jumlah'];
        $harga_satuan = $row['total_harga'] / max($jumlah_lama, 1);

        $jumlah_total = $jumlah_lama + $jumlah_baru;
        $total_harga_baru = $jumlah_total * $harga_satuan;

        $queryUpdate = "UPDATE keranjangs SET jumlah = ?, total_harga = ?, keterangan = ? WHERE id = ?";
        $stmtUpdate = $conn->prepare($queryUpdate);
        $stmtUpdate->bind_param("iisi", $jumlah_total, $total_harga_baru, $keterangan_baru, $id);
        $stmtUpdate->execute();
        $stmtUpdate->close();
    } else {
        $harga_produk = 0;
        $queryHarga = "SELECT harga FROM products WHERE id = ?";
        $stmtHarga = $conn->prepare($queryHarga);
        $stmtHarga->bind_param("i", $product_id);
        $stmtHarga->execute();
        $stmtHarga->bind_result($harga_produk);
        $stmtHarga->fetch();
        $stmtHarga->close();

        $total_harga = $jumlah_baru * $harga_produk;

        $queryInsert = "INSERT INTO keranjangs (product_id, jumlah, total_harga, keterangan) VALUES (?, ?, ?, ?)";
        $stmtInsert = $conn->prepare($queryInsert);
        $stmtInsert->bind_param("iiis", $product_id, $jumlah_baru, $total_harga, $keterangan_baru);
        $stmtInsert->execute();
        $stmtInsert->close();
    }

    header("Location: view_keranjang.php");
    exit;
}

// --- DELETE ITEM ---
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = $_GET['id'];
    $conn->query("DELETE FROM keranjangs WHERE id = $id");
    header("Location: view_keranjang.php");
    exit;
}

// --- UPDATE ITEM ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_id'])) {
    $id = $_POST['update_id'];
    $jumlah = $_POST['jumlah'];
    $keterangan = $_POST['keterangan'];

    $queryHarga = "
        SELECT k.total_harga / k.jumlah AS harga_satuan
        FROM keranjangs k WHERE k.id = ?
    ";
    $stmt = $conn->prepare($queryHarga);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($harga_satuan);
    $stmt->fetch();
    $stmt->close();

    $total_harga = $jumlah * $harga_satuan;

    $stmt = $conn->prepare("UPDATE keranjangs SET jumlah = ?, total_harga = ?, keterangan = ? WHERE id = ?");
    $stmt->bind_param("iisi", $jumlah, $total_harga, $keterangan, $id);
    $stmt->execute();
    $stmt->close();

    header("Location: view_keranjang.php");
    exit;
}

// --- GET ITEM UNTUK FORM EDIT ---
$editItem = null;
if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['id'])) {
    $id = $_GET['id'];
    $res = $conn->query("SELECT * FROM keranjangs WHERE id = $id");
    $editItem = $res->fetch_assoc();
}

// --- TAMPILKAN ISI KERANJANG ---
$query = "
    SELECT k.id, p.nama AS nama_produk, k.jumlah, k.total_harga, k.keterangan
    FROM keranjangs k
    JOIN products p ON k.product_id = p.id
";
$result = $conn->query($query);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Isi Keranjang</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px 12px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f2f2f2; }
        a.button { padding: 4px 10px; background: #007bff; color: #fff; text-decoration: none; border-radius: 4px; }
        a.button.red { background: #dc3545; }
        form { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Isi Keranjang</h1>

    <?php if ($result->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>Produk</th>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                    <th>Keterangan</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['nama_produk']) ?></td>
                        <td><?= $row['jumlah'] ?></td>
                        <td>Rp<?= number_format($row['total_harga'], 0, ',', '.') ?></td>
                        <td><?= htmlspecialchars($row['keterangan']) ?></td>
                        <td>
                            <a href="?action=edit&id=<?= $row['id'] ?>" class="button">Edit</a>
                            <a href="?action=delete&id=<?= $row['id'] ?>" class="button red" onclick="return confirm('Yakin hapus item ini?')">Hapus</a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Keranjang masih kosong.</p>
    <?php endif; ?>

    <?php if ($editItem): ?>
        <h2>Edit Item</h2>
        <form method="POST" action="">
            <input type="hidden" name="update_id" value="<?= $editItem['id'] ?>">
            <label>Jumlah:</label><br>
            <input type="number" name="jumlah" value="<?= $editItem['jumlah'] ?>" min="1" required><br><br>
            <label>Keterangan:</label><br>
            <input type="text" name="keterangan" value="<?= htmlspecialchars($editItem['keterangan']) ?>"><br><br>
            <button type="submit">Simpan Perubahan</button>
        </form>
    <?php endif; ?>

    <br><br>
    <a href="view_products.php">← Kembali ke daftar produk</a> |
    <a href="../index.php">Kembali ke Home</a>
</body>
</html>

<?php $conn->close(); ?>
