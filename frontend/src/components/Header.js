import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { LanguageContext } from '../context/LanguageContext';
import api from '../utils/api';
import LanguageSelector from './LanguageSelector';
import EligibleSchemesButton from './EligibleSchemesButton';

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const { t, language } = useContext(LanguageContext);

  // Check for user on mount and when route changes (e.g., after login)
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('currentUser');
      if (token && currentUser) {
        try {
          setUser(JSON.parse(currentUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Check immediately and on route changes (catches login redirects)
    checkUser();
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
    window.location.reload(); // Ensures state resets for full logout
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    
    // Navigate to home page with search query
    navigate('/', { state: { searchQuery: query } });
    
    // Scroll to schemes section after a brief delay
    setTimeout(() => {
      const schemesSection = document.querySelector('.category-explorer-main');
      if (schemesSection) {
        schemesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };


  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <span className="scheme">Scheme</span>
          <span className="connect">Connect</span>
        </Link>
      </div>
      <div className="header-right">
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit-btn" title="Search schemes">
            🔍
          </button>
        </form>
        {user ? (
          <div className="user-section">
            <EligibleSchemesButton userId={user.id} />
            <div className="profile-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="profile-trigger"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                {user.name ? user.name.split(' ')[0] : user.email}
                <span className="dropdown-arrow">▼</span>
              </button>
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <Link
                    to="#"
                    className="profile-dropdown-item"
                    style={{ padding: '0.75rem 1.5rem', display: 'block', color: '#06038D', borderBottom: '1px solid #eee', textDecoration: 'none', fontWeight: 500 }}
                    onClick={() => { setDropdownOpen(false); alert(t('header.profileSettings') + ' coming soon.'); }}
                  >
                    {t('header.profileSettings')}
                  </Link>
                  <button
                    className="profile-dropdown-item"
                    onClick={handleLogout}
                  >
                    {t('header.logout')}
                  </button>
                </div>
              )}
            </div>
            <LanguageSelector />
          </div>
        ) : (
          <div className="auth-section">
            <Link to="/login" className="auth-button">{t('header.signIn')}</Link>
            <LanguageSelector />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
