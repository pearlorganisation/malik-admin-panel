'use client';

import React, { useState } from 'react';

export default function Step4InfoAndLogistics({ formData, onFormDataChange, onNext, onPrevious }) {
  const updatePickupZone = (field, value) => {
    onFormDataChange({
      InfoAndLogistics: {
        ...formData.InfoAndLogistics,
        pickupZone: { ...formData.InfoAndLogistics.pickupZone, [field]: value }
      }
    });
  };

  const addKeyInfo = () => {
    onFormDataChange({
      InfoAndLogistics: {
        ...formData.InfoAndLogistics,
        keyInfo: [...(formData.InfoAndLogistics.keyInfo || []), '']
      }
    });
  };

  const updateKeyInfo = (index, value) => {
    const newKeyInfo = [...formData.InfoAndLogistics.keyInfo];
    newKeyInfo[index] = value;
    onFormDataChange({
      InfoAndLogistics: { ...formData.InfoAndLogistics, keyInfo: newKeyInfo }
    });
  };

  const removeKeyInfo = (index) => {
    const newKeyInfo = formData.InfoAndLogistics.keyInfo.filter((_, i) => i !== index);
    onFormDataChange({
      InfoAndLogistics: { ...formData.InfoAndLogistics, keyInfo: newKeyInfo }
    });
  };

  const addEssentialGuide = () => {
    onFormDataChange({
      InfoAndLogistics: {
        ...formData.InfoAndLogistics,
        essentialGuide: [...(formData.InfoAndLogistics.essentialGuide || []), '']
      }
    });
  };

  const updateEssentialGuide = (index, value) => {
    const newGuide = [...formData.InfoAndLogistics.essentialGuide];
    newGuide[index] = value;
    onFormDataChange({
      InfoAndLogistics: { ...formData.InfoAndLogistics, essentialGuide: newGuide }
    });
  };

  const removeEssentialGuide = (index) => {
    const newGuide = formData.InfoAndLogistics.essentialGuide.filter((_, i) => i !== index);
    onFormDataChange({
      InfoAndLogistics: { ...formData.InfoAndLogistics, essentialGuide: newGuide }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Info & Logistics</h2>
        <p className="text-gray-600 text-sm">Provide important information and logistics details</p>
      </div>

      {/* Pickup Zone */}
      <div className="border border-gray-200 rounded-lg p-5 space-y-4 bg-blue-50">
        <h3 className="font-semibold text-gray-900">Pickup Zone Details</h3>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Pickup Description</label>
          <textarea
            placeholder="Describe the pickup location and process"
            value={formData.InfoAndLogistics.pickupZone.description || ''}
            onChange={(e) => updatePickupZone('description', e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Note (Optional)</label>
          <input
            type="text"
            placeholder="Any additional note about pickup"
            value={formData.InfoAndLogistics.pickupZone.note || ''}
            onChange={(e) => updatePickupZone('note', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Map Link (Optional)</label>
          <input
            type="url"
            placeholder="https://maps.google.com/..."
            value={formData.InfoAndLogistics.pickupZone.mapLink || ''}
            onChange={(e) => updatePickupZone('mapLink', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Key Information */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Key Information</h3>
          <button
            type="button"
            onClick={addKeyInfo}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
          >
            + Add Info
          </button>
        </div>

        {formData.InfoAndLogistics.keyInfo?.map((info, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Key information point"
              value={info}
              onChange={(e) => updateKeyInfo(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeKeyInfo(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Essential Guide */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Essential Guide</h3>
          <button
            type="button"
            onClick={addEssentialGuide}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
          >
            + Add Guide
          </button>
        </div>

        {formData.InfoAndLogistics.essentialGuide?.map((guide, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Essential guide point"
              value={guide}
              onChange={(e) => updateEssentialGuide(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeEssentialGuide(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
            >
              ✕
            </button>
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
