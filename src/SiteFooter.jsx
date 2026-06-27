import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from './assets/images/logo-white.png';

const SiteFooter = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <img src={logoWhite} alt="FeroukArt" className="footer-logo" />
            <p>Inspired by land & Oceanscapes.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/#gallery">Original Paintings</Link></li>
              <li><Link to="/limited-edition-prints">Limited Edition Prints</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/commission">Commission</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: info@feroukart.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Art Street, NY</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Social Media</h4>
            <div className="social-links">
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Pinterest">📌</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 FeroukArt Gallery. All rights reserved.</p>
          <Link to="/admin/ferouk/login" className="admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
