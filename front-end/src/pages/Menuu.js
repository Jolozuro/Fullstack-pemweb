import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Hasil, Menus } from "../components";
import { API_URL } from "../utils/constants";
import axios from "axios";
import swal from "sweetalert";
import ListCategory from "../components/ListCategory";

class Menuu extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      semuaProduk: [],
      keranjangs: [],
      kategoriYangDipilih: "Makanan",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllProducts();
    this.getKeranjangs();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllProducts = () => {
    axios
      .get(`${API_URL}products.php`)
      .then((res) => {
        const response = res.data;

        if (
          response &&
          response.status === "success" &&
          Array.isArray(response.data)
        ) {
          const semuaProduk = response.data.flatMap((kategori) =>
            kategori.produk.map((produk) => ({
              ...produk,
              category_id: kategori.kategori_id,
              kategori_nama: kategori.kategori_nama,
            }))
          );

          if (this._isMounted) {
            this.setState({ semuaProduk });
          }
        } else {
          console.warn("❌ Format data tidak sesuai:", response);
          this.setState({ semuaProduk: [] });
        }
      })
      .catch((err) => {
        console.error("❌ Gagal ambil semua produk:", err);
      });
  };

  getKeranjangs = () => {
    axios
      .get(`${API_URL}get_keranjangs.php`)
      .then((res) => {
        if (this._isMounted) {
          const data = res.data;
          this.setState({ keranjangs: Array.isArray(data) ? data : [] });
        }
      })
      .catch((err) => {
        console.error("❌ Gagal ambil keranjang:", err);
      });
  };

  changeCategory = (namaKategori) => {
    this.setState({ kategoriYangDipilih: namaKategori });
  };

  masukKeranjang = (value) => {
    axios
      .get(`${API_URL}get_keranjangs.php?product_id=${value.id}`)
      .then((res) => {
        const existingData = Array.isArray(res.data) ? res.data : [];

        if (existingData.length === 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product_id: value.id,
          };

          axios
            .post(`${API_URL}add_keranjang.php`, keranjang, {
              headers: { "Content-Type": "application/json" },
            })
            .then(() => {
              this.getKeranjangs();
              swal({
                title: "Berhasil!",
                text: `${value.nama} masuk keranjang.`,
                icon: "success",
                button: false,
                timer: 1500,
              });
            });
        } else {
          const existing = existingData[0];
          const keranjang = {
            id: existing.id,
            jumlah: parseInt(existing.jumlah) + 1,
            total_harga:
              parseInt(existing.total_harga) + parseInt(value.harga),
            keterangan: existing.keterangan || "",
          };

          axios
            .post(`${API_URL}update_keranjang.php`, keranjang, {
              headers: { "Content-Type": "application/json" },
            })
            .then(() => {
              this.getKeranjangs();
              swal({
                title: "Update Keranjang",
                text: `${value.nama} diperbarui.`,
                icon: "success",
                button: false,
                timer: 1500,
              });
            });
        }
      });
  };

  render() {
    const { semuaProduk, keranjangs, kategoriYangDipilih } = this.state;

    const produkFiltered = semuaProduk.filter(
      (menu) => menu.kategori_nama === kategoriYangDipilih
    );

    return (
      <div className="mt-3">
        <Container fluid>
          <Row>
            {/* Sidebar kategori */}
            <ListCategory
              changeCategory={this.changeCategory}
              kategoriYangDipilih={kategoriYangDipilih}
            />

            {/* Produk */}
            <Col md={7}>
              <h4><strong>🛒 Semua Produk</strong></h4>
              <hr />
              <div className="menu-container">
                <Row className="g-4"> {/* Tambahkan jarak antar Col */}
                  {produkFiltered.length > 0 ? (
                    produkFiltered.map((menu) => {
                      return (
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          key={menu.id}
                          className="d-flex mb-5" // Tambahkan mb-5 di Col
                        >
                          <Menus
                            menu={menu}
                            masukKeranjang={this.masukKeranjang}
                          />
                        </Col>
                      );
                    })
                  ) : (
                    <Col>
                      <p className="text-muted">Tidak ada produk tersedia.</p>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>

            {/* Keranjang */}
            <Hasil
              keranjangs={keranjangs}
              getListKeranjang={this.getKeranjangs}
              {...this.props}
            />
          </Row>
        </Container>
      </div>
    );
  }
}

export default Menuu;
