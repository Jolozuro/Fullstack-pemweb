import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [nama, setNama] = useState("");

    // Ambil data kategori dari backend PHP
    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost/kasir-api/admin/get_categories.php");
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Gagal ambil kategori:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Tambah kategori
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!nama.trim()) return;

        try {
            await axios.post(
                "http://localhost/kasir-api/admin/add_category.php",
                { nama: nama.trim() },
                { headers: { "Content-Type": "application/json" } }
            );

            setNama("");
            fetchCategories();
        } catch (error) {
            console.error("Gagal tambah kategori:", error);
        }
    };

    // Hapus kategori
    const handleDelete = async (id) => {
        try {
            await axios.post(
                "http://localhost/kasir-api/admin/delete_category.php",
                { id },
                { headers: { "Content-Type": "application/json" } }
            );
            fetchCategories();
        } catch (error) {
            console.error("Gagal hapus kategori:", error);
        }
    };

    return (
        <div className="mt-4">
            <h4>Manajemen Kategori</h4>

            <form onSubmit={handleAddCategory} className="mb-3">
                <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="form-control"
                    placeholder="Nama Kategori Baru"
                />
                <button className="btn btn-primary mt-2" type="submit">
                    Tambah Kategori
                </button>
            </form>

            <ul className="list-group mt-3">
                {categories.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {item.nama}
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;
