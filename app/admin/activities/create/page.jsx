// app/admin/activities/create/page.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateActivityMutation,
  useGetActivityByIdQuery,
} from "@/features/activity/activityApi";

import ActivityTabs from "../components/ActivityTabs";
import BasicInfoSection from "../components/BasicInfoSection";
import ImagesSection from "../components/ImagesSection";
import DetailsSection from "../components/DetailsSection";
import AvailabilitySection from "../components/AvailabilitySection";
import ItinerarySection from "../components/ItinerarySection";
import InclusionsSection from "../components/InclusionsSection";
import RestrictionsSection from "../components/RestrictionsSection";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";

const TABS_LIST = ["basic", "images", "details", "availability", "itinerary", "inclusions", "restrictions"];
const TAB_LABELS = { basic: "Basic Info", images: "Images", details: "Details", availability: "Availability", itinerary: "Itinerary", inclusions: "Inclusions", restrictions: "Restrictions" };

const initialFormData = {
  title: "", shortDescription: "", fullDescription: "", category: "", location: "", tags: [],
  images: Array(10).fill({ file: null, preview: null, isExisting: false }), 
  video: { file: null, url: "", preview: "", public_id: "", isExisting: false }, // Video completely structured
  duration: { label: "", hours: null }, languages: [], liveGuide: true,
  cancellationPolicy: { isFreeCancellation: true, hoursBefore: 24 }, reservePolicy: { payLater: true, description: "" },
  pickup: { included: true, description: "", locations: ["Dubai"], privateForOutskirts: false },
  
  // EXTRA FIELDS FOR 100% DUPLICATION:
  experienceTitle: "", pickupNote: "", mapLink: "", essentialGuide: [], 
  
  variants: [{ name: "Standard Package", description: "", images: [], video: { url: "" }, pricing: [{ label: "Adult", type: "per_person", price: 0, currency: "AED" }], includes: [], excludes: [], addons: [], highlights: [], discount: { percentage: null, label: "" }, isActive: true }],
  availableDates: [], timeSlots: [{ startTime: "04:00 PM", isAvailable: true }],
  itinerary: [], highlights: [], includes: [], excludes: [], addons: [], notSuitableFor: [], importantInfo: [], isActive: true,
  bbqBuffet: null, privateSUV: null
};

const safeStr = (val) => typeof val === "string" ? val : val != null ? String(val) : "";
const safeArr = (val) => (Array.isArray(val) ? val.filter((v) => v != null) : []);
const safeNum = (val) => (isNaN(Number(val)) ? 0 : Number(val));

function urlToImageObj(val) {
  if (!val) return { file: null, preview: null, isExisting: false };
  const url = typeof val === "string" ? val : val?.secure_url || val?.url || val?.preview || "";
  const publicId = val?.public_id || val?.publicId || url.split("/").pop() || "image";
  if (!url) return { file: null, preview: null, isExisting: false };
  return { preview: url, url: url, secure_url: url, public_id: publicId, file: null, isExisting: true, name: publicId };
}

function safeItineraryItem(raw = {}) {
  const obj = typeof raw === "object" && raw !== null ? raw : {};
  return { time: safeStr(obj.time), title: safeStr(obj.title || raw), description: safeStr(obj.description) };
}

