'use client';

import React, { useState } from 'react';

export default function Step2Experience({ formData, onFormDataChange, onNext, onPrevious }) {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    if (!formData.Experience.title?.trim()) newErrors.title = 'Experience title is required';
    if (!formData.Experience.description?.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExperienceChange = (field, value) => {
    onFormDataChange({
      Experience: { ...formData.Experience, [field]: value }
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const addHighlight = () => {
    onFormDataChange({
      Experience: {
        ...formData.Experience,
        highlights: [...(formData.Experience.highlights || []), '']
      }
    });
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...formData.Experience.highlights];
    newHighlights[index] = value;
    onFormDataChange({
      Experience: { ...formData.Experience, highlights: newHighlights }
    });
  };

  const removeHighlight = (index) => {
    const newHighlights = formData.Experience.highlights.filter((_, i) => i !== index);
    onFormDataChange({
      Experience: { ...formData.Experience, highlights: newHighlights }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience Details</h2>
        <p className="text-gray-600 text-sm">Describe what participants will experience</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Experience Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Adventure in the Desert"
          value={formData.Experience.title || ''}
          onChange={(e) => handleExperienceChange('title', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="text-red-600 text-xs font-medium">{errors.title}</p>}
      </div>

      {/* Note */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Note (Optional)</label>
        <textarea
          placeholder="Add any additional note about the experience"
          value={formData.Experience.note || ''}
          onChange={(e) => handleExperienceChange('note', e.target.value)}
          rows="2"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Detailed description of what the activity entails..."
          value={formData.Experience.description || ''}
          onChange={(e) => handleExperienceChange('description', e.target.value)}
          rows="4"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-red-600 text-xs font-medium">{errors.description}</p>}
        <p className="text-gray-500 text-xs">Be detailed and descriptive about what participants will do</p>
      </div>

      {/* Highlights */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-700">Key Highlights</label>
          <button
            type="button"
            onClick={addHighlight}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
          >
            + Add Highlight
          </button>
        </div>
        
        {formData.Experience.highlights?.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder={`Highlight ${index + 1}`}
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => removeHighlight(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          onClick={() => validateStep() && onNext()}
          className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
