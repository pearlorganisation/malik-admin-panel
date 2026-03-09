'use client';

import React, { useState } from 'react';

export default function Step5BBQBuffet({ formData, onFormDataChange, onNext, onPrevious }) {
  const updateBBQField = (field, value) => {
    onFormDataChange({
      BBQ_BUFFET: { ...formData.BBQ_BUFFET, [field]: value }
    });
  };

  const addCategory = () => {
    onFormDataChange({
      BBQ_BUFFET: {
        ...formData.BBQ_BUFFET,
        fields: [...(formData.BBQ_BUFFET.fields || []), { category: '', items: [] }]
      }
    });
  };

  const updateCategory = (index, field, value) => {
    const newFields = [...formData.BBQ_BUFFET.fields];
    newFields[index][field] = value;
    onFormDataChange({ BBQ_BUFFET: { ...formData.BBQ_BUFFET, fields: newFields } });
  };

  const addCategoryItem = (categoryIndex) => {
    const newFields = [...formData.BBQ_BUFFET.fields];
    newFields[categoryIndex].items.push('');
    onFormDataChange({ BBQ_BUFFET: { ...formData.BBQ_BUFFET, fields: newFields } });
  };

  const updateCategoryItem = (categoryIndex, itemIndex, value) => {
    const newFields = [...formData.BBQ_BUFFET.fields];
    newFields[categoryIndex].items[itemIndex] = value;
    onFormDataChange({ BBQ_BUFFET: { ...formData.BBQ_BUFFET, fields: newFields } });
  };

  const removeCategoryItem = (categoryIndex, itemIndex) => {
    const newFields = [...formData.BBQ_BUFFET.fields];
    newFields[categoryIndex].items = newFields[categoryIndex].items.filter((_, i) => i !== itemIndex);
    onFormDataChange({ BBQ_BUFFET: { ...formData.BBQ_BUFFET, fields: newFields } });
  };

  const removeCategory = (index) => {
    const newFields = formData.BBQ_BUFFET.fields.filter((_, i) => i !== index);
    onFormDataChange({ BBQ_BUFFET: { ...formData.BBQ_BUFFET, fields: newFields } });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">BBQ Buffet Details</h2>
        <p className="text-gray-600 text-sm">Configure BBQ buffet options if included (Optional)</p>
      </div>

      {/* BBQ Title & Description */}
      <div className="space-y-4 border border-gray-200 rounded-lg p-5 bg-orange-50">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">BBQ Title</label>
          <input
            type="text"
            placeholder="e.g., Premium BBQ Buffet"
            value={formData.BBQ_BUFFET?.title || ''}
            onChange={(e) => updateBBQField('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">BBQ Description</label>
          <textarea
            placeholder="Describe the BBQ buffet offerings"
            value={formData.BBQ_BUFFET?.description || ''}
            onChange={(e) => updateBBQField('description', e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>

      {/* BBQ Categories */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Food Categories</h3>
          <button
            type="button"
            onClick={addCategory}
            className="px-3 py-1 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition font-medium"
          >
            + Add Category
          </button>
        </div>

        {formData.BBQ_BUFFET?.fields?.map((category, catIndex) => (
          <div key={catIndex} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-orange-600">Category {catIndex + 1}</span>
              <button
                type="button"
                onClick={() => removeCategory(catIndex)}
                className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition font-semibold text-sm"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Category name (e.g., Grilled Meats)"
              value={category.category || ''}
              onChange={(e) => updateCategory(catIndex, 'category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Items in Category */}
            <div className="space-y-2 ml-4 border-l-2 border-orange-300 pl-4">
              {category.items?.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Item ${itemIndex + 1}`}
                    value={item}
                    onChange={(e) => updateCategoryItem(catIndex, itemIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeCategoryItem(catIndex, itemIndex)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addCategoryItem(catIndex)}
                className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition font-medium"
              >
                + Add Item
              </button>
            </div>
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
          onClick={onNext}
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
