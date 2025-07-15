import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";

const ViewPesanan = () => {
    const [pesanan, setPesanan] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}pesanans.php`)
            .then((res) => {
                setPesanan(res.data);
            })
            .catch((err) => {
                console.error("Gagal mengambil data pesanan:", err);
            });
    }, []);

    return (
        <div className="p-3">
            <h2>📋 Riwayat Pesanan</h2>
            <hr />
            {pesanan.length === 0 ? (
                <p className="text-muted">Belum ada pesanan.</p>
            ) : (
                pesanan.map((p) => (
                    <div key={p.id} className="mb-4 border rounded p-3 bg-light">
                        <h5>🧾 Pesanan #{p.id}</h5>
                        <p><strong>Nama Pelanggan:</strong> {p.nama_pelanggan}</p>
                        <p><strong>Total:</strong> Rp{p.total.toLocaleString()}</p>
                        <p><strong>Waktu:</strong> {p.created_at}</p>
                        <ul>
                            {p.items.map((item, index) => (
                                <li key={index}>
                                    {item.produk_nama} — {item.jumlah} × Rp{item.total_harga.toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default ViewPesanan;
