"use client";
import React from "react";
import { useGetHotelByIdQuery } from "./hotelApi";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, IndianRupee, Star, Info, Calendar, Clock, 
  Phone, Mail, Bed, Users, Image as ImageIcon, ShieldCheck, 
  Map as MapIcon, Tag, MessageSquare ,Globe 
} from "lucide-react";

const HotelViewModal = ({ id, isOpen, onClose }) => {
  const { data: hotelData, isLoading } = useGetHotelByIdQuery(id, { skip: !id || !isOpen });
  const hotel = hotelData?.data;

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop Overlay - Smooth Blur */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-[101] max-h-[90vh] flex flex-col"
        >
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-10 px-8 py-5 border-b bg-white/80 backdrop-blur-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Property Overview</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {hotel?._id}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {isLoading ? (
               <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold text-slate-400 animate-pulse">Fetching details...</p>
               </div>
            ) : (
              <div className="p-6 md:p-10 space-y-12">
                
                {/* 1. Hero Section & Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {hotel?.isFeatured && (
                        <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase rounded-lg shadow-md shadow-amber-100 flex items-center gap-1">
                          <Star size={12} fill="currentColor"/> Featured
                        </span>
                      )}
                      <span className={`px-3 py-1 ${hotel?.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'} text-[10px] font-black uppercase rounded-lg flex items-center gap-1`}>
                        <ShieldCheck size={12}/> {hotel?.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                      {hotel?.name}
                    </h1>

                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 w-fit px-4 py-2 rounded-xl">
                         <MapPin size={18} /> {hotel?.location?.city}, {hotel?.location?.state}
                       </div>
                       <p className="text-slate-500 font-medium pl-2">{hotel?.location?.address}</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                       <div className="text-4xl font-black text-slate-900">₹{hotel?.pricePerNight}</div>
                       <div className="text-slate-400 font-bold">/ night</div>
                       {hotel?.discountPrice > 0 && (
                         <div className="ml-2 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-sm flex items-center gap-1">
                           <Tag size={14}/> Save ₹{hotel.pricePerNight - hotel.discountPrice}
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Visual Gallery Grid */}
                  <div className="grid grid-cols-2 gap-3">
                     {hotel?.images?.length > 0 ? (
                       hotel.images.slice(0, 4).map((img, i) => (
                         <img key={i} src={img.url} className={`w-full h-40 object-cover rounded-3xl shadow-sm border-2 border-white ${i === 0 ? 'ring-2 ring-blue-500' : ''}`} alt="hotel" />
                       ))
                     ) : (
                       <div className="col-span-2 h-40 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 font-bold italic">No Images Available</div>
                     )}
                  </div>
                </div>

                {/* 2. Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={<Bed className="text-blue-500"/>} label="Total Rooms" value={hotel?.totalRooms} />
                  <StatCard icon={<Users className="text-emerald-500"/>} label="Max Guests" value={hotel?.maxGuests} />
                  <StatCard icon={<Star className="text-amber-500"/>} label="Rating" value={`${hotel?.rating?.average || 0} (${hotel?.rating?.count})`} />
                  <StatCard icon={<MapIcon className="text-rose-500"/>} label="Coordinates" value={`${hotel?.location?.coordinates[0]?.toFixed(2)}, ${hotel?.location?.coordinates[1]?.toFixed(2)}`} />
                </div>

                {/* 3. Detailed Info Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left: About & Amenities */}
                  <div className="md:col-span-2 space-y-10">
                    <section>
                       <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">About Property</h3>
                       <p className="text-lg text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-[2rem] border border-dashed border-slate-200">
                         {hotel?.description || "No description provided for this hotel."}
                       </p>
                    </section>

                    <section>
                       <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Amenities</h3>
                       <div className="flex flex-wrap gap-2">
                         {hotel?.amenities?.map((a, i) => (
                           <span key={i} className="px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-700 shadow-sm flex items-center gap-2">
                             <div className="w-2 h-2 bg-blue-500 rounded-full" /> {a}
                           </span>
                         ))}
                       </div>
                    </section>
                  </div>

                  {/* Right: Contact & Times */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl">
                       <h3 className="text-xs font-black uppercase text-slate-400">Timings & Contact</h3>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <Clock size={18} className="text-blue-400"/>
                             <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black">Check-In / Out</p>
                                <p className="font-bold text-sm">{hotel?.checkInTime} - {hotel?.checkOutTime}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <Phone size={18} className="text-emerald-400"/>
                             <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black">Contact</p>
                                <p className="font-bold text-sm">{hotel?.contact?.phone || "N/A"}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <Mail size={18} className="text-rose-400"/>
                             <div className="overflow-hidden">
                                <p className="text-[10px] text-slate-400 uppercase font-black">Official Email</p>
                                <p className="font-bold text-sm truncate">{hotel?.contact?.email || "N/A"}</p>
                             </div>
                          </div>
                          {hotel?.referwebsiteurl && (
  <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
     <Globe size={18} className="text-blue-400"/>
     <div className="overflow-hidden">
        <p className="text-[10px] text-slate-400 uppercase font-black">Official Website</p>
        <a 
          href={hotel.referwebsiteurl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-bold text-sm truncate text-blue-300 hover:text-blue-100 transition-colors flex items-center gap-1"
        >
          Visit Website
        </a>
     </div>
  </div>
)}
                       </div>
                    </div>
                  </div>
                </div>

                {/* 4. Reviews List Section */}
                <section className="pt-8 border-t border-slate-100">
                   <div className="flex items-center gap-2 mb-6">
                      <MessageSquare className="text-blue-600" />
                      <h3 className="text-xl font-black text-slate-900">Guest Reviews ({hotel?.reviews?.length || 0})</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel?.reviews?.length > 0 ? (
                        hotel.reviews.map((rev, i) => (
                          <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="flex gap-1">
                                 {[...Array(rev.rating)].map((_, i) => (
                                   <Star key={i} size={12} className="text-amber-500" fill="currentColor" />
                                 ))}
                               </div>
                               <span className="text-xs font-black text-slate-400 uppercase ml-auto">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600 font-bold text-sm italic">"{rev.comment}"</p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-10 bg-slate-50 rounded-[2rem] text-center text-slate-400 font-bold italic">No reviews yet.</div>
                      )}
                   </div>
                </section>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-6 bg-slate-50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Calendar size={14}/> Listed on: {new Date(hotel?.createdAt).toLocaleDateString()}
             </div>
             <button 
               onClick={onClose}
               className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
             >
               Close Preview
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Reusable Stat Card
const StatCard = ({ icon, label, value }) => (
  <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-4">
    <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-black text-slate-800 leading-tight">{value || "0"}</p>
    </div>
  </div>
);

export default HotelViewModal;