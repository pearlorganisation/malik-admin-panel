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

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // sample defaults
    formData.append(
      "thingsToDo",
      JSON.stringify([{ title: "Sightseeing", description: "Explore area" }])
    );
    formData.append(
      "howToGetThere",
      JSON.stringify([{ mode: "Taxi", description: "Easy access" }])
    );
    formData.append(
      "visitorInfo",
      JSON.stringify({ openingHours: "9AM-6PM", entryFee: "Free" })
    );
    formData.append("whereToStay", JSON.stringify([]));

    if (editingSpot) {
      await updateSpot({ id: editingSpot._id, formData });
    } else {
      await createSpot(formData);
    }

    resetForm();
  };

  /* ================= EDIT ================= */
  const handleEdit = (spot) => {
    setEditingSpot(spot);
    setForm({
      title: spot.title,
      category: spot.category,
      location: spot.location,
      overview: spot.overview,
      image: null,
    });
  };

  /* ================= RESET ================= */
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

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (confirm("Delete this spot?")) {
      await deleteSpot(id);
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Manage Spots</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="input"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="input"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="input"
          required
        />
        <textarea
          name="overview"
          value={form.overview}
          onChange={handleChange}
          placeholder="Overview"
          className="input md:col-span-2"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="md:col-span-2"
        />

        <div className="flex gap-3 md:col-span-2">
          <button className="btn-primary">
            {editingSpot ? "Update Spot" : "Create Spot"}
          </button>
          {editingSpot && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Location</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spots.map((spot) => (
              <tr key={spot._id} className="border-t">
                <td className="p-3">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="p-3">{spot.title}</td>
                <td className="p-3">{spot.location}</td>
                <td className="p-3">{spot.category}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(spot)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(spot._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!spots.length && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No spots found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
