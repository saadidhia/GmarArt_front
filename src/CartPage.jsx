import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import PayPalButton from './PayPalButton';
import { COUNTRIES } from './utils/countries';
import './assets/styles/CartPage.css';

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [form, setForm] = useState({
    buyerName: '',
    buyerEmail: '',
    shippingStreet: '',
    shippingHouseNumber: '',
    shippingPostalCode: '',
    shippingRegion: '',
    shippingCountry: '',
  });
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    form.buyerName.trim() &&
    form.buyerEmail.trim() &&
    form.shippingStreet.trim() &&
    form.shippingHouseNumber.trim() &&
    form.shippingPostalCode.trim() &&
    form.shippingRegion.trim() &&
    form.shippingCountry.trim();

  const buildOrderPayload = () => ({
    ...form,
    items: items.map((item) =>
      item.type === 'print'
        ? { printId: item.id, printName: item.name, imageUrl: item.imageUrl, price: item.price, quantity: item.quantity }
        : { paintingId: item.id, paintingName: item.name, imageUrl: item.imageUrl, price: item.price }
    ),
  });

  const handlePaymentSuccess = (order) => {
    setError(null);
    setConfirmation(order);
    clearCart();
  };

  if (confirmation) {
    return (
      <div className="cart-page">
        <div className="cart-confirmation">
          <div className="cart-confirmation-icon">✓</div>
          <h1>Payment Received!</h1>
          <p>
            Thank you, {confirmation.buyerName}. We've received your payment for{' '}
            {confirmation.items.length} {confirmation.items.length === 1 ? 'piece' : 'pieces'}{' '}
            (total <strong>€{Number(confirmation.totalAmount).toFixed(2)}</strong>).
          </p>
          <p>
            A confirmation has been recorded for <strong>{confirmation.buyerEmail}</strong>. We'll
            ship your order to the address you provided shortly.
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
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="cart-item-placeholder" />
                  )}
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">"{item.name}"</p>
                  <p className="cart-item-price">€{Number(item.price).toFixed(2)} {item.type === 'print' && 'each'}</p>
                  {item.type === 'print' && (
                    <div className="cart-item-quantity">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.maxStock ?? Infinity)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  &times;
                </button>
              </div>
            ))}

            <div className="cart-total">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-checkout">
            <h2>Checkout</h2>
            <p className="cart-checkout-note">
              Pay securely with PayPal. Prices are in Euros (€).
            </p>

            {error && <div className="cart-error">{error}</div>}

            <div className="cart-form-group">
              <label>Full Name *</label>
              <input type="text" name="buyerName" value={form.buyerName} onChange={handleChange} required />
            </div>
            <div className="cart-form-group">
              <label>Email *</label>
              <input type="email" name="buyerEmail" value={form.buyerEmail} onChange={handleChange} required />
            </div>
            <div className="cart-form-row cart-form-row-street">
              <div className="cart-form-group">
                <label>Street Address *</label>
                <input type="text" name="shippingStreet" value={form.shippingStreet} onChange={handleChange} required />
              </div>
              <div className="cart-form-group">
                <label>House Number *</label>
                <input type="text" name="shippingHouseNumber" value={form.shippingHouseNumber} onChange={handleChange} required />
              </div>
            </div>
            <div className="cart-form-row">
              <div className="cart-form-group">
                <label>Postal Code *</label>
                <input type="text" name="shippingPostalCode" value={form.shippingPostalCode} onChange={handleChange} required />
              </div>
              <div className="cart-form-group">
                <label>Region / State *</label>
                <input type="text" name="shippingRegion" value={form.shippingRegion} onChange={handleChange} required />
              </div>
            </div>
            <div className="cart-form-group">
              <label>Country *</label>
              <select name="shippingCountry" value={form.shippingCountry} onChange={handleChange} required>
                <option value="" disabled>Select a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {isFormValid ? (
              <PayPalButton
                buildOrderPayload={buildOrderPayload}
                onSuccess={handlePaymentSuccess}
                onError={setError}
              />
            ) : (
              <p className="cart-checkout-hint">Fill in your name, email and full shipping address to pay with PayPal.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
