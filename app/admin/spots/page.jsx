"use client";
import React, { useState } from "react";
import {
  useGetAllSpotsQuery,
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} from "@/features/spot/spotApi";

export default function ManageSpots() {
  const { data, isLoading } = useGetAllSpotsQuery();
  const [createSpot] = useCreateSpotMutation();
  const [updateSpot] = useUpdateSpotMutation();
  const [deleteSpot] = useDeleteSpotMutation();

  const [editingSpot, setEditingSpot] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    overview: "",
    image: null,
  });

  const spots = data?.data || [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    // Default structured data
    formData.append(
      "thingsToDo",
      JSON.stringify([
        {
          title: "Sightseeing",
          description: "Explore the beautiful surroundings",
        },
      ])
    );
    formData.append(
      "howToGetThere",
      JSON.stringify([{ mode: "Car/Taxi", description: "Accessible by road" }])
    );
    formData.append(
      "visitorInfo",
      JSON.stringify({ openingHours: "9:00 AM - 6:00 PM", entryFee: "Free" })
    );
    formData.append("whereToStay", JSON.stringify([]));

    if (editingSpot) {
      await updateSpot({ id: editingSpot._id, formData });
    } else {
      await createSpot(formData);
    }

    resetForm();
  };

  const handleEdit = (spot) => {
    setEditingSpot(spot);
    setForm({
      title: spot.title || "",
      category: spot.category || "",
      location: spot.location || "",
      overview: spot.overview || "",
      image: null,
    });
  };

  const resetForm = () => {
    setEditingSpot(null);
    setForm({
      title: "",
      category: "",
      location: "",
      overview: "",
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this spot?")) {
      await deleteSpot(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-600">
          Loading spots...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Manage Travel Spots
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Create, update, and organize your amazing destinations
          </p>
        </div>

        {/* Create/Edit Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">
              {editingSpot ? "Edit Spot" : "Add New Spot"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Eiffel Tower"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Landmark, Beach"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Paris, France"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview
              </label>
              <textarea
                name="overview"
                value={form.overview}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of the spot..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spot Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              {editingSpot && editingSpot.image && !form.image && (
                <p className="mt-2 text-sm text-gray-500">
                  Current image will be kept if no new file selected
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
              >
                {editingSpot ? "Update Spot" : "Create Spot"}
              </button>
              {editingSpot && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Spots Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">
              All Spots ({spots.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {spots.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="text-lg">
                        No spots added yet. Create your first one above! ✨
                      </div>
                    </td>
                  </tr>
                ) : (
                  spots.map((spot) => (
                    <tr
                      key={spot._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={spot.image || "/placeholder.jpg"}
                          alt={spot.title}
                          className="w-24 h-16 object-cover rounded-lg shadow-sm"
                          onError={(e) => (e.target.src = "/placeholder.jpg")}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {spot.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {spot.location}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {spot.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(spot)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(spot._id)}
                            className="text-red-600 hover:text-red-800 font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
