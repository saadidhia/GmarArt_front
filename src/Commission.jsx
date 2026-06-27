import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import './assets/styles/HomePage.css';

const steps = [
  {
    title: '1. Tell us your vision',
    text: 'Share the size, style, color palette, and subject you have in mind for your custom piece.',
  },
  {
    title: '2. Get a quote',
    text: "We'll review your request and reply with pricing, timeline, and a deposit to get started.",
  },
  {
    title: '3. Watch it come to life',
    text: "We'll keep you updated with progress photos as your original artwork is created.",
  },
  {
    title: '4. Delivery',
    text: 'Once approved, your finished commission is carefully packaged and shipped to your door.',
  },
];

const Commission = () => {
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
          <h1 className="hero-title">Commission a Piece</h1>
          <p className="hero-subtitle">
            Work with our artists to create a one-of-a-kind original made just for you
          </p>
          <div className="hero-buttons">
            <a href="mailto:info@feroukart.com?subject=Commission%20Request" className="btn btn-primary">
              Start a Commission
            </a>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">From idea to finished artwork in four simple steps</p>
          <div className="artwork-grid">
            {steps.map((step) => (
              <div key={step.title} className="artwork-card" style={{ cursor: 'default' }}>
                <div className="artwork-info">
                  <h3>{step.title}</h3>
                  <p className="painting-size">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Commission;
