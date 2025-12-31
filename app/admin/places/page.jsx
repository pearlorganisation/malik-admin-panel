"use client";
import React, { useState, useEffect } from "react";
import {
  useGetAllPlacesQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
} from "@/features/place/placeApi";
import { useGetAllSpotsQuery } from "@/features/spot/spotApi";
import {
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  MapPin,
  Info,
  Car,
  Bed,
  ShoppingBag,
  TreePine,
  Waves,
  Ticket,
} from "lucide-react";

const TABS = [
  { id: "basic", label: "Basic Info", icon: Info },
  { id: "quick", label: "Quick Facts", icon: Car },
  { id: "map", label: "Map & Tips", icon: MapPin },
  { id: "landmarks", label: "Key Landmarks", icon: Ticket },
  { id: "guide", label: "Travel Guide", icon: ShoppingBag },
  { id: "stay", label: "Where to Stay", icon: Bed },
];

export default function ManagePlaces() {
  const {
    data: placesData,
    isLoading: loadingPlaces,
    refetch,
  } = useGetAllPlacesQuery();
  const [createPlace, { isLoading: creating }] = useCreatePlaceMutation();
  const [updatePlace, { isLoading: updating }] = useUpdatePlaceMutation();
  const [deletePlace] = useDeletePlaceMutation();

  const places = placesData?.data || [];
  const [editingPlace, setEditingPlace] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

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
    map: { latitude: "", longitude: "", mapUrl: "" },
    keyLandmarks: [],
    travelGuide: {
      shoppingAndMalls: [],
      beaches: [],
      parksAndNature: [],
      freeActivities: [],
    },
    whereToStay: [],
  };

  const [form, setForm] = useState(initialForm);

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
          ...initialForm.quickFacts,
          ...editingPlace.quickFacts,
          nearBy: {
            ...initialForm.quickFacts.nearBy,
            ...editingPlace.quickFacts?.nearBy,
          },
        },
        travelTips:
          editingPlace.travelTips?.length > 0
            ? editingPlace.travelTips
            : [{ category: "", tip: "" }],
        map: { ...initialForm.map, ...editingPlace.map },
        keyLandmarks: editingPlace.keyLandmarks || [],
        travelGuide: {
          ...initialForm.travelGuide,
          ...editingPlace.travelGuide,
        },
        whereToStay: editingPlace.whereToStay || [],
      });
      setActiveTab("basic");
    } else {
      setForm(initialForm);
    }
  }, [editingPlace]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (
        (parent === "quickFacts" && child === "name") ||
        child === "distance"
      ) {
        setForm((prev) => ({
          ...prev,
          quickFacts: {
            ...prev.quickFacts,
            nearBy: { ...prev.quickFacts.nearBy, [child]: value },
          },
        }));
      } else if (parent === "quickFacts") {
        setForm((prev) => ({
          ...prev,
          quickFacts: { ...prev.quickFacts, [child]: value },
        }));
      } else if (parent === "map") {
        setForm((prev) => ({ ...prev, map: { ...prev.map, [child]: value } }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    }
  };

  const addItem = (field) => {
    const newItem =
      field === "travelTips"
        ? { category: "", tip: "" }
        : { location: "", latitude: "", longitude: "", description: "" };
    setForm((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const updateItem = (field, index, key, value) => {
    setForm((prev) => {
      const items = [...prev[field]];
      items[index][key] = value;
      return { ...prev, [field]: items };
    });
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleSpot = (key, spotId) => {
    setForm((prev) => {
      const current =
        key === "whereToStay" ? prev.whereToStay : prev.travelGuide[key];
      return {
        ...prev,
        [key === "whereToStay" ? "whereToStay" : "travelGuide"]: {
          ...(key !== "whereToStay" ? prev.travelGuide : {}),
          [key !== "whereToStay" ? key : undefined]: current.includes(spotId)
            ? current.filter((id) => id !== spotId)
            : [...current, spotId],
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "heroImage" && form[key]) formData.append(key, form[key]);
      else if (key === "quickFacts" || key === "map" || key === "travelGuide")
        formData.append(key, JSON.stringify(form[key]));
      else if (key === "travelTips")
        formData.append(
          key,
          JSON.stringify(form[key].filter((t) => t.category && t.tip))
        );
      else if (key === "keyLandmarks")
        formData.append(
          key,
          JSON.stringify(
            form[key].filter((k) => k.location && k.latitude && k.longitude)
          )
        );
      else if (key === "whereToStay")
        formData.append(key, JSON.stringify(form[key]));
      else if (typeof form[key] === "string")
        formData.append(key, form[key].trim());
    });

    try {
      if (editingPlace) {
        await updatePlace({ id: editingPlace._id, formData }).unwrap();
      } else {
        await createPlace(formData).unwrap();
      }
      setEditingPlace(null);
      setForm(initialForm);
      refetch();
      alert("Place saved successfully!");
    } catch (err) {
      alert("Error: " + (err?.data?.message || "Failed to save"));
    }
  };

  if (loadingPlaces)
    return (
      <div className="p-8 text-center text-gray-600">Loading places...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Manage Places</h1>
          {editingPlace && (
            <button
              onClick={() => {
                setEditingPlace(null);
                setForm(initialForm);
              }}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <X size={20} /> Cancel Editing
            </button>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold">
              {editingPlace
                ? `Editing: ${editingPlace.name}`
                : "Create New Place"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 lg:p-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label[0]}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {/* Basic Info */}
              {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Place Name *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Region *"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  />
                  <Input
                    label="Tagline"
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon className="inline mr-2" size={18} /> Hero Image
                    </label>
                    <input
                      type="file"
                      name="heroImage"
                      onChange={handleChange}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      label="About this place *"
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Quick Facts */}
              {activeTab === "quick" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Input
                    label="Climate"
                    name="quickFacts.climate"
                    value={form.quickFacts.climate}
                    onChange={handleChange}
                  />
                  <Input
                    label="Best Time"
                    name="quickFacts.bestTime"
                    value={form.quickFacts.bestTime}
                    onChange={handleChange}
                  />
                  <Input
                    label="Nearby City"
                    name="quickFacts.nearBy.name"
                    value={form.quickFacts.nearBy.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Distance"
                    name="quickFacts.nearBy.distance"
                    value={form.quickFacts.nearBy.distance}
                    onChange={handleChange}
                  />
                  <Input
                    label="Safety"
                    name="quickFacts.safety"
                    value={form.quickFacts.safety}
                    onChange={handleChange}
                    className="lg:col-span-2"
                  />
                </div>
              )}

              {/* Map & Tips */}
              {activeTab === "map" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Input
                      label="Latitude"
                      name="map.latitude"
                      value={form.map.latitude}
                      onChange={handleChange}
                    />
                    <Input
                      label="Longitude"
                      name="map.longitude"
                      value={form.map.longitude}
                      onChange={handleChange}
                    />
                    <Input
                      label="Google Maps URL"
                      name="map.mapUrl"
                      value={form.map.mapUrl}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Travel Tips</h3>
                    {form.travelTips.map((tip, i) => (
                      <div key={i} className="flex gap-4 mb-4">
                        <Input
                          placeholder="Category"
                          value={tip.category}
                          onChange={(e) =>
                            updateItem(
                              "travelTips",
                              i,
                              "category",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="Tip"
                          value={tip.tip}
                          onChange={(e) =>
                            updateItem("travelTips", i, "tip", e.target.value)
                          }
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem("travelTips", i)}
                          className="text-red-600 mt-8"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addItem("travelTips")}
                      className="text-indigo-600 font-medium"
                    >
                      + Add Travel Tip
                    </button>
                  </div>
                </div>
              )}

              {/* Key Landmarks */}
              {activeTab === "landmarks" && (
                <div>
                  {form.keyLandmarks.map((lm, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl"
                    >
                      <Input
                        placeholder="Location"
                        value={lm.location}
                        onChange={(e) =>
                          updateItem(
                            "keyLandmarks",
                            i,
                            "location",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Latitude"
                        value={lm.latitude}
                        onChange={(e) =>
                          updateItem(
                            "keyLandmarks",
                            i,
                            "latitude",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Longitude"
                        value={lm.longitude}
                        onChange={(e) =>
                          updateItem(
                            "keyLandmarks",
                            i,
                            "longitude",
                            e.target.value
                          )
                        }
                      />
                      <div className="md:col-span-4 flex gap-4">
                        <Input
                          placeholder="Description (optional)"
                          value={lm.description}
                          onChange={(e) =>
                            updateItem(
                              "keyLandmarks",
                              i,
                              "description",
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem("keyLandmarks", i)}
                          className="text-red-600"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem("keyLandmarks")}
                    className="text-indigo-600 font-medium"
                  >
                    + Add Landmark
                  </button>
                </div>
              )}

              {/* Travel Guide Spots */}
              {activeTab === "guide" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SpotSelector
                    label="Shopping & Malls"
                    category="Shopping & Malls"
                    formKey="shoppingAndMalls"
                    selected={form.travelGuide.shoppingAndMalls}
                    toggle={toggleSpot}
                    icon={<ShoppingBag />}
                  />
                  <SpotSelector
                    label="Beaches"
                    category="Beach"
                    formKey="beaches"
                    selected={form.travelGuide.beaches}
                    toggle={toggleSpot}
                    icon={<Waves />}
                  />
                  <SpotSelector
                    label="Parks & Nature"
                    category="Park"
                    formKey="parksAndNature"
                    selected={form.travelGuide.parksAndNature}
                    toggle={toggleSpot}
                    icon={<TreePine />}
                    className="lg:col-span-2"
                  />
                  <SpotSelector
                    label="Free Activities"
                    category="Free Activity"
                    formKey="freeActivities"
                    selected={form.travelGuide.freeActivities}
                    toggle={toggleSpot}
                    icon={<Ticket />}
                    className="lg:col-span-2"
                  />
                </div>
              )}

              {/* Where to Stay */}
              {activeTab === "stay" && (
                <WhereToStaySelector
                  selected={form.whereToStay}
                  toggle={toggleSpot}
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 mt-12 pt-8 border-t">
              <button
                type="submit"
                disabled={creating || updating}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 shadow-lg text-lg"
              >
                {creating || updating
                  ? "Saving..."
                  : editingPlace
                  ? "Update Place"
                  : "Create Place"}
              </button>
            </div>
          </form>
        </div>

        {/* Places List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              All Places ({places.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 hidden md:table-cell">
                    Region
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">
                    Tagline
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {places.map((place) => (
                  <tr key={place._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {place.heroImage ? (
                        <img
                          src={place.heroImage}
                          alt={place.name}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded-lg" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {place.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                      {place.region}
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                      {place.tagline || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => setEditingPlace(place)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() =>
                          deletePlace(place._id).unwrap().then(refetch)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      />
    </div>
  );
}

function SpotSelector({
  label,
  category,
  formKey,
  selected,
  toggle,
  icon,
  className = "",
}) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAllSpotsQuery({
    limit: 30,
    category,
    search: search || undefined,
  });

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {icon} {label}
      </h3>
      <input
        type="text"
        placeholder={`Search ${label.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500"
      />
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {(data?.data || []).map((spot) => (
            <label
              key={spot._id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                selected.includes(spot._id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(spot._id)}
                onChange={() => toggle(formKey, spot._id)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{spot.title || spot.name}</p>
                <p className="text-sm text-gray-500">{spot.category}</p>
              </div>
              {spot.mainImage && (
                <img
                  src={spot.mainImage}
                  alt=""
                  className="w-16 h-12 object-cover rounded-lg"
                />
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function WhereToStaySelector({ selected, toggle }) {
  const { data, isLoading } = useGetAllSpotsQuery({ limit: 30 });
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bed /> Where to Stay
      </h3>
      {isLoading ? (
        <p className="text-gray-500">Loading accommodations...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {(data?.data || []).map((spot) => (
            <label
              key={spot._id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                selected.includes(spot._id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(spot._id)}
                onChange={() => toggle("whereToStay", spot._id)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{spot.name || spot.title}</p>
                <p className="text-sm text-gray-500">
                  {spot.category || "Accommodation"}
                </p>
              </div>
              {spot.mainImage && (
                <img
                  src={spot.mainImage}
                  alt=""
                  className="w-20 h-14 object-cover rounded-lg"
                />
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
