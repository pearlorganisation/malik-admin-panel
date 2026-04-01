// app/admin/activities/components/ItinerarySection.jsx
"use client";
import React from "react";

export default function ItinerarySection({ formData, setFormData }) {
  const addItineraryItem = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...(formData.itinerary || []),
        {
          time: "",
          title: "New Stop",
          description: "",
          location: "",
          activities: [],
          optionalAddons: [],
        },
      ],
    });
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            🗺️ Itinerary
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Break down the activity into time-based steps.
          </p>
        </div>
        <button
          type="button"
          onClick={addItineraryItem}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm transition-all"
        >
          + Add Itinerary Step
        </button>
      </div>

      {(formData.itinerary || []).length === 0 && (
        <div className="p-8 text-center text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
          No itinerary added yet. Click the button above to add steps.
        </div>
      )}

      {(formData.itinerary || []).map((item, i) => (
        <div
          key={i}
          className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 space-y-5"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
              Step {i + 1}
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  itinerary: formData.itinerary.filter((_, idx) => idx !== i),
                })
              }
              className="text-red-600 font-medium hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Remove Step
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Time (e.g. 08:00 AM - 09:00 AM)"
              value={item.time || ""}
              onChange={(e) => {
                const newIt = [...formData.itinerary];
                newIt[i].time = e.target.value;
                setFormData({ ...formData, itinerary: newIt });
              }}
              className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <input
              type="text"
              placeholder="Title (e.g. Hotel Pickup)"
              value={item.title || ""}
              onChange={(e) => {
                const newIt = [...formData.itinerary];
                newIt[i].title = e.target.value;
                setFormData({ ...formData, itinerary: newIt });
              }}
              className="w-full px-5 py-3.5 font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <textarea
            placeholder="Description of this step..."
            rows={3}
            value={item.description || ""}
            onChange={(e) => {
              const newIt = [...formData.itinerary];
              newIt[i].description = e.target.value;
              setFormData({ ...formData, itinerary: newIt });
            }}
            className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-200">
             {/* SAFE JOIN FIX: (item.activities || []) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Activities list (One per line)</label>
              <textarea
                placeholder="E.g. Camel riding&#10;Dune bashing"
                rows={4}
                value={(item.activities || []).join("\n")}
                onChange={(e) => {
                  const newIt = [...formData.itinerary];
                  newIt[i].activities = e.target.value.split("\n").filter((a) => a.trim());
                  setFormData({ ...formData, itinerary: newIt });
                }}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* SAFE JOIN FIX: (item.optionalAddons || []) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Optional Addons (One per line)</label>
              <textarea
                placeholder="E.g. VIP seating&#10;Private Guide"
                rows={4}
                value={(item.optionalAddons || []).join("\n")}
                onChange={(e) => {
                  const newIt = [...formData.itinerary];
                  newIt[i].optionalAddons = e.target.value.split("\n").filter((a) => a.trim());
                  setFormData({ ...formData, itinerary: newIt });
                }}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}