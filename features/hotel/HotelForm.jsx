"use client";
import React, { useState, useEffect } from "react";
import { 
  useCreateHotelMutation, 
  useUpdateHotelMutation, 
  useGetHotelByIdQuery,
  useAddReviewMutation 
} from "./hotelApi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Save, Loader2, Plus, X, Globe, Phone, Mail, 
  MapPin, Image as ImageIcon, Zap, Clock, Users, Bed, Star, MessageSquare 
} from "lucide-react";
import { toast } from "react-hot-toast";

const HotelForm = ({ id }) => {
  const isEdit = Boolean(id);
  const router = useRouter();

  // API Hooks
  const { data: hotelData, isLoading: isFetching } = useGetHotelByIdQuery(id, { 
    skip: !id,
    refetchOnMountOrArgChange: true 
  });
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();

  // Form State
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    discountPrice: "",
    totalRooms: "",
    maxGuests: "",
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    isActive: true,
    isFeatured: false,
    contact: { phone: "", email: "" },
    location: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
      address: "",
      city: "",
      state: "",
      country: ""
    },
    amenities: [],
    images: []
  });

  // Review State (for Edit mode)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [tempAmenity, setTempAmenity] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (isEdit && hotelData?.data) {
      setForm({ ...hotelData.data });
    }
  }, [hotelData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle Nested Objects (contact.phone, location.city etc)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleCoordinateChange = (index, value) => {
    const newCoords = [...form.location.coordinates];
    newCoords[index] = parseFloat(value) || 0;
    setForm(prev => ({
      ...prev,
      location: { ...prev.location, coordinates: newCoords }
    }));
  };

  const addAmenity = () => {
    if (tempAmenity.trim() && !form.amenities.includes(tempAmenity)) {
      setForm(prev => ({ ...prev, amenities: [...prev.amenities, tempAmenity.trim()] }));
      setTempAmenity("");
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setForm(prev => ({ 
        ...prev, 
        images: [...prev.images, { url: imageUrl.trim(), isPrimary: prev.images.length === 0 }] 
      }));
      setImageUrl("");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({ id, data: newReview }).unwrap();
      toast.success("Review added successfully!");
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add review");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error("Please add at least one image URL");

    try {
      if (isEdit) {
        await updateHotel({ id, data: form }).unwrap();
        toast.success("Property updated!");
      } else {
        await createHotel(form).unwrap();
        toast.success("Property published!");
      }
      router.push("/admin/hotels");
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  if (isEdit && isFetching) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {isEdit ? "Edit Property" : "Add Property"}
            </h1>
          </div>
          <button onClick={handleSubmit} disabled={isCreating || isUpdating} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-50 transition-all">
            {isCreating || isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            <span className="hidden sm:inline">{isEdit ? "Save Changes" : "Publish Now"}</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Core Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Information */}
          <Card title="General Information" icon={<Bed className="text-blue-500" />}>
            <div className="space-y-6">
              <InputField label="Hotel Name" name="name" value={form.name} onChange={handleChange} required placeholder="The Royal Palace" />
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">About Property</label>
                <textarea name="description" rows={5} value={form.description} onChange={handleChange} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none" placeholder="Describe the luxury and comfort..." />
              </div>
            </div>
          </Card>

          {/* Location & Map Coordinates */}
          <Card title="Location & Geography" icon={<MapPin className="text-rose-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <InputField label="Street Address" name="location.address" value={form.location.address} onChange={handleChange} />
              </div>
              <InputField label="City" name="location.city" value={form.location.city} onChange={handleChange} />
              <InputField label="State" name="location.state" value={form.location.state} onChange={handleChange} />
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 md:col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2"><Globe size={14}/> GeoJSON Coordinates (Lng, Lat)</p>
                <div className="grid grid-cols-2 gap-4">
                   <InputField label="Longitude" type="number" step="any" value={form.location.coordinates[0]} onChange={(e) => handleCoordinateChange(0, e.target.value)} />
                   <InputField label="Latitude" type="number" step="any" value={form.location.coordinates[1]} onChange={(e) => handleCoordinateChange(1, e.target.value)} />
                </div>
              </div>
            </div>
          </Card>

          {/* Media & Amenities */}
          <Card title="Media & Amenities" icon={<ImageIcon className="text-emerald-500" />}>
             <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Gallery URLs</label>
                  <div className="flex gap-2">
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://image-url.com" className="flex-1 px-5 py-3 rounded-xl border bg-slate-50 outline-none" />
                    <button type="button" onClick={addImage} className="bg-slate-900 text-white px-5 rounded-xl font-bold transition-transform active:scale-95">Add</button>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md">
                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                        <button type="button" onClick={() => setForm(p => ({...p, images: p.images.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Property Amenities</label>
                  <div className="flex gap-2">
                    <input value={tempAmenity} onChange={(e) => setTempAmenity(e.target.value)} placeholder="e.g. Infinity Pool" className="flex-1 px-5 py-3 rounded-xl border bg-slate-50 outline-none" />
                    <button type="button" onClick={addAmenity} className="bg-slate-900 text-white px-5 rounded-xl font-bold transition-transform active:scale-95">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.amenities.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black flex items-center gap-2 border border-blue-100">
                        {item} <X size={14} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => setForm(p => ({...p, amenities: p.amenities.filter((_, idx) => idx !== i)}))} />
                      </span>
                    ))}
                  </div>
                </div>
             </div>
          </Card>

          {/* NEW SECTION: Add Reviews (Only Visible in Edit Mode) */}
          {isEdit && (
            <Card title="Add a Review" icon={<Star className="text-amber-500" />}>
               <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <InputField label="Rating (1-5)" type="number" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: e.target.value})} />
                    </div>
                    <div className="md:col-span-3">
                      <InputField label="Your Comment" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="What's the feedback?" />
                    </div>
                  </div>
                  <button disabled={isAddingReview} type="submit" className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                    {isAddingReview ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />} 
                    Add Review to Property
                  </button>
               </form>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: Contact, Pricing & Status */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Contact Information */}
          <Card title="Contact Details" icon={<Phone className="text-purple-500" />}>
            <div className="space-y-4">
              <InputField label="Business Phone" name="contact.phone" icon={<Phone size={14}/>} value={form.contact.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <InputField label="Public Email" name="contact.email" icon={<Mail size={14}/>} value={form.contact.email} onChange={handleChange} placeholder="support@hotel.com" />
            </div>
          </Card>

          {/* Pricing & Capacity */}
          <Card title="Pricing & Inventory" icon={<Zap className="text-orange-500" />}>
            <div className="space-y-5">
              <InputField label="Price Per Night (₹)" type="number" name="pricePerNight" value={form.pricePerNight} onChange={handleChange} required />
              <InputField label="Discounted Price (₹)" type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Total Rooms" type="number" name="totalRooms" value={form.totalRooms} onChange={handleChange} />
                <InputField label="Max Guests" type="number" name="maxGuests" value={form.maxGuests} onChange={handleChange} />
              </div>
            </div>
          </Card>

          {/* Check-In/Out Timing */}
          <Card title="Timings" icon={<Clock className="text-indigo-500" />}>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Check-In" name="checkInTime" value={form.checkInTime} onChange={handleChange} />
              <InputField label="Check-Out" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} />
            </div>
          </Card>

          {/* Listing Status */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Visibility Settings</h3>
            <div className="space-y-4">
              <Toggle label="Active Listing" name="isActive" checked={form.isActive} onChange={handleChange} description="Visible to all customers" />
              <Toggle label="Featured Property" name="isFeatured" checked={form.isFeatured} onChange={handleChange} description="Show on homepage hero" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Specialized Components ---

const Card = ({ title, icon, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
    <div className="p-8">{children}</div>
  </motion.div>
);

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input {...props} className={`w-full ${icon ? 'pl-11' : 'px-5'} py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-300`} />
    </div>
  </div>
);

const Toggle = ({ label, name, checked, onChange, description }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <div>
      <p className="font-bold text-sm">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium">{description}</p>
    </div>
    <div className="relative">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-700'}`} />
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`} />
    </div>
  </label>
);

const LoadingSkeleton = () => (
  <div className="p-8 max-w-7xl mx-auto animate-pulse space-y-8">
    <div className="h-20 bg-white rounded-[2rem]" />
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 h-96 bg-white rounded-[2.5rem]" />
      <div className="col-span-4 h-96 bg-white rounded-[2.5rem]" />
    </div>
  </div>
);

export default HotelForm;