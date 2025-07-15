// src/pages/ProductManager.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Table } from "react-bootstrap";

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ nama: "", harga: "", category_id: "" });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get("http://localhost/kasir-api/admin/get_products.php");
        setProducts(res.data);
    };

    const fetchCategories = async () => {
        const res = await axios.get("http://localhost/kasir-api/get_categories.php");
        setCategories(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nama", form.nama);
        formData.append("harga", form.harga);
        formData.append("category_id", form.category_id);
        if (image) formData.append("gambar", image);

        await axios.post("http://localhost/kasir-api/admin/add_product.php", formData);
        fetchProducts();
        setForm({ nama: "", harga: "", category_id: "" });
    };

    const handleDelete = async (id) => {
        await axios.post("http://localhost/kasir-api/admin/delete_product.php", { id });
        fetchProducts();
    };

    return (
        <div>
            <h4>Manajemen Produk</h4>

            <Form onSubmit={handleSubmit} className="mb-4">
                <Form.Group className="mb-2">
                    <Form.Label>Nama Produk</Form.Label>
                    <Form.Control name="nama" value={form.nama} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Harga</Form.Label>
                    <Form.Control name="harga" value={form.harga} onChange={handleChange} type="number" required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Kategori</Form.Label>
                    <Form.Select name="category_id" value={form.category_id} onChange={handleChange} required>
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nama}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Gambar</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Button type="submit">Tambah Produk</Button>
            </Form>

            <Table bordered>
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Kategori</th>
                        <th>Gambar</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nama}</td>
                            <td>{p.harga}</td>
                            <td>{p.kategori_nama}</td>
                            <td>
                                <img src={`http://localhost/kasir-api/images/${p.gambar}`} alt={p.nama} height="50" />
                            </td>
                            <td>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Hapus</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductManager;
