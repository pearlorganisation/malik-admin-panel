// app/admin/activities/components/ImagesSection.jsx
"use client";
import React from "react";

export default function ImagesSection({ formData, setFormData }) {
  const handleImageChange = (index, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const newImages = [...formData.images];
    newImages[index] = { file: file, preview: URL.createObjectURL(file) };
    setFormData({ ...formData, images: newImages });
  };

  const handleVideoChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      return;
    }

    setFormData({ ...formData, video: { file: file, preview: URL.createObjectURL(file) } });
  };

  const clearImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = { file: null, preview: null, isExisting: false };
    setFormData({ ...formData, images: newImages });
  };

  const clearVideo = () => {
    setFormData({ ...formData, video: { file: null, preview: null, isExisting: false, url: "" } });
  };

  return (
    <section className="space-y-12 animate-fadeIn">
      {/* Images Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity Images</h2>
            <p className="text-gray-600">Upload up to 10 high-quality photos. First image will be the thumbnail.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(formData.images || []).map((img, index) => {
            // Check if there is a preview available (from backend or newly uploaded file)
            const imageUrl = img?.preview || img?.url || img?.secure_url;

            return (
              <div
                key={index}
                className={`relative group overflow-hidden bg-gray-50 rounded-2xl border-2 transition-all duration-300 ${
                  imageUrl ? "border-indigo-400 shadow-md" : "border-dashed border-gray-300 hover:border-indigo-300"
                }`}
              >
                {imageUrl ? (
                  // Show Image Preview
                  <div className="relative w-full h-48">
                    <img src={imageUrl} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => clearImage(index)} className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transform hover:scale-105 transition">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  // Show Empty Upload Box
                  <div className="relative w-full h-48 flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                    <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-600">Slot {index + 1}</span>
                    <span className="text-xs text-gray-400 mt-1">Click to browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageChange(index, e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Section */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-100 rounded-xl">
             <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Promotional Video</h2>
            <p className="text-gray-600">Optional: Add one promotional video</p>
          </div>
        </div>

        <div className="max-w-xl">
          <div className={`relative overflow-hidden bg-gray-50 rounded-2xl border-2 transition-all duration-300 ${
              formData.video?.preview || formData.video?.url ? "border-purple-400 shadow-md" : "border-dashed border-gray-300 hover:border-purple-300"
            }`}
          >
            {formData.video?.preview || formData.video?.url ? (
               <div className="relative w-full aspect-video bg-black">
                 <video src={formData.video.preview || formData.video.url} controls className="w-full h-full object-contain" />
                 <button type="button" onClick={clearVideo} className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               </div>
            ) : (
              <div className="relative w-full aspect-video flex flex-col items-center justify-center p-8 text-center cursor-pointer">
                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span className="text-base font-semibold text-gray-700">Upload Video</span>
                <span className="text-sm text-gray-500 mt-1">MP4 recommended, Max 100MB</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleVideoChange(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}