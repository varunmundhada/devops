import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/EligibleSchemesButton.css';

const EligibleSchemesButton = ({ userId }) => {
  const [eligibleCount, setEligibleCount] = useState(0);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEligibleSchemes = async () => {
    if (!userId) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/eligibility/eligible/${userId}`);
      setEligibleCount(response.data.count || 0);
      setEligibleSchemes(response.data.schemes || []);
      if (!isOpen) {
        setIsOpen(true);
      }
    } catch (err) {
      console.error('Error fetching eligible schemes:', err);
      setError(err.response?.data?.message || 'Failed to fetch eligible schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen && eligibleCount === 0) {
      fetchEligibleSchemes();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="eligible-schemes-wrapper">
      <button 
        className="eligible-schemes-button"
        onClick={handleToggle}
        disabled={loading}
        title="View eligible schemes"
      >
        <span className="button-icon">🎯</span>
        <span className="button-text">My Eligible Schemes</span>
        {eligibleCount > 0 && (
          <span className="eligible-count-badge">{eligibleCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="eligible-schemes-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="eligible-schemes-modal">
            <div className="eligible-schemes-header">
              <h3>Your Eligible Schemes</h3>
              <button 
                className="eligible-schemes-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="eligible-schemes-content">
              {loading ? (
                <div className="eligible-schemes-loading">
                  <div className="loading-spinner"></div>
                  <p>Checking eligibility...</p>
                </div>
              ) : error ? (
                <div className="eligible-schemes-error">
                  <p>{error}</p>
                  <button onClick={fetchEligibleSchemes} className="retry-button">
                    Try Again
                  </button>
                </div>
              ) : eligibleSchemes.length === 0 ? (
                <div className="eligible-schemes-empty">
                  <p>No eligible schemes found at the moment.</p>
                  <p className="empty-hint">Update your profile to see more eligible schemes!</p>
                </div>
              ) : (
                <>
                  <div className="eligible-schemes-count-info">
                    <p>You are eligible for <strong>{eligibleCount}</strong> {eligibleCount === 1 ? 'scheme' : 'schemes'}</p>
                  </div>
                  <div className="eligible-schemes-list">
                    {eligibleSchemes.map((scheme) => (
                      <div key={scheme._id || scheme.id} className="eligible-scheme-card">
                        <h4 className="scheme-name">{scheme.name}</h4>
                        <div className="scheme-details">
                          <p><span className="detail-label">Category:</span> {scheme.category || 'N/A'}</p>
                          <p><span className="detail-label">Authority:</span> {scheme.authority || 'N/A'}</p>
                          <p><span className="detail-label">State:</span> {scheme.state || 'All'}</p>
                          {scheme.description && (
                            <p className="scheme-description">{scheme.description}</p>
                          )}
                          {scheme.applyLink && (
                            <a 
                              href={scheme.applyLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="apply-link-button"
                            >
                              Apply Now →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EligibleSchemesButton;

