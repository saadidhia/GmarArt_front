import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from './api/axiosInstance';
import './assets/styles/Login.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Already logged in? Skip the login form entirely.
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/admin/ferouk/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await instance.post('/api/auth/login', {
        username: username,
        password: password,
      });

      // Store token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to dashboard
      navigate('/admin/ferouk/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-icon">
          <div className="icon-circle">
            🎨
          </div>
        </div>
        
        <h1 className="login-title">FeroukArt<br/>Admin</h1>
        <p className="login-subtitle">Manage your art gallery with<br/>elegance</p>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="sign-in-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                Sign In <span className="arrow">→</span>
              </>
            )}
          </button>
        </form>

        <p className="copyright">© 2024 FeroukArt Gallery</p>
      </div>
    </div>
  );
};

export default AdminLogin;