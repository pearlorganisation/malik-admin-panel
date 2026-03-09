'use client';

import React, { useState } from 'react';

export default function EditPackageModal({ package: pkg, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    price: pkg?.price || 0,
    duration: pkg?.duration || '',
    minPeople: pkg?.minPeople || 1,
    maxPeople: pkg?.maxPeople || 50,
    isActive: pkg?.isActive ?? true,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Package name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.minPeople <= 0) newErrors.minPeople = 'Minimum people must be at least 1';
    if (formData.maxPeople < formData.minPeople) newErrors.maxPeople = 'Max must be greater than min';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave({
        id: pkg._id,
        ...formData,
      });
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save changes' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          ×
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
          <h2 className="text-2xl font-bold">Edit Package</h2>
          <p className="text-green-100 text-sm mt-1">{pkg?.name}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Gold Package"
            />
            {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none h-24 ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Package description"
            />
            {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Price (AED) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-600 text-xs">{errors.price}</p>}
          </div>

          {/* Duration & Group Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="e.g., 4 hours"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Min People</label>
              <input
                type="number"
                value={formData.minPeople}
                onChange={(e) => handleChange('minPeople', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.minPeople ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.minPeople && <p className="text-red-600 text-xs">{errors.minPeople}</p>}
            </div>
          </div>

          {/* Max People */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Max People</label>
            <input
              type="number"
              value={formData.maxPeople}
              onChange={(e) => handleChange('maxPeople', parseInt(e.target.value))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.maxPeople ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.maxPeople && <p className="text-red-600 text-xs">{errors.maxPeople}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-5 h-5 text-green-600 rounded cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Package is Active
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
