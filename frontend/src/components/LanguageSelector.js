import React, { useState, useRef, useEffect, useContext } from 'react';
import '../styles/LanguageSelector.css';
import { LanguageContext } from '../context/LanguageContext';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
];

const LanguageSelector = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectorRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.includes(searchTerm)
  );

  const handleLanguageSelect = (langCode) => {
    // Use the existing LanguageContext to change language
    setLanguage(langCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="language-selector-wrapper" ref={selectorRef}>
      <button
        className="language-icon-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language"
      >
        🌐
      </button>
      {isOpen && (
        <div className="language-selector-modal">
          <div className="language-selector-header">
            <h3>Select Language</h3>
            <button className="language-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="language-search-bar">
            <input
              type="text"
              placeholder="Search language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="language-search-input"
            />
            <span className="language-search-icon">🔍</span>
          </div>
          <div className="language-list">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-option ${language === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className="language-name">{lang.nativeName}</span>
                  <span className="language-code">{lang.name}</span>
                </button>
              ))
            ) : (
              <div className="language-no-results">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

