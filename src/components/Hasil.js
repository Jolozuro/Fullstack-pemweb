import React, { Component } from "react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import ModalKeranjang from "./ModalKeranjang";
import TotalBayar from "./TotalBayar";
import { API_URL } from "../utils/constants";
import axios from "axios";
import swal from "sweetalert";

export default class Hasil extends Component {
  state = {
    showModal: false,
    keranjangDetail: null,
    jumlah: 0,
    keterangan: "",
    totalHarga: 0,
  };

  handleShow = (menuKeranjang) => {
    this.setState({
      showModal: true,
      keranjangDetail: menuKeranjang,
      jumlah: menuKeranjang.jumlah,
      keterangan: menuKeranjang.keterangan || "",
      totalHarga: menuKeranjang.total_harga,
    });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  tambah = () => {
    const { keranjangDetail, jumlah } = this.state;
    if (!keranjangDetail?.product) return;

    const newJumlah = jumlah + 1;
    const totalHarga = keranjangDetail.product.harga * newJumlah;

    this.setState({ jumlah: newJumlah, totalHarga });
  };

  kurang = () => {
    const { keranjangDetail, jumlah } = this.state;
    if (jumlah <= 1 || !keranjangDetail?.product) return;

    const newJumlah = jumlah - 1;
    const totalHarga = keranjangDetail.product.harga * newJumlah;

    this.setState({ jumlah: newJumlah, totalHarga });
  };

  changeHandler = (event) => {
    this.setState({ keterangan: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.handleClose();
  
    const { jumlah, totalHarga, keterangan, keranjangDetail } = this.state;
    if (!keranjangDetail?.product) return;
  
    const data = {
      jumlah,
      total_harga: totalHarga,
      product: keranjangDetail.product,
      keterangan,
    };
  
    axios
      .put(`${API_URL}keranjangs/${keranjangDetail.id}`, data)
      .then(() => {
        swal({
          title: "Update Pesanan!",
          text: `Sukses Update Pesanan ${data.product.nama}`,
          icon: "success",
          button: false,
          timer: 1500,
        });

        // 👉 Refresh data dari parent (mengambil ulang data keranjang)
        if (this.props.getListKeranjang) {
          this.props.getListKeranjang();
        }
      })
      .catch((error) => {
        console.error("Update error:", error);
      });
  };
  
  hapusPesanan = (id) => {
    this.handleClose();
  
    axios
      .delete(`${API_URL}keranjangs/${id}`)
      .then(() => {
        swal({
          title: "Hapus Pesanan!",
          text: `Sukses Hapus Pesanan ${this.state.keranjangDetail?.product?.nama}`,
          icon: "error",
          button: false,
          timer: 1500,
        });
  
        // Memanggil fungsi dari parent untuk menyegarkan data keranjang
        if (this.props.getListKeranjang) {
          this.props.getListKeranjang();
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
      });
  };   

  render() {
    const { keranjangs } = this.props;
    const { showModal, keranjangDetail, jumlah, keterangan, totalHarga } = this.state;

    return (
      <Col md={3} className="mt-3">
        <h4><strong>Hasil</strong></h4>
        <hr />
        {keranjangs.length > 0 && (
          <Card className="overflow-auto hasil">
            <ListGroup variant="flush">
              {keranjangs.map((menuKeranjang) => (
                <ListGroup.Item
                  key={menuKeranjang.id}
                  onClick={() => this.handleShow(menuKeranjang)}
                  style={{ cursor: "pointer" }}
                >
                  <Row>
                    <Col xs={2}>
                      <h4>
                        <Badge pill bg="success">
                          {menuKeranjang.jumlah}
                        </Badge>
                      </h4>
                    </Col>
                    <Col>
                      <h5>{menuKeranjang.product.nama}</h5>
                      <p>Rp. {numberWithCommas(menuKeranjang.product.harga)}</p>
                    </Col>
                    <Col>
                      <strong className="float-end">
                        Rp. {numberWithCommas(menuKeranjang.total_harga)}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}

              <ModalKeranjang
                showModal={showModal}
                handleClose={this.handleClose}
                keranjangDetail={keranjangDetail}
                jumlah={jumlah}
                keterangan={keterangan}
                totalHarga={totalHarga}
                tambah={this.tambah}
                kurang={this.kurang}
                changeHandler={this.changeHandler}
                handleSubmit={this.handleSubmit}
                hapusPesanan={this.hapusPesanan}
              />
            </ListGroup>
          </Card>
        )}

        <TotalBayar keranjangs={keranjangs} {...this.props} />
      </Col>
    );
  }
}
