'use client';

import React, { useState } from 'react';

export default function Step3Itinerary({ formData, onFormDataChange, onNext, onPrevious }) {
  const addItineraryItem = () => {
    onFormDataChange({
      Itinerary: [...(formData.Itinerary || []), { time: '', title: '', description: '' }]
    });
  };

  const updateItinerary = (index, field, value) => {
    const newItinerary = [...formData.Itinerary];
    newItinerary[index][field] = value;
    onFormDataChange({ Itinerary: newItinerary });
  };

  const removeItinerary = (index) => {
    const newItinerary = formData.Itinerary.filter((_, i) => i !== index);
    onFormDataChange({ Itinerary: newItinerary });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Itinerary</h2>
        <p className="text-gray-600 text-sm">Break down the activity into time-based steps</p>
      </div>

      {/* Itinerary Items */}
      <div className="space-y-4">
        {formData.Itinerary?.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-600">Step {index + 1}</span>
              <button
                type="button"
                onClick={() => removeItinerary(index)}
                className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition font-semibold"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Time (e.g., 08:00 AM - 09:00 AM)"
              value={item.time || ''}
              onChange={(e) => updateItinerary(index, 'time', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Step title"
              value={item.title || ''}
              onChange={(e) => updateItinerary(index, 'title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Description of this step"
              value={item.description || ''}
              onChange={(e) => updateItinerary(index, 'description', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={addItineraryItem}
        className="w-full px-6 py-3 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition border-2 border-dashed border-blue-300"
      >
        + Add Itinerary Step
      </button>

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
