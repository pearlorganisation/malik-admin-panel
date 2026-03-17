'use client';

import React, { useState, useEffect } from 'react';
import { useUpdateActivityMutation } from '@/features/activity/activityApi';

export default function EditActivityModal({ activity, onClose, onSuccess }) {
  if (!activity) return null;
  const [updateActivity, { isLoading }] = useUpdateActivityMutation();
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    categoryId: activity?.categoryId?._id || activity?.categoryId || '',
    placeId: activity?.placeId?._id || activity?.placeId || '',
    isActive: activity?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
  if (activity) {
    setFormData({
      name: activity?.name || '',
      categoryId: activity?.categoryId?._id || activity?.categoryId || '',
      placeId: activity?.placeId?._id || activity?.placeId || '',
      isActive: activity?.isActive ?? true,
    });
  }
}, [activity]);
  const [categories] = useState([
    { id: '6954df3dbe9967f0401688b7', name: 'Adventure' },
    { id: '6954df3dbe9967f0401688b8', name: 'Beach' },
    { id: '6954df3dbe9967f0401688b9', name: 'Cultural' },
  ]);
  const [places] = useState([
    { id: '6954c919be9967f0401683a2', name: 'Dubai' },
    { id: '6954c919be9967f0401683a3', name: 'Abu Dhabi' },
    { id: '6954c919be9967f0401683a4', name: 'Sharjah' },
  ]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Activity name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.placeId) newErrors.placeId = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('placeId', formData.placeId);
      // formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isActive', String(formData.isActive));

      // await updateActivity({ id: activity._id, formData: formDataToSend }).unwrap();
      await updateActivity({ id: activity._id, data: formDataToSend }).unwrap();
      onSuccess?.();
    } catch (error) {
      // setErrors({ submit: error?.data?.message || 'Failed to update activity' });
      console.error("UPDATE ERROR:", error); // 🔥 add this
  setErrors({ submit: error?.data?.message || 'Failed to update activity' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Activity Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Category & Place */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-600 text-xs mt-1">{errors.categoryId}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <select
            value={formData.placeId}
            onChange={(e) => handleChange('placeId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
              errors.placeId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            {places.map(place => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
          {errors.placeId && <p className="text-red-600 text-xs mt-1">{errors.placeId}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
          Activity is Active
        </label>
      </div>

      {/* Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {errors.submit}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold"
        >
          {isLoading ? 'Saving...' : 'Update'}
        </button>
      </div>
    </div>
  );
}
