'use client';

import React, { useState, useEffect } from 'react';
import { useUpdateActivityMutation } from '@/lib/api/activityApi';

export default function EditActivityForm({ activity, onClose, onSuccess }) {
  const [updateActivity, { isLoading }] = useUpdateActivityMutation();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || '',
        categoryId: activity.categoryId || '',
        placeId: activity.placeId || '',
        isActive: activity.isActive || true,
      });
    }
  }, [activity]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await updateActivity({
        id: activity._id,
        formData: formData,
      }).unwrap();

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err?.data?.message || 'Failed to update activity');
    }
  };

  if (!formData) return <div className="text-center py-4">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Activity Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="6954df3dbe9967f0401688b7">Adventure</option>
            <option value="6954df3dbe9967f0401688b8">Beach</option>
            <option value="6954df3dbe9967f0401688b9">Cultural</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Place</label>
          <select
            value={formData.placeId}
            onChange={(e) => handleChange('placeId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Place</option>
            <option value="6954c919be9967f0401683a2">Dubai</option>
            <option value="6954c919be9967f0401683a3">Abu Dhabi</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Activity is Active</label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
        >
          {isLoading ? 'Updating...' : 'Update Activity'}
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
