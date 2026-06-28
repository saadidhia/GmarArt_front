import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import { getAllImageUrls, cmToIn } from './utils/printImages';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import './assets/styles/HomePage.css';

const LimitedEditionPrints = () => {
  const [prints, setPrints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrints();
  }, []);

  const fetchPrints = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get('/api/prints/all');
      setPrints(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFirstImageUrl = (print) => {
    const allUrls = getAllImageUrls(print);
    return allUrls.length > 0 ? allUrls[0] : null;
  };

  return (
    <div className="home-page">
      <SiteHeader />

      <section className="featured">
        <div className="container">
          <h2 className="section-title">Limited Edition Prints</h2>
          <p className="section-subtitle prints-subtitle">
            Each print is signed and numbered and presented on acid-free, archival Etching Giclée paper.<br />
            Sustainable production, packaging and shipping.<br />
            Global delivery with tracked &amp; insured shipping
          </p>

          {loading && <div className="loading-message"><p>Loading prints...</p></div>}

          {error && (
            <div className="error-message">
              <p>Error loading prints: {error}</p>
              <button onClick={fetchPrints} className="btn btn-primary">Retry</button>
            </div>
          )}

          {!loading && !error && prints.length === 0 && (
            <div className="empty-message">
              <p>
                Our limited edition print collection is being curated and will be available soon.
                In the meantime, reach out to us if you'd like to be notified when a piece is released.
              </p>
              <Link to="/commission" className="btn btn-primary" style={{ marginTop: '20px' }}>Get in Touch</Link>
            </div>
          )}

          {!loading && !error && prints.length > 0 && (
            <div className="artwork-grid">
              {prints.map((print) => {
                const firstImageUrl = getFirstImageUrl(print);
                const inStock = print.stock > 0;

                return (
                  <Link
                    key={print.id}
                    to={`/print/${encodeURIComponent(print.name || 'untitled')}/${print.id}`}
                    className="artwork-card"
                  >
                    <div className="artwork-image">
                      {firstImageUrl ? (
                        <img
                          src={firstImageUrl}
                          alt={print.name || 'Print'}
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
                      <h3>"{print.name || 'Untitled'}"</h3>
                      {print.width && print.height && (
                        <p className="painting-size">
                          {print.width} X {print.height} CM / {cmToIn(print.width)} X {cmToIn(print.height)} IN
                        </p>
                      )}
                      {print.price != null && (
                        <p className="painting-price">€{Number(print.price).toFixed(2)}</p>
                      )}
                      <p className="painting-size">{inStock ? `${print.stock} in stock` : 'Sold out'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default LimitedEditionPrints;
