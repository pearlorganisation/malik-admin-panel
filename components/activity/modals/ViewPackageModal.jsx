'use client';

import React from 'react';
import { X, CheckCircle, XCircle, Clock, Users } from 'lucide-react';

export default function ViewPackageModal({ package: pkg, isOpen, onClose }) {
  if (!isOpen || !pkg) return null;

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between p-4 border-b bg-gradient-to-r from-slate-600 to-slate-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">{pkg.name}</h2>
            <p className="text-emerald-100 mt-1 text-sm">
              Base Price: <span className="font-semibold">AED {pkg.price}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6 bg-gray-50">
          
          {/* Description */}
          {pkg.description && (
            <Section title="Description">
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {pkg.description}
              </p>
            </Section>
          )}

          {/* Included */}
          {pkg.whatInclude?.length > 0 && (
            <Section title="What's Included">
              <ul className="space-y-2">
                {pkg.whatInclude.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Excluded */}
          {pkg.whatExclude?.length > 0 && (
            <Section title="What's Excluded">
              <ul className="space-y-2">
                {pkg.whatExclude.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Booking Fields */}
          {pkg.bookingFields?.length > 0 && (
            <Section title="Booking Configuration">
              <div className="grid md:grid-cols-2 gap-4">
                {pkg.bookingFields.map((field, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">
                        {field.name}
                      </p>

                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {field.unit}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {field.min !== undefined && (
                        <p className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          Min: {field.min}
                        </p>
                      )}

                      {field.max !== undefined && (
                        <p className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          Max: {field.max}
                        </p>
                      )}

                      <p className="flex items-center gap-1 font-medium text-gray-900">
                        <Clock className="w-4 h-4 text-gray-400" />
                        AED {field.price} / {field.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Status */}
          <Section title="Status">
            <div className="flex items-center justify-between bg-white border rounded-xl p-4">
              <span className="text-gray-600">Availability</span>
              <span
                className={`font-semibold ${
                  pkg.isActive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {pkg.isActive ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
              <span>Created</span>
              <span>{formatDate(pkg.createdAt)}</span>
            </div>
          </Section>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="bg-white border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);