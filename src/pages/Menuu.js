import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Menus, ListCategories, Hasil } from "../components";
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getProducts = (kategori) => {
    axios
      .get(API_URL + "products?category.nama=" + kategori)
      .then((res) => {
        if (this._isMounted) {
          this.setState({ menus: res.data });
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  getKeranjangs = () => {
    axios
      .get(API_URL + "keranjangs")
      .then((res) => {
        if (this._isMounted) {
          this.setState({ keranjangs: res.data });
        }
      })
      .catch((error) => {
        console.error("Error fetching keranjangs:", error);
      });
  };

  changeCategory = (value) => {
    this.setState(
      { kategoriYangDipilih: value, menus: [] },
      () => this.getProducts(value)
    );
  };

  masukKeranjang = (value) => {
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then((res) => {
        if (res.data.length === 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
          };

          axios
            .post(API_URL + "keranjangs", keranjang)
            .then(() => {
              this.getKeranjangs(); // refresh
              swal({
                title: "Sukses Masuk Keranjang",
                text: `Produk ${value.nama} ditambahkan.`,
                icon: "success",
                button: false,
                timer: 1500,
              });
            });
        } else {
          const existing = res.data[0];
          const keranjang = {
            jumlah: existing.jumlah + 1,
            total_harga: existing.total_harga + value.harga,
            product: value,
          };

          axios
            .put(API_URL + "keranjangs/" + existing.id, keranjang)
            .then(() => {
              this.getKeranjangs(); // refresh
              swal({
                title: "Sukses Update Keranjang",
                text: `Produk ${value.nama} diperbarui.`,
                icon: "success",
                button: false,
                timer: 1500,
              });
            });
        }
      })
      .catch((error) => {
        console.error("Error keranjang:", error);
      });
  };

  render() {
    const { menus, kategoriYangDipilih } = this.state;
    return (
      <div className="mt-3">
        <Container fluid>
          <Row>
            <ListCategories/>
            <Col className="mt-3">
              <h4><strong>Daftar Produk</strong></h4>
              <hr />
              <Row className="overflow-auto menu">
                {menus.map((menu) => (
                  <Menus
                    key={menu.id}
                    menu={menu}
                    masukKeranjang={this.masukKeranjang}
                  />
                ))}
              </Row>
            </Col>
            <Hasil/>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Menuu;
