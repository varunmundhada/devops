//Register.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
// backend base URL (can be configured via env REACT_APP_API_URL)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    occupation: '',
    income: '',
    state: '',
    age: '',
    gender: '',
    caste: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const { 
    name, email, password, confirmPassword, 
    occupation, income, state, age, gender, caste 
  } = formData;

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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Basic client-side validation
      if (!name || !email || !password || !occupation || !state || !age || !gender) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Post to backend register route
      const payload = {
        name,
        email,
        password,
        occupation,
        income: income ? Number(income) : undefined,
        state,
        age: Number(age),
        gender,
        caste: caste || undefined
      };

      const response = await axios.post(`${API_BASE}/api/users/register`, payload);

      // On success, redirect to login
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response) {
        setError(`Registration failed (status ${err.response.status}).`);
      } else {
        setError(`Cannot reach backend at ${API_BASE} — please ensure the server is running.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-title">
          <h2>{t('register.title')}</h2>
        </div>

        <div className="auth-card">
          <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {t('register.alreadyHave')}{' '}
            <Link to="/login" className="btn-secondary" style={{ padding: '0.25rem 0.6rem', borderRadius: 4 }}>
              {t('register.signInHere')}
            </Link>
          </p>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #f5c2c2', padding: '0.75rem', borderRadius: '6px', color: '#a00', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>{t('register.fullName')} *</label>
                <input name="name" value={name} onChange={handleChange} required />
              </div>

              <div>
                <label>{t('register.email')} *</label>
                <input name="email" type="email" value={email} onChange={handleChange} required />
              </div>

              <div>
                <label>{t('register.password')} *</label>
                <input name="password" type="password" minLength={6} value={password} onChange={handleChange} required />
              </div>

              <div>
                <label>{t('register.confirmPassword')} *</label>
                <input name="confirmPassword" type="password" minLength={6} value={confirmPassword} onChange={handleChange} required />
              </div>

              <div>
                <label>{t('register.occupation')} *</label>
                <select name="occupation" value={occupation} onChange={handleChange} required>
                  <option value="">Select Occupation</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="employee">Employee</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label>{t('register.annualIncome')}</label>
                <input name="income" type="number" value={income} onChange={handleChange} />
              </div>

              <div>
                <label>{t('register.state')} *</label>
                <select name="state" value={state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label>{t('register.age')} *</label>
                <input name="age" type="number" min={18} max={120} value={age} onChange={handleChange} required />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>{t('register.gender')} *</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label><input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={handleChange} required /> Male</label>
                  <label><input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={handleChange} /> Female</label>
                  <label><input type="radio" name="gender" value="other" checked={gender === 'other'} onChange={handleChange} /> Other</label>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>{t('register.caste')}</label>
                <select name="caste" value={caste} onChange={handleChange}>
                  <option value="">Select Caste Category</option>
                  <option value="general">general</option>
                  <option value="obc">obc</option>
                  <option value="sc">sc</option>
                  <option value="st">st</option>
                </select>
              </div>
            </div>

          <div
  style={{
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }}
>
  <input
    id="terms"
    name="terms"
    type="checkbox"
    required
    style={{ marginRight: '8px' }}
  />
  <label
    htmlFor="terms"
    style={{
      whiteSpace: 'nowrap',        // prevents text from breaking
      fontSize: '14px',
    }}
  >
    {t('register.terms')}
  </label>
</div>







            <div style={{ marginTop: '1rem' }}>
              <button className="btn" type="submit" disabled={loading}>{loading ? t('register.creating') : t('register.createAccountBtn')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
