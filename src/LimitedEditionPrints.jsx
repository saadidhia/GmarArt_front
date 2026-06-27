import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import './assets/styles/HomePage.css';

const LimitedEditionPrints = () => {
  return (
    <div className="home-page">
      <SiteHeader />

      <section className="hero">
        <div className="hero-background">
          <div className="art-element element-1"></div>
          <div className="art-element element-2"></div>
          <div className="art-element element-3"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">Limited Edition Prints</h1>
          <p className="hero-subtitle">
            Museum-quality, numbered reproductions of our most sought-after originals
          </p>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2 className="section-title">Our Print Collection</h2>
          <p className="section-subtitle">
            Each print is signed and numbered, printed on archival fine-art paper
          </p>
          <div className="empty-message">
            <p>
              Our limited edition print collection is being curated and will be available soon.
              In the meantime, reach out to us if you'd like to be notified when a piece is released.
            </p>
            <Link to="/commission" className="btn btn-primary" style={{ marginTop: '20px' }}>Get in Touch</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default LimitedEditionPrints;
