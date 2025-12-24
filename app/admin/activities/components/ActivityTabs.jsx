// app/admin/activities/components/ActivityTabs.jsx
"use client";

import React from "react";
import {
  FileText,
  Image,
  Settings,
  Ticket,
  CalendarDays,
  Map,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const tabs = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "images", label: "Images", icon: Image },
  { id: "details", label: "Details", icon: Settings },
  { id: "variants", label: "Plans", icon: Ticket },
  { id: "availability", label: "Availability", icon: CalendarDays },
  { id: "itinerary", label: "Itinerary", icon: Map },
  { id: "inclusions", label: "Inclusions", icon: CheckCircle },
  { id: "restrictions", label: "Restrictions", icon: AlertTriangle },
];

export default function ActivityTabs({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-4 py-3 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-white" : "text-gray-500"}
                />

                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
