//Login.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

// backend base URL (can be configured via env REACT_APP_API_URL)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`http://localhost:5000/api/users/login`, { email, password });

      const token = response.data?.token || response.data?.accessToken || null;
      if (token) {
        localStorage.setItem('token', token);
      }

      // store user if returned
      if (response.data?.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }

      // Redirect to main page after successful login
      navigate('/');
    } catch (err) {
      // Prefer server-sent message when available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response) {
        setError(`Login failed (status ${err.response.status}).`);
      } else {
        setError(`Cannot reach backend at ${API_BASE} — please ensure the server is running.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <div className="container" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="section-title">
          <h2>{t('login.title')}</h2>
        </div>

        <div className="auth-card">
          <p style={{ textAlign: 'center' }}>
            {t('login.orCreate')} <Link to="/register" className="btn-secondary" style={{ padding: '0.25rem 0.6rem', borderRadius: 4 }}>{t('login.createAccount')}</Link>
          </p>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #f5c2c2', padding: '0.75rem', borderRadius: '6px', color: ' #FF671F ', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label>{t('login.email')}</label>
              <input name="email" type="email" value={email} onChange={handleChange} required />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label>{t('login.password')}</label>
              <input name="password" type="password" value={password} onChange={handleChange} required />
            </div>

            <div
  style={{
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}
>
  <label
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      lineHeight: '1',
      verticalAlign: 'middle'
    }}
  >
    <input
      name="remember-me"
      type="checkbox"
      style={{ verticalAlign: 'middle', transform: 'translateY(-1px)' }}
    />
    <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{t('login.rememberMe')}</span>
  </label>
  <a href="#">{t('login.forgotPassword')}</a>
</div>


            <div style={{ marginTop: '1rem' }}>
              <button className="btn" type="submit" disabled={loading}>{loading ? t('login.signingIn') : t('login.signIn')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
