import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarComponent } from './components';
import { Menuu, Home, About} from './pages';

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
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
}
