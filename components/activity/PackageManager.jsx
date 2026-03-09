'use client';

import React, { useState } from 'react';
import { useCreatePackageMutation, useUpdatePackageMutation } from '@/lib/api/activityApi';

export default function PackageManager({ activityId, packages = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    whatInclude: [],
    whatExclude: [],
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      whatInclude: [],
      whatExclude: [],
      isActive: true,
    });
    setEditingId(null);
  };

  const handleAddInclude = () => {
    setFormData({
      ...formData,
      whatInclude: [...(formData.whatInclude || []), '']
    });
  };

  const handleAddExclude = () => {
    setFormData({
      ...formData,
      whatExclude: [...(formData.whatExclude || []), '']
    });
  };

  const handleUpdateInclude = (index, value) => {
    const newInclude = [...formData.whatInclude];
    newInclude[index] = value;
    setFormData({ ...formData, whatInclude: newInclude });
  };

  const handleUpdateExclude = (index, value) => {
    const newExclude = [...formData.whatExclude];
    newExclude[index] = value;
    setFormData({ ...formData, whatExclude: newExclude });
  };

  const handleRemoveInclude = (index) => {
    setFormData({
      ...formData,
      whatInclude: formData.whatInclude.filter((_, i) => i !== index)
    });
  };

  const handleRemoveExclude = (index) => {
    setFormData({
      ...formData,
      whatExclude: formData.whatExclude.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        activityId,
        ...formData,
        whatInclude: formData.whatInclude.filter(x => x.trim()),
        whatExclude: formData.whatExclude.filter(x => x.trim()),
      };

      if (editingId) {
        await updatePackage({ id: editingId, packageData }).unwrap();
        alert('Package updated successfully!');
      } else {
        await createPackage(packageData).unwrap();
        alert('Package created successfully!');
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      alert('Error: ' + (error?.data?.message || 'Failed to save package'));
    }
  };

  const handleEdit = (pkg) => {
    setFormData(pkg);
    setEditingId(pkg._id);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Activity Packages</h3>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          + Add Package
        </button>
      </div>

      {/* Packages List */}
      <div className="space-y-3">
        {packages?.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No packages yet. Create your first package!</p>
        ) : (
          packages.map((pkg) => (
            <div key={pkg._id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{pkg.name}</h4>
                  <p className="text-sm text-blue-600 font-semibold mt-1">AED {pkg.price}</p>
                  
                  {pkg.whatInclude?.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold text-green-700">Includes:</p>
                      <ul className="ml-2 space-y-0.5">
                        {pkg.whatInclude.map((item, i) => (
                          <li key={i} className="text-green-600">✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pkg.whatExclude?.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold text-red-700">Excludes:</p>
                      <ul className="ml-2 space-y-0.5">
                        {pkg.whatExclude.map((item, i) => (
                          <li key={i} className="text-red-600">✕ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className={`text-xs mt-2 px-2 py-1 rounded inline-block ${
                    pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(pkg)}
                  className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition font-semibold text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto space-y-4 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Package' : 'Create New Package'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Package Name */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gold Package"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Price (AED) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="10"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* What Includes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">What's Included</label>
                  <button
                    type="button"
                    onClick={handleAddInclude}
                    className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.whatInclude?.map((item, i) => (
                    <div key={i} className="flex gap-1">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateInclude(i, e.target.value)}
                        placeholder="Item included"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInclude(i)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Excludes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">What's Excluded</label>
                  <button
                    type="button"
                    onClick={handleAddExclude}
                    className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.whatExclude?.map((item, i) => (
                    <div key={i} className="flex gap-1">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateExclude(i, e.target.value)}
                        placeholder="Item excluded"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExclude(i)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Active
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
