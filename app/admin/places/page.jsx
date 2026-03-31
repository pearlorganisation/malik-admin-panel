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
  Star,
  Eye,
  Globe,
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
  const { data: placesData, isLoading: loadingPlaces, refetch } = useGetAllPlacesQuery();
  const [createPlace, { isLoading: creating }] = useCreatePlaceMutation();
  const [updatePlace, { isLoading: updating }] = useUpdatePlaceMutation();
  const [deletePlace] = useDeletePlaceMutation();

  const places = placesData?.data || [];
  const [editingPlace, setEditingPlace] = useState(null);
  const [viewingPlace, setViewingPlace] = useState(null); // For View Modal
  const [activeTab, setActiveTab] = useState("basic");

const initialForm = {
  name: "",
  region: "",
  country: "UAE",
  tagline: "",
  heroImage: null,
  heroImagePreview: null, // Track new file preview
  existingHeroImage: "",  // Track image from database
  about: "",
    quickFacts: {
      climate: "Desert",
      bestTime: "Oct - Apr",
      nearBy: { name: "", distance: "" },
      safety: "Very Safe",
    },
    travelTips: [{ category: "", tip: "" }],
    map: { latitude: "", longitude: "", mapUrl: "" },
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

useEffect(() => {
  if (editingPlace) {
    setForm({
      ...initialForm,
      name: editingPlace.name || "",
      region: editingPlace.region || "",
      country: editingPlace.country || "UAE",
      tagline: editingPlace.tagline || "",
      heroImage: null, 
      heroImagePreview: null,
      existingHeroImage: editingPlace.heroImage || "", // Map existing URL here
      about: editingPlace.about || "",
      quickFacts: { ...editingPlace.quickFacts },
      travelTips: editingPlace.travelTips || [{ category: "", tip: "" }],
      map: { ...editingPlace.map },
      keyLandmarks: editingPlace.keyLandmarks || [],
      travelGuide: {
        mustVisitSpots: editingPlace.travelGuide?.mustVisitSpots?.map(s => s._id || s) || [],
        shoppingAndMalls: editingPlace.travelGuide?.shoppingAndMalls?.map(s => s._id || s) || [],
        beaches: editingPlace.travelGuide?.beaches?.map(s => s._id || s) || [],
        parksAndNature: editingPlace.travelGuide?.parksAndNature?.map(s => s._id || s) || [],
        freeActivities: editingPlace.travelGuide?.freeActivities?.map(s => s._id || s) || [],
      },
      whereToStay: editingPlace.whereToStay?.map(s => s._id || s) || [],
    });
    setActiveTab("basic");
  } else {
    setForm(initialForm);
  }
}, [editingPlace]);

 const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "heroImage" && files[0]) {
    setForm(prev => ({
      ...prev,
      heroImage: files[0],
      heroImagePreview: URL.createObjectURL(files[0]) // Create a temporary preview
    }));
  } else if (name.includes(".")) {
      const parts = name.split(".");
      setForm((prev) => {
        const newForm = { ...prev };
        let current = newForm;
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...current[parts[i]] };
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newForm;
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    }
  };

  const addItem = (field) => {
    const newItem = field === "travelTips"
      ? { category: "", tip: "" }
      : { location: "", latitude: "", longitude: "", description: "" };
    setForm((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const updateItem = (field, index, key, value) => {
    setForm((prev) => {
      const items = [...prev[field]];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, [field]: items };
    });
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const toggleSpot = (key, spotId) => {
    setForm((prev) => {
      if (key === "whereToStay") {
        const current = prev.whereToStay || [];
        const updated = current.includes(spotId) ? current.filter(id => id !== spotId) : [...current, spotId];
        return { ...prev, whereToStay: updated };
      } else {
        const current = prev.travelGuide[key] || [];
        const updated = current.includes(spotId) ? current.filter(id => id !== spotId) : [...current, spotId];
        return { ...prev, travelGuide: { ...prev.travelGuide, [key]: updated } };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const cleanedMap = {
      ...form.map,
      latitude: form.map.latitude ? Number(form.map.latitude) : 0,
      longitude: form.map.longitude ? Number(form.map.longitude) : 0,
    };

    const cleanedLandmarks = form.keyLandmarks.map(lm => ({
      ...lm,
      latitude: lm.latitude ? Number(lm.latitude) : 0,
      longitude: lm.longitude ? Number(lm.longitude) : 0,
    }));

    Object.keys(form).forEach((key) => {
      if (key === "heroImage" && form[key]) formData.append(key, form[key]);
      else if (key === "map") formData.append(key, JSON.stringify(cleanedMap));
      else if (key === "keyLandmarks") formData.append(key, JSON.stringify(cleanedLandmarks.filter(l => l.location)));
      else if (["quickFacts", "travelGuide", "whereToStay"].includes(key)) formData.append(key, JSON.stringify(form[key]));
      else if (key === "travelTips") formData.append(key, JSON.stringify(form[key].filter(t => t.tip)));
      else formData.append(key, form[key]);
    });

    try {
      if (editingPlace) await updatePlace({ id: editingPlace._id, formData }).unwrap();
      else await createPlace(formData).unwrap();
      setEditingPlace(null);
      setForm(initialForm);
      refetch();
      alert("Success!");
    } catch (err) {
      alert("Error: " + (err?.data?.message || "Failed"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Destinations</h1>
            <p className="text-slate-500 font-medium">Create and manage your travel guide places</p>
          </div>
          {editingPlace && (
            <button onClick={() => setEditingPlace(null)} className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition shadow-sm">
              <X size={18} /> Cancel Edit
            </button>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-8 py-5">
            <h2 className="text-lg font-semibold">{editingPlace ? `Editing: ${editingPlace.name}` : "Add New Place"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex flex-wrap gap-2 mb-10 bg-slate-50 p-1.5 rounded-2xl w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-100">
             {activeTab === "basic" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
    <Input label="Place Name *" name="name" value={form.name} onChange={handleChange} required />
    <Input label="Region *" name="region" value={form.region} onChange={handleChange} required />
    
   <div className="md:col-span-2">
  <label className="block text-sm font-bold text-slate-700 mb-3">Hero Image</label>
  
  {/* If there is a new preview OR an existing image from DB */}
  {(form.heroImagePreview || form.existingHeroImage) ? (
    <div className="relative w-2xl h-60 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 group">
      <img 
        src={form.heroImagePreview || form.existingHeroImage} 
        alt="Preview" 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
        <button 
          type="button"
          onClick={() => document.getElementById('heroInput').click()}
          className="bg-white text-slate-900 px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition shadow-xl"
        >
          Change Image
        </button>
        
        {/* Only show "Undo" if they have selected a NEW image and want to go back to the DB image */}
        {form.heroImagePreview && form.existingHeroImage && (
          <button 
            type="button"
            onClick={() => setForm(prev => ({ ...prev, heroImage: null, heroImagePreview: null }))}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-700 transition"
          >
            Cancel New Selection
          </button>
        )}

        <button 
          type="button"
          onClick={() => setForm(prev => ({ ...prev, heroImage: null, heroImagePreview: null, existingHeroImage: "" }))}
          className="bg-red-500 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-red-600 transition shadow-xl shadow-red-200"
        >
          Remove Completely
        </button>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-6 left-6 flex gap-2">
        {form.heroImagePreview ? (
          <span className="bg-amber-500 text-white text-[10px] px-3 py-1.5 rounded-full uppercase font-black tracking-widest shadow-lg">
            New Selection
          </span>
        ) : (
          <span className="bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-full uppercase font-black tracking-widest shadow-lg">
            Saved Image
          </span>
        )}
      </div>
    </div>
  ) : (
    /* Empty State / Upload Trigger */
    <div 
      onClick={() => document.getElementById('heroInput').click()}
      className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
    >
      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
        <ImageIcon className="text-slate-400 group-hover:text-indigo-600" size={28} />
      </div>
      <h4 className="text-slate-900 font-bold">Upload Hero Image</h4>
      <p className="text-slate-400 text-sm mt-1">Recommended size: 1920x1080px</p>
    </div>
  )}

  {/* Hidden Input */}
  <input 
    id="heroInput"
    type="file" 
    name="heroImage" 
    onChange={handleChange} 
    className="hidden" 
    accept="image/*"
  />
</div>

    <Input label="Country" name="country" value={form.country} onChange={handleChange} />
    <Input label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
    <Textarea label="About this place *" name="about" value={form.about} onChange={handleChange} rows={5} required className="md:col-span-2" />
  </div>
)}

              {activeTab === "quick" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-right-4">
                  <Input label="Climate" name="quickFacts.climate" value={form.quickFacts.climate} onChange={handleChange} />
                  <Input label="Best Time" name="quickFacts.bestTime" value={form.quickFacts.bestTime} onChange={handleChange} />
                  <Input label="Nearby City" name="quickFacts.nearBy.name" value={form.quickFacts.nearBy.name} onChange={handleChange} />
                  <Input label="Distance" name="quickFacts.nearBy.distance" value={form.quickFacts.nearBy.distance} onChange={handleChange} />
                  <Input label="Safety" name="quickFacts.safety" value={form.quickFacts.safety} onChange={handleChange} className="lg:col-span-2" />
                </div>
              )}

              {activeTab === "map" && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Input label="Latitude" type="number" step="any" name="map.latitude" value={form.map.latitude} onChange={handleChange} />
                    <Input label="Longitude" type="number" step="any" name="map.longitude" value={form.map.longitude} onChange={handleChange} />
                    <Input label="Maps URL" name="map.mapUrl" value={form.map.mapUrl} onChange={handleChange} />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold mb-4">Travel Tips</h3>
                    {form.travelTips.map((tip, i) => (
                      <div key={i} className="flex gap-4 mb-4 items-start">
                        <Input placeholder="Category" value={tip.category} onChange={(e) => updateItem("travelTips", i, "category", e.target.value)} />
                        <Input placeholder="Tip content..." value={tip.tip} onChange={(e) => updateItem("travelTips", i, "tip", e.target.value)} className="flex-1" />
                        <button type="button" onClick={() => removeItem("travelTips", i)} className="text-slate-400 hover:text-red-500 pt-3 transition">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addItem("travelTips")} className="text-indigo-600 font-bold text-sm">+ Add New Tip</button>
                  </div>
                </div>
              )}

              {activeTab === "landmarks" && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  {form.keyLandmarks.map((lm, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl relative">
                      <Input label="Location" value={lm.location} onChange={(e) => updateItem("keyLandmarks", i, "location", e.target.value)} />
                      <Input label="Latitude" type="number" step="any" value={lm.latitude} onChange={(e) => updateItem("keyLandmarks", i, "latitude", e.target.value)} />
                      <Input label="Longitude" type="number" step="any" value={lm.longitude} onChange={(e) => updateItem("keyLandmarks", i, "longitude", e.target.value)} />
                      <Input label="Description" className="md:col-span-3" value={lm.description} onChange={(e) => updateItem("keyLandmarks", i, "description", e.target.value)} />
                      <button type="button" onClick={() => removeItem("keyLandmarks", i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addItem("keyLandmarks")} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition">+ Add Landmark</button>
                </div>
              )}

              {activeTab === "guide" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right-4">
                  <SpotSelector label="Must Visit" formKey="mustVisitSpots" selected={form.travelGuide.mustVisitSpots} toggle={toggleSpot} icon={<Star className="text-amber-500" />} className="lg:col-span-2" />
                  <SpotSelector label="Shopping" category="Shopping" formKey="shoppingAndMalls" selected={form.travelGuide.shoppingAndMalls} toggle={toggleSpot} icon={<ShoppingBag className="text-indigo-500" />} />
                  <SpotSelector label="Beaches" category="Beach" formKey="beaches" selected={form.travelGuide.beaches} toggle={toggleSpot} icon={<Waves className="text-blue-500" />} />
                  <SpotSelector label="Parks" category="Park" formKey="parksAndNature" selected={form.travelGuide.parksAndNature} toggle={toggleSpot} icon={<TreePine className="text-emerald-500" />} />
                  <SpotSelector label="Free Activities" category="Activity" formKey="freeActivities" selected={form.travelGuide.freeActivities} toggle={toggleSpot} icon={<Ticket className="text-orange-500" />} />
                </div>
              )}

              {activeTab === "stay" && (
                <div className="animate-in slide-in-from-right-4">
                  <SpotSelector label="Accommodations" formKey="whereToStay" selected={form.whereToStay} toggle={toggleSpot} icon={<Bed className="text-indigo-600" />} />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-12 pt-8 border-t border-slate-100">
              <button
                type="submit"
                disabled={creating || updating}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 transition shadow-lg shadow-slate-200"
              >
                {creating || updating ? "Saving Changes..." : editingPlace ? "Update Destination" : "Create Destination"}
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Registered Places</h2>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">{places.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-8 py-4 font-semibold">Place Details</th>
                  <th className="px-8 py-4 font-semibold">Location</th>
                  <th className="px-8 py-4 font-semibold text-center">Stats</th>
                  <th className="px-8 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {places.map((place) => (
                  <tr key={place._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 rounded-xl overflow-hidden shadow-sm bg-slate-200 shrink-0">
                          <img src={place.heroImage || "https://placehold.co/100x100?text=No+Img"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{place.name}</p>
                          <p className="text-sm text-slate-400 truncate max-w-50">{place.tagline || "No tagline"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center text-sm font-bold text-slate-700">
                           {place.region}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{place.country}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        <StatsBadge icon={<Star size={12} />} count={place.travelGuide?.mustVisitSpots?.length || 0} />
                        <StatsBadge icon={<MapPin size={12} />} count={place.keyLandmarks?.length || 0} />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setViewingPlace(place)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition shadow-none hover:shadow-sm">
                          <Eye size={20} />
                        </button>
                        <button onClick={() => setEditingPlace(place)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl transition shadow-none hover:shadow-sm">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => deletePlace(place._id).then(refetch)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition shadow-none hover:shadow-sm">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingPlace && <ViewModal place={viewingPlace} onClose={() => setViewingPlace(null)} />}
    </div>
  );
}

// Sub-components
function StatsBadge({ icon, count }) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-bold text-xs">
      {icon} {count}
    </div>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
      <input {...props} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition" />
    </div>
  );
}

function Textarea({ label, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
      <textarea {...props} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition" />
    </div>
  );
}

function ViewModal({ place, onClose }) {
  if (!place) return null;

  // Reusable Section Header
  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
      <Icon size={18} className="text-indigo-600" />
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">{title}</h3>
    </div>
  );

  // Reusable Spot Card
  const SpotCard = ({ spot }) => (
    <div className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
        <img src={spot.image || "/api/placeholder/100/100"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="min-w-0">
        <h5 className="text-sm font-bold text-slate-900 truncate">{spot.title}</h5>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <MapPin size={10} />
          <span className="truncate">{spot.location}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          {/* Hero Header */}
          <div className="relative h-87.5 shrink-0">
            <img src={place.heroImage} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-white" />
            
            {/* Top Bar Controls */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                  {place.region}
                </span>
                <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200">
                  {place.country}
                </span>
              </div>
              <button onClick={onClose} className="p-3 bg-white hover:bg-slate-50 text-slate-900 rounded-full transition-all shadow-xl hover:rotate-90 duration-300">
                <X size={20} />
              </button>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-10">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{place.name}</h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl">{place.tagline}</p>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="p-10 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left Column: The Narrative (7 Cols) */}
              <div className="lg:col-span-7 space-y-12">
                
                {/* About Section */}
                <section>
                  <SectionHeader title="Overview" icon={Info} />
                  <p className="text-slate-600 text-lg leading-relaxed font-normal">
                    {place.about}
                  </p>
                </section>

                {/* Travel Guide Categorized */}
                <section className="space-y-10">
                  <SectionHeader title="The Experience" icon={Star} />
                  
                  {Object.entries(place.travelGuide || {}).map(([key, spots]) => {
                    if (!spots || spots.length === 0) return null;
                    const labels = {
                      mustVisitSpots: "Top Rated",
                      shoppingAndMalls: "Retail & Malls",
                      beaches: "Coastal & Sun",
                      parksAndNature: "Green Spaces",
                      freeActivities: "Budget Friendly"
                    };
                    return (
                      <div key={key} className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">
                          {labels[key] || key}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {spots.map(spot => <SpotCard key={spot._id} spot={spot} />)}
                        </div>
                      </div>
                    );
                  })}
                </section>

                {/* Key Landmarks */}
                <section>
                  <SectionHeader title="Landmarks" icon={MapPin} />
                  <div className="grid grid-cols-1 gap-4">
                    {place.keyLandmarks?.map((lm, i) => (
                      <div key={i} className="group p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{lm.location}</h4>
                          <Ticket size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{lm.description}</p>
                        <div className="flex gap-4">
                          <div className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                            LAT: {lm.latitude}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                            LNG: {lm.longitude}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Logistics (5 Cols) */}
              <div className="lg:col-span-5 space-y-12">
                
                {/* Logistics Card */}
                <div className="bg-slate-50 rounded-4xl p-8 border border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Trip Essentials</h4>
                  
                  <div className="space-y-8">
                    {/* Quick Facts pills */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Climate</p>
                        <p className="text-sm font-bold text-slate-900">{place.quickFacts?.climate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Best Time</p>
                        <p className="text-sm font-bold text-slate-900">{place.quickFacts?.bestTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Safety</p>
                        <p className="text-sm font-bold text-slate-900">{place.quickFacts?.safety}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Nearby</p>
                        <p className="text-sm font-bold text-slate-900">{place.quickFacts?.nearBy?.name}</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200/60">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Coordinates</p>
                      <div className="flex items-center justify-between font-mono text-xs text-slate-600 mb-6">
                        <span>{place.map?.latitude}° N</span>
                        <span>{place.map?.longitude}° E</span>
                      </div>
                      {place.map?.mapUrl && (
                        <a href={place.map.mapUrl} target="_blank" className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                          <Globe size={18} /> View Satellite Map
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                <section>
                  <SectionHeader title="Travel Tips" icon={Car} />
                  <div className="space-y-6">
                    {place.travelTips?.map((tip, idx) => (
                      <div key={idx} className="group relative pl-6 border-l-2 border-slate-100 hover:border-indigo-500 transition-colors">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{tip.category}</span>
                        <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">{tip.tip}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Where to Stay */}
                <section>
                  <SectionHeader title="Preferred Stays" icon={Bed} />
                  <div className="grid grid-cols-1 gap-3">
                    {place.whereToStay?.map((stay) => (
                      <div key={stay._id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <img src={stay.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{stay.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{stay.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Minimal */}
        <div className="p-8 border-t border-slate-50 bg-white flex justify-between items-center">
          <div className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            Data Verified • Ref: {place._id.slice(-8)}
          </div>
          <button onClick={onClose} className="px-12 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black text-sm transition-all">
            CLOSE PREVIEW
          </button>
        </div>
      </div>
    </div>
  );
}

function SpotSelector({ label, category, formKey, selected, toggle, icon, className = "" }) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAllSpotsQuery({ limit: 100, category, search: search || undefined });

  return (
    <div className={className}>
      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">{icon} {label}</h3>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={`Search ${label}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
        {isLoading ? <p className="text-xs p-4 text-slate-400">Loading spots...</p> : (data?.data || []).map((spot) => (
          <label
            key={spot._id}
            className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
              selected.includes(spot._id) ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(spot._id)}
              onChange={() => toggle(formKey, spot._id)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-slate-900 truncate">{spot.title || spot.name}</p>
            </div>
            {spot.image && <img src={spot.image} className="w-8 h-8 object-cover rounded-lg shadow-sm" />}
          </label>
        ))}
      </div>
    </div>
  );
}