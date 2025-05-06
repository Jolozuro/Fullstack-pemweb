import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavbarComponent from './components/NavbarComponent'
import { Home, About, Menu } from './pages/index'

export default class App extends Component {
  render() {
    return (
      <Router>
        <NavbarComponent/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/menu' element={<Menu />}/>
        </Routes>
      </Router>
    )
  }
}
