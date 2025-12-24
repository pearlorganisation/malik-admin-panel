// app/admin/activities/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useToggleActivityStatusMutation,
} from "@/features/activity/activityApi";
import { useRouter } from "next/navigation";


import ActivityList from "./components/ActivityList";

const initialFormData = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  images: [],
  duration: { label: "", hours: "" },
  languages: [],
  liveGuide: true,
  cancellationPolicy: { isFreeCancellation: true, hoursBefore: 24 },
  reservePolicy: { payLater: true, description: "" },
  pickup: {
    included: true,
    description: "",
    locations: ["Dubai", "Sharjah"],
    privateForOutskirts: false,
  },
  variants: [
    {
      name: "Standard",
      description: "",
      pricing: [
        { label: "Adult", type: "per_person", price: 0, currency: "AED" },
      ],
      includes: [],
      highlights: [],
      discount: { percentage: null, label: "" },
      isActive: true,
    },
  ],
  availableDates: [],
  timeSlots: [{ startTime: "08:00 AM", isAvailable: true }],
  itinerary: [],
  highlights: [],
  includes: [],
  excludes: [],
  addons: [],
  notSuitableFor: [],
  importantInfo: [],
  isActive: true,
};

export default function ActivityManagementPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const { data, isLoading } = useGetActivitiesQuery({
    page,
    limit,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
  });
  const [createActivity, { isLoading: creating }] = useCreateActivityMutation();
  const [updateActivity, { isLoading: updating }] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();
  const [toggleActivityStatus] = useToggleActivityStatusMutation();
  const { data: activityData } = useGetActivityByIdQuery(selectedId, {
    skip: !selectedId,
  });

  useEffect(() => {
    if (modalMode === "edit" && activityData) {
      setFormData({
        ...activityData,
        variants:
          activityData.variants?.length > 0
            ? activityData.variants
            : initialFormData.variants,
      });
    }
  }, [activityData, modalMode]);

const openCreate = () => {
  router.push("/admin/activities/create"); 
};

  const openEdit = (id) => {
    setModalMode("edit");
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") await createActivity(formData).unwrap();
      else await updateActivity({ id: selectedId, data: formData }).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this activity?")) await deleteActivity(id).unwrap();
  };

  const handleToggle = async (id) => await toggleActivityStatus(id).unwrap();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );

  const { activities = [], total = 0, pages = 1 } = data || {};
  const totalPages = pages || Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Manage Activities
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Full control with multiple plans
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg"
          >
            + Create Activity
          </button>
        </div>

        <div className="mb-6 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-6 py-3 border rounded-xl bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <ActivityList
          activities={activities}
          onEdit={openEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
        />

      </div>
    </div>
  );
}
