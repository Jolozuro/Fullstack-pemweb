import React, { Component } from "react";
import { Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCoffee,
  faCheese,
} from "@fortawesome/free-solid-svg-icons";

// Komponen Icon Kategori
const Icon = ({ nama }) => {
  if (nama === "Makanan")
    return <FontAwesomeIcon icon={faUtensils} className="me-2" />;
  if (nama === "Minuman")
    return <FontAwesomeIcon icon={faCoffee} className="me-2" />;
  if (nama === "Cemilan")
    return <FontAwesomeIcon icon={faCheese} className="me-2" />;
  return <FontAwesomeIcon icon={faUtensils} className="me-2" />;
};

export default class ListCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [], // harus array supaya aman untuk .map()
    };
  }

  componentDidMount() {
    axios
      .get(`${API_URL}get_categories.php`)
      .then((res) => {
        console.log("✅ Response kategori:", res.data);
        if (Array.isArray(res.data)) {
          this.setState({ categories: res.data });
        } else {
          console.warn("⚠️ Data kategori bukan array:", res.data);
          this.setState({ categories: [] });
        }
      })
      .catch((error) => {
        console.error("❌ Error mengambil kategori:", error);
      });
  }

  render() {
    const { categories } = this.state;
    const { changeCategory, kategoriYangDipilih } = this.props;

    return (
      <Col md={2} className="mt-3">
        <h4>
          <strong>Daftar Kategori</strong>
        </h4>
        <hr />
        <ListGroup>
          {categories.length > 0 ? (
            categories.map((category) => (
              <ListGroup.Item
                key={category.id}
                onClick={() => changeCategory(category.nama)}
                className={
                  kategoriYangDipilih === category.nama ? "category-aktif" : ""
                }
                style={{ cursor: "pointer" }}
              >
                <h5>
                  <Icon nama={category.nama} /> {category.nama}
                </h5>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item disabled>
              <small className="text-muted">Tidak ada kategori</small>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Col>
    );
  }
}
