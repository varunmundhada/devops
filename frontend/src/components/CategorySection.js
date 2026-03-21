import React, { useState, useEffect, useContext } from 'react';
import '../styles/CategorySection.css';
import api from '../utils/api';
import { LanguageContext } from '../context/LanguageContext';
import ReminderModal from './ReminderModal';

const categories = [
  { id: 'central', authority: 'central' },
  { id: 'state', authority: 'state' },
  { id: 'private', authority: 'private' },
];

// Map frontend occupation display names to backend category enum values
const occupationToCategoryMap = {
  student: 'student',
  farmer: 'farmer',
  business: 'business',
  senior_citizen: 'welfare',
  women: 'women',
  startup: 'startup',
  small_business: 'business',
  women_entrepreneur: 'women',
  professional: 'other',
  unemployed: 'welfare'
};

const occupations = {
  central: ['student', 'farmer', 'business', 'senior_citizen', 'women'],
  state: ['student', 'farmer', 'unemployed', 'women', 'senior_citizen'],
  private: ['student', 'startup', 'small_business', 'women_entrepreneur', 'professional']
};

// States: keep `value` as backend-facing string, `labelKey` refers to translation entry
const states = [
  { value: '', labelKey: 'states.all' },
  { value: 'Andhra Pradesh', labelKey: 'states.andhra_pradesh' },
  { value: 'Telangana', labelKey: 'states.telangana' },
  { value: 'Karnataka', labelKey: 'states.karnataka' },
  { value: 'Tamil Nadu', labelKey: 'states.tamil_nadu' },
  { value: 'Kerala', labelKey: 'states.kerala' },
  { value: 'Maharashtra', labelKey: 'states.maharashtra' },
  { value: 'Delhi', labelKey: 'states.delhi' }
];

const castes = [
  '', 'general', 'obc', 'sc', 'st'
];

