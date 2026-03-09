'use client';

import React, { useState } from 'react';

export default function Step7MediaUpload({ formData, onFormDataChange, onNext, onPrevious }) {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...(formData.images || []), ...files];
    
    onFormDataChange({ images: newImages });

    const previews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFormDataChange({ video: file });
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    onFormDataChange({ images: newImages });
    
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const removeVideo = () => {
    onFormDataChange({ video: null });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Media Upload</h2>
        <p className="text-gray-600 text-sm">Upload images and video for your activity</p>
      </div>

      {/* Images Section */}
      <div className="space-y-4 border border-gray-200 rounded-lg p-6 bg-linear-to-br from-blue-50 to-cyan-50">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Activity Images</h3>
          <p className="text-gray-600 text-xs mb-4">Upload up to 10 high-quality images (recommended 4-6 images)</p>
        </div>

        {/* Upload Area */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-8 bg-white hover:bg-blue-50 transition cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="text-center">
            <p className="text-3xl mb-2">📷</p>
            <p className="text-sm font-semibold text-gray-900">Click to upload images</p>
            <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>
        </label>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">{formData.images?.length} image(s) selected</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="space-y-4 border border-gray-200 rounded-lg p-6 bg-linear-to-br from-purple-50 to-pink-50">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Activity Video</h3>
          <p className="text-gray-600 text-xs mb-4">Upload one promotional video (optional)</p>
        </div>

        {!formData.video ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-8 bg-white hover:bg-purple-50 transition cursor-pointer">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
            <div className="text-center">
              <p className="text-3xl mb-2">🎬</p>
              <p className="text-sm font-semibold text-gray-900">Click to upload video</p>
              <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">MP4, WebM up to 100MB</p>
            </div>
          </label>
        ) : (
          <div className="bg-white p-4 rounded-lg border border-gray-300 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{formData.video.name}</p>
                <p className="text-xs text-gray-500">{(formData.video.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeVideo}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-yellow-900 mb-2">📸 Pro Tips</p>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• Use high-quality images that showcase the best features of your activity</li>
          <li>• Include landscape, close-up, and action shots for better engagement</li>
          <li>• Keep video under 5 minutes for best performance</li>
          <li>• First image will be shown as thumbnail</li>
        </ul>
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
          Continue to Review
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
