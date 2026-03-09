'use client';

import React, { useState } from 'react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200 rounded-t-lg">
          <h2 className="text-lg font-bold text-red-900">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700">{message}</p>
          
          {itemName && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-1">Item to be deleted</p>
              <p className="text-red-900 font-bold text-lg break-words">{itemName}</p>
            </div>
          )}

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
            <span className="text-yellow-600 font-bold text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-yellow-900 font-semibold text-sm">Warning</p>
              <p className="text-yellow-800 text-xs">This action is permanent and cannot be reversed.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Deleting...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
