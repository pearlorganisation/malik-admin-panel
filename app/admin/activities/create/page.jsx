// app/admin/activities/create/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateActivityMutation } from "@/features/activity/activityApi";

import ActivityTabs from "../components/ActivityTabs";
import BasicInfoSection from "../components/BasicInfoSection";
import ImagesSection from "../components/ImagesSection";
import DetailsSection from "../components/DetailsSection";
import VariantsSection from "../components/VariantsSection";
import AvailabilitySection from "../components/AvailabilitySection";
import ItinerarySection from "../components/ItinerarySection";
import InclusionsSection from "../components/InclusionsSection";
import RestrictionsSection from "../components/RestrictionsSection";

const initialFormData = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  images: [], // Will be populated by ImagesSection with { file: File | null }
  video: { file: null },
  duration: { label: "", hours: null },
  languages: [],
  liveGuide: true,
  cancellationPolicy: { isFreeCancellation: true, hoursBefore: 24 },
  reservePolicy: { payLater: true, description: "" },
  pickup: {
    included: true,
    description: "",
    locations: ["Dubai", "Sharjah", "Abu Dhabi"],
    privateForOutskirts: false,
  },
  variants: [
    {
      name: "Standard Package",
      description: "Great value for money",
      images: [],
      video: { url: "" },
      pricing: [
        { label: "Adult", type: "per_person", price: 0, currency: "AED" },
        {
          label: "Child (3-11)",
          type: "per_person",
          price: 0,
          currency: "AED",
        },
      ],
      includes: [],
      excludes: [],
      addons: [],
      highlights: [],
      discount: { percentage: null, label: "" },
      isActive: true,
    },
  ],
  availableDates: [],
  timeSlots: [{ startTime: "04:00 PM", isAvailable: true }],
  itinerary: [],
  highlights: [],
  includes: [],
  excludes: [],
  addons: [],
  notSuitableFor: [],
  importantInfo: [],
  isActive: true,
};

export default function CreateActivityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [createActivity, { isLoading: isSaving }] = useCreateActivityMutation();

  const buildFormDataPayload = () => {
    const fd = new FormData();

    // Append all non-file fields as JSON strings or directly
    fd.append("title", formData.title || "");
    fd.append("shortDescription", formData.shortDescription || "");
    fd.append("fullDescription", formData.fullDescription || "");
    fd.append("duration", JSON.stringify(formData.duration));
    fd.append("languages", JSON.stringify(formData.languages));
    fd.append("liveGuide", formData.liveGuide);
    fd.append(
      "cancellationPolicy",
      JSON.stringify(formData.cancellationPolicy)
    );
    fd.append("reservePolicy", JSON.stringify(formData.reservePolicy));
    fd.append("pickup", JSON.stringify(formData.pickup));
    fd.append("variants", JSON.stringify(formData.variants));
    fd.append("availableDates", JSON.stringify(formData.availableDates));
    fd.append("timeSlots", JSON.stringify(formData.timeSlots));
    fd.append("itinerary", JSON.stringify(formData.itinerary));
    fd.append("highlights", JSON.stringify(formData.highlights));
    fd.append("includes", JSON.stringify(formData.includes));
    fd.append("excludes", JSON.stringify(formData.excludes));
    fd.append("addons", JSON.stringify(formData.addons));
    fd.append("notSuitableFor", JSON.stringify(formData.notSuitableFor));
    fd.append("importantInfo", JSON.stringify(formData.importantInfo));
    fd.append("isActive", formData.isActive);

    // Append images — only if file exists
    formData.images.forEach((img, index) => {
      if (img?.file instanceof File) {
        fd.append(
          "images",
          img.file,
          `image-${index + 1}.${img.file.name.split(".").pop()}`
        );
      }
    });

    // Append video — only if selected
    if (formData.video?.file instanceof File) {
      fd.append("video", formData.video.file);
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter an activity title.");
      setActiveTab("basic");
      return;
    }

    try {
      const payload = buildFormDataPayload();

      // Important: Pass the FormData directly — RTK Query will set correct headers
      await createActivity(payload).unwrap();

      alert("Activity created successfully!");
      router.push("/admin/activities");
    } catch (err) {
      console.error("Failed to create activity:", err);
      alert("Failed to create activity. Check console for details.");
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      router.push("/admin/activities");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoSection formData={formData} setFormData={setFormData} />
        );
      case "images":
        return <ImagesSection formData={formData} setFormData={setFormData} />;
      case "details":
        return <DetailsSection formData={formData} setFormData={setFormData} />;
      case "variants":
        return (
          <VariantsSection formData={formData} setFormData={setFormData} />
        );
      case "availability":
        return (
          <AvailabilitySection formData={formData} setFormData={setFormData} />
        );
      case "itinerary":
        return (
          <ItinerarySection formData={formData} setFormData={setFormData} />
        );
      case "inclusions":
        return (
          <InclusionsSection formData={formData} setFormData={setFormData} />
        );
      case "restrictions":
        return (
          <RestrictionsSection formData={formData} setFormData={setFormData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header & Tabs remain the same */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Activity
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Complete all required sections to publish
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Draft</span>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden">
            <div className="p-6 sm:p-10 lg:p-12">{renderTabContent()}</div>
          </div>
        </form>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Activity"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
