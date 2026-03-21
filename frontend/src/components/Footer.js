import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/" className="logo">
            <span className="scheme">Scheme</span>
            <span className="connect">Connect</span>
          </Link>
        </div>
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} SchemeConnect. All rights reserved.</p>
          <p className="powered-by">Powered by <span className="pseudo-coders">Pseudo Coders</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
