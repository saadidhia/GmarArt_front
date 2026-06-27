import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import './assets/styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [paintings, setPaintings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    technique: '',
    year: new Date().getFullYear(),
    style: '',
    artist: '',
    width: '',
    height: '',
    depth: '',
    price: '',
    description: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const MAX_IMAGES = 7;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin/ferouk/login');
    }
    fetchPaintings();
    fetchOrders();
  }, [navigate]);

  // Fetch all paintings
  const fetchPaintings = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get('/api/paintings/all');
      setPaintings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await instance.get('/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate number of images
    if (files.length + imageFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      e.target.value = '';
      return;
    }

    // Validate file sizes and types
    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPG, PNG, WEBP, GIF allowed.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large: ${file.name}. Max ${MAX_FILE_SIZE / (1024 * 1024)}MB per file.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
      setError(null);
    }

    // Reset so selecting the same file(s) again later still fires onChange
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeAllImages = () => {
    imagePreviews.forEach(URL.revokeObjectURL);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.technique || !formData.artist || !formData.width || !formData.height || !formData.price) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (imageFiles.length === 0 && !editingId) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      // Create FormData for multipart upload
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('technique', formData.technique);
      uploadData.append('year', formData.year);
      uploadData.append('style', formData.style);
      uploadData.append('artist', formData.artist);
      uploadData.append('width', formData.width);
      uploadData.append('height', formData.height);
      uploadData.append('depth', formData.depth || 0);
      uploadData.append('price', formData.price);
      uploadData.append('description', formData.description || '');

      // Add image files
      imageFiles.forEach((file, index) => {
        uploadData.append('images', file);
      });

      const endpoint = editingId
        ? `/api/paintings/${editingId}`
        : '/api/paintings/upload';

      const request = editingId
        ? instance.put(endpoint, uploadData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          })
        : instance.post(endpoint, uploadData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });

      await request;

      setSuccess(editingId ? 'Painting updated successfully!' : 'Painting uploaded successfully!');

      // Reset form
      setFormData({
        name: '',
        technique: '',
        year: new Date().getFullYear(),
        style: '',
        artist: '',
        width: '',
        height: '',
        depth: '',
        price: '',
        description: ''
      });
      imagePreviews.forEach(URL.revokeObjectURL);
      setImageFiles([]);
      setImagePreviews([]);
      setEditingId(null);

      // Refresh paintings
      setTimeout(() => {
        fetchPaintings();
        setSuccess(null);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (painting) => {
    setFormData({
      name: painting.name,
      technique: painting.technique,
      year: painting.year,
      style: painting.style || '',
      artist: painting.artist || '',
      width: painting.width,
      height: painting.height,
      depth: painting.depth || '',
      price: painting.price,
      description: painting.description || ''
    });
    setEditingId(painting.id);
    setActiveTab('upload');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this painting?')) return;

    try {
      setLoading(true);
      await instance.delete(`/api/paintings/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setSuccess('Painting deleted successfully!');
      fetchPaintings();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin/ferouk/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.66 22 15 20.66 15 19C15 18.31 14.75 17.68 14.34 17.19C13.94 16.71 13.69 16.08 13.69 15.38C13.69 14.28 14.58 13.38 15.69 13.38H17C19.76 13.38 22 11.14 22 8.38C22 4.69 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/>
              <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/>
              <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
              <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
            </svg>
            <h1>FeroukArt Admin</h1>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Upload Painting
            </button>
            <button
              className={`nav-item ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Manage Paintings
            </button>
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7V6C6 3.79086 7.79086 2 10 2H14C16.2091 2 18 3.79086 18 6V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4.5 7H19.5L20.5 21H3.5L4.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Orders
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Alerts */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span>✓ {success}</span>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="tab-content">
              <h2>{editingId ? 'Edit Painting' : 'Upload New Painting'}</h2>
              
              <form onSubmit={handleSubmit} className="upload-form">
                {/* Basic Info */}
                <section className="form-section">
                  <h3>Painting Information</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Painting Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Sunset Over Mountains"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Technique *</label>
                      <input
                        type="text"
                        name="technique"
                        value={formData.technique}
                        onChange={handleInputChange}
                        placeholder="e.g., Acrylic, Oil, Watercolor"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Artist *</label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        placeholder="e.g., Ferouk"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Style</label>
                      <input
                        type="text"
                        name="style"
                        value={formData.style}
                        onChange={handleInputChange}
                        placeholder="e.g., Abstract, Realism"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Width (cm) *</label>
                      <input
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        placeholder="e.g., 60"
                        step="0.1"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Height (cm) *</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="e.g., 90"
                        step="0.1"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Depth (cm)</label>
                      <input
                        type="number"
                        name="depth"
                        value={formData.depth}
                        onChange={handleInputChange}
                        placeholder="e.g., 2"
                        step="0.1"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </section>

                {/* Pricing */}
                <section className="form-section">
                  <h3>Pricing</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., 50.00"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </section>

                {/* Description */}
                <section className="form-section">
                  <h3>Description</h3>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell buyers about this piece..."
                      rows={5}
                      disabled={loading}
                    />
                  </div>
                </section>

                {/* Image Upload */}
                <section className="form-section">
                  <h3>Upload Images ({imageFiles.length}/{MAX_IMAGES})</h3>
                  
                  <div className="upload-area">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p>Drag images here or click to select</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={loading || imageFiles.length >= MAX_IMAGES}
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="file-label">
                      Select Images
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="image-preview-grid">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <button
                      type="button"
                      className="remove-all-btn"
                      onClick={removeAllImages}
                    >
                      Remove All Images
                    </button>
                  )}
                </section>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : editingId ? 'Update Painting' : 'Upload Painting'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          name: '',
                          technique: '',
                          year: new Date().getFullYear(),
                          style: '',
                          artist: '',
                          width: '',
                          height: '',
                          depth: '',
                          price: '',
                          description: ''
                        });
                        imagePreviews.forEach(URL.revokeObjectURL);
                        setImageFiles([]);
                        setImagePreviews([]);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div className="tab-content">
              <h2>Manage Paintings</h2>

              {loading ? (
                <p className="loading">Loading paintings...</p>
              ) : paintings.length === 0 ? (
                <p className="empty">No paintings found. Start by uploading one!</p>
              ) : (
                <div className="paintings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Artist</th>
                        <th>Technique</th>
                        <th>Year</th>
                        <th>Size (cm)</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paintings.map(painting => (
                        <tr key={painting.id}>
                          <td>{painting.name}</td>
                          <td>{painting.artist}</td>
                          <td>{painting.technique}</td>
                          <td>{painting.year}</td>
                          <td>{painting.width} x {painting.height}{painting.depth ? ` x ${painting.depth}` : ''}</td>
                          <td>${painting.price.toFixed(2)}</td>
                          <td className="actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(painting)}
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(painting.id)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h2>Orders</h2>

              {orders.length === 0 ? (
                <p className="empty">No purchase requests yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <strong>{order.buyerName}</strong>
                          <span className="order-email"> · {order.buyerEmail}</span>
                        </div>
                        <span className={`order-status order-status-${(order.status || '').toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      {order.shippingAddress && (
                        <p className="order-address">{order.shippingAddress}</p>
                      )}
                      <ul className="order-items">
                        {order.items.map(item => (
                          <li key={item.id}>
                            "{item.paintingName}" — ${Number(item.price).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                      <div className="order-card-footer">
                        <span>Total: ${Number(order.totalAmount).toFixed(2)}</span>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;