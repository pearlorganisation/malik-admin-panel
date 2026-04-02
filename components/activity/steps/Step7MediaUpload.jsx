'use client';

import React, { useState, useEffect } from 'react';

export default function Step7MediaUpload({ formData, onFormDataChange, onNext, onPrevious }) {
  const [imagePreviews, setImagePreviews] = useState([]);

  // Generate previews (handles both File & existing images)
  useEffect(() => {
    if (!formData.images) return;

    const previews = formData.images.map((img) => {
      if (img instanceof File) {
        return URL.createObjectURL(img);
      }
      if (img.isExisting) {
        return img.secure_url;
      }
      return "";
    });

    setImagePreviews(previews);

    // Cleanup (prevent memory leak)
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.images]);

  // Handle Image Upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...(formData.images || []), ...files];
    onFormDataChange({ images: newImages });
  };

  // Handle Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFormDataChange({ video: file });
    }
  };

  // Remove Image
  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    onFormDataChange({ images: newImages });
  };

  // Remove Video
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
          <p className="text-gray-600 text-xs mb-4">Upload up to 10 images</p>
        </div>

        {/* Upload */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-8 bg-white hover:bg-blue-50 cursor-pointer">
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          <p>📷 Click to upload</p>
        </label>

        {/* Preview */}
        {imagePreviews.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-3">{formData.images?.length} image(s)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img src={preview} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100"
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
        <h3 className="font-semibold">Activity Video</h3>

        {!formData.video ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-8 bg-white cursor-pointer">
            <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
            <p>🎬 Upload Video</p>
          </label>
        ) : (
          <div className="bg-white p-4 rounded-lg border flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {formData.video.name || "Existing Video"}
              </p>
              {formData.video.size && (
                <p className="text-xs text-gray-500">
                  {(formData.video.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            <button onClick={removeVideo} className="text-red-600">Remove</button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button onClick={onPrevious} className="px-6 py-3 bg-gray-200 rounded-lg">
          Back
        </button>
        <button onClick={onNext} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Continue
        </button>
      </div>
    </div>
  );
}