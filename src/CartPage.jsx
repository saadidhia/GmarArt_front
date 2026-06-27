import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import { useCart } from './CartContext';
import './assets/styles/CartPage.css';

const CartPage = () => {
  const { items, removeItem, clearCart, total } = useCart();
  const [form, setForm] = useState({ buyerName: '', buyerEmail: '', shippingAddress: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data } = await instance.post('/api/orders', {
        ...form,
        items: items.map((item) => ({
          paintingId: item.paintingId,
          paintingName: item.paintingName,
          imageUrl: item.imageUrl,
          price: item.price,
        })),
      });

      setConfirmation(data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="cart-page">
        <div className="cart-confirmation">
          <div className="cart-confirmation-icon">✓</div>
          <h1>Purchase Request Received!</h1>
          <p>
            Thank you, {confirmation.buyerName}. We've received your request for{' '}
            {confirmation.items.length} {confirmation.items.length === 1 ? 'piece' : 'pieces'}{' '}
            (total <strong>${Number(confirmation.totalAmount).toFixed(2)}</strong>).
          </p>
          <p>
            We'll reach out to <strong>{confirmation.buyerEmail}</strong> shortly to arrange
            payment and shipping for your original artwork.
          </p>
          <Link to="/" className="cart-back-link">&larr; Continue Browsing</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <Link to="/" className="cart-back-link">&larr; Back to Gallery</Link>
        <h1>Your Cart</h1>
      </header>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="cart-back-link">Browse the gallery &rarr;</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.paintingId} className="cart-item">
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.paintingName} />
                  ) : (
                    <div className="cart-item-placeholder" />
                  )}
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">"{item.paintingName}"</p>
                  <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => removeItem(item.paintingId)}
                  aria-label={`Remove ${item.paintingName} from cart`}
                >
                  &times;
                </button>
              </div>
            ))}

            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <form className="cart-checkout" onSubmit={handleCheckout}>
            <h2>Checkout</h2>
            <p className="cart-checkout-note">
              Since these are one-of-a-kind originals, we confirm details with you before
              taking payment. Submit your info and we'll send you a secure payment link.
            </p>

            {error && <div className="cart-error">{error}</div>}

            <div className="cart-form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="buyerName"
                value={form.buyerName}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
            <div className="cart-form-group">
              <label>Email *</label>
              <input
                type="email"
                name="buyerEmail"
                value={form.buyerEmail}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
            <div className="cart-form-group">
              <label>Shipping Address</label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                rows={3}
                disabled={submitting}
              />
            </div>

            <button type="submit" className="cart-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : `Proceed to Payment · $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CartPage;
