import React from "react";
import {Nav, Navbar, Container } from 'react-bootstrap'
import {Link} from 'react-router-dom'


const NavbarComponent = () => {
  return (
    <Navbar variant="dark" expand="lg" className="custom-navbar">
     <Container fluid>
      <Navbar.Brand as={Link} to="/"><strong>Dapur</strong> Nusantara</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/About">About</Nav.Link>
          <Nav.Link as={Link} to="/Menuu">Menu</Nav.Link>
          <Nav.Link as={Link} to="/Review">Riview</Nav.Link>
          <Nav.Link as={Link} to="/Contact">Contact</Nav.Link>
        </Nav>
        
      </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
