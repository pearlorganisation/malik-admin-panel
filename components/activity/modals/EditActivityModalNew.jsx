'use client';

import { useUpdateActivityMutation } from '@/features/activity/activityApi';
import React, { useState, useEffect } from 'react';
  import toast from "react-hot-toast";

// ✅ Moved OUTSIDE the main component to prevent focus loss & Next.js compile errors
const InputField = ({ label, name, type = 'text', placeholder, value, onChange, ...rest }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 resize-none"
        {...rest}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
        {...rest}
        />
    )}
  </div>
);

export default function EditActivityModalNew({ activity, onClose, onSuccess }) {
    const [updateActivity, { isLoading }] = useUpdateActivityMutation();
  const[activeTab, setActiveTab] = useState('basic');

  // --- STATE WITH FALLBACKS ---
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    timeSlots: '',
    
    // Experience
    experienceTitle: '',
    experienceNote: '',
    experienceDesc: '',
    highlights: '',

    // Itinerary
    itinerary:[],

    // Logistics
    pickupDesc: '',
    pickupNote: '',
    pickupMap: '',
    keyInfo: '',
    essentialGuide: '',

    // Extras
    bbqTitle: '',
    bbqDesc: '',
    bbqFields: [],
    suvAvailable: false,
    suvFee: 0,
    suvModel: 'SUV',
  });

  // ✅ PREFILL DATA ON MOUNT
  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity?.name || '',
        isActive: activity?.isActive ?? true,
        timeSlots: (activity?.timeSlots ||[]).join(', '),
        
        experienceTitle: activity?.Experience?.title || '',
        experienceNote: activity?.Experience?.note || '',
        experienceDesc: activity?.Experience?.description || '',
        highlights: (activity?.Experience?.highlights ||[]).join(', '),
        
        // itinerary: activity?.Itinerary?.length ? [...activity.Itinerary] :[],
        itinerary: activity?.Itinerary?.length
  ? activity.Itinerary.map(item => ({
      ...item,
      _id: item._id || crypto.randomUUID()
    }))
  : [],
        
        pickupDesc: activity?.InfoAndLogistics?.pickupZone?.description || '',
        pickupNote: activity?.InfoAndLogistics?.pickupZone?.note || '',
        pickupMap: activity?.InfoAndLogistics?.pickupZone?.mapLink || '',
        keyInfo: (activity?.InfoAndLogistics?.keyInfo ||[]).join(', '),
        essentialGuide: (activity?.InfoAndLogistics?.essentialGuide ||[]).join(', '),
        
        bbqTitle: activity?.BBQ_BUFFET?.title || '',
        bbqFields: activity?.BBQ_BUFFET?.fields?.length
  ? activity.BBQ_BUFFET.fields.map(f => ({
      category: f.category || '',
      items: f.items || []
    }))
  : [],
        bbqDesc: activity?.BBQ_BUFFET?.description || '',
        
        suvAvailable: activity?.PrivateSUV?.available || false,
        suvFee: activity?.PrivateSUV?.fee || 0,
        suvModel: activity?.PrivateSUV?.model || 'SUV',
      });
    }
  }, [activity]);

  // ✅ HANDLE BASIC CHANGES
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ✅ DYNAMIC ITINERARY HANDLERS
//   const handleItineraryChange = (index, field, value) => {
//     const newItinerary = [...formData.itinerary];
//     newItinerary[index][field] = value;
//     setFormData({ ...formData, itinerary: newItinerary });
//   };




// const addItineraryItem = () => {
//   setFormData({
//     ...formData,
//     itinerary: [
//       ...formData.itinerary,
//       { time: '', title: '', description: '', image: { secure_url: '', publicId: '' } }
//     ],
//   });
// };
// const handleItineraryChange = (index, field, value) => {
//   const newItinerary = [...formData.itinerary];

//   if (!newItinerary[index]) {
//     newItinerary[index] = {
//       time: '',
//       title: '',
//       description: '',
//       image: { secure_url: '', publicId: '' }
//     };
//   }

//   if (field === 'image') {
//     newItinerary[index].image = value;
//   } else {
//     newItinerary[index][field] = value;
//   }

