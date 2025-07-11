import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";

export default class Sukses extends Component {
  componentDidMount() {
    axios
      .get(API_URL + "get_keranjangs.php")
      .then((res) => {
        const keranjangs = res.data;
        keranjangs.forEach((item) => {
          axios
            .post(API_URL + "delete_keranjang.php", JSON.stringify({ id: item.id }), {
              headers: { "Content-Type": "application/json" }
            })
            .then((res) => console.log("Deleted:", res.data))
            .catch((error) => console.log("Delete error:", error));
        });
      })
      .catch((error) => {
        console.log("Error yaa ", error);
      });
  }

  render() {
    return (
      <div className="mt-4 text-center">
        <Image src="assets/images/sukses.png" width="500" />
        <h2>Sukses Pesan</h2>
        <p>Terimakasih Sudah Memesan!</p>
        <Button variant="primary" as={Link} to="/">
          Kembali
        </Button>
      </div>
    );
  }
}
