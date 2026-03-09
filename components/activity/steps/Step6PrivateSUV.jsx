'use client';

import React from 'react';

export default function Step6PrivateSUV({ formData, onFormDataChange, onNext, onPrevious }) {
  const updatePrivateSUV = (field, value) => {
    onFormDataChange({
      PrivateSUV: { ...formData.PrivateSUV, [field]: value }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Private SUV Service</h2>
        <p className="text-gray-600 text-sm">Configure private SUV transportation options (Optional)</p>
      </div>

      {/* Enable Service */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-linear-to-br from-purple-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="suvAvailable"
            checked={formData.PrivateSUV?.available || false}
            onChange={(e) => updatePrivateSUV('available', e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded cursor-pointer"
          />
          <label htmlFor="suvAvailable" className="text-sm font-semibold text-gray-700 cursor-pointer">
            Enable Private SUV Service
          </label>
        </div>
        <p className="text-gray-600 text-xs">Check this if you want to offer private SUV transportation</p>
      </div>

      {/* SUV Details - Show only if enabled */}
      {formData.PrivateSUV?.available && (
        <div className="space-y-4 border border-gray-200 rounded-lg p-5 bg-gray-50 animate-fadeIn">
          {/* Model */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">SUV Model</label>
            <input
              type="text"
              placeholder="e.g., Toyota Land Cruiser, Chevrolet Tahoe"
              value={formData.PrivateSUV?.model || 'SUV'}
              onChange={(e) => updatePrivateSUV('model', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <p className="text-gray-500 text-xs">Specify the make and model of the SUV</p>
          </div>

          {/* Fee */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Service Fee (AED)</label>
            <input
              type="number"
              placeholder="Enter fee amount"
              value={formData.PrivateSUV?.fee || 0}
              onChange={(e) => updatePrivateSUV('fee', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              min="0"
              step="10"
            />
            <p className="text-gray-500 text-xs">Price per booking or per person in AED</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">💡 Service Information</p>
            <p className="text-xs text-blue-700 mt-1">
              This service will be offered as an add-on option for participants who need private transportation during the activity.
            </p>
          </div>
        </div>
      )}

      {/* Feature Highlight */}
      <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-green-900 mb-2">✨ Premium Add-on</p>
        <p className="text-xs text-green-800">
          Private SUV services attract premium customers and significantly increase activity value perception.
        </p>
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
