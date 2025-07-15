import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Hasil, ListCategory, Menus } from "../components";
import { API_URL } from "../utils/constants";
import axios from "axios";
import swal from "sweetalert";

class Menuu extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      menus: [],
      kategoriYangDipilih: "Makanan",
      keranjangs: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getProducts(this.state.kategoriYangDipilih);
    this.getKeranjangs();
    console.log("Mounted, ambil data...");
  }
  

  componentWillUnmount() {
    this._isMounted = false;
  }

  getProducts = (kategori = "Makanan") => {
    axios
      .get(`${API_URL}get_products.php?category=${kategori}`)
      .then((res) => {
        if (this._isMounted) {
          const data = res.data;
          if (Array.isArray(data)) {
            this.setState({ menus: data });
          } else {
            console.warn("❌ Produk bukan array:", data);
            this.setState({ menus: [] });
          }
        }
      })
      .catch((error) => {
        console.error("Error get_products:", error);
      });
  };

  getKeranjangs = () => {
    axios
      .get(`${API_URL}get_keranjangs.php`)
      .then((res) => {
        if (this._isMounted) {
          const data = res.data;
          if (Array.isArray(data)) {
            this.setState({ keranjangs: data });
          } else {
            console.warn("❌ Keranjang bukan array:", data);
            this.setState({ keranjangs: [] });
          }
        }
      })
      .catch((error) => {
        console.error("Error get_keranjangs:", error);
      });
  };

  changeCategory = (value) => {
    this.setState({ kategoriYangDipilih: value }, () => {
      this.getProducts(value);
    });
  };

  masukKeranjang = (value) => {
    axios.get(`${API_URL}get_keranjangs.php?product_id=${value.id}`)
      .then((res) => {
        const existingData = Array.isArray(res.data) ? res.data : [];

        if (existingData.length === 0) {
          // Belum ada di keranjang
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product_id: value.id,
          };

          axios.post(`${API_URL}add_keranjang.php`, keranjang, {
            headers: { "Content-Type": "application/json" },
          }).then(() => {
            this.getKeranjangs();
            swal({
              title: "Sukses Masuk Keranjang",
              text: `Produk ${value.nama} ditambahkan.`,
              icon: "success",
              button: false,
              timer: 1500,
            });
          });
        } else {
          // Sudah ada, tinggal update
          const existing = existingData[0];
          const keranjang = {
            id: existing.id,
            jumlah: parseInt(existing.jumlah) + 1,
            total_harga: parseInt(existing.total_harga) + parseInt(value.harga),
            keterangan: existing.keterangan || "",
          };

          axios.post(`${API_URL}update_keranjang.php`, keranjang, {
            headers: { "Content-Type": "application/json" },
          }).then(() => {
            this.getKeranjangs();
            swal({
              title: "Sukses Update Keranjang",
              text: `Produk ${value.nama} diperbarui.`,
              icon: "success",
              button: false,
              timer: 1500,
            });
          });
        }
      });
  };   

  render() {
    const { menus, kategoriYangDipilih, keranjangs } = this.state;

    return (
      <div className="mt-3">
        <Container fluid>
          <Row>
            <ListCategory
              changeCategory={this.changeCategory}
              kategoriYangDipilih={kategoriYangDipilih}
            />

            <Col className="mt-3">
              <h4><strong>Daftar Produk</strong></h4>
              <hr />
              <Row className="overflow-auto menu">
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <Menus
                      key={menu.id}
                      menu={menu}
                      masukKeranjang={this.masukKeranjang}
                    />
                  ))
                ) : (
                  <Col>
                    <p className="text-muted">Produk tidak ditemukan.</p>
                  </Col>
                )}
              </Row>
            </Col>

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
