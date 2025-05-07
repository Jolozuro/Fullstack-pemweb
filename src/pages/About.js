import React from 'react';
import 'animate.css';

function About() {
  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="row min-vh-100 justify-content-center align-items-center text-center">

        {/* Gambar bundar dengan animasi */}
        <div className="col-md-4 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <div
            className="rounded-circle shadow animate__animated animate__zoomIn"
            style={{
              width: '300px',
              height: '300px',
              backgroundImage: "url('/assets/images/makanan/lontong-opor-ayam.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: 'translateY(-100px)',
            }}
          ></div>
        </div>

        {/* Teks dengan animasi bertahap */}
        <div className="col-md-6 text-md-left px-4" style={{ marginTop: '-150px' }}>
          <h1 className="mb-3 animate__animated animate__fadeInDown">Tentang Kami</h1>
          <h5 className="text-muted mb-4 animate__animated animate__fadeInDown animate__delay-1s">
            Cita rasa Nusantara dalam setiap sajian
          </h5>
          <p className="lead animate__animated animate__fadeInUp animate__delay-2s">
            Selamat datang di <strong>Dapur Nusantara</strong>, tempat di mana cita rasa lezat bertemu dengan suasana hangat dan pelayanan ramah.
          </p>
          <p className="lead animate__animated animate__fadeInUp animate__delay-3s">
            Sejak berdiri pada tahun <strong>2025</strong>, kami berkomitmen menyajikan hidangan berkualitas dari bahan-bahan segar.
          </p>
          <a
            href="/menuu"
            className="btn btn-primary mt-3 animate__animated animate__zoomIn animate__delay-4s"
          >
            Lihat Menu Kami
          </a>
        </div>

      </div>
    </div>
  );
}

export default About;
