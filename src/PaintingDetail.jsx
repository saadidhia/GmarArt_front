import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import { getAllImageUrls, cmToIn } from './utils/paintingImages';
import { useCart } from './CartContext';
import CartIcon from './CartIcon';
import ImageZoomModal from './ImageZoomModal';
import './assets/styles/PaintingDetail.css';

const PaintingDetail = () => {
  const { id } = useParams();
  const { addItem, isInCart } = useCart();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        setLoading(true);
        const { data } = await instance.get(`/api/paintings/${id}`);
        setPainting(data);
        setActiveImage(0);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPainting();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <p className="detail-status">Loading...</p>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="detail-page">
        <p className="detail-status">{error || 'Painting not found'}</p>
        <Link to="/" className="detail-back-link">&larr; Back to Gallery</Link>
      </div>
    );
  }

  const images = getAllImageUrls(painting);
  const inCart = isInCart(painting.id);

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link to="/" className="detail-back-link">&larr; Back to Gallery</Link>
        <CartIcon />
      </header>

      <div className="detail-container">
        <div className="detail-gallery">
          <div
            className="detail-main-image"
            onClick={() => images.length > 0 && setZoomOpen(true)}
            role={images.length > 0 ? 'button' : undefined}
            tabIndex={images.length > 0 ? 0 : undefined}
          >
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={painting.name || 'Artwork'} />
            ) : (
              <div className="detail-image-placeholder">No image available</div>
            )}
          </div>

          {zoomOpen && (
            <ImageZoomModal
              images={images}
              startIndex={activeImage}
              alt={painting.name || 'Artwork'}
              onClose={() => setZoomOpen(false)}
            />
          )}

          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className={`detail-thumb ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={url} alt={`${painting.name || 'Artwork'} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-eyebrow">Original Painting</p>
          <h1>
            "{painting.name || 'Untitled'}"{painting.technique ? ` ${painting.technique.toLowerCase()} painting` : ''}
          </h1>

          {painting.price != null && (
            <p className="detail-price">€{Number(painting.price).toFixed(2)}</p>
          )}
          <p className="detail-shipping">Worldwide shipping is free</p>

          <button
            type="button"
            className={`detail-add-to-cart ${inCart ? 'in-cart' : ''}`}
            onClick={() => addItem('painting', painting, images[0])}
            disabled={inCart}
          >
            {inCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          {inCart && (
            <Link to="/cart" className="detail-view-cart-link">View cart &rarr;</Link>
          )}

          {painting.description && (
            <div className="detail-description">{painting.description}</div>
          )}

          {(painting.width || painting.height || painting.depth) && (
            <div className="detail-size-block">
              <p className="detail-block-title">Size:</p>
              {painting.width != null && (
                <p>Width - {painting.width} cm / {cmToIn(painting.width)} inches</p>
              )}
              {painting.height != null && (
                <p>Height - {painting.height} cm / {cmToIn(painting.height)} inches</p>
              )}
              {painting.depth != null && (
                <p>Depth - {painting.depth} cm / {cmToIn(painting.depth)} inches</p>
              )}
            </div>
          )}

          <div className="detail-facts">
            {painting.style && <p><strong>Style:</strong> {painting.style}</p>}
            {painting.year && <p><strong>Year:</strong> {painting.year}</p>}
            {painting.artist && <p><strong>Artist:</strong> {painting.artist}</p>}
            {painting.technique && <p><strong>Medium:</strong> {painting.technique}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetail;
