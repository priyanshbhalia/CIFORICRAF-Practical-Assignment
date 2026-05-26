import React, { useState } from 'react';
import { Sprout, CheckCircle, AlertCircle } from 'lucide-react';
import { DISTRICTS, SPECIES } from '../data/mockData';

export default function RecordForm({ onAddRecord }) {
  const initialFormState = {
    district: '',
    species: '',
    treesPlanted: '',
    plantingDate: '',
    healthStatus: 'good'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate fields on submit
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.district) {
      newErrors.district = 'District selection is required';
    }
    
    if (!formData.species.trim()) {
      newErrors.species = 'Tree species is required';
    }
    
    if (!formData.treesPlanted) {
      newErrors.treesPlanted = 'Number of trees is required';
    } else {
      const num = parseInt(formData.treesPlanted, 10);
      if (isNaN(num) || num <= 0) {
        newErrors.treesPlanted = 'Must be a positive integer';
      }
    }
    
    if (!formData.plantingDate) {
      newErrors.plantingDate = 'Planting date is required';
    } else {
      const inputDate = new Date(formData.plantingDate);
      const today = new Date();
      if (inputDate > today) {
        newErrors.plantingDate = 'Planting date cannot be in the future';
      }
    }
    
    if (!formData.healthStatus) {
      newErrors.healthStatus = 'Health status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error as user starts correcting it
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newRecord = {
        district: formData.district,
        species: formData.species.trim(),
        treesPlanted: parseInt(formData.treesPlanted, 10),
        plantingDate: formData.plantingDate,
        healthStatus: formData.healthStatus
      };

      // Bubble up to update app data
      onAddRecord(newRecord);

      // Show success toast
      setShowSuccess(true);
      
      // Reset form
      setFormData(initialFormState);
      setErrors({});

      // Auto-hide success toast
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }
  };

  return (
    <div className="panel-card" id="form-panel" style={{ height: '100%' }}>
      {showSuccess && (
        <div className="toast-success" id="success-toast">
          <CheckCircle size={16} />
          <span>Record successfully saved and metrics updated!</span>
        </div>
      )}

      <div className="panel-header">
        <div>
          <h2 className="panel-title">Add Planting Log</h2>
          <p className="panel-subtitle font-sm">Log new agroforestry observations</p>
        </div>
        <Sprout className="brand-icon" size={20} />
      </div>

      <form onSubmit={handleSubmit} className="form-grid" id="add-record-form" noValidate>
        {/* District Field */}
        <div className="form-group">
          <label htmlFor="district-select" className="form-label">District</label>
          <select
            id="district-select"
            name="district"
            className={`input-control ${errors.district ? 'error' : ''}`}
            value={formData.district}
            onChange={handleChange}
          >
            <option value="">Select District...</option>
            {DISTRICTS.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
          {errors.district && (
            <span className="error-text" id="district-error">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              {errors.district}
            </span>
          )}
        </div>

        {/* Tree Species Field */}
        <div className="form-group">
          <label htmlFor="species-input" className="form-label">Tree Species</label>
          <input
            id="species-input"
            list="species-list"
            name="species"
            type="text"
            className={`input-control ${errors.species ? 'error' : ''}`}
            placeholder="e.g. Grevillea robusta"
            value={formData.species}
            onChange={handleChange}
            autoComplete="off"
          />
          <datalist id="species-list">
            {SPECIES.map(sp => (
              <option key={sp} value={sp} />
            ))}
          </datalist>
          {errors.species && (
            <span className="error-text" id="species-error">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              {errors.species}
            </span>
          )}
        </div>

        {/* Number of Trees Planted Field */}
        <div className="form-group">
          <label htmlFor="treesPlanted-input" className="form-label">Number of Trees Planted</label>
          <input
            id="treesPlanted-input"
            name="treesPlanted"
            type="number"
            min="1"
            className={`input-control ${errors.treesPlanted ? 'error' : ''}`}
            placeholder="e.g. 150"
            value={formData.treesPlanted}
            onChange={handleChange}
          />
          {errors.treesPlanted && (
            <span className="error-text" id="treesPlanted-error">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              {errors.treesPlanted}
            </span>
          )}
        </div>

        {/* Planting Date Field */}
        <div className="form-group">
          <label htmlFor="plantingDate-input" className="form-label">Planting Date</label>
          <input
            id="plantingDate-input"
            name="plantingDate"
            type="date"
            className={`input-control ${errors.plantingDate ? 'error' : ''}`}
            value={formData.plantingDate}
            onChange={handleChange}
          />
          {errors.plantingDate && (
            <span className="error-text" id="plantingDate-error">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              {errors.plantingDate}
            </span>
          )}
        </div>

        {/* Health Status Field */}
        <div className="form-group">
          <label htmlFor="healthStatus-select" className="form-label">Health Status</label>
          <select
            id="healthStatus-select"
            name="healthStatus"
            className="input-control"
            value={formData.healthStatus}
            onChange={handleChange}
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" id="btn-submit-record" style={{ marginTop: '0.5rem' }}>
          <Sprout size={16} />
          Submit Record
        </button>
      </form>
    </div>
  );
}
