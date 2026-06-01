// 'use client';

// import React, { useState } from 'react';
// import { useGetCategoriesQuery } from "@/features/category/categoryApi";
// import { useGetAllPlacesQuery } from "@/features/place/placeApi";
// import { useGetAddonsQuery } from "@/features/addon/addonApi";

// export default function Step1BasicInfo({ formData, onFormDataChange, onNext }) {
//   const [errors, setErrors] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
//   const [addonSearch, setAddonSearch] = useState(""); // Search inside modal

//   const { data: categoryResponse, isLoading: categoryLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
//   const categories = categoryResponse?.data || [];
  
//   const { data: placeResponse, isLoading: placeLoading } = useGetAllPlacesQuery();
//   const places = placeResponse?.data || [];

//   const { data: addonResponse, isLoading: addonLoading } = useGetAddonsQuery({ page: 1, limit: 100 });
//   const allAddons = addonResponse?.data?.data || [];

//   const validateStep = () => {
//     const newErrors = {};
//     if (!formData.name?.trim()) newErrors.name = 'Activity name is required';
//     if (!formData.categoryId) newErrors.categoryId = 'Category is required';
//     if (!formData.placeId) newErrors.placeId = 'Place is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep()) onNext();
//   };

//   const handleInputChange = (field, value) => {
//     onFormDataChange({ ...formData, [field]: value });
//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   // Addon Logic
//   const handleAddonToggle = (addonId) => {
//     const currentAddons = [...(formData.addons || [])];
//     const index = currentAddons.indexOf(addonId);
//     if (index > -1) {
//       currentAddons.splice(index, 1);
//     } else {
//       currentAddons.push(addonId);
//     }
//     onFormDataChange({ ...formData, addons: currentAddons });
//   };

//   // Filtered addons for the modal search
//   const filteredAddons = allAddons.filter(addon => 
//     addon.name.toLowerCase().includes(addonSearch.toLowerCase())
//   );

