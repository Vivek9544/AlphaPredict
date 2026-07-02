import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">📈</span>
          <h1>StockPredictor</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="/" className="active">Home</a></li>
          <li><a href="#about">About Model</a></li>
          <li><a href="#github">GitHub</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
