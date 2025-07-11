import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { Component } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import { API_URL } from "../utils/constants";
import { withNavigation } from "../utils/withNavigation";
import swal from "sweetalert";

class TotalBayar extends Component {
  submitTotalBayar = (totalBayar) => {
    const { keranjangs, navigate } = this.props;

    if (keranjangs.length === 0) {
      return swal({
        title: "Gagal!",
        text: "Keranjang masih kosong!",
        icon: "error",
        button: false,
        timer: 1500,
      });
    }

    // 💡 Ambil data penting saja
    const menus = keranjangs.map(item => ({
      product_id: item.product_id,
      jumlah: item.jumlah,
      total_harga: item.total_harga
    }));

    const pesanan = {
      total_bayar: totalBayar,
      menus: menus
    };

    axios.post(`${API_URL}pesanans.php`, pesanan, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        swal({
          title: "Pesanan Berhasil!",
          text: `Total: Rp ${numberWithCommas(totalBayar)}`,
          icon: "success",
          button: false,
          timer: 2000,
        });

        // 💡 Redirect ke halaman sukses
        navigate("/sukses");
      })
      .catch((error) => {
        console.error("Error saat checkout:", error);
        swal({
          title: "Gagal!",
          text: "Terjadi kesalahan saat memproses pesanan.",
          icon: "error",
          button: false,
          timer: 2000,
        });
      });
  };

  render() {
    const { keranjangs } = this.props;

    const totalBayar = keranjangs.reduce((result, item) => {
      return result + parseInt(item.total_harga);
    }, 0);

    return (
      <>
        {/* Desktop */}
        <div className="fixed-bottom d-none d-md-block">
          <Row>
            <Col md={{ span: 3, offset: 9 }} className="px-4">
              <h4>
                Total Harga :{" "}
                <strong className="float-right">
                  Rp. {numberWithCommas(totalBayar)}
                </strong>
              </h4>
              <Button
                variant="primary"
                className="w-100 mb-2 mt-4"
                size="lg"
                onClick={() => this.submitTotalBayar(totalBayar)}
              >
                <FontAwesomeIcon icon={faShoppingCart} /> <strong>BAYAR</strong>
              </Button>
            </Col>
          </Row>
        </div>

        {/* Mobile */}
        <div className="d-sm-block d-md-none">
          <Row>
            <Col className="px-4">
              <h4>
                Total Harga :{" "}
                <strong className="float-right">
                  Rp. {numberWithCommas(totalBayar)}
                </strong>
              </h4>
              <Button
                variant="primary"
                className="w-100 mb-2 mt-4"
                size="lg"
                onClick={() => this.submitTotalBayar(totalBayar)}
              >
                <FontAwesomeIcon icon={faShoppingCart} /> <strong>BAYAR</strong>
              </Button>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default withNavigation(TotalBayar);
