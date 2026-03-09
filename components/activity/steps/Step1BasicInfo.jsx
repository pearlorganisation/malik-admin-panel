'use client';

import React, { useState } from 'react';
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";

export default function Step1BasicInfo({ formData, onFormDataChange, onNext }) {
  const [errors, setErrors] = useState({});
  const { data: categoryResponse, isLoading: categoryLoading } =
    useGetCategoriesQuery({ page: 1, limit: 100 });

  const categories = categoryResponse?.data || [];
  const { data: placeResponse, isLoading: placeLoading } =
    useGetAllPlacesQuery();

  const places = placeResponse?.data || [];

  const validateStep = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Activity name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.placeId) newErrors.placeId = 'Place is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) onNext();
  };

  const handleInputChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Activity Information</h2>
        <p className="text-gray-600 text-sm">Enter the essential details of your activity</p>
      </div>

      {/* Activity Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Activity Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Desert Safari Adventure"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.name && <p className="text-red-600 text-xs font-medium">{errors.name}</p>}
        <p className="text-gray-500 text-xs">This is the main title of your activity</p>
      </div>

      {/* Category & Place - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none ${errors.categoryId ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
          >
            <option value=""> Select Category </option>
            {categoryLoading ? (
              <option>Loading categories...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          {errors.categoryId && <p className="text-red-600 text-xs font-medium">{errors.categoryId}</p>}
          <p className="text-gray-500 text-xs">Choose the main category</p>
        </div>

        {/* Place */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Place/Location <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.placeId || ''}
            onChange={(e) => handleInputChange('placeId', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none ${errors.placeId ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
          >
            <option value=""> Select Place </option>
            {placeLoading ? (
              <option>Loading places...</option>
            ) : (
              places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.name}
                </option>
              ))
            )}
          </select>
          {errors.placeId && <p className="text-red-600 text-xs font-medium">{errors.placeId}</p>}
          <p className="text-gray-500 text-xs">Select the location</p>
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
          Activity is Active
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition duration-200"
        >
          Continue to Experience
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
