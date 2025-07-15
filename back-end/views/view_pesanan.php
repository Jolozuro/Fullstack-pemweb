<?php
include '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_POST['selected_items'])) {
        $selected_cart_ids = array_map('intval', $_POST['selected_items']);
        $ids = implode(',', $selected_cart_ids);

        $query = "
            SELECT k.id, p.id AS product_id, p.nama AS nama_produk, k.jumlah, k.total_harga
            FROM keranjangs k
            JOIN products p ON k.product_id = p.id
            WHERE k.id IN ($ids)
        ";
        $result = $conn->query($query);
        $items_to_checkout = [];
        $total_selected = 0;

        while ($row = $result->fetch_assoc()) {
            $items_to_checkout[] = $row;
            $total_selected += $row['total_harga'];
        }

        if (!empty($items_to_checkout)) {
            // Perbaikan di sini: ganti kolom total ➜ total_bayar
            $insertPesanan = $conn->query("INSERT INTO pesanans (total_bayar) VALUES ($total_selected)");
            if ($insertPesanan) {
                $pesanan_id = $conn->insert_id;

                // Simpan ke pesanan_detail (bukan pesanan_details)
                foreach ($items_to_checkout as $item) {
                    $conn->query("
                        INSERT INTO pesanan_detail (pesanan_id, product_id, jumlah, total_harga)
                        VALUES ($pesanan_id, {$item['product_id']}, {$item['jumlah']}, {$item['total_harga']})
                    ");
                }

                // Hapus dari keranjang
                $conn->query("DELETE FROM keranjangs WHERE id IN ($ids)");

                echo "<script>alert('✅ Pesanan berhasil disimpan!'); window.location.href='file_history.php';</script>";
                exit;
            } else {
                echo "<p style='color:red'>❌ Gagal menyimpan pesanan: {$conn->error}</p>";
            }
        } else {
            echo "<p style='color:red'>❌ Tidak ada item valid untuk checkout</p>";
        }
    } else {
        echo "<p style='color:red'>❌ Anda belum memilih item</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Checkout Keranjang</title>
</head>
<body>
    <h2>🛒 Checkout Keranjang</h2>
    <form method="post" action="">
        <table border="1" cellpadding="10" cellspacing="0">
            <tr>
                <th>Pilih</th>
                <th>Nama Produk</th>
                <th>Jumlah</th>
                <th>Total Harga</th>
            </tr>
            <?php
            $result = $conn->query("
                SELECT k.id, p.nama AS nama_produk, k.jumlah, k.total_harga
                FROM keranjangs k
                JOIN products p ON k.product_id = p.id
            ");
            if ($result->num_rows > 0):
                while ($row = $result->fetch_assoc()):
            ?>
                <tr>
                    <td><input type="checkbox" name="selected_items[]" value="<?= $row['id'] ?>"></td>
                    <td><?= htmlspecialchars($row['nama_produk']) ?></td>
                    <td><?= $row['jumlah'] ?></td>
                    <td>Rp <?= number_format($row['total_harga'], 0, ',', '.') ?></td>
                </tr>
            <?php endwhile; else: ?>
                <tr>
                    <td colspan="4">Keranjang kosong</td>
                </tr>
            <?php endif; ?>
        </table>
        <br>
        <button type="submit" name="submit">Checkout</button>
    </form>
</body>
</html>
