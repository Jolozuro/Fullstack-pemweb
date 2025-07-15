import React from "react";
import { Card, Button } from "react-bootstrap";

const Menus = ({ menu, masukKeranjang }) => {
  return (
    <Card className="mb-5 shadow-sm h-100">
      <Card.Img
        variant="top"
        src={menu.gambar} // URL gambar langsung dari backend
        alt={menu.nama}
        style={{ height: "180px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/250x180?text=No+Image";
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fw-bold">{menu.nama}</Card.Title>
          <Card.Text>
            Rp {parseInt(menu.harga).toLocaleString("id-ID")}
          </Card.Text>
        </div>
        <Button
          variant="primary"
          onClick={() => masukKeranjang(menu)}
          className="w-100 mt-3"
        >
          + Tambah ke Keranjang
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Menus;