const CategorySection = () => {
  const [filters, setFilters] = useState({
    category: 'central',
    occupation: '',
    state: '',
    caste: '',
    search: ''
  });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useContext(LanguageContext);

  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  
  // Check for search query from navigation state (from header search)
  useEffect(() => {
    const locationState = window.history.state?.usr;
    if (locationState && locationState.searchQuery) {
      // When searching from header, fetch all schemes first
      setFilters(prev => ({
        ...prev,
        category: '',
        occupation: '',
        state: '',
        caste: '',
        search: locationState.searchQuery
      }));
      // Clear the state to prevent repeated application
      window.history.replaceState({ ...window.history.state, usr: null }, '');
    }
  }, []);

  useEffect(() => {
    fetchSchemes();
    // eslint-disable-next-line
  }, [filters]);

  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '/schemes/get';
      let params = {};

      // Determine which endpoint to use based on filters
      // Frontend "category" maps to backend "authority"
      // Frontend "occupation" needs to be mapped to backend "category" enum values
      
      const hasAuthority = filters.category && filters.category !== '';
      const hasState = filters.state && filters.state !== '';
      const hasOccupation = filters.occupation && filters.occupation !== '';
      const hasCaste = filters.caste && filters.caste !== '';
      const hasSearch = filters.search && filters.search.trim() !== '';

      // If only caste is selected, use caste endpoint
      if (hasCaste && !hasAuthority && !hasOccupation && !hasState) {
        endpoint = `/schemes/caste/${filters.caste}`;
        params = {};
      } else if (hasSearch && !hasAuthority && !hasOccupation && !hasState && !hasCaste) {
        // If search query exists from header, fetch schemes from both central and state (exclude private)
        // Fetch central and state schemes separately, then combine and filter
        endpoint = null; // Will handle with multiple requests
      } else {
        // Map occupation to backend category enum value if occupation is selected
        const mappedCategory = hasOccupation 
          ? (occupationToCategoryMap[filters.occupation] || filters.occupation.toLowerCase())
          : null;

        if (hasAuthority && (mappedCategory || hasState)) {
          // Use authoritycategory endpoint when authority + category/state are selected
          endpoint = '/schemes/authoritycategory';
          params = {
            authority: filters.category,
          };
          if (hasState) params.state = filters.state;
          if (mappedCategory) params.category = mappedCategory;
        } else if (hasAuthority) {
          // Use authority endpoint when only authority is selected
          endpoint = '/schemes/authority';
          params = {
            authority: filters.category,
          };
          if (hasState) params.state = filters.state;
        } else if (mappedCategory && !hasAuthority) {
          // If only occupation is selected, use category endpoint with mapped value
          endpoint = `/schemes/category/${mappedCategory}`;
          params = {};
        } else {
          // Default: get all schemes
          endpoint = '/schemes/get';
          params = {};
        }
      }

      // Handle search from header (central and state only)
      let schemesData = [];
      if (endpoint === null && hasSearch && !hasAuthority && !hasOccupation && !hasState && !hasCaste) {
        // Fetch schemes from both central and state authorities
        try {
          const [centralRes, stateRes] = await Promise.all([
            api.get('/schemes/authority', { params: { authority: 'central' } }),
            api.get('/schemes/authority', { params: { authority: 'state' } })
          ]);
          const centralSchemes = Array.isArray(centralRes.data) ? centralRes.data : [];
          const stateSchemes = Array.isArray(stateRes.data) ? stateRes.data : [];
          schemesData = [...centralSchemes, ...stateSchemes];
        } catch (err) {
          console.error('Error fetching schemes for header search:', err);
          schemesData = [];
        }
      } else {
        const res = await api.get(endpoint, { params });
        schemesData = res.data;
        if (!Array.isArray(schemesData)) {
          schemesData = [];
        }
      }
      
      // Apply search and caste filter on client side if not already filtered by backend
      let filtered = schemesData;
      
      // Filter by caste if not already filtered by backend endpoint
      const wasCasteEndpoint = endpoint && endpoint === `/schemes/caste/${filters.caste}`;
      if (hasCaste && !wasCasteEndpoint) {
        filtered = schemesData.filter(s => {
          const schemeCaste = s.eligibilityCriteria?.caste || s.caste || '';
          return schemeCaste === filters.caste.toLowerCase();
        });
      }
      
      // Apply search filter
      if (filters.search && filters.search.trim() !== '') {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(s => {
          const name = (s.name || '').toLowerCase();
          const description = (s.description || '').toLowerCase();
          const category = (s.category || '').toLowerCase();
          return name.includes(searchLower) || 
                 description.includes(searchLower) || 
                 category.includes(searchLower);
        });
      }
      
      setSchemes(filtered);
      setError('');
    } catch (e) {
      console.error('Error fetching schemes:', e);
      setSchemes([]);
      setError(e.response?.data?.message || e.message || 'Failed to fetch schemes. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get localized occupation label from a key or backend value
  const getOccupationLabel = (val) => {
    if (!val) return t('category.notAvailable');
    // If val matches one of our keys, translate directly
    const translated = t(`occupations.${val}`);
    if (translated && translated !== `occupations.${val}`) return translated;
    // Otherwise try to map backend enum to a known key
    const backendToKeyEntry = Object.entries(occupationToCategoryMap).find(([, backend]) => backend === val);
    if (backendToKeyEntry) {
      const key = backendToKeyEntry[0];
      const backTranslated = t(`occupations.${key}`);
      if (backTranslated && backTranslated !== `occupations.${key}`) return backTranslated;
    }
    return val;
  };

  const getStateLabel = (stateValue) => {
    if (!stateValue) return t('category.all');
    const found = states.find(s => s.value === stateValue);
    if (found) return t(found.labelKey);
    return stateValue;
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      if (field === 'category') {
        return { ...prev, category: value, occupation: '', state: '', caste: '', search: '' };
      }
      if (field === 'occupation') {
        return { ...prev, occupation: value };
      }
      if (field === 'state') {
        return { ...prev, state: value };
      }
      if (field === 'caste') {
        return { ...prev, caste: value };
      }
      if (field === 'search') {
        return { ...prev, search: value };
      }
      return prev;
    });
  };

  const handleBellClick = (e, scheme) => {
    e.stopPropagation();
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Please login to set reminders.');
      return;
    }
    setSelectedScheme(scheme);
    setReminderModalOpen(true);
  };

  const handleCreateReminder = async (reminderDate) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.id) {
      throw new Error('User not found. Please login again.');
    }

    try {
      const reminderData = {
        userId: currentUser.id,
        schemeId: selectedScheme._id || selectedScheme.id,
        type: 'email',
        reminderDate: reminderDate
      };

      const response = await api.post('/reminders/create', reminderData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create reminder';
      throw new Error(errorMessage);
    }
  };

  const handleSchemeNameClick = (scheme) => {
    if (scheme.applyLink) {
      window.open(scheme.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="category-explorer-main">
      <aside className="category-sidebar">
        <h2>{t('category.filters')}</h2>
        <div className="filter-group">
          <label>{t('category.schemeCategory')}</label>
          <div className="filter-btns-vertical">
            {categories.map(c => (
              <button
                key={c.id}
                className={`side-category-btn${filters.category === c.id ? ' active' : ''}`}
                onClick={() => handleFilterChange('category', c.id)}
              >
                {t(`category.${c.id}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>{t('category.occupation')}</label>
          <select
            value={filters.occupation}
            onChange={e => handleFilterChange('occupation', e.target.value)}
            disabled={!filters.category}
          >
            <option value="">{t('category.all')}</option>
            {(occupations[filters.category] || []).map(o => (
              <option key={o} value={o}>{t(`occupations.${o}`)}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('category.stateLabel')}</label>
          <select value={filters.state} onChange={e => handleFilterChange('state', e.target.value)}>
            <option value="">{t('category.allStates')}</option>
            {states.map(s => (
              s.value !== '' && <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('category.casteLabel')}</label>
          <select value={filters.caste} onChange={e => handleFilterChange('caste', e.target.value)}>
            <option value="">{t('category.allCastes')}</option>
            {castes.map(caste => (
              caste && <option key={caste} value={caste}>{caste}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('category.searchByName')}</label>
          <input
            type="text"
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            placeholder={t('category.searchPlaceholderExample')}
          />
        </div>
      </aside>
      <main className="scheme-results-area">
        <h2 className="results-title">{t('category.schemes')}</h2>
        {error && (
          <div style={{padding: '1rem', background: '#fff0f0', border: '1px solid #f5c2c2', borderRadius: '6px', color: '#a00', marginBottom: '1rem'}}>
            {error}
          </div>
        )}
        {loading ? (
          <div style={{padding: '2rem', textAlign: 'center'}}>{t('category.loading')}</div>
        ) : schemes.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
            {t('category.noMatchingSchemes')}
            {!loading && <div style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>{t('category.adjustFilters')}</div>}
          </div>
        ) : (
          <div className="schemes-list">
            {schemes.map(scheme => {
              const schemeName = (language === 'hi' && (scheme.name_hi || scheme.name_hindi)) 
                ? (scheme.name_hi || scheme.name_hindi) 
                : (language === 'te' && scheme.name_te) 
                  ? scheme.name_te 
                  : (scheme.name || scheme.title);

              const schemeDescription = (language === 'hi' && (scheme.description_hi || scheme.description_hindi))
                ? (scheme.description_hi || scheme.description_hindi)
                : (language === 'te' && scheme.description_te)
                  ? scheme.description_te
                  : (scheme.description || t('category.noDescription'));

              return (
                <div className="scheme-card" key={scheme._id || scheme.id}>
                  <h3 
                    onClick={() => handleSchemeNameClick(scheme)}
                    className={scheme.applyLink ? 'scheme-name-link' : ''}
                    title={scheme.applyLink ? t('category.clickToApply') : ''}
                  >
                    {schemeName}
                  </h3>
                  <p><b>{t('category.categoryLabel')}:</b> {getOccupationLabel(scheme.category || scheme.occupation)}</p>
                  <p><b>{t('category.stateLabel')}:</b> {getStateLabel(scheme.state)}</p>
                  <p><b>{t('category.authority')}:</b> {scheme.authority || filters.category || t('category.notAvailable')}</p>
                  <p className="scheme-description">{schemeDescription}</p>
                  <button 
                    className="scheme-bell-icon" 
                    onClick={(e) => handleBellClick(e, scheme)}
                    title={t('category.setReminder')}
                  >
                    🔔
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <ReminderModal
        isOpen={reminderModalOpen}
        onClose={() => {
          setReminderModalOpen(false);
          setSelectedScheme(null);
        }}
        scheme={selectedScheme}
        onCreateReminder={handleCreateReminder}
      />
    </section>
  );
};
export default CategorySection;