//   // Time slot functions... (unchanged)
//   const addTimeSlot = () => {
//     const updated = [...(formData.timeSlots || []), ""];
//     onFormDataChange({ ...formData, timeSlots: updated });
//   };
//   const updateTimeSlot = (index, value) => {
//     const updated = [...formData.timeSlots];
//     const [hour, minute] = value.split(":");
//     const h = parseInt(hour);
//     const ampm = h >= 12 ? "PM" : "AM";
//     const formattedHour = ((h + 11) % 12 + 1).toString().padStart(2, "0");
//     updated[index] = `${formattedHour}:${minute} ${ampm}`;
//     onFormDataChange({ ...formData, timeSlots: updated });
//   };
//   const removeTimeSlot = (index) => {
//     const updated = formData.timeSlots.filter((_, i) => i !== index);
//     onFormDataChange({ ...formData, timeSlots: updated });
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn">
//       {/* ... Activity Name, Category, Place UI (Unchanged) ... */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Activity Information</h2>
//         <p className="text-gray-600 text-sm">Enter the essential details of your activity</p>
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700">Activity Name *</label>
//         <input
//           type="text"
//           value={formData.name || ''}
//           onChange={(e) => handleInputChange('name', e.target.value)}
//           className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
//         />
//         {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700">Category *</label>
//           <select
//             value={formData.categoryId || ''}
//             onChange={(e) => handleInputChange('categoryId', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//           >
//             <option value="">Select Category</option>
//             {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//           </select>
//         </div>
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700">Place *</label>
//           <select
//             value={formData.placeId || ''}
//             onChange={(e) => handleInputChange('placeId', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//           >
//             <option value="">Select Place</option>
//             {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* --- ADDONS SECTION --- */}
//       <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
//         <div className="flex justify-between items-center">
//           <label className="block text-sm font-bold text-gray-700">
//             Available Addons 
//             <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">
//               {formData.addons?.length || 0} Selected
//             </span>
//           </label>
//           {allAddons.length > 3 && (
//             <button 
//               type="button"
//               onClick={() => setIsModalOpen(true)}
//               className="text-blue-600 text-xs font-semibold hover:underline"
//             >
//               View All & Search
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           {addonLoading ? (
//             <p className="text-xs text-gray-400">Loading...</p>
//           ) : (
//             allAddons.slice(0, 3).map((addon) => (
//               <div 
//                 key={addon._id}
//                 onClick={() => handleAddonToggle(addon._id)}
//                 className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
//                   formData.addons?.includes(addon._id)
//                     ? "border-blue-500 bg-white shadow-sm"
//                     : "border-gray-200 bg-gray-50/50 opacity-80"
//                 }`}
//               >
//                 <div className="truncate">
//                   <p className="text-xs font-bold text-gray-800 truncate">{addon.name}</p>
//                   <p className="text-[10px] text-blue-600">AED {addon.price}</p>
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   readOnly 
//                   checked={formData.addons?.includes(addon._id)} 
//                   className="w-3 h-3 rounded"
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* --- ADDON MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">Select Activity Addons</h3>
//                 <p className="text-sm text-gray-500">Choose multiple optional extras</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
//             </div>
            
//             <div className="p-4 border-b bg-gray-50">
//               <input 
//                 type="text"
//                 placeholder="Search addons by name..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={addonSearch}
//                 onChange={(e) => setAddonSearch(e.target.value)}
//               />
//             </div>

//             <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4">
//               {filteredAddons.map((addon) => (
//                 <div 
//                   key={addon._id}
//                   onClick={() => handleAddonToggle(addon._id)}
//                   className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
//                     formData.addons?.includes(addon._id)
//                       ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <div className="flex-1">
//                     <p className="text-sm font-bold text-gray-900">{addon.name}</p>
//                     <p className="text-xs text-blue-600 font-medium">AED {addon.price}</p>
//                   </div>
//                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
//                     formData.addons?.includes(addon._id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
//                   }`}>
//                     {formData.addons?.includes(addon._id) && <span className="text-white text-[10px]">✓</span>}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="p-6 border-t bg-gray-50 flex justify-end">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
//               >
//                 Done ({formData.addons?.length || 0})
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- TIME SLOTS & STATUS --- */}
//       <div className="space-y-3">
//         <label className="block text-sm font-semibold text-gray-700">Activity Time Slots</label>
//         {(formData.timeSlots || []).map((slot, index) => (
//           <div key={index} className="flex gap-3 items-center">
//             <input type="time" onChange={(e) => updateTimeSlot(index, e.target.value)} className="px-4 py-2 border rounded-lg" />
//             <span className="text-sm text-gray-600">{slot}</span>
//             <button type="button" onClick={() => removeTimeSlot(index)} className="text-red-500 text-sm">Remove</button>
//           </div>
//         ))}
//         <button type="button" onClick={addTimeSlot} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">+ Add Slot</button>
//       </div>

//       <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//         <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} className="w-5 h-5" />
//         <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Activity is Active</label>
//       </div>

//       <div className="flex justify-end gap-3 pt-6 border-t">
//         <button onClick={handleNext} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg">
//           Continue to Experience
//         </button>
//       </div>
//     </div>
//   );
// }







'use client';

import React, { useState } from 'react';
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import { useGetAddonsQuery } from "@/features/addon/addonApi";
import { useGetLanguagesQuery } from "@/features/languages/languageApi";
import { Globe, Search, ChevronDown, Check, Info,X} from "lucide-react"; 
import { useGetUniqueActivityNamesQuery } from '@/features/activity/activityApi';
import { useSearchParams } from 'next/navigation';
export default function Step1BasicInfo({ formData, onFormDataChange, onNext }) {
  // console.log("formdata",formData)
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addonSearch, setAddonSearch] = useState("");

  // --- NEW STATE FOR LANGUAGE SEARCH ---
  const [langSearch, setLangSearch] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
const hasInitialized = React.useRef(false);
  // --- EXISTING API CALLS ---
  const { data, isLoading } = useGetUniqueActivityNamesQuery();
  // console.log("daaa",data)
  const activityNames = data?.data || [];
  const filteredNames = formData.isDuplicate
  ? activityNames 
  : [];  
const searchParams = useSearchParams();
const duplicateId = searchParams.get("duplicateId");

const isDuplicateMode = !!duplicateId;
  const { data: categoryResponse, isLoading: categoryLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
  const categories = categoryResponse?.data || [];
  
  const { data: placeResponse, isLoading: placeLoading } = useGetAllPlacesQuery();
  const places = placeResponse?.data || [];

  const { data: addonResponse, isLoading: addonLoading } = useGetAddonsQuery({ page: 1, limit: 100 });
  const allAddons = addonResponse?.data?.data || [];

  // --- NEW LANGUAGE API CALL ---
  const { data: languagesResponse } = useGetLanguagesQuery();
  // const languages = languagesResponse || []; 
  const languages = languagesResponse?.data || []; 

  const validateStep = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Activity name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.placeId) newErrors.placeId = 'Place is required';
    if (!formData.language) newErrors.language = 'Target language is required'; // New Validation
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleNext = () => {
    if (validateStep()) onNext();
  };

  const handleInputChange = (field, value) => {
    // Retaining your exact original spread logic
    onFormDataChange({ ...formData, [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };
React.useEffect(() => {
  if (duplicateId && !hasInitialized.current) {
    handleInputChange('isDuplicate', true);
    hasInitialized.current = true; 
  }
}, [duplicateId, formData.isDuplicate]); 

  // --- EXISTING ADDON LOGIC ---
  const handleAddonToggle = (addonId) => {
    const currentAddons = [...(formData.addons || [])];
    const index = currentAddons.indexOf(addonId);
    if (index > -1) {
      currentAddons.splice(index, 1);
    } else {
      currentAddons.push(addonId);
    }
    onFormDataChange({ ...formData, addons: currentAddons });
  };

  const filteredAddons = allAddons.filter(addon => 
    addon.name.toLowerCase().includes(addonSearch.toLowerCase())
  );

  // --- NEW LANGUAGE SEARCH LOGIC ---
  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase())
  );
  const selectedLangName = languages.find(l => l._id === formData.language)?.name || "";

  // --- EXISTING TIME SLOT LOGIC ---
  const addTimeSlot = () => {
    const updated = [...(formData.timeSlots || []), ""];
    onFormDataChange({ ...formData, timeSlots: updated });
  };
  const updateTimeSlot = (index, value) => {
    const updated = [...formData.timeSlots];
    const [hour, minute] = value.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = ((h + 11) % 12 + 1).toString().padStart(2, "0");
    updated[index] = `${formattedHour}:${minute} ${ampm}`;
    onFormDataChange({ ...formData, timeSlots: updated });
  };
  const removeTimeSlot = (index) => {
    const updated = formData.timeSlots.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, timeSlots: updated });
  };

