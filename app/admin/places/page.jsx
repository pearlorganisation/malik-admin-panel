"use client";
import React, { useState, useEffect } from "react";
import {
  useGetAllPlacesQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
} from "@/features/place/placeApi";

import { useGetAllSpotsQuery } from "@/features/spot/spotApi"; // Adjust path if needed

export default function ManagePlaces() {
  const { data, isLoading, refetch } = useGetAllPlacesQuery();
  const [createPlace, { isLoading: creating }] = useCreatePlaceMutation();
  const [updatePlace, { isLoading: updating }] = useUpdatePlaceMutation();
  const [deletePlace] = useDeletePlaceMutation();

  const {
    data: spotsData,
    isLoading: spotsLoading,
    error: spotsError,
  } = useGetAllSpotsQuery();

  const allSpots = spotsData?.data || [];
  const places = data?.data || [];

  const [editingPlace, setEditingPlace] = useState(null);

  const initialForm = {
    name: "",
    region: "",
    country: "UAE",
    tagline: "",
    heroImage: null,
    about: "",

    quickFacts: {
      climate: "Desert",
      bestTime: "Oct - Apr",
      nearBy: { name: "Dubai", distance: "1.5 Hrs" },
      safety: "Very Safe",
    },

    travelTips: [{ category: "", tip: "" }],

    map: {
      latitude: "",
      longitude: "",
      mapUrl: "",
    },

    // New keyLandmarks schema: location + coordinates
    keyLandmarks: [],

    travelGuide: {
      mustVisitSpots: [],
      shoppingAndMalls: [],
      beaches: [],
      parksAndNature: [],
      freeActivities: [],
    },

    whereToStay: [],
  };

  const [form, setForm] = useState(initialForm);

  // Populate form when editing
  useEffect(() => {
    if (editingPlace) {
      setForm({
        name: editingPlace.name || "",
        region: editingPlace.region || "",
        country: editingPlace.country || "UAE",
        tagline: editingPlace.tagline || "",
        heroImage: null,
        about: editingPlace.about || "",

        quickFacts: {
          climate: editingPlace.quickFacts?.climate || "Desert",
          bestTime: editingPlace.quickFacts?.bestTime || "Oct - Apr",
          nearBy: {
            name: editingPlace.quickFacts?.nearBy?.name || "Dubai",
            distance: editingPlace.quickFacts?.nearBy?.distance || "1.5 Hrs",
          },
          safety: editingPlace.quickFacts?.safety || "Very Safe",
        },

        travelTips:
          editingPlace.travelTips?.length > 0
            ? editingPlace.travelTips
            : [{ category: "", tip: "" }],

        map: {
          latitude: editingPlace.map?.latitude || "",
          longitude: editingPlace.map?.longitude || "",
          mapUrl: editingPlace.map?.mapUrl || "",
        },

        // Updated keyLandmarks population
        keyLandmarks:
          editingPlace.keyLandmarks?.length > 0
            ? editingPlace.keyLandmarks.map((lm) => ({
                location: lm.location || "",
                latitude: lm.latitude || "",
                longitude: lm.longitude || "",
                description: lm.description || "",
              }))
            : [],

        travelGuide: {
          mustVisitSpots: editingPlace.travelGuide?.mustVisitSpots || [],
          shoppingAndMalls: editingPlace.travelGuide?.shoppingAndMalls || [],
          beaches: editingPlace.travelGuide?.beaches || [],
          parksAndNature: editingPlace.travelGuide?.parksAndNature || [],
          freeActivities: editingPlace.travelGuide?.freeActivities || [],
        },

        whereToStay: editingPlace.whereToStay || [],
      });
    } else {
      setForm(initialForm);
    }
  }, [editingPlace]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.startsWith("quickFacts.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        quickFacts: { ...prev.quickFacts, [field]: value },
      }));
    } else if (name.startsWith("nearBy.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        quickFacts: {
          ...prev.quickFacts,
          nearBy: { ...prev.quickFacts.nearBy, [field]: value },
        },
      }));
    } else if (name.startsWith("map.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        map: { ...prev.map, [field]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  // Travel Tips
  const addTravelTip = () => {
    setForm((prev) => ({
      ...prev,
      travelTips: [...prev.travelTips, { category: "", tip: "" }],
    }));
  };

  const updateTravelTip = (index, field, value) => {
    setForm((prev) => {
      const newTips = [...prev.travelTips];
      newTips[index][field] = value;
      return { ...prev, travelTips: newTips };
    });
  };

  const removeTravelTip = (index) => {
    setForm((prev) => ({
      ...prev,
      travelTips: prev.travelTips.filter((_, i) => i !== index),
    }));
  };

  // Key Landmarks - NEW SCHEMA
  const addKeyLandmark = () => {
    setForm((prev) => ({
      ...prev,
      keyLandmarks: [
        ...prev.keyLandmarks,
        { location: "", latitude: "", longitude: "", description: "" },
      ],
    }));
  };

  const updateKeyLandmark = (index, field, value) => {
    setForm((prev) => {
      const newLandmarks = [...prev.keyLandmarks];
      newLandmarks[index][field] = value;
      return { ...prev, keyLandmarks: newLandmarks };
    });
  };

  const removeKeyLandmark = (index) => {
    setForm((prev) => ({
      ...prev,
      keyLandmarks: prev.keyLandmarks.filter((_, i) => i !== index),
    }));
  };

  // Spot selection
  const toggleSpotSelection = (category, spotId) => {
    setForm((prev) => {
      if (category === "whereToStay") {
        return {
          ...prev,
          whereToStay: prev.whereToStay.includes(spotId)
            ? prev.whereToStay.filter((id) => id !== spotId)
            : [...prev.whereToStay, spotId],
        };
      }

      return {
        ...prev,
        travelGuide: {
          ...prev.travelGuide,
          [category]: prev.travelGuide[category].includes(spotId)
            ? prev.travelGuide[category].filter((id) => id !== spotId)
            : [...prev.travelGuide[category], spotId],
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("region", form.region.trim());
    formData.append("country", form.country || "UAE");
    formData.append("tagline", form.tagline || "");
    formData.append("about", form.about);

    if (form.heroImage) formData.append("heroImage", form.heroImage);

    formData.append("quickFacts", JSON.stringify(form.quickFacts));

    formData.append(
      "travelTips",
      JSON.stringify(form.travelTips.filter((t) => t.category && t.tip))
    );

    const mapData = {
      latitude: form.map.latitude ? parseFloat(form.map.latitude) : undefined,
      longitude: form.map.longitude
        ? parseFloat(form.map.longitude)
        : undefined,
      mapUrl: form.map.mapUrl || "",
    };
    Object.keys(mapData).forEach(
      (k) => mapData[k] === undefined && delete mapData[k]
    );
    formData.append("map", JSON.stringify(mapData));

    // Updated keyLandmarks submission
    const cleanedLandmarks = form.keyLandmarks
      .filter((lm) => lm.location && lm.latitude && lm.longitude)
      .map((lm) => ({
        location: lm.location.trim(),
        latitude: parseFloat(lm.latitude),
        longitude: parseFloat(lm.longitude),
        description: lm.description?.trim() || "",
      }));

    formData.append("keyLandmarks", JSON.stringify(cleanedLandmarks));

    formData.append("travelGuide", JSON.stringify(form.travelGuide));
    formData.append("whereToStay", JSON.stringify(form.whereToStay));

    try {
      if (editingPlace) {
        await updatePlace({ id: editingPlace._id, formData }).unwrap();
      } else {
        await createPlace(formData).unwrap();
      }
      resetForm();
      refetch();
      alert("Place saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save: " + (err?.data?.message || "Unknown error"));
    }
  };

  const handleEdit = (place) => setEditingPlace(place);

  const handleDelete = async (id) => {
    if (confirm("Delete this place permanently?")) {
      await deletePlace(id);
      refetch();
    }
  };

  const resetForm = () => {
    setEditingPlace(null);
    setForm(initialForm);
  };

  if (isLoading)
    return <p className="p-12 text-center text-3xl">Loading places...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-5xl font-bold text-gray-800">Manage Places</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-10 space-y-12"
        >
          <h2 className="text-4xl font-bold text-gray-700">
            {editingPlace ? "Edit Place" : "Create New Place"}
          </h2>

          {/* Basic Information */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Place Name *"
                required
                className="input-field"
              />
              <input
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="Region *"
                required
                className="input-field"
              />
              <input
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Tagline"
                className="input-field"
              />
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="input-field"
              />
              <div className="md:col-span-2">
                <input
                  type="file"
                  name="heroImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="file-input"
                />
              </div>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="About this place *"
                rows="6"
                required
                className="md:col-span-2 input-field"
              />
            </div>
          </Section>

          {/* Quick Facts */}
          <Section title="Quick Facts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="quickFacts.climate"
                value={form.quickFacts.climate}
                onChange={handleChange}
                placeholder="Climate"
                className="input-field"
              />
              <input
                name="quickFacts.bestTime"
                value={form.quickFacts.bestTime}
                onChange={handleChange}
                placeholder="Best Time to Visit"
                className="input-field"
              />
              <input
                name="nearBy.name"
                value={form.quickFacts.nearBy.name}
                onChange={handleChange}
                placeholder="Nearby City"
                className="input-field"
              />
              <input
                name="nearBy.distance"
                value={form.quickFacts.nearBy.distance}
                onChange={handleChange}
                placeholder="Distance"
                className="input-field"
              />
              <input
                name="quickFacts.safety"
                value={form.quickFacts.safety}
                onChange={handleChange}
                placeholder="Safety Level"
                className="input-field"
              />
            </div>
          </Section>

          {/* Main Map */}
          <Section title="Main Map Location">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <input
                type="number"
                step="any"
                name="map.latitude"
                value={form.map.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="input-field"
              />
              <input
                type="number"
                step="any"
                name="map.longitude"
                value={form.map.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="input-field"
              />
              <input
                type="url"
                name="map.mapUrl"
                value={form.map.mapUrl}
                onChange={handleChange}
                placeholder="Google Maps URL"
                className="md:col-span-3 input-field"
              />
            </div>
          </Section>

          {/* Travel Tips */}
          <Section
            title="Travel Tips"
            button="+ Add Tip"
            onClick={addTravelTip}
          >
            {form.travelTips.map((tip, i) => (
              <div key={i} className="flex gap-4 mb-5 items-start">
                <input
                  value={tip.category}
                  onChange={(e) =>
                    updateTravelTip(i, "category", e.target.value)
                  }
                  placeholder="Category"
                  className="flex-1 input-field"
                />
                <input
                  value={tip.tip}
                  onChange={(e) => updateTravelTip(i, "tip", e.target.value)}
                  placeholder="Tip"
                  className="flex-2 input-field"
                />
                <button
                  type="button"
                  onClick={() => removeTravelTip(i)}
                  className="text-red-600 text-3xl mt-2"
                >
                  ×
                </button>
              </div>
            ))}
          </Section>

          {/* Key Landmarks - UPDATED */}
          <Section
            title="Key Landmarks"
            button="+ Add Landmark"
            onClick={addKeyLandmark}
          >
            {form.keyLandmarks.length === 0 && (
              <p className="text-gray-500 italic">
                No key landmarks added yet.
              </p>
            )}
            {form.keyLandmarks.map((landmark, i) => (
              <div
                key={i}
                className="border-2 border-indigo-200 rounded-2xl p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 relative"
              >
                <button
                  type="button"
                  onClick={() => removeKeyLandmark(i)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-3xl font-bold"
                >
                  ×
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={landmark.location}
                    onChange={(e) =>
                      updateKeyLandmark(i, "location", e.target.value)
                    }
                    placeholder="Landmark Name (e.g. Sheikh Zayed Grand Mosque)"
                    className="input-field"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      step="any"
                      value={landmark.latitude}
                      onChange={(e) =>
                        updateKeyLandmark(i, "latitude", e.target.value)
                      }
                      placeholder="Latitude"
                      className="input-field"
                    />
                    <input
                      type="number"
                      step="any"
                      value={landmark.longitude}
                      onChange={(e) =>
                        updateKeyLandmark(i, "longitude", e.target.value)
                      }
                      placeholder="Longitude"
                      className="input-field"
                    />
                  </div>
                </div>

                <textarea
                  value={landmark.description}
                  onChange={(e) =>
                    updateKeyLandmark(i, "description", e.target.value)
                  }
                  placeholder="Description of this landmark"
                  rows="4"
                  className="mt-6 w-full input-field"
                />
              </div>
            ))}
          </Section>

          {/* Travel Guide Categories */}
          <Section title="Travel Guide - Recommended Spots">
            {spotsLoading ? (
              <p className="text-gray-600">Loading spots...</p>
            ) : spotsError ? (
              <p className="text-red-600">Error loading spots</p>
            ) : allSpots.length === 0 ? (
              <p className="text-gray-500">
                No spots created yet. Create some first!
              </p>
            ) : (
              <div className="space-y-10">
                {[
                  { key: "mustVisitSpots", label: "Must Visit Spots" },
                  { key: "shoppingAndMalls", label: "Shopping & Malls" },
                  { key: "beaches", label: "Beaches" },
                  { key: "parksAndNature", label: "Parks & Nature" },
                  { key: "freeActivities", label: "Free Activities" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <h4 className="font-bold text-xl mb-4 text-gray-800">
                      {label}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allSpots.map((spot) => (
                        <label
                          key={spot._id}
                          className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-blue-50 transition"
                        >
                          <input
                            type="checkbox"
                            checked={form.travelGuide[key].includes(spot._id)}
                            onChange={() => toggleSpotSelection(key, spot._id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{spot.name}</p>
                            {spot.category && (
                              <p className="text-sm text-gray-600">
                                {spot.category}
                              </p>
                            )}
                          </div>
                          {spot.mainImage && (
                            <img
                              src={spot.mainImage}
                              alt={spot.name}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Where To Stay */}
          <Section title="Where To Stay (Hotels, Resorts, etc.)">
            {spotsLoading ? (
              <p className="text-gray-600">Loading spots...</p>
            ) : allSpots.length === 0 ? (
              <p className="text-gray-500">No spots available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSpots.map((spot) => (
                  <label
                    key={spot._id}
                    className="flex items-center gap-5 p-6 border-2 rounded-2xl cursor-pointer hover:border-indigo-500 transition bg-white shadow-md"
                  >
                    <input
                      type="checkbox"
                      checked={form.whereToStay.includes(spot._id)}
                      onChange={() =>
                        toggleSpotSelection("whereToStay", spot._id)
                      }
                      className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-lg">{spot.name}</p>
                      {spot.category && (
                        <p className="text-gray-600">{spot.category}</p>
                      )}
                    </div>
                    {spot.mainImage && (
                      <img
                        src={spot.mainImage}
                        alt={spot.name}
                        className="w-24 h-20 object-cover rounded-xl"
                      />
                    )}
                  </label>
                ))}
              </div>
            )}
          </Section>

          {/* Submit */}
          <div className="flex gap-6 pt-12 border-t-4 border-gray-200">
            <button
              type="submit"
              disabled={creating || updating}
              className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-2xl font-bold rounded-2xl hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 shadow-xl"
            >
              {creating || updating
                ? "Saving..."
                : editingPlace
                ? "Update Place"
                : "Create Place"}
            </button>
            {editingPlace && (
              <button
                type="button"
                onClick={resetForm}
                className="px-12 py-5 bg-gray-300 text-gray-800 text-2xl font-bold rounded-2xl hover:bg-gray-400 shadow-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Places List */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <h2 className="text-4xl font-bold">All Places ({places.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-10 py-6 text-left text-lg font-semibold">
                    Hero Image
                  </th>
                  <th className="px-10 py-6 text-left text-lg font-semibold">
                    Name
                  </th>
                  <th className="px-10 py-6 text-left text-lg font-semibold">
                    Region
                  </th>
                  <th className="px-10 py-6 text-left text-lg font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr
                    key={place._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-10 py-8">
                      {place.heroImage ? (
                        <img
                          src={place.heroImage}
                          alt={place.name}
                          className="w-40 h-28 object-cover rounded-2xl shadow-lg"
                        />
                      ) : (
                        <div className="w-40 h-28 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 font-medium">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8 text-2xl font-bold text-gray-800">
                      {place.name}
                    </td>
                    <td className="px-10 py-8 text-xl text-gray-700">
                      {place.region}
                    </td>
                    <td className="px-10 py-8 space-x-8">
                      <button
                        onClick={() => handleEdit(place)}
                        className="text-indigo-600 font-bold text-xl hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(place._id)}
                        className="text-red-600 font-bold text-xl hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {places.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-20 text-gray-500 text-2xl"
                    >
                      No places yet. Create your first one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Section
function Section({ title, children, button, onClick }) {
  return (
    <div className="border-t-4 border-gray-200 pt-12 first:border-t-0 first:pt-0">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-bold text-gray-800">{title}</h3>
        {button && (
          <button
            type="button"
            onClick={onClick}
            className="text-indigo-600 hover:text-indigo-800 font-bold text-xl"
          >
            {button}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
