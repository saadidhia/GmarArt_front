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
              <li>Email: contact@gmarart.com</li>
              <li>Phone: +49 1517 0419399</li>
              <li>Address: 123 Art Street, NY</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Social Media</h4>
            <div className="social-links">
              <a href="https://www.instagram.com/ferouk_gmar/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
              <a href="https://www.facebook.com/farouk.gmar" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Gm'ar,t Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
