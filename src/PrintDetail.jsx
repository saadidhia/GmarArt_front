import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import { getAllImageUrls, cmToIn } from './utils/printImages';
import { useCart } from './CartContext';
import CartIcon from './CartIcon';
import ImageZoomModal from './ImageZoomModal';
import './assets/styles/PaintingDetail.css';

const PrintDetail = () => {
  const { id } = useParams();
  const { addItem, isInCart } = useCart();
  const [print, setPrint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const fetchPrint = async () => {
      try {
        setLoading(true);
        const { data } = await instance.get(`/api/prints/${id}`);
        setPrint(data);
        setActiveImage(0);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrint();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <p className="detail-status">Loading...</p>
      </div>
    );
  }

  if (error || !print) {
    return (
      <div className="detail-page">
        <p className="detail-status">{error || 'Print not found'}</p>
        <Link to="/limited-edition-prints" className="detail-back-link">&larr; Back to Print Collection</Link>
      </div>
    );
  }

  const images = getAllImageUrls(print);
  const inCart = isInCart(print.id);
  const inStock = print.stock > 0;

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link to="/limited-edition-prints" className="detail-back-link">&larr; Back to Print Collection</Link>
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
              <img src={images[activeImage]} alt={print.name || 'Print'} />
            ) : (
              <div className="detail-image-placeholder">No image available</div>
            )}
          </div>

          {zoomOpen && (
            <ImageZoomModal
              images={images}
              startIndex={activeImage}
              alt={print.name || 'Print'}
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
                  <img src={url} alt={`${print.name || 'Print'} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-eyebrow">Limited Edition Print</p>
          <h1>"{print.name || 'Untitled'}"</h1>

          {print.price != null && (
            <p className="detail-price">€{Number(print.price).toFixed(2)}</p>
          )}

          {inStock && !inCart && (
            <div className="detail-quantity">
              <label htmlFor="print-quantity">Quantity:</label>
              <div className="detail-quantity-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  id="print-quantity"
                  type="number"
                  min={1}
                  max={print.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setQuantity(Number.isNaN(value) ? 1 : Math.max(1, Math.min(value, print.stock)));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(print.stock, q + 1))}
                  disabled={quantity >= print.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className={`detail-add-to-cart ${inCart ? 'in-cart' : ''}`}
            onClick={() => addItem('print', print, images[0], quantity)}
            disabled={!inStock || inCart}
          >
            {!inStock ? 'Sold Out' : inCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          {inCart && (
            <Link to="/cart" className="detail-view-cart-link">View cart &rarr;</Link>
          )}

          {(print.width || print.height) && (
            <div className="detail-size-block">
              <p className="detail-block-title">Size:</p>
              {print.width != null && (
                <p>Width - {print.width} cm / {cmToIn(print.width)} inches</p>
              )}
              {print.height != null && (
                <p>Height - {print.height} cm / {cmToIn(print.height)} inches</p>
              )}
            </div>
          )}

          <div className="detail-facts">
            <p><strong>Availability:</strong> {inStock ? `${print.stock} in stock` : 'Sold out'}</p>
          </div>

          <p className="detail-print-info-title">About this print edition:</p>
          <p className="detail-print-info">
            • Each print is signed and numbered and presented on acid-free, archival Etching Giclée paper.<br />
            • Sustainable production, packaging and shipping.<br />
            • Global delivery with tracked &amp; insured shipping<br />
            • Worldwide shipping is free
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintDetail;
