import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './assets/styles/HomePage.css';

const HomePage = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaintings();
  }, []);

  const fetchPaintings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/paintings/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch paintings');
      }
      
      const data = await response.json();
      console.log('Fetched paintings:', data);
      setPaintings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching paintings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:8081${imageUrl}`;
    }
    if (!imageUrl.startsWith('/')) {
      return `http://localhost:8081/uploads/paintings/${imageUrl}`;
    }
    return `http://localhost:8081${imageUrl}`;
  };

  const getAllImageUrls = (painting) => {
    const urls = [];
    for (let i = 1; i <= 5; i++) {
      const urlKey = `imageUrl${i}`;
      if (painting[urlKey]) {
        urls.push(getImageUrl(painting[urlKey]));
      }
    }
    return urls;
  };

  const getFirstImageUrl = (painting) => {
    const allUrls = getAllImageUrls(painting);
    return allUrls.length > 0 ? allUrls[0] : null;
  };

  const getImageCount = (painting) => {
    return getAllImageUrls(painting).length;
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <div className="logo-section">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.66 22 15 20.66 15 19C15 18.31 14.75 17.68 14.34 17.19C13.94 16.71 13.69 16.08 13.69 15.38C13.69 14.28 14.58 13.38 15.69 13.38H17C19.76 13.38 22 11.14 22 8.38C22 4.69 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/>
              <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/>
              <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
              <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
            </svg>
            <h1>FeroukArt</h1>
          </div>
          <nav className="nav">
            <a href="#gallery">Gallery</a>
            <a href="#artists">Artists</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-background">
          <div className="art-element element-1"></div>
          <div className="art-element element-2"></div>
          <div className="art-element element-3"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">Discover Extraordinary Art</h1>
          <p className="hero-subtitle">
            Explore our curated collection of unique artworks from talented artists around the world
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Explore Gallery</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="featured" id="gallery">
        <div className="container">
          <h2 className="section-title">Featured Artworks</h2>
          <p className="section-subtitle">Handpicked masterpieces from our collection</p>
          
          {loading && <div className="loading-message"><p>Loading paintings...</p></div>}
          
          {error && (
            <div className="error-message">
              <p>Error loading paintings: {error}</p>
              <button onClick={fetchPaintings} className="btn btn-primary">Retry</button>
            </div>
          )}
          
          {!loading && !error && paintings.length === 0 && (
            <div className="empty-message"><p>No paintings available at the moment.</p></div>
          )}
          
          {!loading && !error && paintings.length > 0 && (
            <div className="artwork-grid">
              {paintings.map((painting) => {
                const firstImageUrl = getFirstImageUrl(painting);
                const imageCount = getImageCount(painting);
                const hasMultipleImages = imageCount > 1;
                
                return (
                  <div key={painting.id} className="artwork-card">
                    <div className="artwork-image">
                      {hasMultipleImages && (
                        <div className="multiple-images-badge">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" opacity="0.3"/>
                          </svg>
                          {imageCount}
                        </div>
                      )}
                      
                      {firstImageUrl ? (
                        <img 
                          src={firstImageUrl} 
                          alt={painting.name || 'Artwork'}
                          onLoad={() => console.log('✓ Image loaded:', painting.name)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.image-placeholder').style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder" style={{ display: firstImageUrl ? 'none' : 'flex' }}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="artwork-info">
                      <h3>{painting.name || 'Untitled'}</h3>
                      {painting.printSize && <p className="painting-size">Size: {painting.printSize}</p>}
                      <Link 
                        to={`/${encodeURIComponent(painting.name || 'untitled')}/${painting.id}`}
                        className="btn-view"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About FeroukArt</h2>
              <p>
                FeroukArt is a premier online gallery showcasing exceptional artworks from talented artists worldwide. 
                We believe in making fine art accessible to everyone, connecting art lovers with unique pieces that 
                inspire and transform spaces.
              </p>
              <p>
                Our carefully curated collection spans various styles and mediums, ensuring there's something 
                for every taste and aesthetic preference. Each piece is authenticated and comes with a certificate 
                of authenticity.
              </p>
              <button className="btn btn-primary">Our Story</button>
            </div>
            <div className="about-image">
              <div className="image-frame">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.66 22 15 20.66 15 19C15 18.31 14.75 17.68 14.34 17.19C13.94 16.71 13.69 16.08 13.69 15.38C13.69 14.28 14.58 13.38 15.69 13.38H17C19.76 13.38 22 11.14 22 8.38C22 4.69 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/>
                  <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/>
                  <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
                  <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>FeroukArt</h3>
              <p>Discover and collect extraordinary art from talented artists worldwide.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#artists">Artists</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
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
              <h4>Follow Us</h4>
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
    </div>
  );
};

export default HomePage;