const currentSelectedName = formData.name?.replace(" (Copy)", "").trim() || "";
// const handleDuplicateSelect = (selectedName) => {
//   const originalData = activityNames.find(act => act.name === selectedName);
//   if (originalData) {
//     onFormDataChange({
//       ...formData,
//       ...originalData, // Pura data copy ho jayega
//       name: `${selectedName} (Copy)`, // Naam ke peeche (Copy) lag jayega
//       isDuplicate: true,
//       _id: undefined // New activity ke liye ID reset
//     });
//   }
// };
const handleDuplicateSelect = (selectedName) => {
  const originalData = activityNames.find(act => act.name === selectedName);
  
  if (originalData) {
    onFormDataChange({
      ...formData,
      ...originalData, 
      // Field Mapping: MongoDB ka 'languageId' -> Frontend ka 'language'
      language: originalData.languageId?._id || originalData.languageId || "",
      
      // Category aur Place ke liye bhi safe mapping (agar wo object hain)
      categoryId: originalData.categoryId?._id || originalData.categoryId || "",
      placeId: originalData.placeId?._id || originalData.placeId || "",
      
      name: `${selectedName} (Copy)`,
      isDuplicate: true,
      _id: undefined, 
      originalActivityId: originalData._id
    });
  }
};  


const toggleDuplicateMode = () => {
  const newStatus = !formData.isDuplicate;
  onFormDataChange({ 
    ...formData, 
    isDuplicate: newStatus,
    originalActivityId: newStatus ? formData.originalActivityId : null,
    name: newStatus ? formData.name : formData.name.replace(" (Copy)", "").trim()
  });
};
return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Basic Activity Information</h2>
          <p className="text-gray-600 text-sm">Enter the essential details and regional settings</p>
        </div>

        {/* --- NEW: IS DUPLICATE TOGGLE (Professional UI) --- */}
        <div 
          // onClick={() => handleInputChange('isDuplicate', !formData.isDuplicate)}
  // onClick={() => handleInputChange('isDuplicate', !formData.isDuplicate)}
  onClick={toggleDuplicateMode}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
            (formData.isDuplicate || isDuplicateMode) ? "border-amber-500 bg-amber-50" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            (formData.isDuplicate || isDuplicateMode) ? "bg-amber-500 border-amber-500" : "border-gray-300"
          }`}>
            {(formData.isDuplicate || isDuplicateMode) && <Check size={14} className="text-white" strokeWidth={4} />}
          </div>
         <span className={`text-xs font-bold uppercase tracking-wider ${formData.isDuplicate ? "text-amber-700" : "text-gray-500"}`}>
  Duplicate Entry
</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ACTIVITY NAME */}
        {/* <div className="md:col-span-8 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Activity Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g. Desert Safari Premium"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
        </div> */}
  <div className="md:col-span-8 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            {(formData.isDuplicate || isDuplicateMode) ? "Select Existing Activity to Copy *" : "Activity Name *"}
          </label>
          
          {/* {formData.isDuplicate ? ( */}
          {(formData.isDuplicate || isDuplicateMode) ? (
            // <select
            //   value={formData.name || ''}
            //   onChange={(e) => handleInputChange('name', e.target.value)}
            //   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            // >
            //   <option value="">-- Choose Activity --</option>
            //   {activityNames.map((act) => (
            //     <option key={act._id} value={act.name}>
            //       {act.name} {/* FIXED: Rendering act.name instead of object act */}
            //     </option>
            //   ))}
            // </select>

       <select
  value={currentSelectedName} // Step 1 wala variable yahan use karein
  onChange={(e) => handleDuplicateSelect(e.target.value)} // Step 2 wala function yahan call karein
  className={`w-full px-4 py-3 border rounded-lg ...`}
>
  <option value="">-- Choose Activity --</option>
  {activityNames.map((act) => (
    <option key={act._id} value={act.name}>
      {act.name}
    </option>
  ))}
</select>
          ) : (
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Desert Safari Premium"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
          )}
          {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
        </div>

        {/* --- NEW: SEARCHABLE LANGUAGE SELECTOR --- */}
        <div className="md:col-span-4 space-y-2 relative">
          <label className="block text-sm font-semibold text-gray-700">Target Language *</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setShowLangDropdown(true)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${errors.language ? 'border-red-500' : 'border-gray-300'}`}
              value={langSearch || selectedLangName}
              onChange={(e) => { setLangSearch(e.target.value); setShowLangDropdown(true); }}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
            
            {showLangDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1 animate-in slide-in-from-top-1">
                {filteredLanguages.map(lang => (
                  <div 
                    key={lang._id}
                    onClick={() => {
                      handleInputChange('language', lang._id);
                      setLangSearch("");
                      setShowLangDropdown(false);
                    }}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">{lang.name}</span>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{lang.code}</span>
                  </div>
                ))}
                {filteredLanguages.length === 0 && <p className="p-3 text-xs text-gray-400">No language found</p>}
              </div>
            )}
          </div>
          {errors.language && <p className="text-red-600 text-xs">{errors.language}</p>}
          {showLangDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Category *</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-red-600 text-xs">{errors.categoryId}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Place *</label>
          <select
            value={formData.placeId || ''}
            onChange={(e) => handleInputChange('placeId', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.placeId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Place</option>
            {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {errors.placeId && <p className="text-red-600 text-xs">{errors.placeId}</p>}
        </div>
      </div>

      {/* --- ADDONS SECTION (RETAINED EXACTLY) --- */}
      <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-gray-700">
            Available Addons 
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">
              {formData.addons?.length || 0} Selected
            </span>
          </label>
          {allAddons.length > 3 && (
            <button type="button" onClick={() => setIsModalOpen(true)} className="text-blue-600 text-xs font-semibold hover:underline">
              View All & Search
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {addonLoading ? (
            <p className="text-xs text-gray-400">Loading...</p>
          ) : (
            allAddons.slice(0, 3).map((addon) => (
              <div 
                key={addon._id}
                onClick={() => handleAddonToggle(addon._id)}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.addons?.includes(addon._id) ? "border-blue-500 bg-white shadow-sm" : "border-gray-200 bg-gray-50/50 opacity-80"
                }`}
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 truncate">{addon.name}</p>
                  <p className="text-[10px] text-blue-600">AED {addon.price}</p>
                </div>
                <input type="checkbox" readOnly checked={formData.addons?.includes(addon._id)} className="w-3 h-3 rounded" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADDON MODAL (RETAINED EXACTLY) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Select Activity Addons</h3>
                <p className="text-sm text-gray-500">Choose multiple optional extras</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="p-4 border-b bg-gray-50">
              <input 
                type="text"
                placeholder="Search addons by name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={addonSearch}
                onChange={(e) => setAddonSearch(e.target.value)}
              />
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4">
              {filteredAddons.map((addon) => (
                <div 
                  key={addon._id}
                  onClick={() => handleAddonToggle(addon._id)}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.addons?.includes(addon._id) ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{addon.name}</p>
                    <p className="text-xs text-blue-600 font-medium">AED {addon.price}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    formData.addons?.includes(addon._id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  }`}>
                    {formData.addons?.includes(addon._id) && <span className="text-white text-[10px]">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                Done ({formData.addons?.length || 0})
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Activity Time Slots</label>
       {(formData.timeSlots || []).map((slot, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input type="time" onChange={(e) => updateTimeSlot(index, e.target.value)} className="px-4 py-2 border rounded-lg" />
            <span className="text-sm text-gray-600">{slot}</span>
            <button type="button" onClick={() => removeTimeSlot(index)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addTimeSlot} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">+ Add Slot</button>
      </div>

     
<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
       <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} className="w-5 h-5" />
         <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Activity is Active</label>
      </div>
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
        <button 
          onClick={handleNext} 
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Continue to Experience
        </button>
        
      </div>
    </div>
  );
}