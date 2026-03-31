'use client';

import React, { useState } from 'react';
import {
  X,
  Save,
  Info,
  MapPin,
  Tag,
  CheckCircle,
  FileText,
  Clock,
  Utensils,
  Layers,
  Plus,
  Trash2
} from 'lucide-react';
import { useUpdateActivityMutation } from '@/features/activity/activityApi';

export default function EditActivityModal({ activity, onClose, onSuccess }) {
  if (!activity) return null;
  const [updateActivity, { isLoading }] = useUpdateActivityMutation();
  const[activeTab, setActiveTab] = useState('overview');

  // --- FORM STATE INITIALIZATION ---
  const[formData, setFormData] = useState({
    name: activity?.name || '',
    slug: activity?.slug || '',
    categoryId: activity?.categoryId?._id || activity?.categoryId || '',
    placeId: activity?.placeId?._id || activity?.placeId || '',
    isActive: activity?.isActive ?? true,
    timeSlots: activity?.timeSlots ||[],
    
    Experience: {
      title: activity?.Experience?.title || '',
      note: activity?.Experience?.note || '',
      description: activity?.Experience?.description || '',
      highlights: activity?.Experience?.highlights ||[],
    },
    
    Itinerary: activity?.Itinerary ||[],
    
    InfoAndLogistics: {
      pickupZone: {
        description: activity?.InfoAndLogistics?.pickupZone?.description || '',
        note: activity?.InfoAndLogistics?.pickupZone?.note || '',
        mapLink: activity?.InfoAndLogistics?.pickupZone?.mapLink || '',
      },
      keyInfo: activity?.InfoAndLogistics?.keyInfo ||[],
      essentialGuide: activity?.InfoAndLogistics?.essentialGuide ||[],
    },
    
    BBQ_BUFFET: {
      title: activity?.BBQ_BUFFET?.title || '',
      description: activity?.BBQ_BUFFET?.description || '',
      fields: activity?.BBQ_BUFFET?.fields ||[],
    },
    
    PrivateSUV: {
      available: activity?.PrivateSUV?.available || false,
      fee: activity?.PrivateSUV?.fee || 0,
      model: activity?.PrivateSUV?.model || '',
      seat: activity?.PrivateSUV?.seat || 0,
    }
  });

  const[errors, setErrors] = useState({});

  // Mock Dropdowns (Replace with your actual API fetched data)
  const categories =[
    { id: '6954df3dbe9967f0401688b7', name: 'Buggy / Adventure' },
    { id: '6954df54be9967f0401688bd', name: 'Dhow Cruise' },
    { id: '6954df64be9967f0401688c0', name: 'Water Activities' },
    { id: '6954df49be9967f0401688ba', name: 'Yacht' },
  ];
  const places =[
    { id: '6971e7698389004178c9d198', name: 'Dubai' },
    { id: '69aeaa21371130e6401d1ece', name: 'Rose Landry' },
    { id: '6954c919be9967f0401683a2', name: 'Abu Dhabi' },
  ];

  const tabs =[
    { id: 'overview', label: 'Basic Info', icon: Info },
    { id: 'experience', label: 'Experience', icon: FileText },
    { id: 'itinerary', label: 'Itinerary', icon: Clock },
    { id: 'logistics', label: 'Logistics & SUV', icon: MapPin },
    { id: 'dining', label: 'Dining (BBQ)', icon: Utensils },
  ];

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleDeepNestedChange = (grandparent, parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [grandparent]: {
        ...prev[grandparent],
        [parent]: { ...prev[grandparent][parent], [field]: value }
      }
    }));
  };

  // Simple Array Handlers (strings)
  const handleArrayChange = (parent, arrayField, index, value) => {
    setFormData((prev) => {
      const newArray =[...prev[parent][arrayField]];
      newArray[index] = value;
      return { ...prev, [parent]: { ...prev[parent], [arrayField]: newArray } };
    });
  };

  const addArrayItem = (parent, arrayField) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [arrayField]: [...prev[parent][arrayField], ''] }
    }));
  };

  const removeArrayItem = (parent, arrayField, index) => {
    setFormData((prev) => {
      const newArray = prev[parent][arrayField].filter((_, i) => i !== index);
      return { ...prev, [parent]: { ...prev[parent], [arrayField]: newArray } };
    });
  };

  // Object Array Handlers (Itinerary, BBQ Fields)
  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.Itinerary];
    newItinerary[index][field] = value;
    setFormData({ ...formData, Itinerary: newItinerary });
  };

  const addItineraryItem = () => {
    setFormData({
      ...formData,
      Itinerary:[...formData.Itinerary, { title: '', time: '', description: '' }]
    });
  };

  const removeItineraryItem = (index) => {
    setFormData({
      ...formData,
      Itinerary: formData.Itinerary.filter((_, i) => i !== index)
    });
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      setErrors({ name: 'Activity name is required' });
      setActiveTab('overview');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Basic Fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('placeId', formData.placeId);
      // formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isActive', String(formData.isActive));

      // Arrays and Objects (Backend typically accepts stringified JSON for these in FormData)
      formDataToSend.append('timeSlots', JSON.stringify(formData.timeSlots));
      formDataToSend.append('Experience', JSON.stringify(formData.Experience));
      formDataToSend.append('Itinerary', JSON.stringify(formData.Itinerary));
      formDataToSend.append('InfoAndLogistics', JSON.stringify(formData.InfoAndLogistics));
      formDataToSend.append('BBQ_BUFFET', JSON.stringify(formData.BBQ_BUFFET));
      formDataToSend.append('PrivateSUV', JSON.stringify(formData.PrivateSUV));

      await updateActivity({ id: activity._id, formData: formDataToSend }).unwrap();
      onSuccess?.();
    } catch (error) {
      // setErrors({ submit: error?.data?.message || 'Failed to update activity' });
      console.error("UPDATE ERROR:", error); // 🔥 add this
  setErrors({ submit: error?.data?.message || 'Failed to update activity' });
    }
  };

  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all">
        
        {/* HEADER */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Edit: {activity.name}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Update activity details, itinerary, and logistics.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-100 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-hide bg-gray-50/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* ================= OVERVIEW TAB ================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <SectionCard title="Basic Information" icon={Info}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Name</label>
                      <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm ${errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="Name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug URL</label>
                      <input type="text" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm" placeholder="e.g. desert-safari" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                      <select value={formData.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm">
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                      <select value={formData.placeId} onChange={(e) => handleChange('placeId', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm">
                        <option value="">Select Location</option>
                        {places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Status & Visibility" icon={CheckCircle}>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Visible on Website</p>
                      <p className="text-xs text-gray-500 mt-0.5">Toggle to instantly show or hide this activity.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                  </label>
                </SectionCard>
              </div>
            )}

            {/* ================= EXPERIENCE TAB ================= */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <SectionCard title="Experience Details" icon={FileText}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                      <input type="text" value={formData.Experience.title} onChange={(e) => handleNestedChange('Experience', 'title', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm" placeholder="Experience Title" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Note (Badge)</label>
                      <input type="text" value={formData.Experience.note} onChange={(e) => handleNestedChange('Experience', 'note', e.target.value)} className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-amber-50 text-sm" placeholder="e.g. Best Seller" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea rows="4" value={formData.Experience.description} onChange={(e) => handleNestedChange('Experience', 'description', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm" placeholder="Full description..." />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Highlights" icon={Tag}>
                  <div className="space-y-3">
                    {formData.Experience.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={highlight} onChange={(e) => handleArrayChange('Experience', 'highlights', index, e.target.value)} className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Highlight item" />
                        <button onClick={() => removeArrayItem('Experience', 'highlights', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('Experience', 'highlights')} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-2">
                      <Plus className="w-4 h-4" /> Add Highlight
                    </button>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ================= ITINERARY TAB ================= */}
            {activeTab === 'itinerary' && (
              <SectionCard title="Itinerary Timeline" icon={Clock}>
                <div className="space-y-4">
                  {formData.Itinerary.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative">
                      <button onClick={() => removeItineraryItem(index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Time / Duration</label>
                          <input type="text" value={item.time} onChange={(e) => handleItineraryChange(index, 'time', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. 10:00 AM" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                          <input type="text" value={item.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Event title" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                          <textarea rows="2" value={item.description} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Details..." />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addItineraryItem} className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition font-semibold text-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Itinerary Item
                  </button>
                </div>
              </SectionCard>
            )}

            {/* ================= LOGISTICS TAB ================= */}
            {activeTab === 'logistics' && (
              <div className="space-y-6">
                <SectionCard title="Pickup Zone" icon={MapPin}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea rows="2" value={formData.InfoAndLogistics.pickupZone.description} onChange={(e) => handleDeepNestedChange('InfoAndLogistics', 'pickupZone', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Pickup details..." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note</label>
                        <input type="text" value={formData.InfoAndLogistics.pickupZone.note} onChange={(e) => handleDeepNestedChange('InfoAndLogistics', 'pickupZone', 'note', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Extra note" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Google Maps Link</label>
                        <input type="text" value={formData.InfoAndLogistics.pickupZone.mapLink} onChange={(e) => handleDeepNestedChange('InfoAndLogistics', 'pickupZone', 'mapLink', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Private SUV Setup" icon={Layers}>
                   <div className="space-y-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.PrivateSUV.available} onChange={(e) => handleNestedChange('PrivateSUV', 'available', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-semibold text-gray-800">SUV Available</span>
                     </label>
                     {formData.PrivateSUV.available && (
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Model</label>
                            <input type="text" value={formData.PrivateSUV.model} onChange={(e) => handleNestedChange('PrivateSUV', 'model', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Fee (AED)</label>
                            <input type="number" value={formData.PrivateSUV.fee} onChange={(e) => handleNestedChange('PrivateSUV', 'fee', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Seats</label>
                            <input type="number" value={formData.PrivateSUV.seat} onChange={(e) => handleNestedChange('PrivateSUV', 'seat', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                          </div>
                       </div>
                     )}
                   </div>
                </SectionCard>
                
                {/* Key Info Array */}
                <SectionCard title="Key Info & Essential Guide" icon={Info}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Key Info */}
                     <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Key Info</h4>
                        <div className="space-y-2">
                          {formData.InfoAndLogistics.keyInfo.map((info, index) => (
                            <div key={index} className="flex gap-2">
                              <input type="text" value={info} onChange={(e) => handleArrayChange('InfoAndLogistics', 'keyInfo', index, e.target.value)} className="flex-1 px-3 py-1.5 border rounded-lg text-sm" />
                              <button onClick={() => removeArrayItem('InfoAndLogistics', 'keyInfo', index)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <button onClick={() => addArrayItem('InfoAndLogistics', 'keyInfo')} className="text-xs text-blue-600 font-semibold">+ Add Info</button>
                        </div>
                     </div>
                     {/* Essential Guide */}
                     <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Essential Guide</h4>
                        <div className="space-y-2">
                          {formData.InfoAndLogistics.essentialGuide.map((guide, index) => (
                            <div key={index} className="flex gap-2">
                              <input type="text" value={guide} onChange={(e) => handleArrayChange('InfoAndLogistics', 'essentialGuide', index, e.target.value)} className="flex-1 px-3 py-1.5 border rounded-lg text-sm" />
                              <button onClick={() => removeArrayItem('InfoAndLogistics', 'essentialGuide', index)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <button onClick={() => addArrayItem('InfoAndLogistics', 'essentialGuide')} className="text-xs text-blue-600 font-semibold">+ Add Guide</button>
                        </div>
                     </div>
                   </div>
                </SectionCard>
              </div>
            )}

            {/* ================= DINING TAB ================= */}
            {activeTab === 'dining' && (
              <SectionCard title="BBQ Buffet & Dining" icon={Utensils}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Menu Title</label>
                    <input type="text" value={formData.BBQ_BUFFET.title} onChange={(e) => handleNestedChange('BBQ_BUFFET', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="e.g. International BBQ Buffet" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea rows="2" value={formData.BBQ_BUFFET.description} onChange={(e) => handleNestedChange('BBQ_BUFFET', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Menu description..." />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">Menu Categories</h4>
                    <div className="space-y-4">
                      {formData.BBQ_BUFFET.fields.map((field, fIndex) => (
                        <div key={fIndex} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative">
                           <button onClick={() => {
                              const newFields =[...formData.BBQ_BUFFET.fields];
                              newFields.splice(fIndex, 1);
                              handleNestedChange('BBQ_BUFFET', 'fields', newFields);
                           }} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                           
                           <label className="block text-xs font-semibold text-gray-600 mb-1">Category Name</label>
                           <input type="text" value={field.category} onChange={(e) => {
                              const newFields = [...formData.BBQ_BUFFET.fields];
                              newFields[fIndex].category = e.target.value;
                              handleNestedChange('BBQ_BUFFET', 'fields', newFields);
                           }} className="w-full md:w-1/2 px-3 py-2 border rounded-lg text-sm mb-3" placeholder="e.g. Starters" />

                           <label className="block text-xs font-semibold text-gray-600 mb-1">Food Items</label>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                             {field.items.map((item, iIndex) => (
                               <div key={iIndex} className="flex gap-2">
                                  <input type="text" value={item} onChange={(e) => {
                                      const newFields =[...formData.BBQ_BUFFET.fields];
                                      newFields[fIndex].items[iIndex] = e.target.value;
                                      handleNestedChange('BBQ_BUFFET', 'fields', newFields);
                                  }} className="flex-1 px-3 py-1.5 border rounded-lg text-sm bg-white" placeholder="Dish name" />
                                  <button onClick={() => {
                                      const newFields =[...formData.BBQ_BUFFET.fields];
                                      newFields[fIndex].items.splice(iIndex, 1);
                                      handleNestedChange('BBQ_BUFFET', 'fields', newFields);
                                  }} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                               </div>
                             ))}
                             <button onClick={() => {
                                 const newFields = [...formData.BBQ_BUFFET.fields];
                                 newFields[fIndex].items.push('');
                                 handleNestedChange('BBQ_BUFFET', 'fields', newFields);
                             }} className="text-xs text-blue-600 font-semibold flex items-center gap-1 border border-dashed border-blue-200 rounded-lg px-3 py-1.5 justify-center hover:bg-blue-50">
                               <Plus className="w-3 h-3" /> Add Item
                             </button>
                           </div>
                        </div>
                      ))}
                      
                      <button onClick={() => {
                          handleNestedChange('BBQ_BUFFET', 'fields',[...formData.BBQ_BUFFET.fields, { category: '', items: [] }]);
                      }} className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition text-sm font-semibold">
                         + Add Menu Category
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Error Message Display */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p>{errors.submit}</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 z-20">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-all shadow-sm hover:shadow"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-50">
      {Icon && (
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <h3 className="font-bold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);