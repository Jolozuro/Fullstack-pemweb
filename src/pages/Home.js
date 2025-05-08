import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/menuu');
  };

  return (
    <div
      className="hero-section d-flex align-items-center"
      style={{
        backgroundImage: "url('/assets/images/hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif", // Font modern
      }}
    >
      <div
        className="overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Gelapkan gambar untuk kontras
          zIndex: 1,
        }}
      ></div>

      <Container
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Row className="min-vh-100 d-flex align-items-center">
          <Col xs={12} md={7}>
            <h1 className="mb-4 text-white animate__animated animate__fadeInDown">
              <strong>Selamat Datang di Dapur Nusantara</strong>
            </h1>
            <p className="lead text-white animate__animated animate__fadeInUp animate__delay-1s">
              Nikmati pengalaman kuliner yang tak terlupakan di Dapur Nusantara. Kami menghadirkan kekayaan cita rasa Indonesia melalui berbagai pilihan menu favorit dari hidangan tradisional yang menggugah kenangan, hingga kreasi modern penuh inovasi.
            </p>
            <p className="lead text-white animate__animated animate__fadeInUp animate__delay-2s">
              Temukan kelezatan dalam setiap gigitan. Mari rayakan keberagaman rasa Nusantara bersama kami.
            </p>
            <Button
              onClick={handleClick}
              variant="light"
              size="lg"
              className="mt-3 animate__animated animate__zoomIn animate__delay-3s"
              style={{ 
                backgroundColor: '#22668A',
                borderColor: '#22668A',
                color: 'white',
                fontWeight: '600'
              }}
            >
              Lihat Menu Kami
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
