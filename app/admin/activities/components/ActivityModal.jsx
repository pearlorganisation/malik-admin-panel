// app/admin/activities/components/ActivityModal.jsx
"use client";

import React from "react";
import VariantForm from "./VariantForm";

export default function ActivityModal({
  isOpen,
  onClose,
  mode,
  formData,
  setFormData,
  onSubmit,
  isSaving,
}) {
  if (!isOpen) return null;

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "images", label: "Shared Images" },
    { id: "details", label: "Details & Policies" },
    { id: "variants", label: "Plans / Variants" },
    { id: "availability", label: "Availability" },
    { id: "itinerary", label: "Itinerary" },
    { id: "shared_inclusions", label: "Shared Inclusions" },
    { id: "restrictions", label: "Restrictions" },
  ];

  const [activeTab, setActiveTab] = React.useState("basic");

  const updateVariant = (index, updatedVariant) => {
    const newVariants = [...formData.variants];
    newVariants[index] = updatedVariant;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          name: "New Plan",
          description: "",
          images: [],
          pricing: [
            { label: "Adult", type: "per_person", price: 0, currency: "AED" },
          ],
          includes: [],
          excludes: [],
          addons: [],
          highlights: [],
          discount: { percentage: null, label: "" },
          isActive: true,
        },
      ],
    });
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1 || confirm("Remove this plan?")) {
      setFormData({
        ...formData,
        variants: formData.variants.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === "create" ? "Create New Activity" : "Edit Activity"}
          </h2>
          <button
            onClick={onClose}
            className="text-4xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-4 border-indigo-600 bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-10"
        >
          {/* BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Activity Title *"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-indigo-200"
              />
              <textarea
                placeholder="Short Description"
                rows={3}
                value={formData.shortDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                className="w-full px-6 py-4 border rounded-xl focus:ring-4 focus:ring-indigo-200"
              />
              <textarea
                placeholder="Full Description"
                rows={10}
                value={formData.fullDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullDescription: e.target.value })
                }
                className="w-full px-6 py-4 border rounded-xl focus:ring-4 focus:ring-indigo-200"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Duration Label (e.g. 7 Hours)"
                  value={formData.duration.label || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: { ...formData.duration, label: e.target.value },
                    })
                  }
                  className="px-6 py-4 border rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Hours (numeric)"
                  value={formData.duration.hours || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: {
                        ...formData.duration,
                        hours: e.target.value ? Number(e.target.value) : null,
                      },
                    })
                  }
                  className="px-6 py-4 border rounded-xl"
                />
              </div>
            </div>
          )}

          {/* SHARED IMAGES */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Shared Activity Images
              </h3>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    images: [
                      ...formData.images,
                      {
                        url: "",
                        alt: "",
                        isMain: formData.images.length === 0,
                      },
                    ],
                  })
                }
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium"
              >
                + Add Image
              </button>
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="p-6 bg-gray-50 rounded-xl flex flex-col md:flex-row gap-4 items-start"
                >
                  <input
                    placeholder="Image URL *"
                    value={img.url}
                    onChange={(e) => {
                      const newImgs = [...formData.images];
                      newImgs[i].url = e.target.value;
                      setFormData({ ...formData, images: newImgs });
                    }}
                    className="flex-1 px-5 py-3 border rounded-lg"
                  />
                  <input
                    placeholder="Alt Text"
                    value={img.alt || ""}
                    onChange={(e) => {
                      const newImgs = [...formData.images];
                      newImgs[i].alt = e.target.value;
                      setFormData({ ...formData, images: newImgs });
                    }}
                    className="w-full md:w-64 px-5 py-3 border rounded-lg"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={img.isMain}
                      onChange={(e) => {
                        const newImgs = formData.images.map((im, idx) => ({
                          ...im,
                          isMain: idx === i && e.target.checked,
                        }));
                        setFormData({ ...formData, images: newImgs });
                      }}
                    />
                    <span>Main Image</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-red-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* DETAILS & POLICIES */}
          {activeTab === "details" && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Languages (one per line)
                </label>
                <textarea
                  rows={4}
                  value={(formData.languages || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      languages: e.target.value
                        .split("\n")
                        .filter((l) => l.trim()),
                    })
                  }
                  placeholder="English&#10;Arabic&#10;French"
                  className="w-full px-6 py-4 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="liveGuide"
                  checked={formData.liveGuide || false}
                  onChange={(e) =>
                    setFormData({ ...formData, liveGuide: e.target.checked })
                  }
                  className="w-6 h-6"
                />
                <label htmlFor="liveGuide" className="text-lg font-medium">
                  Live Guide Included
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Cancellation Policy
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={
                        formData.cancellationPolicy?.isFreeCancellation || false
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cancellationPolicy: {
                            ...formData.cancellationPolicy,
                            isFreeCancellation: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>Free Cancellation</span>
                    <input
                      type="number"
                      placeholder="Hours before"
                      value={formData.cancellationPolicy?.hoursBefore || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cancellationPolicy: {
                            ...formData.cancellationPolicy,
                            hoursBefore: Number(e.target.value) || null,
                          },
                        })
                      }
                      className="w-32 px-4 py-3 border rounded-xl"
                    />
                    <span>hours</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Reserve Policy
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={formData.reservePolicy?.payLater || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reservePolicy: {
                            ...formData.reservePolicy,
                            payLater: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>Pay Later Available</span>
                  </div>
                  <textarea
                    placeholder="Reserve policy description"
                    rows={2}
                    value={formData.reservePolicy?.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reservePolicy: {
                          ...formData.reservePolicy,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full mt-3 px-6 py-4 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4">
                  Pickup & Transfer
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.pickup?.included || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pickup: {
                            ...formData.pickup,
                            included: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="font-medium">Pickup Included</span>
                  </div>
                  <textarea
                    placeholder="Pickup Description"
                    rows={3}
                    value={formData.pickup?.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup: {
                          ...formData.pickup,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full px-6 py-4 border rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Locations (comma separated)"
                    value={(formData.pickup?.locations || []).join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup: {
                          ...formData.pickup,
                          locations: e.target.value
                            .split(",")
                            .map((l) => l.trim()),
                        },
                      })
                    }
                    className="w-full px-6 py-4 border rounded-xl"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.pickup?.privateForOutskirts || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pickup: {
                            ...formData.pickup,
                            privateForOutskirts: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>Private transfer for outskirts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLANS / VARIANTS */}
          {activeTab === "variants" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-bold text-gray-900">
                  Activity Plans / Packages
                </h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg"
                >
                  + Add New Plan
                </button>
              </div>

              {formData.variants.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <p className="text-xl text-gray-500">
                    No plans created yet. Add your first plan above!
                  </p>
                </div>
              ) : (
                formData.variants.map((variant, index) => (
                  <VariantForm
                    key={index}
                    variant={variant}
                    index={index}
                    updateVariant={updateVariant}
                    removeVariant={removeVariant}
                  />
                ))
              )}
            </div>
          )}

          {/* AVAILABILITY */}
          {activeTab === "availability" && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold mb-4">
                  Time Slots
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      timeSlots: [
                        ...(formData.timeSlots || []),
                        { startTime: "09:00 AM", isAvailable: true },
                      ],
                    })
                  }
                  className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-xl"
                >
                  + Add Time Slot
                </button>
                {(formData.timeSlots || []).map((slot, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center mb-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <input
                      type="text"
                      placeholder="Start Time (e.g. 02:30 PM)"
                      value={slot.startTime}
                      onChange={(e) => {
                        const newSlots = [...formData.timeSlots];
                        newSlots[i].startTime = e.target.value;
                        setFormData({ ...formData, timeSlots: newSlots });
                      }}
                      className="flex-1 px-5 py-3 border rounded-lg"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={slot.isAvailable}
                        onChange={(e) => {
                          const newSlots = [...formData.timeSlots];
                          newSlots[i].isAvailable = e.target.checked;
                          setFormData({ ...formData, timeSlots: newSlots });
                        }}
                      />
                      Available
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          timeSlots: formData.timeSlots.filter(
                            (_, idx) => idx !== i
                          ),
                        })
                      }
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">
                  Available Dates (comma separated, YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  placeholder="2025-12-15, 2025-12-20, 2025-12-25"
                  value={(formData.availableDates || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableDates: e.target.value
                        .split(",")
                        .map((d) => d.trim())
                        .filter((d) => d),
                    })
                  }
                  className="w-full px-6 py-4 border rounded-xl"
                />
              </div>
            </div>
          )}

          {/* ITINERARY */}
          {activeTab === "itinerary" && (
            <div className="space-y-8">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    itinerary: [
                      ...(formData.itinerary || []),
                      {
                        title: "New Stop",
                        location: "",
                        activities: [""],
                        optionalAddons: [""],
                      },
                    ],
                  })
                }
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
              >
                + Add Itinerary Item
              </button>
              {(formData.itinerary || []).map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border"
                >
                  <input
                    placeholder="Title (e.g. Hotel Pickup)"
                    value={item.title}
                    onChange={(e) => {
                      const newIt = [...formData.itinerary];
                      newIt[i].title = e.target.value;
                      setFormData({ ...formData, itinerary: newIt });
                    }}
                    className="w-full px-6 py-4 border rounded-xl text-lg font-semibold mb-4"
                  />
                  <input
                    placeholder="Location"
                    value={item.location || ""}
                    onChange={(e) => {
                      const newIt = [...formData.itinerary];
                      newIt[i].location = e.target.value;
                      setFormData({ ...formData, itinerary: newIt });
                    }}
                    className="w-full px-6 py-4 border rounded-xl mb-4"
                  />
                  <textarea
                    placeholder="Activities (one per line)"
                    rows={4}
                    value={item.activities.join("\n")}
                    onChange={(e) => {
                      const newIt = [...formData.itinerary];
                      newIt[i].activities = e.target.value
                        .split("\n")
                        .filter((a) => a.trim());
                      setFormData({ ...formData, itinerary: newIt });
                    }}
                    className="w-full px-6 py-4 border rounded-xl mb-4"
                  />
                  <textarea
                    placeholder="Optional Addons (one per line)"
                    rows={3}
                    value={item.optionalAddons.join("\n")}
                    onChange={(e) => {
                      const newIt = [...formData.itinerary];
                      newIt[i].optionalAddons = e.target.value
                        .split("\n")
                        .filter((a) => a.trim());
                      setFormData({ ...formData, itinerary: newIt });
                    }}
                    className="w-full px-6 py-4 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        itinerary: formData.itinerary.filter(
                          (_, idx) => idx !== i
                        ),
                      })
                    }
                    className="mt-4 text-red-600 font-medium"
                  >
                    Remove Item
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SHARED INCLUSIONS */}
          {activeTab === "shared_inclusions" && (
            <div className="space-y-8">
              <div>
                <label className="block text-xl font-bold mb-4">
                  Shared Highlights (one per line)
                </label>
                <textarea
                  rows={8}
                  value={(formData.highlights || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      highlights: e.target.value
                        .split("\n")
                        .filter((h) => h.trim()),
                    })
                  }
                  placeholder="• Dune bashing&#10;• Camel riding&#10;• Sandboarding&#10;• BBQ Dinner"
                  className="w-full px-6 py-4 border rounded-xl font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl font-bold mb-4">
                    What's Included
                  </label>
                  <textarea
                    rows={8}
                    value={(formData.includes || []).join("\n")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includes: e.target.value
                          .split("\n")
                          .filter((i) => i.trim()),
                      })
                    }
                    className="w-full px-6 py-4 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-4">
                    What's Excluded
                  </label>
                  <textarea
                    rows={8}
                    value={(formData.excludes || []).join("\n")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excludes: e.target.value
                          .split("\n")
                          .filter((e) => e.trim()),
                      })
                    }
                    className="w-full px-6 py-4 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xl font-bold mb-4">
                  Shared Optional Addons
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      addons: [
                        ...(formData.addons || []),
                        { title: "", duration: "", price: 0 },
                      ],
                    })
                  }
                  className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-xl"
                >
                  + Add Shared Addon
                </button>
                {(formData.addons || []).map((addon, i) => (
                  <div
                    key={i}
                    className="flex gap-4 mb-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <input
                      placeholder="Title"
                      value={addon.title}
                      onChange={(e) => {
                        const newA = [...formData.addons];
                        newA[i].title = e.target.value;
                        setFormData({ ...formData, addons: newA });
                      }}
                      className="flex-1 px-5 py-3 border rounded-lg"
                    />
                    <input
                      placeholder="Duration"
                      value={addon.duration || ""}
                      onChange={(e) => {
                        const newA = [...formData.addons];
                        newA[i].duration = e.target.value;
                        setFormData({ ...formData, addons: newA });
                      }}
                      className="w-48 px-5 py-3 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={addon.price}
                      onChange={(e) => {
                        const newA = [...formData.addons];
                        newA[i].price = Number(e.target.value);
                        setFormData({ ...formData, addons: newA });
                      }}
                      className="w-32 px-5 py-3 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          addons: formData.addons.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESTRICTIONS */}
          {activeTab === "restrictions" && (
            <div className="space-y-8">
              <div>
                <label className="block text-xl font-bold mb-4">
                  Not Suitable For (one per line)
                </label>
                <textarea
                  rows={6}
                  value={(formData.notSuitableFor || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notSuitableFor: e.target.value
                        .split("\n")
                        .filter((n) => n.trim()),
                    })
                  }
                  className="w-full px-6 py-4 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xl font-bold mb-4">
                  Important Information (one per line)
                </label>
                <textarea
                  rows={8}
                  value={(formData.importantInfo || []).join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      importantInfo: e.target.value
                        .split("\n")
                        .filter((i) => i.trim()),
                    })
                  }
                  className="w-full px-6 py-4 border rounded-xl"
                />
              </div>
              <div className="flex items-center gap-4 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-8 h-8 text-indigo-600"
                />
                <label htmlFor="isActive" className="text-2xl font-bold">
                  Publish Activity (Make it Live)
                </label>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="sticky bottom-0 bg-white border-t pt-8 pb-8 flex justify-end gap-6">
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-5 border-2 border-gray-400 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-16 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-2xl disabled:opacity-70 transition"
            >
              {isSaving
                ? "Saving Activity..."
                : mode === "create"
                ? "Create Activity"
                : "Update Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
