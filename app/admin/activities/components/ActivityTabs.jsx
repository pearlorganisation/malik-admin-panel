// app/admin/activities/components/ActivityTabs.jsx
"use client";

import React from "react";

const tabs = [
  { id: "basic", label: "Basic Info", icon: "📝" },
  { id: "images", label: "Images", icon: "🖼️" },
  { id: "details", label: "Details", icon: "⚙️" },
  { id: "variants", label: "Plans", icon: "🎟️" },
  { id: "availability", label: "Availability", icon: "📅" },
  { id: "itinerary", label: "Itinerary", icon: "🗺️" },
  { id: "inclusions", label: "Inclusions", icon: "✅" },
  { id: "restrictions", label: "Restrictions", icon: "⚠️" },
];

export default function ActivityTabs({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all shadow-sm transform hover:scale-105 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional: Scroll indicator for mobile */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none sm:hidden">
        <div className="text-gray-400 animate-pulse">→</div>
      </div>
    </div>
  );
}
