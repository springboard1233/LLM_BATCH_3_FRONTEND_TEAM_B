/**
 * Advanced Filtering and Search System
 */
import React, { useState, useEffect } from 'react';

const AdvancedFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [presets, setPresets] = useState([]);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadFilterPresets();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadFilterPresets = async () => {
    try {
      const response = await fetch('/api/user-preferences/filter-presets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPresets(data.presets || []);
      }
    } catch (error) {
      console.error('Error loading filter presets:', error);
    }
  };

  const saveFilterPreset = async () => {
    if (!presetName.trim()) return;

    try {
      const response = await fetch('/api/user-preferences/filter-presets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          preset_name: presetName,
          filters: filters
        })
      });

      if (response.ok) {
        await loadFilterPresets();
        setShowPresetDialog(false);
        setPresetName('');
      }
    } catch (error) {
      console.error('Error saving filter preset:', error);
    }
  };

  const loadPreset = (preset) => {
    setFilters(preset.filters);
    onFilterChange(preset.filters);
  };

  const deletePreset = async (presetId) => {
    try {
      const response = await fetch(
        `/api/user-preferences/filter-presets/${presetId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.ok) {
        await loadFilterPresets();
      }
    } catch (error) {
      console.error('Error deleting filter preset:', error);
    }
  };

  const fetchSuggestions = async (query) => {
    // Simulate search suggestions
    const mockSuggestions = [
      { type: 'transaction_id', value: `TXN-${query}`, relevance: 0.9 },
      { type: 'merchant', value: `Merchant ${query}`, relevance: 0.8 },
      { type: 'amount', value: `$${query}`, relevance: 0.7 }
    ];
    setSuggestions(mockSuggestions);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'in', label: 'In List' },
    { value: 'between', label: 'Between' }
  ];

  return (
    <div className="advanced-filter">
      {/* Search Bar with Autocomplete */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchQuery(suggestion.value);
                    setSuggestions([]);
                  }}
                >
                  <span className="suggestion-type">{suggestion.type}</span>
                  <span className="suggestion-value">{suggestion.value}</span>
                  <span className="suggestion-relevance">
                    {(suggestion.relevance * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Presets */}
      <div className="filter-presets">
        <label>Saved Filters:</label>
        <div className="preset-list">
          {presets.map((preset) => (
            <div key={preset.id} className="preset-item">
              <button
                onClick={() => loadPreset(preset)}
                className="preset-button"
              >
                {preset.name}
              </button>
              <button
                onClick={() => deletePreset(preset.id)}
                className="preset-delete"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => setShowPresetDialog(true)}
            className="button-secondary"
          >
            Save Current
          </button>
        </div>
      </div>

      {/* Filter Fields */}
      <div className="filter-fields">
        <div className="filter-row">
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="flagged">Flagged</option>
          </select>

          <select
            value={filters.risk_level || ''}
            onChange={(e) => handleFilterChange('risk_level', e.target.value)}
            className="filter-select"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <input
            type="number"
            placeholder="Min Amount"
            value={filters.min_amount || ''}
            onChange={(e) => handleFilterChange('min_amount', e.target.value)}
            className="filter-input"
          />

          <input
            type="number"
            placeholder="Max Amount"
            value={filters.max_amount || ''}
            onChange={(e) => handleFilterChange('max_amount', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-row">
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            className="filter-input"
          />

          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            className="filter-input"
          />

          <button onClick={clearFilters} className="button-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Save Preset Dialog */}
      {showPresetDialog && (
        <div className="preset-dialog">
          <div className="dialog-content">
            <h3>Save Filter Preset</h3>
            <input
              type="text"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="input"
            />
            <div className="dialog-actions">
              <button onClick={saveFilterPreset} className="button-primary">
                Save
              </button>
              <button
                onClick={() => setShowPresetDialog(false)}
                className="button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;
