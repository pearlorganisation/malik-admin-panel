'use client';

import React, { useState } from 'react';
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import { useGetAddonsQuery } from "@/features/addon/addonApi";

export default function Step1BasicInfo({ formData, onFormDataChange, onNext }) {
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
  const [addonSearch, setAddonSearch] = useState(""); // Search inside modal

  const { data: categoryResponse, isLoading: categoryLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
  const categories = categoryResponse?.data || [];
  
  const { data: placeResponse, isLoading: placeLoading } = useGetAllPlacesQuery();
  const places = placeResponse?.data || [];

  const { data: addonResponse, isLoading: addonLoading } = useGetAddonsQuery({ page: 1, limit: 100 });
  const allAddons = addonResponse?.data?.data || [];

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

  // Addon Logic
  const handleAddonToggle = (addonId) => {
    const currentAddons = [...(formData.addons || [])];
    const index = currentAddons.indexOf(addonId);
    if (index > -1) {
      currentAddons.splice(index, 1);
    } else {
      currentAddons.push(addonId);
    }
    onFormDataChange({ ...formData, addons: currentAddons });
  };

  // Filtered addons for the modal search
  const filteredAddons = allAddons.filter(addon => 
    addon.name.toLowerCase().includes(addonSearch.toLowerCase())
  );

  // Time slot functions... (unchanged)
  const addTimeSlot = () => {
    const updated = [...(formData.timeSlots || []), ""];
    onFormDataChange({ ...formData, timeSlots: updated });
  };
  const updateTimeSlot = (index, value) => {
    const updated = [...formData.timeSlots];
    const [hour, minute] = value.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = ((h + 11) % 12 + 1).toString().padStart(2, "0");
    updated[index] = `${formattedHour}:${minute} ${ampm}`;
    onFormDataChange({ ...formData, timeSlots: updated });
  };
  const removeTimeSlot = (index) => {
    const updated = formData.timeSlots.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, timeSlots: updated });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ... Activity Name, Category, Place UI (Unchanged) ... */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Activity Information</h2>
        <p className="text-gray-600 text-sm">Enter the essential details of your activity</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Activity Name *</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Category *</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Place *</label>
          <select
            value={formData.placeId || ''}
            onChange={(e) => handleInputChange('placeId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Place</option>
            {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* --- ADDONS SECTION --- */}
      <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-gray-700">
            Available Addons 
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">
              {formData.addons?.length || 0} Selected
            </span>
          </label>
          {allAddons.length > 3 && (
            <button 
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 text-xs font-semibold hover:underline"
            >
              View All & Search
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {addonLoading ? (
            <p className="text-xs text-gray-400">Loading...</p>
          ) : (
            allAddons.slice(0, 3).map((addon) => (
              <div 
                key={addon._id}
                onClick={() => handleAddonToggle(addon._id)}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.addons?.includes(addon._id)
                    ? "border-blue-500 bg-white shadow-sm"
                    : "border-gray-200 bg-gray-50/50 opacity-80"
                }`}
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 truncate">{addon.name}</p>
                  <p className="text-[10px] text-blue-600">AED {addon.price}</p>
                </div>
                <input 
                  type="checkbox" 
                  readOnly 
                  checked={formData.addons?.includes(addon._id)} 
                  className="w-3 h-3 rounded"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADDON MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Select Activity Addons</h3>
                <p className="text-sm text-gray-500">Choose multiple optional extras</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="p-4 border-b bg-gray-50">
              <input 
                type="text"
                placeholder="Search addons by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={addonSearch}
                onChange={(e) => setAddonSearch(e.target.value)}
              />
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4">
              {filteredAddons.map((addon) => (
                <div 
                  key={addon._id}
                  onClick={() => handleAddonToggle(addon._id)}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.addons?.includes(addon._id)
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{addon.name}</p>
                    <p className="text-xs text-blue-600 font-medium">AED {addon.price}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    formData.addons?.includes(addon._id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  }`}>
                    {formData.addons?.includes(addon._id) && <span className="text-white text-[10px]">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Done ({formData.addons?.length || 0})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TIME SLOTS & STATUS --- */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Activity Time Slots</label>
        {(formData.timeSlots || []).map((slot, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input type="time" onChange={(e) => updateTimeSlot(index, e.target.value)} className="px-4 py-2 border rounded-lg" />
            <span className="text-sm text-gray-600">{slot}</span>
            <button type="button" onClick={() => removeTimeSlot(index)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addTimeSlot} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">+ Add Slot</button>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} className="w-5 h-5" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Activity is Active</label>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button onClick={handleNext} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg">
          Continue to Experience
        </button>
      </div>
    </div>
  );
}