"use client";
import React, { useState } from "react";
import {
  useGetAllSpotsQuery,
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} from "@/features/spot/spotApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
// 1. ADDED: Import Places API to link "Where to Stay"
// import { useGetAllPlacesQuery } from "@/features/place/placeApi"; 
import { useGetHotelsQuery } from "@/features/hotel/hotelApi"; 

export default function ManageSpots() {
  const { data, isLoading } = useGetAllSpotsQuery();
  const [createSpot] = useCreateSpotMutation();
  const [updateSpot] = useUpdateSpotMutation();
  const [deleteSpot] = useDeleteSpotMutation();

  const { data: categoryResponse, isLoading: categoryLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
  // 2. ADDED: Fetch all Places
  // const { data: placesResponse, isLoading: placesLoading } = useGetAllPlacesQuery();
   const { data: hotelsResponse, isLoading: hotelsLoading } = useGetHotelsQuery();

  const categories = categoryResponse?.data || [];
  // const places = placesResponse?.data || []; // The list of cities
  const hotels = hotelsResponse?.data || []; // Linked Hotels list

  const [editingSpot, setEditingSpot] = useState(null);

  const initialForm = {
    title: "",
    category: "",
    location: "",
    overview: "",
    image: null,
    thingsToDo: [{ title: "", description: "" }],
    howToGetThere: [{ mode: "", description: "" }],
    visitorInfo: {
      openingHours: "",
      entryFee: "",
      address: "",
      directionsLink: "",
    },
    whereToStay: [], // This was already in your form state
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

  // 3. ADDED: Toggle function for Where to Stay selection
  // const handleTogglePlace = (placeId) => {
  //   setForm((prev) => {
  //     const isSelected = prev.whereToStay.includes(placeId);
  //     if (isSelected) {
  //       return { ...prev, whereToStay: prev.whereToStay.filter(id => id !== placeId) };
  //     } else {
  //       return { ...prev, whereToStay: [...prev.whereToStay, placeId] };
  //     }
  //   });
  // };


   const handleToggleHotel = (hotelId) => {
    setForm((prev) => {
      const isSelected = prev.whereToStay.includes(hotelId);
      if (isSelected) {
        return { ...prev, whereToStay: prev.whereToStay.filter(id => id !== hotelId) };
      } else {
        return { ...prev, whereToStay: [...prev.whereToStay, hotelId] };
      }
    });
  };
  // const handleNestedChange = (field, index, subfield) => (e) => {
  //   const value = e.target.value;
  //   setForm((prev) => {
  //     const updated = [...prev[field]];
  //     updated[index][subfield] = value;
  //     return { ...prev, [field]: updated };
  //   });
  // };


  const handleNestedChange = (field, index, subfield) => (e) => {
  const value = e.target.value;
  setForm((prev) => {
    // 1. Clone the array
    const updatedArray = [...prev[field]];
    
    // 2. Clone the specific OBJECT at that index before modifying it
    updatedArray[index] = { 
      ...updatedArray[index], 
      [subfield]: value 
    };

    return { 
      ...prev, 
      [field]: updatedArray 
    };
  });
};
const handleVisitorInfoChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    visitorInfo: { 
      ...prev.visitorInfo, // Clone the existing visitorInfo object
      [name]: value        // Update the specific field
    },
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

    // if (form.image) {
    //   formData.append("image", form.image);
    // }

     if (form.image instanceof File) {
    formData.append("image", form.image);
  }

 const cleanThings = form.thingsToDo.filter((item) => item.title.trim() !== "");
  const cleanHow = form.howToGetThere.filter((item) => item.mode.trim() !== "");
    // formData.append("thingsToDo", JSON.stringify(form.thingsToDo.filter((item) => item.title && item.description)));
    // formData.append("howToGetThere", JSON.stringify(form.howToGetThere.filter((item) => item.mode && item.description)));
    // formData.append("visitorInfo", JSON.stringify(form.visitorInfo));
    //   // 4. Send Where to Stay (Hotel IDs) to backend
    // formData.append("whereToStay", JSON.stringify(form.whereToStay));
formData.append("thingsToDo", JSON.stringify(cleanThings));
  formData.append("howToGetThere", JSON.stringify(cleanHow));
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
      alert("Failed to save spot.");
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
      thingsToDo: spot.thingsToDo?.length > 0 ? spot.thingsToDo : [{ title: "", description: "" }],
      howToGetThere: spot.howToGetThere?.length > 0 ? spot.howToGetThere : [{ mode: "", description: "" }],
      visitorInfo: {
        openingHours: spot.visitorInfo?.openingHours || "",
        entryFee: spot.visitorInfo?.entryFee || "",
        address: spot.visitorInfo?.address || "",
        directionsLink: spot.visitorInfo?.directionsLink || "",
      },
        // 5. Populate Hotel IDs for editing
      whereToStay: spot.whereToStay?.map(h => h._id || h) || [],
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
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
            Manage Travel Spots
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">
              {editingSpot ? "Edit Spot" : "Add New Spot"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Info */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input-field" required />
                <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                </select>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input-field" required />
              </div>
              <div className="mt-6">
                <textarea name="overview" value={form.overview} onChange={handleChange} rows="4" placeholder="Overview..." className="input-field w-full" required />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Spot Image</label>
                <input type="file" name="image" onChange={handleChange} accept="image/*" className="file-input" />
              </div>
            </section>

            {/* Things To Do */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Things To Do</h3>
              {form.thingsToDo.map((item, index) => (
                <div key={index} className="flex gap-4 mb-4 items-start">
                  <input type="text" value={item.title} onChange={handleNestedChange("thingsToDo", index, "title")} placeholder="Title" className="input-field flex-1" />
                  <input type="text" value={item.description} onChange={handleNestedChange("thingsToDo", index, "description")} placeholder="Description" className="input-field flex-2" />
                  <button type="button" onClick={() => removeItem("thingsToDo", index)} className="text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addItem("thingsToDo")} className="text-blue-600 font-medium">+ Add Activity</button>
            </section>

            {/* How To Get There */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How To Get There</h3>
              {form.howToGetThere.map((item, index) => (
                <div key={index} className="flex gap-4 mb-4 items-start">
                  <input type="text" value={item.mode} onChange={handleNestedChange("howToGetThere", index, "mode")} placeholder="Mode" className="input-field flex-1" />
                  <input type="text" value={item.description} onChange={handleNestedChange("howToGetThere", index, "description")} placeholder="Description" className="input-field flex-2" />
                  <button type="button" onClick={() => removeItem("howToGetThere", index)} className="text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addItem("howToGetThere")} className="text-blue-600 font-medium">+ Add Transport</button>
            </section>

            {/* 6. ADDED: Where To Stay Section (Selection UI) */}
            {/* <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Where To Stay (Linked Places)</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                {placesLoading ? (
                  <p className="text-sm">Loading places...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {places.map((place) => {
                      const isSelected = form.whereToStay.includes(place._id);
                      return (
                        <button
                          key={place._id}
                          type="button"
                          onClick={() => handleTogglePlace(place._id)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                            isSelected 
                              ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                              : "bg-white border-gray-300 text-gray-600 hover:border-blue-400"
                          }`}
                        >
                          {place.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section> */}

 {/* 6. FIXED: Where To Stay Section (Hotel Selection UI) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Where To Stay (Linked Hotels)</h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                   {form.whereToStay.length} Selected
                </span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                {hotelsLoading ? (
                  <p className="text-sm text-blue-500 animate-pulse italic font-medium">Fetching available hotels...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {hotels.map((hotel) => {
                      const isSelected = form.whereToStay.includes(hotel._id);
                      return (
                        <button
                          key={hotel._id}
                          type="button"
                          onClick={() => handleToggleHotel(hotel._id)}
                          className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${
                            isSelected 
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105" 
                              : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                          }`}
                        >
                          {hotel.name}
                        </button>
                      );
                    })}
                  </div>
                )}
                {hotels.length === 0 && !hotelsLoading && (
                   <p className="text-xs text-slate-400 italic">No hotels found. Create hotels first to link them.</p>
                )}
              </div>
            </section>
            {/* Visitor Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Visitor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="openingHours" value={form.visitorInfo.openingHours} onChange={handleVisitorInfoChange} placeholder="Opening Hours" className="input-field" />
                <input type="text" name="entryFee" value={form.visitorInfo.entryFee} onChange={handleVisitorInfoChange} placeholder="Entry Fee" className="input-field" />
                <input type="text" name="address" value={form.visitorInfo.address} onChange={handleVisitorInfoChange} placeholder="Full Address" className="input-field" />
                <input type="url" name="directionsLink" value={form.visitorInfo.directionsLink} onChange={handleVisitorInfoChange} placeholder="Google Maps Link" className="input-field" />
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button type="submit" className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md">
                {editingSpot ? "Update Spot" : "Create Spot"}
              </button>
              {editingSpot && (
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Spots List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">All Spots ({spots.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {spots.map((spot) => (
                  <tr key={spot._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img src={spot.image || "/placeholder.jpg"} alt={spot.title} className="w-24 h-16 object-cover rounded-lg" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{spot.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{spot.location}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {spot.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button onClick={() => handleEdit(spot)} className="text-blue-600 font-medium">Edit</button>
                        <button onClick={() => handleDelete(spot._id)} className="text-red-600 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
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