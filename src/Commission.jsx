import React, { useState } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { instance } from './api/axiosInstance';
import { COUNTRIES } from './utils/countries';
import './assets/styles/HomePage.css';

const steps = [
  {
    title: '1. Tell us your vision',
    text: 'Share the size, style, color palette, and subject, and even a reference picture or photograph of what you have in mind for your custom piece.',
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

const MAX_IMAGES = 2;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  city: '',
  country: '',
  desiredSize: '',
  style: '',
  subject: '',
  description: '',
};

const Commission = () => {
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} reference pictures`);
      e.target.value = '';
      return;
    }

    const validFiles = files.filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPG, PNG, WEBP, GIF are allowed.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large: ${file.name}. Max ${MAX_FILE_SIZE / (1024 * 1024)}MB per file.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
      setError(null);
    }

    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = ['fullName', 'email', 'phone', 'street', 'houseNumber', 'city', 'country', 'desiredSize', 'style', 'subject'];
    if (requiredFields.some((field) => !form[field].trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      imageFiles.forEach((file) => payload.append('images', file));

      await instance.post('/api/commissions', payload);

      imagePreviews.forEach(URL.revokeObjectURL);
      setForm(initialForm);
      setImageFiles([]);
      setImagePreviews([]);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong while sending your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <SiteHeader />

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

      <section className="featured commission-form-section">
        <div className="container">
          <h2 className="section-title">Start Your Commission</h2>
          <p className="section-subtitle">Tell us about your custom piece and we'll get back to you with a quote</p>

          {submitted ? (
            <div className="commission-success">
              <div className="commission-success-icon">✓</div>
              <h3>Thank you!</h3>
              <p>We've received your commission request and will be in touch shortly with a quote.</p>
              <button type="button" className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                Submit another request
              </button>
            </div>
          ) : (
            <form className="commission-form" onSubmit={handleSubmit}>
              {error && <div className="commission-error">{error}</div>}

              <h3 className="commission-form-heading">Your Details</h3>
              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="commission-form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
              </div>

              <h3 className="commission-form-heading">Your Address</h3>
              <div className="commission-form-row">
                <div className="commission-form-group commission-form-group-grow">
                  <label>Street *</label>
                  <input type="text" name="street" value={form.street} onChange={handleChange} required />
                </div>
                <div className="commission-form-group">
                  <label>House Number *</label>
                  <input type="text" name="houseNumber" value={form.houseNumber} onChange={handleChange} required />
                </div>
              </div>
              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>City *</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="commission-form-group">
                  <label>Country *</label>
                  <select name="country" value={form.country} onChange={handleChange} required>
                    <option value="" disabled>Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h3 className="commission-form-heading">Your Custom Piece</h3>
              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>Desired Size *</label>
                  <input
                    type="text"
                    name="desiredSize"
                    value={form.desiredSize}
                    onChange={handleChange}
                    placeholder="e.g., 60x80 cm"
                    required
                  />
                </div>
                <div className="commission-form-group">
                  <label>Style *</label>
                  <input
                    type="text"
                    name="style"
                    value={form.style}
                    onChange={handleChange}
                    placeholder="e.g., Abstract, Realism"
                    required
                  />
                </div>
              </div>
              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g., Portrait, Landscape, Pet"
                    required
                  />
                </div>
              </div>
              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>Describe Your Idea</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us more about the piece you have in mind..."
                  />
                </div>
              </div>

              <div className="commission-form-row">
                <div className="commission-form-group">
                  <label>Reference Pictures (up to {MAX_IMAGES})</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleImageSelect}
                    disabled={imageFiles.length >= MAX_IMAGES}
                  />
                  {imagePreviews.length > 0 && (
                    <div className="commission-image-previews">
                      {imagePreviews.map((src, index) => (
                        <div key={src} className="commission-image-preview">
                          <img src={src} alt={`Reference ${index + 1}`} />
                          <button type="button" onClick={() => removeImage(index)} aria-label="Remove image">
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary commission-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Submit Commission Request'}
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Commission;
