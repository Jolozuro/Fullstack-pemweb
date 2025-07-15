import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarComponent } from './components';
import { Menuu, Home, About, Review, Contact, Sukses } from './pages';
import AdminDashboard from './pages/AdminDashboard'; // Tambahkan ini

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavbarComponent />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menuu" element={<Menuu />} />
            <Route path="/about" element={<About />} />
            <Route path="/review" element={<Review />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sukses" element={<Sukses />} />
            <Route path="/admin" element={<AdminDashboard />} /> {/* Ini route ke dashboard admin */}
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
}
