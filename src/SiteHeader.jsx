import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import logo from './assets/images/logo.png';

const SiteHeader = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-section">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="FeroukArt" className="site-logo" />
          </Link>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-home-icon" aria-label="Home">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11L12 4L21 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10V20H19V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 20V14H15V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/#gallery">Original Paintings</Link>
          <Link to="/limited-edition-prints">Limited Edition Prints</Link>
          <Link to="/about">About</Link>
          <Link to="/commission">Commission</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
        <CartIcon />
      </div>
    </header>
  );
};

export default SiteHeader;