export default function CreateActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicateId");

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [visitedTabs, setVisitedTabs] = useState(new Set(["basic"]));
  const [formErrors, setFormErrors] = useState([]); 

  const [createActivity, { isLoading: isSaving }] = useCreateActivityMutation();
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [categories, setCategories] = useState([]);

  const { data: duplicateActivityData, isLoading: isFetchingDuplicate } = useGetActivityByIdQuery(duplicateId, { skip: !duplicateId });

  useEffect(() => {
    if (categoriesData?.data) setCategories(categoriesData.data);
  }, [categoriesData]);

  // ─── 100% EXACT DATA MAPPER ─────────────────────────────────────────
  useEffect(() => {
    if (!duplicateActivityData?.data) return;
    const act = duplicateActivityData.data;

    let mappedImages = safeArr(act.Images).map(urlToImageObj).filter(img => img.isExisting);
    while (mappedImages.length < 10) mappedImages.push({ file: null, preview: null, isExisting: false });
    mappedImages = mappedImages.slice(0, 10);

    // FIXED VIDEO MAPPING FOR DUPLICATION
    const existingVideoUrl = act.Video?.secure_url || act.Video?.url || "";
    const existingVideoPubId = act.Video?.public_id || act.Video?.publicId || "";
    const mappedVideo = { file: null, url: existingVideoUrl, preview: existingVideoUrl, public_id: existingVideoPubId, isExisting: !!existingVideoUrl };

    const mappedItinerary = safeArr(act.Itinerary).map(safeItineraryItem);

    const formatTime = (t) => { if(typeof t !== 'string') return "10:00 AM"; return t.trim().toUpperCase(); };
    const mappedTimeSlots = safeArr(act.timeSlots).length > 0 ? act.timeSlots.map((slot) => typeof slot === "string" ? { startTime: formatTime(slot), isAvailable: true } : { startTime: formatTime(slot?.startTime), isAvailable: slot?.isAvailable !== false }) : initialFormData.timeSlots;

    const mappedVariants = safeArr(act.packages).length > 0 ? act.packages.map((pkg) => ({ name: safeStr(pkg.name), description: safeStr(pkg.description), images: [], video: { url: "" }, pricing: safeArr(pkg.bookingFields).length > 0 ? pkg.bookingFields.map((bf) => ({ label: safeStr(bf.name) || "Adult", type: "per_person", price: safeNum(bf.price), currency: "AED", unit: bf.unit || "quantity", min: bf.min || 1, max: bf.max || 99, duration: bf.duration || null,seat: bf.seat || 0 })) : [{ label: "Adult", type: "per_person", price: safeNum(pkg.price), currency: "AED" }], includes: safeArr(pkg.whatInclude), excludes: safeArr(pkg.whatExclude), addons: safeArr(pkg.addons), highlights: [], discount: { percentage: null, label: "" }, isActive: pkg.isActive !== false })) : initialFormData.variants;

    const getSafeId = (val) => val?.$oid || val?._id || val;

    setFormData({
      ...initialFormData,
      title: act.name ? `${act.name} (Copy)` : "New Activity (Copy)",
      shortDescription: safeStr(act.Experience?.note),
      fullDescription: safeStr(act.Experience?.description),
      category: getSafeId(act.categoryId) || "",
      location: getSafeId(act.placeId) || "",
      
      images: mappedImages,
      video: mappedVideo,
      
      // Preserving exact Experience Details
      experienceTitle: safeStr(act.Experience?.title),
      highlights: safeArr(act.Experience?.highlights),
      
      // Preserving exact Logistics Details
      importantInfo: safeArr(act.InfoAndLogistics?.keyInfo),
      essentialGuide: safeArr(act.InfoAndLogistics?.essentialGuide),
      pickupNote: safeStr(act.InfoAndLogistics?.pickupZone?.note),
      mapLink: safeStr(act.InfoAndLogistics?.pickupZone?.mapLink),
      pickup: { ...initialFormData.pickup, description: safeStr(act.InfoAndLogistics?.pickupZone?.description) },
      
      includes: safeArr(act.includes),
      excludes: safeArr(act.excludes),
      notSuitableFor: safeArr(act.notSuitableFor),
      timeSlots: mappedTimeSlots.length > 0 ? mappedTimeSlots : initialFormData.timeSlots, // Fallback protection
      itinerary: mappedItinerary,
      variants: mappedVariants,
      bbqBuffet: act.BBQ_BUFFET || null,
      privateSUV: act.PrivateSUV || null,
      isActive: true,
    });
    setVisitedTabs(new Set(TABS_LIST));
  }, [duplicateActivityData]);


  // ─── PAYLOAD BUILDER ──────────────────────────────────────────────────
  const buildFormDataPayload = useCallback(() => {
    const fd = new FormData();
    
    // Basic Info
    fd.append("name", formData.title || "");             
    fd.append("categoryId", formData.category || "");    
    fd.append("placeId", formData.location || "");       
    fd.append("isActive", formData.isActive);

    // FIXED EXPERIENCE (Keeping Original Title if available)
    fd.append("Experience", JSON.stringify({
      title: formData.experienceTitle || formData.title || "Activity Experience",
      note: formData.shortDescription || "",
      description: formData.fullDescription || "",
      highlights: formData.highlights || []
    }));

    // FIXED LOGISTICS (Keeping Note and MapLink separate)
    fd.append("InfoAndLogistics", JSON.stringify({
      pickupZone: { 
        description: formData.pickup?.description || "",
        note: formData.pickupNote || "",
        mapLink: formData.mapLink || ""
      },
      keyInfo: formData.importantInfo || [],
      essentialGuide: formData.essentialGuide || []
    }));

    // Formatting Time Slots
    const timeSlotsArray = formData.timeSlots.map(ts => ts.startTime).filter(Boolean);
    fd.append("timeSlots", JSON.stringify(timeSlotsArray));

    // Itinerary
    const itineraryArray = formData.itinerary.map(item => ({ time: item.time || "", title: item.title || "", description: item.description || "" }));
    fd.append("Itinerary", JSON.stringify(itineraryArray));

    // Packages & Root Arrays
    fd.append("packages", JSON.stringify(formData.variants || []));  
// fd.append("packageCount", formData.variants?.length || 0);
    fd.append("includes", JSON.stringify(formData.includes || []));
    fd.append("excludes", JSON.stringify(formData.excludes || []));
    fd.append("notSuitableFor", JSON.stringify(formData.notSuitableFor || []));
    
    // Addons
    if(formData.bbqBuffet) fd.append("BBQ_BUFFET", JSON.stringify(formData.bbqBuffet));
    if(formData.privateSUV) fd.append("PrivateSUV", JSON.stringify(formData.privateSUV));

    // ----- MEDIA FIX (IMAGES) -----
    const existingImagesData = formData.images
      .filter(img => img.isExisting && img.secure_url)
      .map(img => ({ secure_url: img.secure_url, public_id: img.public_id || "image" }));
    if(existingImagesData.length > 0) fd.append("existingImages", JSON.stringify(existingImagesData));

    formData.images.forEach((img, i) => {
      if (img?.file instanceof File) fd.append("images", img.file, `image-${i + 1}.${img.file.name?.split(".").pop() || 'jpg'}`);
    });

    // ----- VIDEO FIX (KEY FOR BACKEND) -----
    if (formData.video?.file instanceof File) {
      fd.append("video", formData.video.file); // User uploaded new video
    } else if (formData.video?.isExisting && formData.video?.url) {
      // Backend expects "existingVideo" as JSON String !
      fd.append("existingVideo", JSON.stringify({ 
        secure_url: formData.video.url, 
        public_id: formData.video.public_id || "video" 
      }));
    }
    
    return fd;
  }, [formData]);


  const translateBackendErrors = (err) => {
    if (err?.data?.errors && Array.isArray(err.data.errors)) {
      const errorMap = { "name": "Activity Title", "categoryId": "Category Selection", "placeId": "Location Selection", "timeSlots": "Time Slots" };
      return err.data.errors.map(e => `${errorMap[e.path] || e.path}: ${e.msg}`);
    }
    if (err?.data?.message) return [err.data.message];
    if (err?.error) return [err.error];
    return ["An unknown server error occurred."];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]); 

    if (!formData.title || !formData.category || !formData.location) {
      setFormErrors(["Basic Info: Please ensure Title, Category, and Location are fully selected."]);
      setActiveTab("basic");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (formData.category.length < 20 || formData.location.length < 20) {
      setFormErrors(["Basic Info: Category or Location is invalid. Please select from the dropdown."]);
      setActiveTab("basic"); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
    }

    try {
      await createActivity(buildFormDataPayload()).unwrap();
      alert(duplicateId ? "Activity duplicated successfully!" : "Activity created successfully!");
      router.push("/admin/activities");
    } catch (err) {
      console.error("Backend Rejected:", err);
      setFormErrors(translateBackendErrors(err));
      
      const errStr = JSON.stringify(err).toLowerCase();
      if (errStr.includes("name") || errStr.includes("categoryid") || errStr.includes("placeid") || errStr.includes("experience")) setActiveTab("basic");
      else if (errStr.includes("image") || errStr.includes("video")) setActiveTab("images");
      else if (errStr.includes("time") || errStr.includes("slot")) setActiveTab("availability");
      else if (errStr.includes("itinerary")) setActiveTab("itinerary");

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => { if (confirm("Discard all changes?")) router.push("/admin/activities"); };
  const goToTab = (tab) => { setFormErrors([]); setVisitedTabs((prev) => new Set([...prev, activeTab, tab])); setActiveTab(tab); };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic": return <BasicInfoSection categories={categories} formData={formData} setFormData={setFormData} />;
      case "images": return <ImagesSection formData={formData} setFormData={setFormData} />;
      case "details": return <DetailsSection formData={formData} setFormData={setFormData} />;
      case "availability": return <AvailabilitySection formData={formData} setFormData={setFormData} />;
      case "itinerary": return <ItinerarySection formData={formData} setFormData={setFormData} />;
      case "inclusions": return <InclusionsSection formData={formData} setFormData={setFormData} />;
      case "restrictions": return <RestrictionsSection formData={formData} setFormData={setFormData} />;
      default: return null;
    }
  };

  if (duplicateId && isFetchingDuplicate) return ( <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading Duplicate Data...</p></div> );

  const currentTabIndex = TABS_LIST.indexOf(activeTab);
  const isLastTab = currentTabIndex === TABS_LIST.length - 1;
  const progressPct = Math.round(((currentTabIndex + 1) / TABS_LIST.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button onClick={handleCancel} type="button" className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 leading-none mb-0.5">Activities <span className="mx-1">/</span> {duplicateId ? "Duplicate" : "Create"}</p>
                <h1 className="text-sm font-semibold text-gray-900 truncate leading-tight">{duplicateId ? `Duplicating: ${formData.title || "…"}` : "Create New Activity"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 rounded-lg px-2.5 py-1.5 whitespace-nowrap">
                Step <strong className="text-gray-800 ml-0.5">{currentTabIndex + 1}</strong>
                <span className="text-gray-300 mx-0.5">/</span>{TABS_LIST.length}
                <span className="hidden md:inline ml-1 text-gray-400">· {TAB_LABELS[activeTab]}</span>
              </span>
            </div>
          </div>
          <div className="h-0.5 bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </header>

      <div className="sticky top-[65px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ActivityTabs activeTab={activeTab} setActiveTab={goToTab} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {formErrors.length > 0 && (
          <div className="mb-6 p-5 rounded-xl bg-red-50 border border-red-200 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-red-900 mb-1">Please fix these issues:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {formErrors.map((err, i) => <li key={i} className="text-sm font-medium text-red-700">{err}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">{renderTabContent()}</div>
            
            <div className="border-t border-gray-100 bg-gray-50/60 px-6 sm:px-8 py-4 flex items-center justify-between">
              <button type="button" onClick={handleCancel} className="px-4 py-2.5 text-sm text-gray-500 font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all">Cancel</button>
              
              <div className="flex items-center gap-3">
                {TABS_LIST.indexOf(activeTab) > 0 && (
                  <button type="button" onClick={() => goToTab(TABS_LIST[TABS_LIST.indexOf(activeTab) - 1])} className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Back</button>
                )}

                {TABS_LIST.indexOf(activeTab) < TABS_LIST.length - 1 ? (
                  <button type="button" onClick={() => goToTab(TABS_LIST[TABS_LIST.indexOf(activeTab) + 1])} className="flex items-center gap-2 px-5 py-2.5 text-sm bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700">Next</button>
                ) : (
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700">
                    {isSaving ? "Saving…" : "Create Activity"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}