import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { API_URL } from '../utils/constants'; // sesuaikan path jika berbeda
import 'animate.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Pesan berhasil dikirim!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Gagal mengirim pesan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan');
    }
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f9f9f9" }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={8}>
            <h2 className="mb-4 text-center">Hubungi Kami</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nama Anda</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Nama Anda"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email Anda</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Masukkan Email Anda"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formMessage">
                <Form.Label>Pesan</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Tulis pesan Anda"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Kirim Pesan</Button>
            </Form>
          </Col>
        </Row>

        <hr />
        <Row className="text-center mt-5">
          <Col md={4}>
            <h5>📞 WhatsApp</h5>
            <p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                +62 812 3456 7890
              </a>
            </p>
          </Col>
          <Col md={4}>
            <h5>📧 Email</h5>
            <p>
              <a href="mailto:cont@dapur-nusantara.com">
                contact@dapur-nusantara.com
              </a>
            </p>
          </Col>
          <Col md={4}>
            <h5>📍 Lokasi</h5>
            <p>Jl. Raya No. 123, Cirebon, Indonesia</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;
