import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarComponent } from './components';
import { Menuu, Home, About, Review, Contact, Sukses} from './pages';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavbarComponent />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menuu" element={<Menuu />} />
            <Route path="/about" element={<About />} />  {/* Pastikan path-nya sesuai */}
            <Route path="/review" element={<Review />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sukses" element={<Sukses />} />
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
}
