'use client';

import React, { useState } from 'react';

export default function Step8ReviewSubmit({ formData, onSubmit, isLoading, onPrevious }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const canSubmit = agreedToTerms && !isLoading;

  const ReviewSection = ({ title, children }) => (
    <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
      <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-200">{title}</h3>
      <div className="space-y-1 text-xs text-gray-700">{children}</div>
    </div>
  );

  const ReviewItem = ({ label, value }) => (
    <div className="flex justify-between gap-4">
      <span className="font-semibold text-gray-600 min-w-fit">{label}:</span>
      <span className="text-right break-words">{value || 'Not provided'}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600 text-sm">Verify all information before submitting</p>
      </div>

      {/* Basic Information */}
      <ReviewSection title="📋 Basic Information">
        <ReviewItem label="Activity Name" value={formData.name} />
        <ReviewItem label="Category ID" value={formData.categoryId} />
        <ReviewItem label="Place ID" value={formData.placeId} />
        <ReviewItem label="Status" value={formData.isActive ? '✓ Active' : '✕ Inactive'} />
      </ReviewSection>

      {/* Experience */}
      {formData.Experience.title && (
        <ReviewSection title="🎯 Experience">
          <ReviewItem label="Title" value={formData.Experience.title} />
          {formData.Experience.note && <ReviewItem label="Note" value={formData.Experience.note} />}
          <ReviewItem label="Description" value={formData.Experience.description} />
          {formData.Experience.highlights?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-600">Highlights:</p>
              <ul className="ml-4 space-y-1">
                {formData.Experience.highlights.map((h, i) => h && (
                  <li key={i} className="text-gray-700">• {h}</li>
                ))}
              </ul>
            </div>
          )}
        </ReviewSection>
      )}

      {/* Itinerary */}
      {formData.Itinerary?.length > 0 && (
        <ReviewSection title="🗓️ Itinerary">
          <p className="font-semibold text-gray-900 mb-2">{formData.Itinerary.length} step(s)</p>
          {formData.Itinerary.map((item, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-xs mb-2">
              <p className="font-semibold text-blue-600">Step {idx + 1}</p>
              {item.time && <p><span className="font-semibold">Time:</span> {item.time}</p>}
              <p><span className="font-semibold">Title:</span> {item.title}</p>
              <p><span className="font-semibold">Desc:</span> {item.description}</p>
            </div>
          ))}
        </ReviewSection>
      )}

      {/* Info & Logistics */}
      {(formData.InfoAndLogistics.pickupZone.description || formData.InfoAndLogistics.keyInfo?.length > 0) && (
        <ReviewSection title="🚗 Info & Logistics">
          {formData.InfoAndLogistics.pickupZone.description && (
            <>
              <p className="font-semibold text-gray-900">Pickup Zone:</p>
              <p className="ml-2">{formData.InfoAndLogistics.pickupZone.description}</p>
            </>
          )}
          {formData.InfoAndLogistics.keyInfo?.length > 0 && (
            <>
              <p className="font-semibold text-gray-900 mt-2">Key Info:</p>
              <ul className="ml-4 space-y-0.5">
                {formData.InfoAndLogistics.keyInfo.map((k, i) => k && (
                  <li key={i} className="text-gray-700">• {k}</li>
                ))}
              </ul>
            </>
          )}
        </ReviewSection>
      )}

      {/* BBQ Buffet */}
      {formData.BBQ_BUFFET?.title && (
        <ReviewSection title="🍖 BBQ Buffet">
          <ReviewItem label="Title" value={formData.BBQ_BUFFET.title} />
          <ReviewItem label="Description" value={formData.BBQ_BUFFET.description} />
          {formData.BBQ_BUFFET.fields?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-600">Categories:</p>
              {formData.BBQ_BUFFET.fields.map((f, i) => (
                <div key={i} className="ml-4 text-xs bg-white p-1 rounded mt-1">
                  <p className="font-semibold text-orange-600">{f.category}</p>
                  {f.items?.length > 0 && (
                    <ul className="ml-2">
                      {f.items.map((item, j) => item && (
                        <li key={j}>• {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </ReviewSection>
      )}

      {/* Private SUV */}
      {formData.PrivateSUV?.available && (
        <ReviewSection title="🚙 Private SUV Service">
          <ReviewItem label="Model" value={formData.PrivateSUV.model} />
          <ReviewItem label="Fee (AED)" value={`AED ${formData.PrivateSUV.fee}`} />
        </ReviewSection>
      )}

      {/* Media */}
      {(formData.images?.length > 0 || formData.video) && (
        <ReviewSection title="📸 Media">
          {formData.images?.length > 0 && <ReviewItem label="Images" value={`${formData.images.length} image(s) ready`} />}
          {formData.video && <ReviewItem label="Video" value="1 video ready" />}
        </ReviewSection>
      )}

      {/* Agreement */}
      <div className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 text-blue-600 mt-0.5 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">
            I confirm that all the information provided above is accurate and complete
          </span>
        </label>
        <p className="text-xs text-gray-600 ml-8">
          Please review all details carefully before submitting your activity
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={onPrevious}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? '⏳ Submitting...' : '✅ Submit Activity'}
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