//   setFormData((prev) => ({
//     ...prev,
//     itinerary: newItinerary,
//   }));
// };

const handleItineraryChange = (index, field, value) => {
  setFormData(prev => {
    const updated = [...prev.itinerary];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    return { ...prev, itinerary: updated };
  });
};

const addItineraryItem = () => {
  setFormData((prev) => ({
    ...prev,
    itinerary: [
      ...prev.itinerary,
      {
        time: '',
        title: '',
        description: '',
        image: { secure_url: '', publicId: '' },
      },
    ],
  }));
};

const handleBBQFieldChange = (index, field, value) => {
  const updated = [...formData.bbqFields];
  updated[index][field] = value;

  setFormData((prev) => ({
    ...prev,
    bbqFields: updated,
  }));
};

const handleBBQItemsChange = (index, value) => {
  const updated = [...formData.bbqFields];
  updated[index].items = value.split(',').map(i => i.trim());

  setFormData((prev) => ({
    ...prev,
    bbqFields: updated,
  }));
};

const addBBQField = () => {
  setFormData((prev) => ({
    ...prev,
    bbqFields: [...prev.bbqFields, { category: '', items: [] }],
  }));
};

const removeBBQField = (index) => {
  const updated = formData.bbqFields.filter((_, i) => i !== index);
  setFormData((prev) => ({
    ...prev,
    bbqFields: updated,
  }));
};

  const removeItineraryItem = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    // setFormData({ ...formData, itinerary: newItinerary });
    setFormData((prev) => ({
  ...prev,
  itinerary: newItinerary,
}));
  };

  // ✅ SUBMIT
//   const handleSubmit = () => {
//     const payload = {
//       name: formData.name,
//       isActive: formData.isActive,
//       timeSlots: formData.timeSlots.split(',').map((i) => i.trim()).filter(Boolean),
      
//       Experience: {
//         title: formData.experienceTitle,
//         note: formData.experienceNote,
//         description: formData.experienceDesc,
//         highlights: formData.highlights.split(',').map((i) => i.trim()).filter(Boolean),
//       },

//       Itinerary: formData.itinerary,

//       InfoAndLogistics: {
//         pickupZone: {
//           description: formData.pickupDesc,
//           note: formData.pickupNote,
//           mapLink: formData.pickupMap,
//         },
//         keyInfo: formData.keyInfo.split(',').map((i) => i.trim()).filter(Boolean),
//         essentialGuide: formData.essentialGuide.split(',').map((i) => i.trim()).filter(Boolean),
//       },

//       BBQ_BUFFET: {
//         title: formData.bbqTitle,
//         description: formData.bbqDesc,
//       },

//       PrivateSUV: {
//         available: formData.suvAvailable,
//         fee: Number(formData.suvFee) || 0,
//         model: formData.suvModel,
//       },
//     };

//     console.log("🔥 FINAL PAYLOAD READY FOR API:", payload);
//     // TODO: Call your update API here
    
//     if (onSuccess) onSuccess();
//   };

