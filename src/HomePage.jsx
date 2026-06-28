import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import { getAllImageUrls, cmToIn } from './utils/paintingImages';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import heroBackground from './assets/images/hero-background.jpeg';
import introPhoto from './assets/images/home-about.jpeg';
import './assets/styles/HomePage.css';

const HomePage = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchPaintings();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  const fetchPaintings = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get('/api/paintings/all');

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

  const getFirstImageUrl = (painting) => {
    const allUrls = getAllImageUrls(painting);
    return allUrls.length > 0 ? allUrls[0] : null;
  };

  return (
    <div className="home-page">
      <SiteHeader />

      <section className="hero">
        <div className="hero-background">
          <div className="art-element element-1"></div>
          <div className="art-element element-2"></div>
          <div className="art-element element-3"></div>
        </div>
        <div className="hero-photo">
          <img src={heroBackground} alt="Artist painting in studio" />
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">Inspired by Land & Oceanscapes</h1>
          <div className="hero-buttons">
            <button className="btn btn-primary">All Artworks</button>
          </div>
        </div>
      </section>

      <section className="featured" id="gallery">
        <div className="container">
          <h2 className="section-title">Latest Paintings</h2>

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

                return (
                  <Link
                    key={painting.id}
                    to={`/${encodeURIComponent(painting.name || 'untitled')}/${painting.id}`}
                    className="artwork-card"
                  >
                    <div className="artwork-image">
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
                      <h3>"{painting.name || 'Untitled'}"</h3>
                      {painting.width && painting.height && (
                        <p className="painting-size">
                          {painting.width} X {painting.height} CM / {cmToIn(painting.width)} X {cmToIn(painting.height)} IN
                        </p>
                      )}
                      {painting.price != null && (
                        <p className="painting-price">€{Number(painting.price).toFixed(2)}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="intro">
        <div className="intro-image">
          <img src={introPhoto} alt="Farouk Gmar holding one of his paintings in his studio" />
        </div>
        <div className="container intro-content">
          <h2 className="intro-title">Hi, I'm Farouk</h2>
          <div className="intro-text">
            <p>A part time, and self taught artist.</p>
            <p>
              I have been painting since my childhood and I have been doing it professionally since 3 years. My
              main inspiration is nature and landscapes.
            </p>
            <p>
              What I feel like I do sometimes is something in between Modern art and realism.
            </p>
            <p>
              I paint because I enjoy it, because sometimes it's an escape from life, but most importantly
              because painting makes me always feel free, and I can reflect my emotions and thoughts into color
              combinations and brushstrokes.
            </p>
            <p>Welcome to my small world and enjoy!</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default HomePage;