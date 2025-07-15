<?php
include '../config.php';

$whereClause = "";
$params = [];

// Hapus pesanan jika diminta
if (isset($_GET['delete'])) {
    $delete = $_GET['delete'];

    if ($delete === "all") {
        $conn->query("DELETE FROM pesanan_detail");
        $conn->query("DELETE FROM pesanans");

        // Reset AUTO_INCREMENT
        $conn->query("ALTER TABLE pesanan_detail AUTO_INCREMENT = 1");
        $conn->query("ALTER TABLE pesanans AUTO_INCREMENT = 1");

        echo "Semua pesanan telah dihapus dan ID di-reset.";
        exit();
    } else {
        $idToDelete = intval($delete);
        $conn->query("DELETE FROM pesanan_detail WHERE pesanan_id = $idToDelete");
        $conn->query("DELETE FROM pesanans WHERE id = $idToDelete");

        echo "Pesanan #$idToDelete berhasil dihapus.";
        exit();
    }
}

// Filter berdasarkan ID
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $whereClause = " WHERE p.id = ?";
    $params[] = $id;
}

$sql = "
    SELECT 
        p.id AS pesanan_id,
        p.total_bayar,
        p.created_at AS tanggal,
        d.product_id,
        pr.nama AS nama_produk,
        d.jumlah,
        d.total_harga
    FROM pesanans p
    JOIN pesanan_detail d ON p.id = d.pesanan_id
    JOIN products pr ON d.product_id = pr.id
    $whereClause
    ORDER BY p.id DESC
";

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param("i", ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$riwayat = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['pesanan_id'];

    if (!isset($riwayat[$id])) {
        $riwayat[$id] = [
            "id" => $id,
            "tanggal" => $row['tanggal'],
            "total_bayar" => (int)$row['total_bayar'],
            "items" => []
        ];
    }

    $riwayat[$id]["items"][] = [
        "nama_produk" => $row['nama_produk'],
        "jumlah" => (int)$row['jumlah'],
        "total_harga" => (int)$row['total_harga']
    ];
}

// Tampilkan JSON jika ?json
if (isset($_GET['json'])) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    echo json_encode(array_values($riwayat), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $stmt->close();
    $conn->close();
    exit();
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Riwayat Pesanan</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        .pesanan {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 25px;
            background: #f9f9f9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 8px;
            border: 1px solid #aaa;
        }
        th {
            background-color: #eee;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            text-decoration: none;
            color: #007bff;
        }
        .delete-button {
            background-color: #dc3545;
            color: white;
            padding: 5px 10px;
            margin-top: 10px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <h1>🧾 Riwayat Pesanan</h1>
    <a href="../index.php" class="back-link">← Kembali ke Home</a>
    <br><br>

    <?php if (count($riwayat) > 0): ?>
        <?php foreach ($riwayat as $pesanan): ?>
            <div class="pesanan">
                <h2>Pesanan #<?= htmlspecialchars($pesanan['id']) ?></h2>
                <p><strong>Tanggal:</strong> <?= date("d-m-Y H:i", strtotime($pesanan['tanggal'])) ?></p>

                <table>
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Jumlah</th>
                            <th>Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($pesanan['items'] as $item): ?>
                            <tr>
                                <td><?= htmlspecialchars($item['nama_produk']) ?></td>
                                <td><?= $item['jumlah'] ?></td>
                                <td>Rp<?= number_format($item['total_harga'], 0, ',', '.') ?></td>
                            </tr>
                        <?php endforeach; ?>
                        <tr>
                            <td colspan="2"><strong>Total Bayar</strong></td>
                            <td><strong>Rp<?= number_format($pesanan['total_bayar'], 0, ',', '.') ?></strong></td>
                        </tr>
                    </tbody>
                </table>

                <a href="?delete=<?= $pesanan['id'] ?>" class="delete-button" onclick="return confirm('Hapus pesanan ini?')">🗑 Hapus Pesanan Ini</a>
            </div>
        <?php endforeach; ?>
        <a href="?delete=all" class="delete-button" onclick="return confirm('Hapus semua pesanan? ID akan di-reset!')">🗑 Hapus Semua Pesanan</a>
    <?php else: ?>
        <p><i>Tidak ada riwayat pesanan.</i></p>
    <?php endif; ?>
</body>
</html>

<?php
$stmt->close();
$conn->close();
?>