const handleSubmit = async() => {
try{
   const timeSlotsArray = formData.timeSlots
  .split(',')
  .map((i) => i.trim())
  .filter(Boolean);

const isValidTime = (time) =>
  /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(time);

for (let time of timeSlotsArray) {
  if (!isValidTime(time)) {
    alert(`Invalid time format: ${time}`);
    return;
  }
}
  const payload = {
    name: formData.name.trim(),
    isActive: formData.isActive,

    // timeSlots: formData.timeSlots
    //   .split(',')
    //   .map((i) => i.trim())
    //   .filter(Boolean),
    timeSlots: timeSlotsArray,

    Experience: {
      title: formData.experienceTitle,
      note: formData.experienceNote,
      description: formData.experienceDesc,
      highlights: formData.highlights
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
    },

    // Itinerary: formData.itinerary.filter(
    //   (item) => item.title || item.description
    // ),
    Itinerary: formData.itinerary
  .filter((item) => item.title || item.description)
  .map((item) => ({
    ...item,
    image: item.image?.secure_url ? item.image : undefined,
  })),

    InfoAndLogistics: {
      pickupZone: {
        description: formData.pickupDesc,
        note: formData.pickupNote,
        mapLink: formData.pickupMap,
      },
      keyInfo: formData.keyInfo
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      essentialGuide: formData.essentialGuide
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
    },

   BBQ_BUFFET: {
  title: formData.bbqTitle,
  description: formData.bbqDesc,
  fields: formData.bbqFields.filter((f) => f.category),
},

    PrivateSUV: {
      available: formData.suvAvailable,
      fee: Number(formData.suvFee) || 0,
      model: formData.suvModel,
    },
  };

  console.log("backend",payload)
// await updateActivity({
//       id: activity._id,
//       data: payload,
//     }).unwrap();
await updateActivity({
  id: activity._id,
  data: {
    ...payload,
    Experience: JSON.stringify(payload.Experience),
    Itinerary: JSON.stringify(payload.Itinerary),
    InfoAndLogistics: JSON.stringify(payload.InfoAndLogistics),
    BBQ_BUFFET: JSON.stringify(payload.BBQ_BUFFET),
    PrivateSUV: JSON.stringify(payload.PrivateSUV),
    timeSlots: JSON.stringify(payload.timeSlots),
  },
}).unwrap();
    // console.log("✅ Updated:", payload);

toast.success("Activity Updated 🎉");

if (onSuccess) onSuccess();
onClose();

} catch (error) {
    //   toast.error("Update failed ❌");
    toast.error(error?.data?.message || "Update failed ❌");
    // console.error("❌ Update failed:", error);
    alert("Update failed ❌");
  }
};

  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      {/* <div className="bg-white w-full max-w-4xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] overflow-hidden"> */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Edit Activity
            </h2>
            <p className="text-sm text-gray-500 mt-1">Update details for {formData.name || 'this activity'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Custom Tabs Navigation */}
        {/* <div className="flex border-b border-gray-200 bg-white overflow-x-auto"> */}
        <div className="flex border-b border-gray-200 bg-white overflow-x-auto sticky top-0 z-10">
          {['basic', 'experience', 'itinerary', 'logistics', 'extras'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50/50'
                  : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        {/* <div className="p-6 overflow-y-auto flex-1 bg-white"> */}
        <div className="p-6 flex-1 overflow-y-auto min-h-0 bg-white scroll-smooth">
          
          {/* TAB: BASIC */}
          {activeTab === 'basic' && (
            <div className="animate-fade-in transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Activity Name *" name="name" value={formData.name} onChange={handleChange} placeholder="E.g. Desert Safari" />
                <InputField label="Time Slots" name="timeSlots" value={formData.timeSlots} onChange={handleChange} placeholder="09:00 AM, 02:30 PM (Comma separated)" />
              </div>
              <div className="mt-4 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label className="font-bold text-gray-700">Activity is Active & Visible</label>
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="animate-fade-in">
              <InputField label="Experience Title" name="experienceTitle" value={formData.experienceTitle} onChange={handleChange} placeholder="Main catchy title..." />
              <InputField label="Note / Subtitle" name="experienceNote" value={formData.experienceNote} onChange={handleChange} placeholder="Important note..." />
              <InputField label="Description" name="experienceDesc" value={formData.experienceDesc} onChange={handleChange} type="textarea" placeholder="Detailed description..." />
              <InputField label="Highlights" name="highlights" value={formData.highlights} onChange={handleChange} type="textarea" placeholder="Dune bashing, Camel ride (Comma separated)" />
            </div>
          )}

          {/* TAB: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="animate-fade-in space-y-4">
              {formData.itinerary.map((item, index) => (
                <div key={item._id || index} className="relative p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => removeItineraryItem(index)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                  <h4 className="font-bold text-indigo-600 mb-3">Step {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Time (Optional)</label>
                      <input type="text" value={item?.time || ''} onChange={(e) => handleItineraryChange(index, 'time', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 bg-white outline-none" placeholder="e.g. 10:00 AM" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                      <input type="text" value={item?.title || ''} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 bg-white outline-none" placeholder="Arrival at Camp" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Description *</label>
                      <textarea value={item?.description || ''} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} rows="2" className="w-full border border-gray-300 rounded-lg p-2 bg-white outline-none resize-none" placeholder="Details of this step..."></textarea>
                    </div>
                    <InputField
  label="Image URL"
  value={item?.image?.secure_url || ''}
onChange={(e) =>
  handleItineraryChange(index, 'image', {
    ...(item.image || {}),
    secure_url: e.target.value,
  })
}
  placeholder="https://image-url.com"
/>
                  </div>
                </div>
              ))}
              <button
                onClick={addItineraryItem}
                className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                + Add Itinerary Step
              </button>
            </div>
          )}

          {/* TAB: LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="animate-fade-in space-y-6">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-3">📍 Pickup Zone</h3>
                <InputField label="Description" name="pickupDesc" value={formData.pickupDesc} onChange={handleChange} placeholder="Hotel pickup in central area..." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Note" name="pickupNote" value={formData.pickupNote} onChange={handleChange} placeholder="Wait in lobby 10 mins prior..." />
                  <InputField label="Google Map Link" name="pickupMap" value={formData.pickupMap} onChange={handleChange} placeholder="https://maps.google.com/..." />
                </div>
              </div>
              <InputField label="Key Info" name="keyInfo" value={formData.keyInfo} onChange={handleChange} type="textarea" placeholder="Passport required, Wear comfortable shoes (Comma separated)" />
              <InputField label="Essential Guide" name="essentialGuide" value={formData.essentialGuide} onChange={handleChange} type="textarea" placeholder="Pregnant women not advised (Comma separated)" />
            </div>
          )}

<div className="mt-4 space-y-4">
  {formData.bbqFields.map((field, index) => (
    <div key={index} className="p-4 border rounded-xl bg-white relative">
      
      <button
        onClick={() => removeBBQField(index)}
        className="absolute top-2 right-2 text-red-400"
      >
        ✕
      </button>

      <InputField
        label="Category"
        value={field.category}
        onChange={(e) => handleBBQFieldChange(index, 'category', e.target.value)}
        placeholder="Veg / Non-Veg"
      />

      <InputField
        label="Items (comma separated)"
        value={field.items.join(', ')}
        onChange={(e) => handleBBQItemsChange(index, e.target.value)}
        placeholder="Paneer, Chicken..."
      />
    </div>
  ))}

  <button
    onClick={addBBQField}
    className="w-full py-2 border-dashed border-2 rounded-xl text-indigo-600"
  >
    + Add BBQ Category
  </button>
</div>

          {/* TAB: EXTRAS */}
          {activeTab === 'extras' && (
            <div className="animate-fade-in space-y-6 my-6">
              {/* BBQ Section */}
              <div className="p-5 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="font-bold text-orange-800 mb-3 text-lg">🍖 BBQ Buffet Info</h3>
                <InputField label="BBQ Title" name="bbqTitle" value={formData.bbqTitle} onChange={handleChange} placeholder="Premium BBQ Dinner" />
                <InputField label="BBQ Description" name="bbqDesc" value={formData.bbqDesc} onChange={handleChange} type="textarea" placeholder="Enjoy unlimited veg and non-veg buffet..." />
              </div>

              {/* SUV Section */}
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-300">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">🚙 Private SUV Option</h3>
                  <input
                    type="checkbox"
                    name="suvAvailable"
                    checked={formData.suvAvailable}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-gray-600">Available?</span>
                </div>
                {formData.suvAvailable && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Extra Fee (₹ / $)" name="suvFee" value={formData.suvFee} onChange={handleChange} type="number" placeholder="5000" />
                    <InputField label="Car Model" name="suvModel" value={formData.suvModel} onChange={handleChange} placeholder="e.g. Land Cruiser" />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-4 p-5 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
          >
            Cancel
          </button>
  <button
  onClick={handleSubmit}
  disabled={isLoading}
className={`px-8 py-2.5 font-bold text-white rounded-xl ${
  isLoading
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-gradient-to-r from-indigo-600 to-purple-600"
}`}
 >
  {isLoading ? "Saving..." : "Save Changes"}
</button>
        </div>
      </div>
    </div>
  );
}