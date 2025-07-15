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
    loading: false,
  };

  handleShow = (menuKeranjang) => {
    this.setState({
      showModal: true,
      keranjangDetail: menuKeranjang,
      jumlah: parseInt(menuKeranjang.jumlah),
      keterangan: menuKeranjang.keterangan || "",
      totalHarga: menuKeranjang.total_harga,
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
      keranjangDetail: null,
      jumlah: 0,
      keterangan: "",
      totalHarga: 0,
    });
  };

  tambah = () => {
    const { keranjangDetail, jumlah } = this.state;
    if (!keranjangDetail?.product) return;

    const newJumlah = parseInt(jumlah) + 1;
    const totalHarga = keranjangDetail.product.harga * newJumlah;

    this.setState({ jumlah: newJumlah, totalHarga });
  };

  kurang = () => {
    const { keranjangDetail, jumlah } = this.state;
    if (jumlah <= 1 || !keranjangDetail?.product) return;

    const newJumlah = parseInt(jumlah) - 1;
    const totalHarga = keranjangDetail.product.harga * newJumlah;

    this.setState({ jumlah: newJumlah, totalHarga });
  };

  changeHandler = (event) => {
    this.setState({ keterangan: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    this.handleClose();

    const { jumlah, totalHarga, keterangan, keranjangDetail } = this.state;
    if (!keranjangDetail?.product?.id) {
      console.error("id_product tidak ditemukan!");
      return;
    }

    const data = {
      id_product: keranjangDetail.product.id, // WAJIB
      jumlah: parseInt(jumlah),
      total_harga: totalHarga,
      keterangan,
    };

    console.log("KIRIM DATA:", data); // Cek di console

    axios
      .post(`${API_URL}add_keranjang.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        swal({
          title: "Update Pesanan!",
          text: `Sukses Update Pesanan ${keranjangDetail.product.nama}`,
          icon: "success",
          button: false,
          timer: 1500,
        });

        if (this.props.getListKeranjang) {
          this.props.getListKeranjang();
        }
      })
      .catch((error) => {
        console.error("Gagal tambah/update keranjang:", error);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  
  

  hapusPesanan = (id) => {
    this.setState({ loading: true });
    this.handleClose();

    axios.post(`${API_URL}delete_keranjang.php`, { id }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        swal({
          title: "Hapus Pesanan!",
          text: "Pesanan berhasil dihapus",
          icon: "error",
          button: false,
          timer: 1500,
        });

        if (this.props.getListKeranjang) {
          this.props.getListKeranjang();
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { keranjangs } = this.props;
    const {
      showModal,
      keranjangDetail,
      jumlah,
      keterangan,
      totalHarga,
      loading,
    } = this.state;

    return (
      <Col md={3} className="mt-3">
        <h4><strong>Hasil</strong></h4>
        <hr />
        {keranjangs?.length > 0 && (
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
                      <h5>{menuKeranjang.product?.nama || "Menu Tidak Ditemukan"}</h5>
                      <p>Rp. {numberWithCommas(menuKeranjang.product?.harga || 0)}</p>
                    </Col>
                    <Col>
                      <strong className="float-end">
                        Rp. {numberWithCommas(menuKeranjang.total_harga)}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        )}

        {/* Modal keranjang */}
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
          loading={loading}
        />

        {/* Total */}
        <TotalBayar keranjangs={keranjangs} {...this.props} />
      </Col>
    );
  }
}
 