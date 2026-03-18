"use client";
import React, { useState } from "react";
import {
  useGetAllSpotsQuery,
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} from "@/features/spot/spotApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";

const CATEGORY_OPTIONS = [
  "Shopping & Malls",
  "Beaches",
  "Parks & Nature",
  "Free Activities",
  "Where to Stay",
  "Restaurant",
];

export default function ManageSpots() {
  const { data, isLoading } = useGetAllSpotsQuery();
  const [createSpot] = useCreateSpotMutation();
  const [updateSpot] = useUpdateSpotMutation();
  const [deleteSpot] = useDeleteSpotMutation();

  const [editingSpot, setEditingSpot] = useState(null);

  const { data: categoryResponse, isLoading: categoryLoading } =
  useGetCategoriesQuery({ page: 1, limit: 100 });

const categories = categoryResponse?.data || [];

  const initialForm = {
    title: "",
    category: "",
    location: "",
    overview: "",
    image: null,

    // Things To Do
    thingsToDo: [{ title: "", description: "" }],

    // How To Get There
    howToGetThere: [{ mode: "", description: "" }],

    // Visitor Info
    visitorInfo: {
      openingHours: "",
      entryFee: "",
      address: "",
      directionsLink: "",
    },

    // Where To Stay (array of Place IDs)
    whereToStay: [],
  };

  const [form, setForm] = useState(initialForm);

  const spots = data?.data || [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (field, index, subfield) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index][subfield] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleVisitorInfoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      visitorInfo: { ...prev.visitorInfo, [name]: value },
    }));
  };

  const addItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "thingsToDo"
          ? { title: "", description: "" }
          : { mode: "", description: "" },
      ],
    }));
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("location", form.location);
    formData.append("overview", form.overview);

    if (form.image) {
      formData.append("image", form.image);
    }

    formData.append(
      "thingsToDo",
      JSON.stringify(
        form.thingsToDo.filter((item) => item.title && item.description)
      )
    );
    formData.append(
      "howToGetThere",
      JSON.stringify(
        form.howToGetThere.filter((item) => item.mode && item.description)
      )
    );
    formData.append("visitorInfo", JSON.stringify(form.visitorInfo));
    formData.append("whereToStay", JSON.stringify(form.whereToStay));

    try {
      if (editingSpot) {
        await updateSpot({ id: editingSpot._id, formData }).unwrap();
      } else {
        await createSpot(formData).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save spot:", err);
      alert("Failed to save spot. Check console for details.");
    }
  };

  const handleEdit = (spot) => {
    setEditingSpot(spot);
    setForm({
      title: spot.title || "",
      category: spot.category?._id || spot.category,
      location: spot.location || "",
      overview: spot.overview || "",
      image: null,

      thingsToDo:
        spot.thingsToDo?.length > 0
          ? spot.thingsToDo
          : [{ title: "", description: "" }],
      howToGetThere:
        spot.howToGetThere?.length > 0
          ? spot.howToGetThere
          : [{ mode: "", description: "" }],
      visitorInfo: {
        openingHours: spot.visitorInfo?.openingHours || "",
        entryFee: spot.visitorInfo?.entryFee || "",
        address: spot.visitorInfo?.address || "",
        directionsLink: spot.visitorInfo?.directionsLink || "",
      },
      whereToStay: spot.whereToStay || [],
    });
  };

  const resetForm = () => {
    setEditingSpot(null);
    setForm(initialForm);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Manage Travel Spots
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Create and edit rich destination details
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">
              {editingSpot ? "Edit Spot" : "Add New Spot"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Info */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="input-field"
                  required
                />

                {/* Category Dropdown */}
              <select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="input-field"
  required
>
  <option value="">Select Category</option>

  {categoryLoading ? (
    <option>Loading categories...</option>
  ) : (
    categories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))
  )}
</select>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location (e.g. Paris, France)"
                  className="input-field"
                  required
                />
              </div>

              <div className="mt-6">
                <textarea
                  name="overview"
                  value={form.overview}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Overview description..."
                  className="input-field w-full"
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spot Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="file-input"
                />
                {editingSpot && editingSpot.image && !form.image && (
                  <p className="mt-2 text-sm text-green-600">
                    Current image will be kept
                  </p>
                )}
              </div>
            </section>

            {/* The rest of the form remains unchanged */}
            {/* Things To Do */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Things To Do
              </h3>
              {form.thingsToDo.map((item, index) => (
                <div key={index} className="flex gap-4 mb-4 items-start">
                  <input
                    type="text"
                    value={item.title}
                    onChange={handleNestedChange("thingsToDo", index, "title")}
                    placeholder="Title (e.g. Sightseeing)"
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={handleNestedChange(
                      "thingsToDo",
                      index,
                      "description"
                    )}
                    placeholder="Description"
                    className="input-field flex-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("thingsToDo", index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("thingsToDo")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Activity
              </button>
            </section>

            {/* How To Get There */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                How To Get There
              </h3>
              {form.howToGetThere.map((item, index) => (
                <div key={index} className="flex gap-4 mb-4 items-start">
                  <input
                    type="text"
                    value={item.mode}
                    onChange={handleNestedChange(
                      "howToGetThere",
                      index,
                      "mode"
                    )}
                    placeholder="Mode (e.g. Metro, Taxi)"
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={handleNestedChange(
                      "howToGetThere",
                      index,
                      "description"
                    )}
                    placeholder="Description"
                    className="input-field flex-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("howToGetThere", index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("howToGetThere")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Transport Option
              </button>
            </section>

            {/* Visitor Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Visitor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="openingHours"
                  value={form.visitorInfo.openingHours}
                  onChange={handleVisitorInfoChange}
                  placeholder="Opening Hours (e.g. 9:00 AM - 6:00 PM)"
                  className="input-field"
                />
                <input
                  type="text"
                  name="entryFee"
                  value={form.visitorInfo.entryFee}
                  onChange={handleVisitorInfoChange}
                  placeholder="Entry Fee (e.g. $20 or Free)"
                  className="input-field"
                />
                <input
                  type="text"
                  name="address"
                  value={form.visitorInfo.address}
                  onChange={handleVisitorInfoChange}
                  placeholder="Full Address"
                  className="input-field"
                />
                <input
                  type="url"
                  name="directionsLink"
                  value={form.visitorInfo.directionsLink}
                  onChange={handleVisitorInfoChange}
                  placeholder="Google Maps Link (optional)"
                  className="input-field"
                />
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
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

        {/* Spots List */}
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
                      className="px-6 py-12 text-center text-gray-500 text-lg"
                    >
                      No spots yet. Add your first destination above! ✨
                    </td>
                  </tr>
                ) : (
                  spots.map((spot) => (
                    <tr key={spot._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <img
                          src={spot.image || "/placeholder.jpg"}
                          alt={spot.title}
                          className="w-24 h-16 object-cover rounded-lg shadow-sm"
                          onError={(e) => (e.target.src = "/placeholder.jpg")}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {spot.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {spot.location}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {spot.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(spot)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(spot._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
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

      <style jsx>{`
        .input-field {
          @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition;
        }
        .file-input {
          @apply block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100;
        }
      `}</style>
    </div>
  );
}
