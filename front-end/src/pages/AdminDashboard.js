import React, { useState } from "react";
import ProductManager from "./ProductManager";
import CategoryManager from "./CategoryManager";
// import komponen lain kalau ada: OrderList, MessageList, ReviewList, dll

const AdminDashboard = () => {
    const [view, setView] = useState("products");

    return (
        <div className="container mt-4">
            <h2>Dashboard Admin</h2>

            <div className="mb-3">
                <button className="btn btn-outline-primary me-2" onClick={() => setView("products")}>
                    Produk
                </button>
                <button className="btn btn-outline-success me-2" onClick={() => setView("categories")}>
                    Kategori
                </button>
                <button className="btn btn-outline-info me-2" onClick={() => setView("orders")}>
                    Pesanan
                </button>
                <button className="btn btn-outline-warning me-2" onClick={() => setView("messages")}>
                    Pesan
                </button>
                <button className="btn btn-outline-dark me-2" onClick={() => setView("reviews")}>
                    Ulasan
                </button>
            </div>

            {view === "products" && <ProductManager />}
            {view === "categories" && <CategoryManager />}
            {/* Tambah lainnya jika sudah siap */}
            {/* {view === "orders" && <OrderList />} */}
            {/* {view === "messages" && <MessageList />} */}
            {/* {view === "reviews" && <ReviewList />} */}
        </div>
    );
};

export default AdminDashboard;
