'use client';

import React, { useState, useEffect } from 'react';
import { useUpdatePackageMutation } from '@/lib/api/activityApi';

export default function EditPackageForm({ packageData, activityId, onClose, onSuccess }) {
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (packageData) {
      setFormData({
        name: packageData.name || '',
        price: packageData.price || 0,
        duration: packageData.duration || '',
        groupSize: packageData.groupSize || '',
        includes: packageData.includes || [],
        excludes: packageData.excludes || [],
        description: packageData.description || '',
      });
    }
  }, [packageData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const handleRemoveItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await updatePackage({
        id: packageData._id,
        packageData: formData,
      }).unwrap();

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err?.data?.message || 'Failed to update package');
    }
  };

  if (!formData) return <div className="text-center py-4">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sticky top-0">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Package Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Price (AED)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g., 4 hours"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Group Size</label>
        <input
          type="text"
          value={formData.groupSize}
          onChange={(e) => handleChange('groupSize', e.target.value)}
          placeholder="e.g., 2-6 people"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2"
        />
      </div>

      {/* Includes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Includes</label>
        {formData.includes.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange('includes', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem('includes', index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem('includes')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Include
        </button>
      </div>

      {/* Excludes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Excludes</label>
        {formData.excludes.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange('excludes', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem('excludes', index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem('excludes')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Exclude
        </button>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
        >
          {isLoading ? 'Updating...' : 'Update Package'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
