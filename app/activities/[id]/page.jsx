"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetActivityByIdQuery } from "@/features/activity/activityApi.js";
import { useCreateBookingMutation } from "@/features/booking/bookApi.js";
import ReviewModal from "@/components/Review/ReviewModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  Clock,
  Users,
  Calendar,
  Check,
  ChevronRight,
  Home,
  Star,
  ShieldCheck,
  AlertCircle,
  Info,
  Car,
  Camera,
  Map as MapIcon,
  ChevronDown,
  Loader2,
  X,
  Zap,
  Award,
  Globe,
  Ticket,
  Crown,
  Anchor,
  Truck,
  CheckCircle2,
  MapPin,
  Clock3,
  ThumbsUp,
  MessageSquare,
  HelpCircle,
  Train,
  Wifi,
  Navigation,
  LayoutGrid,
  ArrowRight,
  CreditCard,
  User 
} from "lucide-react";
import ActivityReviews from "@/components/Review/ActivityReviews";

export default function ActivityDetailPage() {
  const fallbackHighlights =[
    "Experience breathtaking 360-degree views of Dubai",
    "Ride the world's fastest multimedia elevators",
    "Explore levels at your leisure",
    "Access to high-powered telescopes for closer views",
    "Private SUV Transfer (1 x 6-Seater Vehicle) included",
  ];

  const fallbackIncludes =[
    "Instant E-Ticket Delivery",
    "Access to Level 124 & 125",
    "Use of High-Powered Telescopes",
    "Free WiFi at the Attraction",
  ];

  const fallbackExcludes =[
    "Fast Track / Priority Lane",
    "Level 148 Access",
    "Hotel Pickup",
  ];

  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const { data, isLoading, isError } = useGetActivityByIdQuery(id, { skip: !id });
  const activity = data?.data;

  const PAGE_TABS = useMemo(() => {
    if (!activity) return[];
    const tabs =[];
    if (activity.Experience) tabs.push({ key: "experience", label: "EXPERIENCE" });
    if (activity.Itinerary?.length) tabs.push({ key: "itinerary", label: "ITINERARY" });
    if (activity.InfoAndLogistics) tabs.push({ key: "logistics", label: "INFO & LOGISTICS" });
    if (activity.BBQ_BUFFET) tabs.push({ key: "bbq_buffet", label: "BBQ BUFFET" });
    if (activity.PrivateSUV?.available) tabs.push({ key: "private_suv", label: "PRIVATE SUV" });
    tabs.push({ key: "reviews", label: "REVIEWS" });
    return tabs;
  }, [activity]);

  const[createBooking, { isLoading: isBooking, error: bookingError }] = useCreateBookingMutation();

  const[selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const[transferType, setTransferType] = useState("self");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const[quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState("experience");
  const[selectedDate, setSelectedDate] = useState("");
  const[bookingStep, setBookingStep] = useState(1);
  const [isVariantExpanded, setIsVariantExpanded] = useState(true);

  // ─── SUV QUANTITY STATE (user-controlled) ────────────────────────────────
  const [suvQty, setSuvQty] = useState(1);

  const dateInputRef = useRef(null);
  const contentRef = useRef(null);

  const selectedPackage = activity?.packages?.[selectedPackageIndex] || activity?.packages?.[0];
  const isVIP = selectedPackage?.name?.toLowerCase().includes("vip");
  const isSUV = transferType === "suv";

  // ─── BUGGY VS YACHT DETECTION LOGIC ──────────────────────────────────────
  const isBuggyPkg = useMemo(() => {
    const pkgName = selectedPackage?.name?.toLowerCase() || "";
    return pkgName.includes('seater') || pkgName.includes('buggy') || pkgName.includes('polaris') || pkgName.includes('can-am');
  }, [selectedPackage]);

  const isYachtActivity = useMemo(() => {
    if (isBuggyPkg) return false; // Prevent Buggies from accidentally triggering yacht logic
    return selectedPackage?.bookingFields?.some(f => {
      const n = f.name.toLowerCase();
      return n.includes('duration') || n.includes('yacht') || n.includes('yatch') || n.includes('vessel') || n.includes('no of') || n.includes('number of');
    });
  }, [selectedPackage, isBuggyPkg]);

  const durationField = selectedPackage?.bookingFields?.find(f => f.name.toLowerCase().includes('duration'));
  const yachtField = selectedPackage?.bookingFields?.find(f => {
    const n = f.name.toLowerCase();
    return n.includes('yacht') || n.includes('yatch') || n.includes('vessel') || n.includes('no of') || n.includes('number of');
  });

  const durationQtyHours = durationField ? (quantities[durationField._id] || durationField.min || 1) : 1;
  const yachtQty = yachtField ? (quantities[yachtField._id] || yachtField.min || 1) : 1;

  // ─── PRICING LOGIC (Standard vs Yacht) ──────────────────────────────────
  const baseTotalAmount = useMemo(() => {
    if (!selectedPackage?.bookingFields) return 0;
    
    if (isYachtActivity) {
      const rate = durationField?.price || yachtField?.price || selectedPackage.price || 0;
      return durationQtyHours * yachtQty * rate;
    }

    return selectedPackage.bookingFields.reduce((acc, field) => {
      return acc + (field.price || 0) * (quantities[field._id] || 0);
    }, 0);
  },[selectedPackage, quantities, isYachtActivity, durationQtyHours, yachtQty, durationField, yachtField]);

  const totalQty = useMemo(() => {
    return Object.values(quantities).reduce((a, b) => a + b, 0);
  },[quantities]);

  const suvAddonPrice = activity?.PrivateSUV?.fee || 500;
  const suvTotalAddonPrice = suvAddonPrice * suvQty;
  const displayPrice = isSUV ? baseTotalAmount + suvTotalAddonPrice : baseTotalAmount;

  // ─── EXACT BUGGY & SUV AUTO-CALCULATION ──────────────────────────────────
  useEffect(() => {
    if (isSUV) {
      const suvCapacity =
        activity?.PrivateSUV?.seat && activity?.PrivateSUV?.seat !== 0
          ? activity.PrivateSUV.seat
          : 6;

      let autoCount = 1;

    if (isYachtActivity && yachtQty > 0) {
      const yachtCapacity = selectedPackage.bookingFields.find(
  (field) => field.unit === "quantity"
)?.seat;
      console.log(selectedPackage , "yathc")
      autoCount = Math.ceil((yachtQty * yachtCapacity) / suvCapacity);
    } else {
      autoCount = Math.ceil(totalQty / suvCapacity) || 1;
    }
console.log("autoCount",autoCount)
    setSuvQty(Math.max(1, autoCount));
  }
}, [transferType, yachtQty, totalQty, isYachtActivity, activity]);

  // Initialize Quantities
  useEffect(() => {
    if (!activity?.packages?.length) return;
    const pkg = activity.packages[selectedPackageIndex];
    const initialQty = {};
    pkg.bookingFields?.forEach((f) => {
      const lowerName = f.name.toLowerCase();
      if (lowerName.includes('duration')) {
        initialQty[f._id] = f.min ? f.min / 60 : 1;
      } else {
        initialQty[f._id] = f.min || 0;
      }
    });
    setQuantities(initialQty);
  }, [selectedPackageIndex, activity]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    if (activity?.timeSlots?.length > 0) {
      setSelectedTimeSlot(activity.timeSlots[0]);
    }
  },[activity]);

  if (isLoading) return <LoadingSpinner size={80} color="border-blue-600" className="py-40" />;
  if (isError || !activity) return <div className="min-h-screen flex items-center justify-center text-red-600">Activity not found</div>;

  const images = activity?.Images?.map((img) => ({ url: img.url || img.secure_url })) ||[];
  const video = activity?.Video?.secure_url || null;

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => {
      const field = selectedPackage?.bookingFields?.find(f => f._id === id);
      const lowerName = field?.name?.toLowerCase() || '';
      const isDurationField = lowerName.includes('duration');
      const currentQty = prev[id] || 0;

      let min, max;
      if (isDurationField) {
        min = field?.min ? field.min / 60 : 0.5;
        max = field?.max ? field.max / 60 : 24;
      } else {
        min = field?.min || 0;
        max = field?.max || 20;
      }

      const newQty = Math.max(min, Math.min(max, currentQty + delta));
      return { ...prev, [id]: Math.round(newQty * 10) / 10 };
    });
  };

  const handleVariantClick = (index) => {
    if (selectedPackageIndex === index) {
      setIsVariantExpanded(!isVariantExpanded);
    } else {
      setSelectedPackageIndex(index);
      setIsVariantExpanded(true);
    }
  };

  const canBook = (isYachtActivity ? (durationQtyHours > 0 && yachtQty > 0) : totalQty > 0) && selectedTimeSlot && selectedDate;

  const handleProceedToCheckout = () => {
    if (!canBook) return;
    setBookingStep(3);
  };

  const handleFinalSubmit = async (formData, selectedAddonsData) => {
    try {
      const formattedParticipants = selectedPackage.bookingFields
        .filter((f) => (quantities[f._id] || 0) > 0)
        .map((f) => {
          const lowerName = f.name.toLowerCase();
          const isDurationField = lowerName.includes('duration');
          return {
            label: f.name || f.label,
            quantity: isDurationField ? quantities[f._id] * 60 : quantities[f._id],
            price: f.price,
          };
        });

      let finalAddons = isSUV ?[{ name: "Private SUV", price: suvAddonPrice, quantity: suvQty }] : [];
      finalAddons =[...finalAddons, ...selectedAddonsData];

      const bookingPayload = {
        activityId: activity._id,
        variantName: selectedPackage.name,
        date: new Date(selectedDate).toISOString(),
        timeSlot: selectedTimeSlot,
        participants: formattedParticipants,
        addons: finalAddons,
        customerDetails: formData 
      };

      const result = await createBooking(bookingPayload).unwrap();
      if (result.success) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      console.error("Booking Failed:", err);
      alert(err?.data?.message || "Something went wrong while booking.");
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const activeHighlights = isSUV
    ? (activity.highlights?.length ?[...activity.highlights.slice(0, 4), "Private SUV Transfer included"] : fallbackHighlights)
    : (activity.highlights?.length ? activity.highlights : fallbackHighlights);

  const includeList = selectedPackage?.whatInclude?.length > 0 ? selectedPackage.whatInclude : fallbackIncludes;
  const excludeList = selectedPackage?.whatExclude?.length > 0 ? selectedPackage.whatExclude : fallbackExcludes;
  const rating = activity?.rating ?? 4.8;
  const title = activity?.name || "Activity Details";

  if (bookingStep === 3) {
    return (
      <CheckoutView 
        activity={activity}
        selectedPackage={selectedPackage}
        transferType={transferType}
        totalQty={totalQty}
        selectedTimeSlot={selectedTimeSlot}
        displayPrice={displayPrice}
        baseTotalAmount={baseTotalAmount}
        isSUV={isSUV}
        suvQty={suvQty}
        suvTotalAddonPrice={suvTotalAddonPrice}
        setBookingStep={setBookingStep}
        handleFinalSubmit={handleFinalSubmit}
        isBooking={isBooking}
        isYachtActivity={isYachtActivity}
        durationQtyHours={durationQtyHours}
        yachtQty={yachtQty}
        selectedDate={selectedDate} 
        quantities={quantities} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 p-4">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="bg-gray-60/10 border-b border-t border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 py-2.5 flex items-center text-xs text-gray-500 gap-1.5 overflow-x-auto whitespace-nowrap">
          <Home className="w-2.5 h-2.5 text-gray-400 shrink-0" />
          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
          <span className="hover:text-blue-600 cursor-pointer text-sm transition-colors">Home</span>
          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
          <span className="text-black font-bold text-[13px] tracking-widest truncate">{activity.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-2 md:py-4">
        {/* ── Title + Rating ────────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black leading-tight mb-2">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800">{rating}</span>
            <span className="px-4 py-0.5 bg-blue-50 text-blue-900 text-[13px] font-semibold rounded-b border border-blue-100 flex items-center gap-1">
              <ShieldCheck size={11} /> Official Ticket
            </span>
          </div>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-10">
          <div className="min-w-0">
            {/* ── Image Gallery ──────────────────────────────────────────── */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-60 sm:h-90 md:h-110 rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer">
                <img src={images?.[0]?.url || "/placeholder.jpg"} alt="Main" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="relative group overflow-hidden cursor-pointer">
                  {idx === 2 && video ? (
                    <video className="w-full h-full object-cover" muted loop playsInline autoPlay>
                      <source src={video} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={images?.[idx]?.url || images?.[0]?.url || "/placeholder.jpg"} alt={`Gallery ${idx + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
              ))}
              <div className="relative group overflow-hidden cursor-pointer">
                <img src={images?.[4]?.url || images?.[0]?.url || "/placeholder.jpg"} alt="Gallery 5" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {images?.length > 5 && (
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-end p-2">
                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
                      <Camera size={11} /> +{images.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Page Tabs ───────────────────────────── */}
            <div ref={contentRef} className="border-b border-gray-200 overflow-x-auto mt-8 scroll-mt-20">
              <div className="flex whitespace-nowrap">
                {PAGE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`px-5 py-4 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 ${
                      activeTab === tab.key
                        ? isVIP ? "border-red-600 text-red-600" : "border-blue-700 text-blue-700"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-7">
              {activeTab === "experience" && (
                <div className="space-y-8">
                  <div className={`border-l-4 pl-4 py-0.5 ${isVIP ? "border-red-600" : "border-blue-700"}`}>
                    <p className="text-[22px] font-bold text-gray-900 leading-snug">{activity.Experience?.title}</p>
                    <p className="text-md text-gray-500 mt-1">{activity.Experience?.note}</p>
                  </div>

                  <div>
                    <h2 className="text-[18px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-yellow-400 text-sm">✦</span> Highlights
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
                      {activeHighlights?.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-[17px] text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.75 shrink-0" /> {h}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-[20px] border overflow-hidden ${isVIP ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}`}>
                    <div className="grid md:grid-cols-2 ">
                      <div className="p-8">
                        <h4 className={`font-bold mb-5 text-[12px] uppercase tracking-wider ${isVIP ? "text-red-600" : "text-blue-900"}`}>WHAT'S INCLUDED</h4>
                        <ul className="space-y-4">
                          {includeList.map((inc, i) => (
                            <li key={i} className="text-[16px] flex items-center gap-3 text-gray-700">
                              <Check size={16} className="text-green-500 shrink-0" /> {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-8">
                        <h4 className={`font-bold mb-5 text-[12px] uppercase tracking-wider ${isVIP ? "text-red-600" : "text-blue-900"}`}>WHAT'S EXCLUDED</h4>
                        <ul className="space-y-4">
                          {excludeList.map((exc, i) => (
                            <li key={i} className="text-[16px] text-gray-600 flex items-center gap-3">
                              <X size={16} className="text-red-400 shrink-0" /> {exc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[22px] font-bold text-black mb-2">About this Entry</h2>
                    <p className="text-[15px] text-gray-600 leading-relaxed">{activity.Experience?.description}</p>
                  </div>

                  <PackagesSection activity={activity} selectedPackageIndex={selectedPackageIndex} isVariantExpanded={isVariantExpanded} handleVariantClick={handleVariantClick} />
                </div>
              )}

              {activeTab === "itinerary" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 my-6">Visit Timeline</h2>
                  <div className="space-y-12">
                    {activity?.Itinerary?.map((stop, idx) => (
                      <div key={stop._id || idx} className="flex gap-6">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          {idx < activity.Itinerary.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                        </div>
                        <div className="flex-1 pb-20 last:pb-0 flex gap-4">
                          <div className="flex-1">
                            <span className="text-[9px] bg-gray-200 p-[1px] font-black text-gray-400 uppercase tracking-widest">{stop.time}</span>
                            <h4 className="text-[18px] font-extrabold text-900 mt-0.5 mb-0.5">{stop.title}</h4>
                            <p className="text-[13px] text-gray-500 font-bold">{stop.description}</p>
                          </div>
                          <div className="w-18 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <img src={stop?.image || "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=200"} alt={stop?.title || "image"} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "logistics" && (
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-[#EBF0F5] rounded-[24px] p-6 sm:p-8 bg-[#F8FAFC]">
                      <div className="flex items-center gap-2.5 mb-4">
                        <MapPin size={18} className="text-[#004bb5]" />
                        <h3 className="font-black text-[#111827] text-[17px]">Entry Point</h3>
                      </div>
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                        {activity?.InfoAndLogistics?.pickupZone?.description || "The main entrance is via Dubai Mall, Lower Ground floor. Follow the signage for 'At The Top'."}
                      </p>
                      {activity?.InfoAndLogistics?.pickupZone?.mapLink ? (
                        <a href={activity.InfoAndLogistics.pickupZone.mapLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest hover:text-[#004bb5] transition-colors">
                          <Train size={14} className="text-[#9ca3af]"/> VIEW ON MAP
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest">
                          <Train size={14} className="text-[#9ca3af]"/> METRO ACCESSIBLE
                        </div>
                      )}
                    </div>
                    <div className="border border-[#EBF0F5] rounded-[24px] p-6 sm:p-8 bg-[#F8FAFC]">
                      <div className="flex items-center gap-2.5 mb-4">
                        <Clock3 size={18} className="text-[#004bb5]" />
                        <h3 className="font-black text-[#111827] text-[17px]">Key Info</h3>
                      </div>
                      <ul className="space-y-3.5">
                        {(activity?.InfoAndLogistics?.keyInfo?.length > 0 
                          ? activity.InfoAndLogistics.keyInfo 
                          :["Arrive 15 mins before slot.", "Entry is only for your slot.", "E-Tickets sent via WhatsApp."]).map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[14px] font-medium text-gray-600">
                            <CheckCircle2 size={16} className="text-[#004bb5] mt-0.5 shrink-0" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h2 className="text-[22px] font-black text-[#111827] mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {[
                        { q: "Is the ticket price per person?", a: "Yes, the ticket price listed is per person for entry to the observation decks." },
                        { q: "Can I cancel or reschedule?", a: "Rescheduling is free up to 24 hours before your slot. Cancellations are subject to terms." },
                        { q: "What is the best time to visit?", a: "Sunset slots (4:00 PM - 6:00 PM) are the most popular for breathtaking golden hour views." }
                      ].map((faq, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-[16px] p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
                          <div className="flex items-start gap-3.5">
                            <MessageSquare size={18} className="text-[#004bb5] mt-0.5 shrink-0" />
                            <div>
                              <h4 className="text-[15px] font-black text-[#111827]">{faq.q}</h4>
                              <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activity?.InfoAndLogistics?.essentialGuide?.length > 0 && (
                    <div className="pt-6">
                      <h3 className="text-[18px] font-black text-[#111827] mb-4">Essential Guide</h3>
                      <div className="space-y-3">
                        {activity.InfoAndLogistics.essentialGuide.map((info, i) => (
                          <div key={i} className="flex gap-3 text-[14px] text-gray-600 bg-[#F9FAFB] p-4 rounded-[16px] border border-gray-100">
                            <span className="text-[#004bb5] font-bold shrink-0">•</span> {info}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "reviews" && <ReviewsSection activity={activity} />}

              {activeTab === "bbq_buffet" && (
                <div className="space-y-8">
                  <div className={`border-l-4 pl-4 py-0.5 ${isVIP ? "border-red-600" : "border-blue-700"}`}>
                    <p className="text-md font-bold text-gray-900 leading-snug">{activity.BBQ_BUFFET?.title}</p>
                    <p className="text-[15px] text-gray-500 mt-1">{activity.BBQ_BUFFET?.description}</p>
                  </div>
                  <div className="space-y-6">
                    {activity.BBQ_BUFFET?.fields?.map((field, i) => (
                      <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h4 className={`font-black mb-3 text-[12px] uppercase tracking-widest ${isVIP ? "text-red-600" : "text-blue-700"}`}>{field.category}</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {field.items?.map((item, idx) => (
                            <li key={idx} className="text-[14px] text-gray-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "private_suv" && activity.PrivateSUV?.available && (
                <div className="space-y-8">
                  <div className={`border-l-4 pl-4 py-0.5 ${isVIP ? "border-red-600" : "border-blue-700"}`}>
                    <p className="text-base font-bold text-gray-900 leading-snug">Private SUV Transfer</p>
                    <p className="text-sm text-gray-500 mt-1">Travel in comfort with a private luxury SUV.</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex justify-between text-[15px] text-gray-700 mb-2">
                      <span className="font-semibold">Model</span>
                      <span>{activity.PrivateSUV?.model || "Luxury SUV"}</span>
                    </div>
                    <div className="flex justify-between text-[12px] text-gray-700">
                      <span className="font-semibold">Transfer Fee</span>
                      <span className="font-bold text-gray-900">${activity.PrivateSUV?.fee}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28 self-start">
              <BookingCard
                baseTotalAmount={baseTotalAmount}
                displayPrice={displayPrice}
                totalQty={totalQty}
                transferType={transferType}
                setTransferType={setTransferType}
                selectedPackageIndex={selectedPackageIndex}
                setSelectedPackageIndex={setSelectedPackageIndex}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateInputRef={dateInputRef}
                activity={activity}
                selectedPackage={selectedPackage}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                quantities={quantities}
                updateQuantity={updateQuantity}
                canBook={canBook}
                handleProceedToCheckout={handleProceedToCheckout}
                isSUV={isSUV}
                suvQty={suvQty}
                setSuvQty={setSuvQty}
                suvAddonPrice={suvAddonPrice}
                suvTotalAddonPrice={suvTotalAddonPrice}
                isVIP={isVIP}
                onTabClick={handleTabClick}
                activeTab={activeTab}
                bookingStep={bookingStep}
                setBookingStep={setBookingStep}
                isYachtActivity={isYachtActivity}
                durationQtyHours={durationQtyHours}
                yachtQty={yachtQty}
              />
            </div>
          </div>
        </div>

        {activeTab === "reviews" && (
          <div className="mt-10 pb-20 lg:pb-10">
            <ActivityReviews activityId={activity._id} />
          </div>
        )}
      </main>

      {/* MOBILE FLOATING BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="shrink-0">
          <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Total</div>
          <div className="text-xl font-black text-blue-700">
            ${displayPrice || "0"}
            <span className="text-xs text-gray-400 font-normal ml-1">AED</span>
          </div>
        </div>
        <button
          onClick={() => setBookingStep(2)}
          className={`flex-1 py-3.5 rounded-full font-black text-white text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            canBook ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canBook}
        >
          {canBook ? "Book Now" : "Select Options"} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function PackagesSection({ activity, selectedPackageIndex, isVariantExpanded, handleVariantClick }) {
  if (!activity?.packages?.length) return null;
  return (
    <div id="packages">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Choose Your Package</h2>
      <p className="text-sm text-gray-400 mb-4">Select the experience that suits you best</p>
      <div className="space-y-3">
        {activity.packages.map((pkg, i) => {
          const isSelected = i === selectedPackageIndex;
          const isExpanded = isSelected && isVariantExpanded;
          return (
            <div
              key={pkg._id}
              onClick={() => handleVariantClick(i)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected ? "border-blue-700 bg-blue-50/20 shadow-md shadow-blue-100" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-blue-700 bg-blue-50" : "border-gray-300"}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-blue-700 rounded-full" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${isSelected ? "text-blue-900" : "text-gray-800"}`}>{pkg.name}</span>
                    </div>
                    {!isExpanded && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{pkg.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isExpanded && <span className="text-sm font-bold text-gray-800">{pkg.price} AED</span>}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-blue-700" : ""}`} />
                </div>
              </div>
              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-4 pb-5 pt-0 border-t border-gray-100 mx-4 mt-1">
                    <p className="text-sm text-gray-500 my-3 leading-relaxed">{pkg.description}</p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Select Travellers</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {pkg.bookingFields?.map((p) => (
                          <div key={p._id} className="flex justify-between items-center bg-white px-3 py-2.5 rounded-lg border border-gray-100 shadow-sm">
                            <span className="text-sm text-gray-700">{p.name}</span>
                            <span className="font-bold text-blue-700 text-sm">{p.price} <span className="text-[10px] text-gray-400 font-normal">AED</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {pkg.whatInclude && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pkg.whatInclude.map((inc, idx) => (
                          <span key={idx} className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-green-100">
                            <Check size={11} /> {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewsSection({ activity }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-4xl font-black text-gray-900">{activity.rating || "4.8"}</div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
          </div>
          <div className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mt-1">Based on {activity.reviewCount || "45000"} reviews</div>
        </div>
        <button onClick={() => setIsReviewOpen(true)} className="px-8 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors">Write a Review</button>
        {isReviewOpen && <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} activityId={activity?._id} />}
      </div>
    </div>
  );
}

function BookingCard({
  baseTotalAmount,
  displayPrice,
  totalQty,
  transferType,
  setTransferType,
  selectedPackageIndex,
  setSelectedPackageIndex,
  selectedDate,
  setSelectedDate,
  dateInputRef,
  activity,
  selectedPackage,
  selectedTimeSlot,
  setSelectedTimeSlot,
  quantities,
  updateQuantity,
  canBook,
  handleProceedToCheckout,
  isSUV,
  suvQty,
  setSuvQty,
  suvAddonPrice,
  suvTotalAddonPrice,
  isVIP,
  onTabClick,
  activeTab,
  bookingStep,
  setBookingStep,
  isYachtActivity,
  durationQtyHours,
  yachtQty
}) {
  const fallbackTimes =["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];
  const timeSlots = activity?.timeSlots?.length > 0 ? activity.timeSlots : fallbackTimes;

  const guestTypes = selectedPackage?.bookingFields?.length > 0
    ? selectedPackage.bookingFields
    :[{ _id: "adult", name: "Adults", price: 65, min: 1, max: 20 }, { _id: "child", name: "Children", price: 45, min: 0, max: 20 }];

  const isBuggyActivity = activity?.packages?.some(p => {
    const n = p.name.toLowerCase();
    return n.includes('seater') || n.includes('buggy') || n.includes('polaris') || n.includes('can-am');
  });

  const sectionLabel = isBuggyActivity ? "MACHINE TYPE" : "TICKET TIER";
  const SectionIcon = isBuggyActivity ? Car : LayoutGrid;
  const btnNextText = isBuggyActivity ? "NEXT: DURATION & TIME" : "NEXT: GUESTS & TIME";

  return (
    <div className="relative bg-white rounded-[32px] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden pb-0">
      <div className="absolute top-0 left-0 w-full rounded-full overflow-hidden leading-none">
        <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="w-full h-2">
          <path d="M0,40 Q250,0 500,40 L500,0 L0,0 Z" className={isVIP ? "fill-red-500" : "fill-[#004bb5]"} />
        </svg>
      </div>

      {bookingStep === 1 && (
        <>
          <div className="pt-5 px-6 pb-2">
            <div className="grid grid-cols-2 bg-[#F4F5F7] rounded-full p-1">
              <button
                onClick={() => { setTransferType("self"); onTabClick(activeTab); }}
                className={`flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-extrabold tracking-widest transition-all ${!isSUV ? "bg-white text-[#004bb5] shadow-sm" : "text-[#9ca3af] hover:text-gray-500"}`}
              >
                <Anchor size={13} strokeWidth={2.5} /> SELF ARRIVAL
              </button>
              <button
                onClick={() => { setTransferType("suv"); onTabClick(activeTab); }}
                className={`flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-extrabold tracking-widest transition-all ${isSUV ? "bg-white text-[#004bb5] shadow-sm" : "text-[#9ca3af] hover:text-gray-500"}`}
              >
                <ShieldCheck size={13} strokeWidth={2.5} /> PRIVATE SUV
              </button>
            </div>
          </div>

          {isSUV && (
            <div className="px-6 mt-4">
              <div className="flex items-center gap-4 bg-[#FFF9F0] border border-[#FED7AA] rounded-[16px] p-4">
                <div className="w-[42px] h-[42px] rounded-full bg-[#FACC15] flex items-center justify-center shrink-0">
                  <Car size={20} className="text-[#111827]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-black text-[#F59E0B] uppercase tracking-[0.1em] mb-0.5">INCLUDED</div>
                  <div className="text-[13px] font-black text-[#111827]">Allocated: {suvQty} x SUV</div>
                </div>
                {/* SUV Quantity Controls */}
                {/* <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1.5 shadow-sm border border-[#FED7AA]">

               
                <div className="flex items-center gap-2 bg-white rounded-xl px-1 py-1 shadow-sm border border-[#FED7AA]">
                  <button
                    onClick={() => setSuvQty(prev => Math.max(1, prev - 1))}
                    disabled={suvQty <= 1}
                    className="w-5 h-5 flex items-center justify-center rounded-[8px] bg-[#FFF9F0] text-gray-700 font-black transition-opacity disabled:opacity-40 hover:bg-[#FEF3C7]"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-[14px] font-black text-[#111827]">{suvQty}</span>
                  <button
                    onClick={() => setSuvQty(prev => prev + 1)}
                    className="w-5 h-5 flex items-center justify-center rounded-[8px] bg-[#FFF9F0] text-gray-700 font-black hover:bg-[#FEF3C7]"
                  >
                    +
                  </button>
                </div> 
                */}
              </div>
            </div>
          )} 

          <div className="px-6 pb-0 space-y-5 mt-5">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-[36px] font-black leading-none tracking-tight ${isVIP ? "text-[#EF4444]" : "text-[#004bb5]"}`}>
                ${displayPrice}
              </span>
              <span className="text-[8px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em]">TOTAL</span>
            </div>

            <div>
              <label className="block text-[9px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em] mb-2">PREFERRED DATE</label>
              <div onClick={() => dateInputRef.current?.showPicker()} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F4F5F7] cursor-pointer">
                <span className="text-[14px] font-bold text-[#111827]">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString("en-GB").replace(/\//g, "-") : "Select Date"}
                </span>
                <Calendar size={16} strokeWidth={2} className="text-[#6b7280]" />
                <input ref={dateInputRef} type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="absolute opacity-0 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[9px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em] mb-2.5">
                <SectionIcon size={13} strokeWidth={2.5} /> {sectionLabel}
              </label>
              <div className="space-y-2.5">
                {activity?.packages?.map((pkg, idx) => {
                  const isActive = selectedPackageIndex === idx;
                  const isThisVIP = pkg.name.toLowerCase().includes("vip");
                  const is1Seater = pkg.name.toLowerCase().includes('1-seater') || pkg.name.toLowerCase().includes('1 seater');
                  const is2Seater = pkg.name.toLowerCase().includes('2-seater') || pkg.name.toLowerCase().includes('2 seater');
                  const is4Seater = pkg.name.toLowerCase().includes('4-seater') || pkg.name.toLowerCase().includes('4 seater');

                  let TierIcon = isThisVIP ? Crown : Ticket;
                  if (is1Seater) TierIcon = User;
                  else if (is2Seater) TierIcon = Users;
                  else if (is4Seater) TierIcon = Crown;

                  let fallbackSubLabel = "OFFICIAL TICKET";
                  if (is1Seater) fallbackSubLabel = "SOLO ADRENALINE RUSH";
                  else if (is2Seater) fallbackSubLabel = "DYNAMIC DUO EXPERIENCE";
                  else if (is4Seater) fallbackSubLabel = "ULTIMATE GROUP THRILL";
                  else if (isBuggyActivity) fallbackSubLabel = "ADRENALINE EXPERIENCE";

                  const parts = pkg.name.split(' - ');
                  const mainLabel = parts[0] || pkg.name;
                  const subLabel = parts[1] || fallbackSubLabel;

                  const pkgPrice = pkg.price || pkg.bookingFields?.[0]?.price || 0;
                  const priceColors = ["text-[#004bb5]", "text-[#EF4444]", "text-[#8B5CF6]", "text-[#F59E0B]"];
                  const currentPriceColor = priceColors[idx % priceColors.length];

                  return (
                    <div
                      key={pkg._id}
                      onClick={() => { setSelectedPackageIndex(idx); onTabClick(activeTab); }}
                      className={`flex items-center justify-between p-4 rounded-[22px] cursor-pointer transition-all border-[1.5px] ${
                        isActive ? `border-[#004bb5] bg-white shadow-sm shadow-[#004bb5]/10` : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-[#004bb5]" : "bg-[#F4F5F7]"}`}>
                          <TierIcon size={20} strokeWidth={2.5} className={isActive ? "text-white" : "text-[#9ca3af]"} />
                        </div>
                        <div>
                          <div className="text-[13px] font-black text-[#111827]">{mainLabel}</div>
                          <div className="text-[9px] text-[#9ca3af] uppercase font-extrabold tracking-widest mt-0.5">{subLabel}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <div className={`text-[15px] font-black ${currentPriceColor}`}>
                          ${pkgPrice}
                        </div>
                        <div className="text-[9px] text-[#9ca3af] font-black uppercase mt-0.5 tracking-wider">
                          / UNIT
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setBookingStep(2)}
                className={`w-full py-[15px] rounded-full text-white text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  isVIP ? "bg-[#EF4444] shadow-[0_4px_14px_rgba(239,68,68,0.25)]" : "bg-[#004bb5] shadow-[0_4px_14px_rgba(0,75,181,0.25)]"
                }`}
              >
                {btnNextText} <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[#F8F9FA] px-6 py-3 flex items-center justify-center gap-5 border-t border-gray-100">
            <span className="text-[9px] text-[#9ca3af] font-extrabold uppercase tracking-widest flex items-center gap-1.5"><Zap size={12} className="text-[#d1d5db]" strokeWidth={2.5} /> INSTANT DELIVERY</span>
            <span className="text-[9px] text-[#9ca3af] font-extrabold uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12} className={isVIP ? "text-[#EF4444]" : "text-[#004bb5]"} strokeWidth={2.5} /> OFFICIAL PARTNER</span>
          </div>
        </>
      )}

      {bookingStep === 2 && (
        <>
          <div className="px-6 pt-5 pb-0 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em]">STEP 2: DETAILS</div>
              <button onClick={() => setBookingStep(1)} className={`text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity ${isVIP ? "text-[#EF4444]" : "text-[#004bb5]"}`}>
                ← BACK
              </button>
            </div>

            {/* TIME */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em] mb-3 mt-6">PREFERRED ENTRY TIME</label>
              <div className="grid grid-cols-3 gap-2.5">
                {timeSlots.map((time, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-2.5 rounded-[12px] text-[12px] font-bold transition-all border
                      ${selectedTimeSlot === time ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6b7280] border-gray-200 hover:border-gray-300"}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* GUESTS / YACHT COUNTER */}
            <div className="bg-[#F8F9FA] rounded-[24px] p-2 space-y-2.5">
              {guestTypes.map((p) => {
                const currentQty = quantities[p._id] || 0;
                const lowerName = p.name.toLowerCase();
                const isDuration = lowerName.includes('duration');
                const isYacht = lowerName.includes('yacht') || lowerName.includes('vessel');

                const minHours = isDuration ? (p.min ? p.min / 60 : 0.5) : (p.min || 0);
                const maxHours = isDuration ? (p.max ? p.max / 60 : 24) : (p.max || 20);

                const isMin = currentQty <= minHours;
                const isMax = currentQty >= maxHours;
                
                let subtext = `AGE ${lowerName.includes("adult") ? "12+" : "3-11"}`;
                if (isDuration) subtext = `${(currentQty * 60).toFixed(0)} MINUTE SESSION`;
                else if (isYacht) subtext = "TOTAL VESSELS";
                else if (isBuggyActivity) subtext = "TOTAL UNITS";
                else if (lowerName.includes("adult")) subtext = "AGE 12+";
                else if (lowerName.includes("child")) subtext = "AGE 3-11";

                const displayQty = isDuration ? `${Number(currentQty).toFixed(1)}h` : currentQty;

                return (
                  <div key={p._id} className="flex items-center justify-between p-2">
                    <div>
                      <div className="text-[12px] font-black text-[#111827]">{p.name}</div>
                      <div className="flex items-center gap-1.5 text-[8px] text-[#9ca3af] font-extrabold uppercase mt-0.5 tracking-wider">
                        {isDuration && <Clock size={9} className="shrink-0" />}
                        {isYacht && <Anchor size={9} className="shrink-0" />}
                        {subtext}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-1 py-1 shadow-sm border border-gray-100">
                      <button
                        onClick={() => updateQuantity(p._id, isDuration ? -0.5 : -1)}
                        disabled={isMin}
                        className={`w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#F4F5F7] text-[#111827] font-black transition-opacity ${isMin ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-[14px] font-black text-[#111827]">{displayQty}</span>
                      <button
                        onClick={() => updateQuantity(p._id, isDuration ? 0.5 : 1)}
                        disabled={isMax}
                        className={`w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#F4F5F7] text-[#111827] font-black transition-opacity ${isMax ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* ── SUV Quantity Row (only shown when SUV is selected) ── */}
              {isSUV && (
                <div className="flex items-center justify-between pt-3 pb-2 px-2 border-t border-gray-200 mt-2">
                  <div>
                    <div className="text-[12px] font-black text-[#111827] flex items-center gap-2">
                      <Truck size={14} className="text-[#004bb5]" /> Private SUV
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-[#9ca3af] font-extrabold uppercase mt-0.5 tracking-wider">
                      ${suvAddonPrice} / SUV
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white rounded-xl px-2 py-1.5 shadow-sm border border-gray-100">
                    <button
                      onClick={() => setSuvQty(prev => Math.max(1, prev - 1))}
                      disabled={suvQty <= 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#F4F5F7] text-[#111827] font-black transition-opacity ${suvQty <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-[14px] font-black text-[#111827]">{suvQty}</span>
                    <button
                      onClick={() => setSuvQty(prev => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#F4F5F7] text-[#111827] font-black hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="bg-[#F0F5FF] border border-[#D1E0FF] rounded-[24px] px-4 py-3 space-y-3">
              <div className="flex justify-between items-center text-[9px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em]">
                <span>PRICE BREAKDOWN</span>
                <span>TOTAL</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-[#111827]">
                    {selectedPackage?.name?.split(' - ')[0] || "Standard Entry"} 
                    {isYachtActivity ? (
                      <span className="ml-1 text-[#6b7280]">({Number(durationQtyHours).toFixed(1)}h x {yachtQty})</span>
                    ) : (
                      <span className="ml-1 text-[#6b7280]">(x{totalQty})</span>
                    )}
                  </span>
                  <span className="text-[13px] font-black text-[#111827]">${baseTotalAmount}</span>
                </div>

                {isSUV && (
                  <div className="flex justify-between items-center text-[12px] font-bold text-gray-500">
                    <span>Private SUV (x{suvQty})</span>
                    <span>${suvTotalAddonPrice}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleProceedToCheckout}
                className={`w-full py-[18px] rounded-full text-white text-[13px] font-black uppercase tracking-widest transition-all ${
                  isVIP ? "bg-[#EF4444] shadow-[0_4px_14px_rgba(239,68,68,0.25)]" : "bg-[#004bb5] shadow-[0_4px_14px_rgba(0,75,181,0.25)]"
                }`}
              >
                {isYachtActivity ? `CONFIRM CHARTER FOR $${displayPrice}` : `BOOK NOW FOR $${displayPrice}`}
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[#F8F9FA] px-6 py-4 flex items-center justify-center gap-6 border-t border-gray-100">
            <span className="text-[9px] text-[#9ca3af] font-extrabold uppercase tracking-widest flex items-center gap-1.5"><Zap size={12} className="text-[#d1d5db]" strokeWidth={2.5} /> INSTANT DELIVERY</span>
            <span className="text-[9px] text-[#9ca3af] font-extrabold uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12} className={isVIP ? "text-[#EF4444]" : "text-[#004bb5]"} strokeWidth={2.5} /> OFFICIAL PARTNER</span>
          </div>
        </>
      )}
    </div>
  );
}
// ════════════════════════════════════════════════════════════════════════════
// STEP 3 & 4: CHECKOUT VIEW COMPONENT (INFO -> PAYMENT)
// ════════════════════════════════════════════════════════════════════════════
function CheckoutView({ 
  activity, 
  selectedPackage, 
  transferType, 
  totalQty, 
  selectedTimeSlot, 
  displayPrice, 
  baseTotalAmount, 
  isSUV, 
  suvQty,
  suvTotalAddonPrice, 
  setBookingStep,
  handleFinalSubmit,
  isBooking,
  isYachtActivity,
  durationQtyHours,
  yachtQty,
  selectedDate, 
  quantities  
}) {
  const[checkoutStep, setCheckoutStep] = useState(1);
  const [toastMsg, setToastMsg] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [finalPayload, setFinalPayload] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupHotel: ""
  });

  

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fallbackAddons =[
    { id: "quad", name: "Quad Bike", price: 150, icon: <Zap size={14} className="text-gray-400"/> },
    { id: "vip_majlis", name: "VIP Majlis", price: 50, icon: <Crown size={14} className="text-gray-400"/> },
    { id: "falcon", name: "Falcon Pix", price: 25, icon: <Camera size={14} className="text-gray-400"/> }
  ];

  const[addonQtys, setAddonQtys] = useState({ quad: 0, vip_majlis: 0, falcon: 0 });

  const updateAddon = (id, delta) => {
    setAddonQtys(prev => ({ ...prev,[id]: Math.max(0, prev[id] + delta) }));
  };

  const addonsTotal = fallbackAddons.reduce((acc, curr) => acc + (curr.price * addonQtys[curr.id]), 0);
  const finalTotal = displayPrice + addonsTotal;

  const onContinueClick = () => {
    setCheckoutStep(2);
  };

  // const handlePayNow = () => {
  //   const selectedAddons = fallbackAddons
  //     .filter(a => addonQtys[a.id] > 0)
  //     .map(a => ({ name: a.name, price: a.price, quantity: addonQtys[a.id], subtotal: a.price * addonQtys[a.id] }));

  //   // ── Build Final Payload
  //   const payload = {
  //     activityId: activity?._id,
  //     activityName: activity?.name,
  //     variantName: selectedPackage?.name,
  //     isYachtActivity,
  //     timeSlot: selectedTimeSlot,
  //     ...(isYachtActivity
  //       ? { durationHours: durationQtyHours, numberOfYachts: yachtQty }
  //       : { totalGuests: totalQty }
  //     ),
  //     transferType: isSUV ? "Private SUV" : "Self Arrival",
  //     ...(isSUV && { suvCount: suvQty, suvPricePerUnit: activity?.PrivateSUV?.fee || 500, suvTotal: suvTotalAddonPrice }),
  //     baseFare: baseTotalAmount,
  //     addons: selectedAddons,
  //     addonsTotal,
  //     grandTotal: finalTotal,
  //     customerDetails: {
  //       firstName: formData.firstName,
  //       lastName: formData.lastName,
  //       email: formData.email,
  //       phone: formData.phone,
  //       pickupHotel: formData.pickupHotel,
  //     },
  //     bookingReference: `FT-${Math.floor(100000 + Math.random() * 900000)}`,
  //     submittedAt: new Date().toISOString(),
  //   };

  //   console.log("════════════════════════════════════════════");
  //   console.log("✅ FINAL BOOKING PAYLOAD — Ready for API");
  //   console.log("════════════════════════════════════════════");
  //   console.log(JSON.stringify(payload, null, 2));
  //   console.log("════════════════════════════════════════════");

  //   setToastMsg("🎉 Booking Confirmed!");
  //   setFinalPayload(payload);
  //   setTimeout(() => {
  //     setToastMsg("");
  //     setBookingConfirmed(true);
  //   }, 1500);
  // };


  // CheckoutView component ke function parameters me in dono ko add karein:

  const handlePayNow = () => {
    const selectedAddons = fallbackAddons
      .filter(a => addonQtys[a.id] > 0)
      .map(a => ({ name: a.name, price: a.price, quantity: addonQtys[a.id], subtotal: a.price * addonQtys[a.id] }));

    // ── Build exact participant breakdown (Adult, Child, etc.)
    const formattedParticipants = selectedPackage?.bookingFields
      ?.filter((f) => (quantities[f._id] || 0) > 0)
      ?.map((f) => {
        const isDurationField = f.name.toLowerCase().includes('duration');
        return {
          label: f.name || f.label,
          quantity: quantities[f._id],
          unit: isDurationField ? 'hours' : 'guests',
          pricePerUnit: f.price,
        };
      }) ||[];

    // ── Build A-to-Z Final Payload
    const payload = {
      // 1. Activity & Package Info
      activityId: activity?._id,
      activityName: activity?.name,
      variantName: selectedPackage?.name,
      
      // 2. Schedule Info
      selectedDate: selectedDate,
      timeSlot: selectedTimeSlot,
      
      // 3. Guests & Fleet Info
      isYachtActivity,
      participantsBreakdown: formattedParticipants,
      ...(isYachtActivity
        ? { durationHours: durationQtyHours, numberOfYachts: yachtQty }
        : { totalGuests: totalQty }
      ),
      
      // 4. Transfer Info
      transferType: isSUV ? "Private SUV" : "Self Arrival",
      ...(isSUV && { suvCount: suvQty, suvPricePerUnit: activity?.PrivateSUV?.fee || 500, suvTotal: suvTotalAddonPrice }),
      
      // 5. Addons Info
      addons: selectedAddons,
      
      // 6. Pricing Breakdown
      pricing: {
        baseFare: baseTotalAmount,
        addonsTotal: addonsTotal,
        suvTotal: isSUV ? suvTotalAddonPrice : 0,
        grandTotal: finalTotal,
      },
      
      // 7. Customer Info
      customerDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        pickupHotel: formData.pickupHotel,
      },
      
      // 8. Meta Info
      bookingReference: `FT-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: new Date().toISOString(),
    };

    // Yahan Console me apko A-to-Z sab data mil jayega
    console.log("════════════════════════════════════════════");
    console.log("✅ COMPLETE FINAL BOOKING PAYLOAD");
    console.log("════════════════════════════════════════════");
    console.log(JSON.stringify(payload, null, 2));
    console.log("════════════════════════════════════════════");

    setToastMsg("🎉 Booking Confirmed!");
    setFinalPayload(payload);
    setTimeout(() => {
      setToastMsg("");
      setBookingConfirmed(true);
    }, 1500);
  };


  if (bookingConfirmed && finalPayload) {
    return <BookingConfirmedScreen payload={finalPayload} activity={activity} />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans relative">
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[999] bg-[#111827] text-white px-6 py-3.5 rounded-full text-[13px] font-bold shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => checkoutStep === 2 ? setCheckoutStep(1) : setBookingStep(2)} 
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← BACK
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <ShieldCheck size={14} /> SECURE
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-[38px] font-black text-gray-900 tracking-tight">
            Complete <span className="text-[#004bb5]">Booking</span>
          </h1>
          <div className="flex items-center gap-3 mt-4 text-[11px] font-black uppercase tracking-widest">
            <span 
              onClick={() => setCheckoutStep(1)}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${checkoutStep === 1 ? "bg-[#004bb5] text-white" : "text-gray-400 bg-gray-100 cursor-pointer hover:bg-gray-200"}`}
            >
              1. INFO
            </span>
            <ChevronRight size={12} className="text-gray-300" />
            <span 
              className={`px-3.5 py-1.5 rounded-md transition-colors ${checkoutStep === 2 ? "bg-[#004bb5] text-white" : "text-gray-400 bg-gray-100"}`}
            >
              2. PAY
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 space-y-6 w-full">
            {checkoutStep === 1 ? (
              <>
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h3 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#111827] mb-5">
                    <Zap size={14} className="text-[#004bb5] fill-[#004bb5]"/> INSTANT UPGRADES
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {fallbackAddons.map(addon => (
                      <div key={addon.id} className="border border-gray-100 rounded-[16px] p-4 flex flex-col items-center relative hover:border-gray-200 transition-colors">
                        <div className="flex justify-between w-full items-start mb-2">
                          {addon.icon}
                          <span className="text-[11px] font-extrabold text-[#004bb5]">${addon.price}</span>
                        </div>
                        <div className="text-[13px] font-bold text-gray-900 mb-3 text-center w-full">{addon.name}</div>
                        <div className="flex items-center gap-4 bg-[#F4F5F7] rounded-xl px-2 py-1.5 w-full justify-center">
                          <button onClick={() => updateAddon(addon.id, -1)} disabled={addonQtys[addon.id] === 0} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-gray-900 disabled:opacity-40">−</button>
                          <span className="text-[13px] font-black text-gray-900">{addonQtys[addon.id]}</span>
                          <button onClick={() => updateAddon(addon.id, 1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-gray-900">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h3 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#111827] mb-5">
                    <Users size={14} className="text-gray-400"/> GUEST DETAILS
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleChange} className="w-full bg-[#F9FAFB] border-0 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none" />
                    <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" onChange={handleChange} className="w-full bg-[#F9FAFB] border-0 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none" />
                    <input type="email" name="email" value={formData.email} placeholder="Email Address" onChange={handleChange} className="w-full sm:col-span-2 bg-[#F9FAFB] border-0 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none" />
                    <input type="tel" name="phone" value={formData.phone} placeholder="WhatsApp Phone" onChange={handleChange} className="w-full bg-[#F9FAFB] border-0 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none" />
                    <input type="text" name="pickupHotel" value={formData.pickupHotel} placeholder="Pickup Hotel" onChange={handleChange} className="w-full bg-[#F9FAFB] border-0 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none" />
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={onContinueClick}
                      className="w-full bg-[#030712] hover:bg-gray-800 text-white rounded-[14px] py-4 text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                      CONTINUE <ArrowRight size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h3 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#111827] mb-6">
                    <CreditCard size={15} className="text-[#004bb5]"/> SECURE PAYMENT
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em] mb-2.5">
                        CARD NUMBER
                      </label>
                      <div className="relative flex items-center">
                        <CreditCard size={16} className="absolute left-4 text-[#9ca3af]" />
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          className="w-full bg-[#F9FAFB] border-0 rounded-[14px] pl-11 pr-4 py-4 text-[15px] font-black text-gray-900 placeholder:text-[#d1d5db] focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none tracking-widest" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em] mb-2.5">
                          EXPIRY
                        </label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full bg-[#F9FAFB] border-0 rounded-[14px] px-4 py-4 text-[15px] font-black text-center text-gray-900 placeholder:text-[#d1d5db] focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none tracking-widest" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-[0.15em] mb-2.5">
                          CVV
                        </label>
                        <div className="relative flex items-center">
                          <svg className="absolute left-4 w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                          <input 
                            type="password" 
                            placeholder="***" 
                            className="w-full bg-[#F9FAFB] border-0 rounded-[14px] pl-11 pr-4 py-4 text-[15px] font-black text-gray-900 placeholder:text-[#d1d5db] focus:ring-2 focus:ring-[#004bb5]/20 focus:bg-white transition-all outline-none tracking-widest" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
{/* 
                  <div className="mt-8">
                    <button 
                      onClick={handlePayNow}
                      className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-[0_6px_20px_rgba(34,197,94,0.3)]"
                    >
                      PAY ${finalTotal} NOW
                    </button>
                  </div> */}
                  {/* <div className="mt-8 space-y-3">
  <button 
    onClick={handlePayNow}
    className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-[0_6px_20px_rgba(34,197,94,0.3)]"
  >
    PAY ${finalTotal} NOW
  </button>
  <button 
    className="w-full bg-white border-2 border-[#004bb5] text-[#004bb5] hover:bg-[#004bb5] hover:text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center transition-all"
  >
    PAY LATER
  </button>
</div> */}
<div className="mt-8 space-y-4">

  {/* PAY NOW (hide when QR open) */}
  {!showQR && (
    <button 
      // onClick={handlePayNow}
      onClick={() => setShowQR(true)}
      className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-[0_6px_20px_rgba(34,197,94,0.3)]"
    >
      PAY ${finalTotal} NOW
    </button>
  )}

  {/* PAY LATER BUTTON */}
  {!showQR && (
    <button 
      // onClick={() => setShowQR(true)}
      onClick={handlePayNow}
      className="w-full bg-white border-2 border-[#004bb5] text-[#004bb5] hover:bg-[#004bb5] hover:text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center transition-all"
    >
      PAY LATER
    </button>
  )}

  {/* QR SECTION */}
  {showQR && (
    <div className="flex flex-col items-center gap-4 bg-[#F9FAFB] p-5 rounded-[18px] border border-gray-200">

      {/* QR IMAGE */}
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJUAAACUCAMAAACtIJvYAAAAY1BMVEX///8AAAD7+/vu7u5ERER9fX04ODjq6urHx8cfHx/j4+MpKSmZmZn09PQuLi7MzMwYGBjBwcESEhKQkJA/Pz+ysrKGhoZgYGChoaG5ublqamrW1taqqqrc3Nx1dXVUVFRLS0uR5Y8yAAAKXUlEQVR4nO2c7XaqOhCGIWA0xUSgaFVa6v1f5ckkMzCkoKG1Xd2nvn8IFOmzyJjMR2KSPPTQQw899NBDD/1vlF2RwHs0tjW7RtdBGs8FOxfTj/S6BSXe5ayKHd50MFJB+9nIomIf3hfuPrPF853y5wdoF/MPfhfJdYkmndcGb+qwfbDHE/vwK973jOcbPF+x9pSam1R5JNXujlR5FFWTf5QKqKpsnT03uYQe1Ov1WiNVccmbIzxovc42Ms8lo1ITz21iqVQ7YZBdQCXzRlZZtoYHHmVu9kj1rL11b0wuD7ZdMapu4rmtiqV6mvjDKqACkaVvbfsVqcjSiWbHqFYTz336H1Bl60EioLL2dFETVHvbrUf/wayy7YO1vSqgEuy52VIq0Q0mf9kFVPYf626Cylp9ZsmcEQNRaO3u3V0GQ+/EUqoX9s0NqRI8D6lAe/zMIfk4MlCPkl6+QlXflar+DirbMc7OrG0ZogSqI06C0IMGqXbG99Tzt1PByNkmfuSkhwGV8fbSbC32HqkEs+rvpVqhnXFtma3AyHBCKq6/SHWQTdHizeRfEVXRWC9GZ3pvGkkzz89QaZz7QM92/qsYlSUCa3dEdhSV/H19LxUXeTJEBb4CWDp852hM/wtU58KQ5KgHUW7MUqbcCy22yhg1otJilkr2zy3OS6n6yICiiH68MoMPDwZtz83eWviWUanG3jBDxaMK+Dbcx5NZ4dvv/QfbBo/vyKhIU1Sh/n0q8UGcqi5L2xZijsr+vayJQvj7HNXHx8ZTpcWEaka1ETpZqaKuZqi4tbd1och/qKcenMZSzYnPOOTJTFNNe8hz+lepZARVi8cTUp2uULURVPIW1U05a68HvwGo0jr1I3btfQb2nure6r9VUyMDF/dkuIf8F6koQiUf6zBBtUGq6p5UfbaoZRd5/Efvi/IxRzyHOOeEbfKtyNqJEGZkoH5ZauHi3T9AcapbET2IzzhEFY4MHVwrPd3voVrdnYoorlG93qC6y7sSZ3wajU9ERFRg7ZS7OuI9VSTVG14zMYQjKqKg3lsFVOGMAzpdoeI9+Kb8tZszzrdTjd7VMipwkMratInQXVq6E/KnPlKVSFV6KnvbybY/Ug0+166o67P1/N8MeGqRVL2sTdVk8aEvSlShaHYmERW1O2y3FvElifRFucDSS7Lye1BtOJVaEHl9KxVv91RlDBXEekTVFUb2811hVGVjP7B+CBXLCSphw8S9MuqZnbv3I3wICSNGh/HkrsF40B5vV0wupSooxhEYCWA7WdXK++/QnqDap8rOzsOHNqlSQG9ddy9o+xZYu7+P/5NZqrnIC0S9xz1kLp7Z9lTzWjS2/2KqlofzLAB/lk3j8uw2gu8mqCBvtWV5q13RNCagKZumkUglsnGO6ypVambqg5VGa7cnaoIKjHqvZNG/L3sevi+w9g2N7Y0xUe8sKvIixY4MXC7uUcOMc/P79yNUo3mwXEoFBZOSPQ2KH5U1g0Pja4UhlV5nrkZIVGLtjXHjKyiucqIw995TXfLmbD93u+6MVGqns/WZUYGFH2Rj4HieoHo1jXllVBvTgFyNEIwa/IgOrZuowNrbSyNv+vA91Rvz+EA83xf6oqCp2Jl6DMQzRdwXhRnndt0Z45vyx6iiMkUvWH0DqgMrQFOd2a0Y8NcleYJQgTs2eeMiL2ltB6smoLP2FZMd1AuxeuKoltQH+2qlSEaVy+wAle/MX9d4kUbAo8zla+bPAeKEFSZnChdv4VAdr5i1qyX1wVlNZbZJvBIHokiVFHp9O/xyf8q/+jaqVjGqGGsfKezBXTLuYVrH4OuDQ49WrAedxWusRefOtrKK9+AlzxdF96G1U7XSWToQbnGVBdYHG3pfrv7MqAqsHTqiS36B7zlZu8BjPFU4MoB4pmiqYkKq0o/idefFsfMkVRgP/iwVq5KIlWx62ZnGVU6sj9WvmQmptoNf5mYYlXtfio52xtGb3M9EK8GqJzffz0vTj6JQ+e5F1m5nYTcPTlEZtirHOCv362Tg6CnBttzjnC29ob3dngfZjDNSmCmaoprrsTCiJ73huBW9/krdouLrrz5NFZtnQA/ZNC3GhVQLPBTOQ6a22tgmkEJ9EDIgitxobFMlri2lOVjXGXqytJfdigIMOq2HLE0sFUQT607KvHUWL5u+Fiibvi64wsgC3CggwFUWGtdgOWvHeqCujI8qVhhptLkka9eL1l9BhbekTFEY1VObi69ICSu8YYYbqrzLPBlGRfmr+t5UFE3EU2FE76mEgFHAUvlano3oIZoXPLofqHxgPlCpeoXRPUT2EMVjvdD7VxjRx/kMaIiuRg9ZjhqPVi77cfAnztp5BQAK4twXBYveKFOssK3xwTsog9t76iXV8P6d8fVXpLDCG9YlOBX1XBc8+FMrB343VTJFBVbfsXZYWQqpeBYtYdd6Knv+VEeN7S5T65Ko9jvIK+HCvhtXBXdkVPEG7e21I7vmrd23a1WS0t7albN2yNbWLzoyf0VSPFM7FXmlPdVQYUrTceTF1Y8M5RfyDD0Vzcb3ototpmL+9uhdQfuAx3Pw36juzKnCiAJEOfi3pTmZXuegjsNF/gK8N/IXaGw/pYO1txOfJX2Kis84k1R85QCnCkeGP0ClocI014NgW0AL9kQjKe9BykDGUL0sgJoXUbTB9WPwX/vKSDpeD9mWYypQcZdVFqAwug+pwpoXiWacxZW4f5KqrvmKlA9UNaxCqScrSh+oCr9i5eurdwa6aR2DB/IYp0vGPsO7PV9Hrwr7CtU2eGC4Q+HTKzN/liqmPnhzBZ27yfq6QKX8n1ytENoKqQTGjVQfdFS4ko6oanv7OdPiTRbF5curDUEd+k4VRhk+1yf6mhdVw3kFnMqGvbVrsPa6ftfJ7W/gXXa+XFvpFI4M0f7VL6aaW/HLqU56WN9uI3r9aqQ5TlB1wzJfXdUu32BWn6GaXR3NqWwMWFNe1MWDwlt5SFWaQRALWit39y2nuraSnHs3UxnIkCpUhyR/hQrLfqMdClNUaqgN5pJRgant7k5V6eGbcI3KWrrG3KiuGFWbS5fBvS8V9xmuUiXDrLPjVOj93ZeKz4mxVBtOpe5JlbGaDgjKNxRRbLGW47KPethDeLpGFVMxidrntWF7co4yvxR4o7nkkkZR2DULNedwD2FIVUfl25fuqJpb8ZsGtjRHBYrKt1/d1Xg3KrYsIZ5qbgeoi06zYZfes++5i/FHt9e5Yr22w950lV3c+bmCvdDvQ3Ulugdnd8vCUV4GaweqV2vR8D3cstrznlF1eqgFgnFvLnm+ehrvmo2jChW784UU7lDgauuFlbhoKv6uFlOpz1Bd27FO9cEK/aV+xa+0o4IedkrBjvXnhHpw/BsNFV+HHFUfvLW7H0wHMiI4O7uxCqjAdF5xrzPu7nc2BlRqbO05rQoDPV0ix6tZTXkyKVKBwl9CSJLpkSFNP7lO5pdRRf7Cxug67VQIf2ED1PJf2Rg+4/x2R9VE/MJG9K+RcOngOl9BOPeLJJr/w1tQDz300EMPPfTQQ/+O/gMB09gM2dafjgAAAABJRU5ErkJggg=="
        alt="QR Code"
        className="w-40 h-40 object-contain"
      />

      <p className="text-[11px] text-gray-500 font-semibold text-center">
        Scan & complete payment, then confirm
      </p>

      {/* CONFIRM BUTTON */}
      <button
        onClick={handlePayNow}
        className="w-full bg-[#004bb5] hover:bg-[#003a8c] text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest transition-all shadow-[0_6px_20px_rgba(0,75,181,0.3)]"
      >
        CONFIRM PAYMENT
      </button>
       
     <button 
      // onClick={() => setShowQR(true)}
      onClick={handlePayNow}
      className="w-full bg-white border-2 border-[#004bb5] text-[#004bb5] hover:bg-[#004bb5] hover:text-white rounded-[14px] py-4 text-[14px] font-black uppercase tracking-widest flex items-center justify-center transition-all"
    >
      PAY LATER
    </button>
 
    </div>
  )}

</div>
                  {/* Back to Details Link */}
                  <div className="mt-5 text-center">
                    <button 
                      onClick={() => setCheckoutStep(1)}
                      className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9ca3af] hover:text-gray-700 transition-colors"
                    >
                      BACK TO DETAILS
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100 sticky top-28">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3af] mb-4">YOUR BOOKING</h3>
              
              <div className="flex gap-4 mb-6">
                <img src={activity?.Images?.[0]?.url || activity?.Images?.[0]?.secure_url || "/placeholder.jpg"} alt="Activity" className="w-16 h-16 rounded-[14px] object-cover shrink-0" />
                <div>
                  <h4 className="text-[14px] font-black text-[#111827] leading-snug mb-1">{activity?.name}</h4>
                  <div className="text-[9px] font-extrabold text-[#004bb5] uppercase tracking-widest">
                    {selectedPackage?.name?.split('-')[0]?.trim()} {isYachtActivity ? `(${Number(durationQtyHours).toFixed(1)}h x ${yachtQty})` : ''} ({transferType === 'suv' ? 'PRIVATE SUV' : 'SELF ARRIVAL'})
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-[16px] flex border border-gray-100 mb-6">
                <div className="flex-1 p-3 border-r border-gray-100">
                  <div className="text-[8px] font-extrabold uppercase tracking-widest text-[#9ca3af] mb-0.5">GUESTS</div>
                  <div className="text-[13px] font-black text-[#111827]">{totalQty} Pers.</div>
                </div>
                <div className="flex-1 p-3">
                  <div className="text-[8px] font-extrabold uppercase tracking-widest text-[#9ca3af] mb-0.5">SLOT</div>
                  <div className="text-[13px] font-black text-[#111827]">{selectedTimeSlot || "Select"}</div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 mb-4">
                <div className="flex justify-between items-center text-[13px] font-bold text-gray-500">
                  <span>Base Fare</span>
                  <span>${baseTotalAmount}</span>
                </div>
                {isSUV && (
                  <div className="flex justify-between items-center text-[13px] font-bold text-gray-500">
                    <span>Private SUV (x{suvQty})</span>
                    <span>${suvTotalAddonPrice}</span>
                  </div>
                )}
                {fallbackAddons.map(addon => (
                  addonQtys[addon.id] > 0 && (
                    <div key={addon.id} className="flex justify-between items-center text-[13px] font-bold text-gray-500">
                      <span>{addon.name} (x{addonQtys[addon.id]})</span>
                      <span>${addon.price * addonQtys[addon.id]}</span>
                    </div>
                  )
                ))}
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-gray-100 mt-2">
                <span className="text-[15px] font-black text-[#111827]">Total Price</span>
                <span className="text-[24px] font-black text-[#004bb5]">${finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// BOOKING CONFIRMED SCREEN
// ════════════════════════════════════════════════════════════════════════════
function BookingConfirmedScreen({ payload, activity }) {
  const router = useRouter();
 const handleDownloadPDF = async () => {
    const element = document.getElementById("voucher-card");
    if (!element) return;

    try {
      // 1. UI element ko pehle high-quality image me convert karna (Modern CSS support ke sath)
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2, // 2x quality for clear PDF
        cacheBust: true
      });

      // 2. Naya PDF document create karna
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 3. Image ko PDF ke width ke hisaab se scale karna
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 4. Image ko PDF me add karke download karna
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Booking-Voucher-${payload.bookingReference}.pdf`);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col items-center justify-start py-12 px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-5 animate-pulse">
          <CheckCircle2 size={28} className="text-emerald-500" />
        </div>
        <h1 className="text-[32px] md:text-[40px] font-black text-[#111827] tracking-tight">Booking Secured!</h1>
        <p className="text-[14px] text-gray-500 mt-2 text-center">
          Your adventure is confirmed. An e-ticket has been sent to{" "}
          <span className="font-bold text-gray-800">{payload.customerDetails?.email || "your email"}</span>.
        </p>
      </div>

      {/* Voucher Card */}
      <div id="voucher-card" className="w-full max-w-[620px] bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.06)]">

        {/* Voucher Header */}
        <div className="px-7 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-black text-[#004bb5] uppercase tracking-widest">FUN TOURS <span className="text-[#EF4444]">DUBAI</span></div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Digital Service Voucher</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Booking Reference</div>
            <div className="text-[15px] font-black text-[#111827] mt-0.5">{payload.bookingReference}</div>
          </div>
        </div>

        <div className="px-7 py-5 flex gap-4 border-b border-gray-100">
          <img
            src={activity?.Images?.[0]?.url || activity?.Images?.[0]?.secure_url || "/placeholder.jpg"}
            alt="activity"
            className="w-16 h-16 rounded-[14px] object-cover shrink-0 border border-gray-100"
          />
          <div className="flex-1">
            <h2 className="text-[16px] font-black text-[#111827] leading-snug">{payload.activityName}</h2>
            <div className="text-[10px] font-extrabold text-[#004bb5] uppercase tracking-widest mt-1">
              {payload.variantName?.split('-')[0]?.trim()}
              {payload.isYachtActivity ? ` (${Number(payload.durationHours).toFixed(1)} Hrs Charter)` : ''}
              {" "}({payload.transferType})
            </div>
          </div>
        </div>

        <div className="px-7 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
              <Calendar size={11} /> Date
            </div>
            <div className="text-[13px] font-black text-[#111827]">
              {new Date(payload.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
              <Users size={11} /> Guests
            </div>
            <div className="text-[13px] font-black text-[#111827]">
              {payload.isYachtActivity
                ? `${payload.numberOfYachts} Yacht${payload.numberOfYachts > 1 ? 's' : ''}`
                : `${payload.totalGuests} Pers.`}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
              <MapPin size={11} /> Pickup
            </div>
            <div className="text-[13px] font-black text-[#111827]">{payload.customerDetails?.pickupHotel || "—"}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
              <Clock size={11} /> Time Slot
            </div>
            <div className="text-[13px] font-black text-[#111827]">{payload.timeSlot || "—"}</div>
          </div>
        </div>

        <div className="px-7 py-5 space-y-3 border-b border-gray-100">
          <div className="flex justify-between text-[13px] text-gray-500 font-bold">
            <span>Base Experience ({payload.variantName?.split('-')[0]?.trim()}{payload.isYachtActivity ? ` (${Number(payload.durationHours).toFixed(1)} Hrs Charter)` : ''})</span>
            <span>${payload.baseFare}</span>
          </div>
          {payload.transferType === "Private SUV" && (
            <div className="flex justify-between text-[13px] text-gray-500 font-bold">
              <span>Private SUV (x{payload.suvCount})</span>
              <span>${payload.suvTotal}</span>
            </div>
          )}
          {payload.addons?.map((addon, i) => (
            <div key={i} className="flex justify-between text-[13px] text-gray-500 font-bold">
              <span>{addon.name} (x{addon.quantity})</span>
              <span>${addon.subtotal}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-[15px] font-black text-[#111827]">Paid Total</span>
            <span className="text-[24px] font-black text-[#004bb5]">${payload.grandTotal}</span>
          </div>
        </div>

        <div className="px-7 py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] border border-gray-200 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="7" height="7" rx="1" stroke="#9ca3af" strokeWidth="1.5"/>
              <rect x="12" y="1" width="7" height="7" rx="1" stroke="#9ca3af" strokeWidth="1.5"/>
              <rect x="1" y="12" width="7" height="7" rx="1" stroke="#9ca3af" strokeWidth="1.5"/>
              <rect x="13" y="13" width="2" height="2" fill="#9ca3af"/>
              <rect x="17" y="13" width="2" height="2" fill="#9ca3af"/>
              <rect x="13" y="17" width="2" height="2" fill="#9ca3af"/>
              <rect x="17" y="17" width="2" height="2" fill="#9ca3af"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Usage Instructions</div>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Please present this digital voucher or a printed copy to our guide at the time of pickup. Valid ID may be requested.
            </p>
          </div>
        </div>

        <div className="bg-[#111827] px-7 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
            <CheckCircle2 size={12} /> Official Voucher
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Fun Tours Dubai Tourism L.L.C</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8 flex-wrap justify-center">
        <button
          onClick={() => window.print()}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Receipt
        </button>
       <button
          onClick={handleDownloadPDF}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          {/* Download Icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PDF
        </button>
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full bg-[#111827] text-white text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Home size={13} /> Go Home
        </button>
      </div>
    </div>
  );
}