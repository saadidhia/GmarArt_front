import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import logo from './assets/images/logo.png';

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <div className="logo-section">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="FeroukArt" className="site-logo" />
          </Link>
          <p className="logo-tagline">-- Visual Artist --</p>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-home-icon" aria-label="Home" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11L12 4L21 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10V20H19V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 20V14H15V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/#gallery" onClick={closeMenu}>Original Paintings</Link>
          <Link to="/limited-edition-prints" onClick={closeMenu}>Limited Edition Prints</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/commission" onClick={closeMenu}>Commission</Link>
          <Link to="/#contact" onClick={closeMenu}>Contact</Link>
        </nav>

        {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

        <CartIcon />
      </div>
    </header>
  );
};

export default SiteHeader;
