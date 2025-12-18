// app/admin/activities/components/ImagesSection.jsx
import React, { useEffect } from "react";

export default function ImagesSection({ formData, setFormData }) {
  // Initialize: 10 image slots + 1 video
  useEffect(() => {
    if (!formData.images || formData.images.length === 0) {
      setFormData({
        ...formData,
        images: Array(10)
          .fill(null)
          .map(() => ({ file: null })),
        video: formData.video || { file: null },
      });
    }
  }, [formData, setFormData]);

  const handleImageChange = (index, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const newImages = [...formData.images];
    newImages[index] = { file };
    setFormData({ ...formData, images: newImages });
  };

  const handleVideoChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      return;
    }

    setFormData({ ...formData, video: { file } });
  };

  const clearImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = { file: null };
    setFormData({ ...formData, images: newImages });
  };

  const clearVideo = () => {
    setFormData({ ...formData, video: { file: null } });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(mb * 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <section className="space-y-12">
      {/* Images Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <svg
              className="w-7 h-7 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Images</h2>
            <p className="text-gray-600">Upload up to 10 high-quality photos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.images.map((img, index) => (
            <div
              key={index}
              className={`relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 ${
                img.file
                  ? "border-indigo-300 shadow-lg"
                  : "border-dashed border-gray-300"
              } transition-all duration-300 hover:shadow-xl`}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Image {index + 1}{" "}
                {img.file && (
                  <span className="text-indigo-600">(Selected)</span>
                )}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageChange(index, e.target.files[0])
                }
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />

              {img.file && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-800 font-medium truncate">
                    {img.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(img.file.size)}
                  </p>
                  <button
                    type="button"
                    onClick={() => clearImage(index)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-100 rounded-xl">
            <svg
              className="w-7 h-7 text-purple-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Promotional Video
            </h2>
            <p className="text-gray-600">
              Optional: Add one video (MP4 recommended)
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <div
            className={`relative p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 ${
              formData.video?.file
                ? "border-purple-300 shadow-lg"
                : "border-dashed border-gray-300"
            } transition-all duration-300 hover:shadow-xl`}
          >
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Video Upload{" "}
              {formData.video?.file && (
                <span className="text-purple-600">(Selected)</span>
              )}
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                e.target.files?.[0] && handleVideoChange(e.target.files[0])
              }
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
            />

            {formData.video?.file && (
              <div className="mt-6 space-y-3">
                <p className="text-lg font-medium text-gray-800">
                  {formData.video.file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(formData.video.file.size)}
                </p>
                <button
                  type="button"
                  onClick={clearVideo}
                  className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                >
                  Remove Video
                </button>
              </div>
            )}

            {!formData.video?.file && (
              <p className="mt-4 text-sm text-gray-500">
                Recommended: MP4, under 100MB, max 2 minutes
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
