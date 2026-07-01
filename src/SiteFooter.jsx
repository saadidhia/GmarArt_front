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
              <li>Phone: +49 1578 1506415</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Social Media</h4>
            <div className="social-links">
              <a href="https://www.instagram.com/gmar_art?utm_source=qr&igsh=czkzc2dmaWtmeHpk" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
                </svg>
              </a>
              <a href="https://www.facebook.com/100063269016529/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8.5h2V5.4c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.78-4.92 5.05v2.6H6.5V16h2.63v8h3.24v-8h2.62l.42-3.1h-3.04v-2.28c0-.9.24-1.52 1.6-1.52Z" fill="currentColor" />
                </svg>
              </a>
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
