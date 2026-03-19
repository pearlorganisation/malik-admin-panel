'use client';

import React, { useState } from 'react';
import { useCreatePackageMutation } from '@/features/activity/activityApi';
import {
  Plus,
  Trash2,
  X,
  Package as PackageIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Save,
} from 'lucide-react';

export default function AddPackageModal({ activityId, onClose, onSuccess }) {
  const [createPackage, { isLoading }] = useCreatePackageMutation();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    whatInclude: [''], // Start with one empty field
    whatExclude: [''], // Start with one empty field
    bookingFields: [],
  });

  // ================= VALIDATION =================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Package name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Check if price is a valid number (0 is allowed if it's free, otherwise change check)
    if (formData.price === '' || Number(formData.price) < 0) {
      newErrors.price = 'Valid price required';
    }

    // Validate Booking Fields
    formData.bookingFields.forEach((f, i) => {
      if (!f.name?.trim()) newErrors[`bookingField_${i}_name`] = 'Required';
      if (Number(f.min) < 0) newErrors[`bookingField_${i}_min`] = 'Invalid min';
      if (Number(f.max) < Number(f.min)) newErrors[`bookingField_${i}_max`] = 'Max < Min';
      if (Number(f.price) < 0) newErrors[`bookingField_${i}_price`] = 'Invalid price';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= INPUT HANDLERS =================
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const copy = { ...errors };
      delete copy[field];
      setErrors(copy);
    }
  };

  // ================= ARRAY HANDLERS (Include/Exclude) =================
  const handleArrayChange = (field, index, value) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    // Optional: Prevent removing the last item if you always want at least one input
    // if (formData[field].length === 1) return; 
    
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // ================= BOOKING FIELD HANDLERS =================
  const addBookingField = () => {
    setFormData((prev) => ({
      ...prev,
      bookingFields: [
        ...prev.bookingFields,
        {
          name: '',
          unit: 'quantity', // Matches backend enum
          min: 1,
          max: 10,
          price: 0,
        },
      ],
    }));
  };

  const updateBookingField = (index, key, value) => {
    const updated = [...formData.bookingFields];
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, bookingFields: updated }));

    // Clear specific error if exists
    const errorKey = `bookingField_${index}_${key}`;
    if (errors[errorKey]) {
      const copy = { ...errors };
      delete copy[errorKey];
      setErrors(copy);
    }
  };

  const removeBookingField = (index) => {
    setFormData((prev) => ({
      ...prev,
      bookingFields: prev.bookingFields.filter((_, i) => i !== index),
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        activityId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        // Filter out empty strings so we don't send ["", ""] to backend
        whatInclude: formData.whatInclude.filter((i) => i.trim()),
        whatExclude: formData.whatExclude.filter((i) => i.trim()),
        bookingFields: formData.bookingFields.map((f) => ({
          name: f.name.trim(),
          unit: f.unit, // 'minute' or 'quantity'
          min: Number(f.min) || 0,
          max: Number(f.max) || 0,
          price: Number(f.price) || 0,
        })),
        isActive: true,
      };

      await createPackage(payload).unwrap();
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
  console.error(err);

  const backendErrors = err?.data?.errors;

  if (backendErrors && Array.isArray(backendErrors)) {
    const formattedErrors = {};

    backendErrors.forEach((e) => {
      formattedErrors[e.path] = e.msg;
    });

    setErrors(formattedErrors);
  } else {
    setErrors({
      submit: err?.data?.message || err?.message || "Failed to create package",
    });
  }
}
  };

  // ================= RENDER HELPERS =================
  // Reusable component for Includes/Excludes lists
  const renderListInput = (field, label, Icon) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
          <Icon size={16} /> {label}
        </label>
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>
      {formData[field].map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
            placeholder={`Add ${label.toLowerCase()} item...`}
            className="flex-1 input border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => removeArrayItem(field, index)}
            className="text-red-400 hover:text-red-600 p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {formData[field].length === 0 && (
        <p className="text-xs text-gray-400 italic">No items added.</p>
      )}
    </div>
  );

  // ================= UI =================
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => onClose?.()}>
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
       onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-white">
            <PackageIcon className="w-6 h-6" />
            <h2 className="text-xl font-bold">Create Activity Package</h2>
          </div>
          <button
            type="button"
             onClick={() => onClose?.()}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SCROLLABLE FORM AREA */}
        <form
         id="create-package-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6"
        >
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="e.g. Standard Package"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full input border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full input border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="h-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe what this package offers..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full h-[calc(100%-1.75rem)] input border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* INCLUDES & EXCLUDES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderListInput('whatInclude', "What's Included", CheckCircle)}
            {renderListInput('whatExclude', "What's Excluded", XCircle)}
          </div>

          <hr className="border-gray-200" />

          {/* BOOKING FIELDS */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-semibold text-gray-800">Booking Fields</h3>
                <p className="text-sm text-gray-500">
                  Define variable costs like Adults, Children, or Duration.
                </p>
              </div>
              <button
                type="button"
                onClick={addBookingField}
                className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 flex items-center gap-1 transition-colors"
              >
                <Plus size={16} /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {formData.bookingFields.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
                  No booking fields added yet.
                </div>
              )}

              {formData.bookingFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 border bg-gray-50/50 p-4 rounded-lg relative group"
                >
                  {/* Name */}
                  <div className="col-span-12 sm:col-span-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Label</label>
                    <input
                      value={field.name}
                      onChange={(e) => updateBookingField(index, 'name', e.target.value)}
                      placeholder="e.g. Adults"
                      className={`w-full input border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none ${
                        errors[`bookingField_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`bookingField_${index}_name`] && <span className="text-[10px] text-red-500">Req</span>}
                  </div>

                  {/* Unit */}
                  <div className="col-span-6 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Unit</label>
                    <select
                      value={field.unit}
                      onChange={(e) => updateBookingField(index, 'unit', e.target.value)}
                      className="w-full input border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="quantity">Quantity</option>
                      <option value="minute">Minute</option>
                    </select>
                  </div>

                  {/* Min */}
                  <div className="col-span-6 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      value={field.min}
                      onChange={(e) => updateBookingField(index, 'min', e.target.value)}
                      className="w-full input border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                     {errors[`bookingField_${index}_min`] && <span className="text-[10px] text-red-500">Invalid</span>}
                  </div>

                  {/* Max */}
                  <div className="col-span-6 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      value={field.max}
                      onChange={(e) => updateBookingField(index, 'max', e.target.value)}
                      className="w-full input border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    {errors[`bookingField_${index}_max`] && <span className="text-[10px] text-red-500">Err</span>}
                  </div>

                  {/* Price */}
                  <div className="col-span-6 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Price/Unit</label>
                    <input
                      type="number"
                      value={field.price}
                      onChange={(e) => updateBookingField(index, 'price', e.target.value)}
                      className="w-full input border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-12 sm:col-span-1 flex items-end justify-center pb-1">
                    <button
                      type="button"
                      onClick={() => removeBookingField(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove Field"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3 shrink-0">
          <button
             type="button"
  onClick={() => onClose?.()}
            className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
              type="submit"
              form="create-package-form"
            disabled={isLoading}
            className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Package
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}