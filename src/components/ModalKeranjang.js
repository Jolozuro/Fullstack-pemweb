import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModalKeranjang = ({
  showModal,
  handleClose,
  keranjangDetail,
  jumlah,
  keterangan,
  tambah,
  kurang,
  changeHandler,
  handleSubmit,
  totalHarga,
  hapusPesanan
}) => {
  if (keranjangDetail) {
    return (
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {keranjangDetail.product.nama}{" "}
            <strong>
              (Rp. {numberWithCommas(keranjangDetail.product.harga)})
            </strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="totalHarga">
                  <Form.Label>Total Harga :</Form.Label>
                  <p>
                    <strong>Rp. {numberWithCommas(totalHarga)}</strong>
                  </p>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="jumlah">
                  <Form.Label>Jumlah :</Form.Label>
                  <div className="d-flex align-items-center">
                    <Button variant="outline-primary" size="sm" onClick={kurang}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <strong className="mx-2">{jumlah}</strong>
                    <Button variant="outline-primary" size="sm" onClick={tambah}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="keterangan">
                  <Form.Label>Keterangan :</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="keterangan"
                    placeholder="Contoh : Pedes, Nasi Setengah"
                    value={keterangan}
                    onChange={changeHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Simpan
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => hapusPesanan(keranjangDetail.id)}>
            <FontAwesomeIcon icon={faTrash} /> Hapus Pesanan
          </Button>
        </Modal.Footer>
      </Modal>
    );
  } else {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Kosong</Modal.Title>
        </Modal.Header>
        <Modal.Body>Kosong</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default ModalKeranjang;
