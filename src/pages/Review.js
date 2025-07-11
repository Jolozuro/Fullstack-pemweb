import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ name: '', comment: '' });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:3004/reviews';

  useEffect(() => {
    fetchReviews();
  }, []);


  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_URL);
      setReviews(res.data.reverse());
    } catch (error) {
      console.error('Gagal mengambil data review:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.comment.trim().length >= 1) {
      try {
        if (editingId) {
          await axios.put(`${API_URL}/${editingId}`, formData);
          setMessage('Review berhasil diperbarui!');
        } else {
          await axios.post(API_URL, formData);
          setMessage('Review berhasil dikirim!');
        }

        setFormData({ name: '', comment: '' });
        setEditingId(null);
        fetchReviews();
      } catch (error) {
        console.error('Gagal menyimpan review:', error);
        setMessage('Terjadi kesalahan saat menyimpan review.');
      }
    } else {
      setMessage('Komentar minimal 10 karakter.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (review) => {
    setFormData({ name: review.name, comment: review.comment });
    setEditingId(review.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', comment: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchReviews();
    } catch (error) {
      console.error('Gagal menghapus review:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">{editingId ? 'Edit Review' : 'Review Pengguna'}</h2>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formComment">
              <Form.Label>Komentar</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                placeholder="Tulis komentar"
                value={formData.comment}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex gap-2">
          <Button type="submit" variant={editingId ? 'warning' : 'primary'}>
            {editingId ? 'Simpan Perubahan' : 'Kirim Review'}
          </Button>
          {editingId && (
            <Button variant="secondary" onClick={handleCancelEdit}>
              Batal Edit
            </Button>
          )}
        </div>
      </Form>

      {message && <div className="mt-3 alert alert-info">{message}</div>}

      <hr />

      {reviews.map((review) => (
        <Card key={review.id} className="mb-3">
          <Card.Body>
            <Card.Title>{review.name}</Card.Title>
            <Card.Text>{review.comment}</Card.Text>
            <div className="d-flex gap-2">
              <Button variant="primary" size="sm" onClick={() => handleEdit(review)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(review.id)}>
                Hapus
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Review;
