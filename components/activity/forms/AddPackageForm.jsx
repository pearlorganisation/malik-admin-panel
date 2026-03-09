'use client';

import React, { useState } from 'react';
import { useCreatePackageMutation } from '@/lib/api/activityApi';

export default function AddPackageForm({ activityId, onSuccess }) {
  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    minPeople: 1,
    maxPeople: 50,
    includes: [''],
    excludes: [''],
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Package name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (formData.minPeople <= 0) newErrors.minPeople = 'Minimum people must be at least 1';
    if (formData.maxPeople < formData.minPeople) newErrors.maxPeople = 'Max must be >= Min';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createPackage({
        activityId,
        ...formData,
        price: parseFloat(formData.price),
        includes: formData.includes.filter(i => i.trim()),
        excludes: formData.excludes.filter(i => i.trim()),
      }).unwrap();

      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        minPeople: 1,
        maxPeople: 50,
        includes: [''],
        excludes: [''],
        isActive: true,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({ submit: error?.data?.message || 'Failed to create package' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Package</h3>

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Package Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Gold Package"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
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
          placeholder="Package description"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none h-20 ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
      </div>

      {/* Price & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Price (AED) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="0"
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="text-red-600 text-xs">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g., 4 hours"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Min & Max People */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Min People</label>
          <input
            type="number"
            value={formData.minPeople}
            onChange={(e) => handleChange('minPeople', parseInt(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.minPeople ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.minPeople && <p className="text-red-600 text-xs">{errors.minPeople}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Max People</label>
          <input
            type="number"
            value={formData.maxPeople}
            onChange={(e) => handleChange('maxPeople', parseInt(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.maxPeople ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.maxPeople && <p className="text-red-600 text-xs">{errors.maxPeople}</p>}
        </div>
      </div>

      {/* Includes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">What's Included</label>
        <div className="space-y-2">
          {formData.includes.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                placeholder="Add item"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {formData.includes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('includes', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('includes')}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            + Add another item
          </button>
        </div>
      </div>

      {/* Excludes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">What's Excluded</label>
        <div className="space-y-2">
          {formData.excludes.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('excludes', index, e.target.value)}
                placeholder="Add item"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {formData.excludes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('excludes', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('excludes')}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            + Add another item
          </button>
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Package...' : 'Create Package'}
      </button>
    </form>
  );
}
