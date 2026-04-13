// features/hotel/HotelViewModal.jsx
"use client";
import React from "react";
import { useGetHotelByIdQuery } from "./hotelApi";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, IndianRupee, Star, Info, Calendar, Clock } from "lucide-react";

const HotelViewModal = ({ id, isOpen, onClose }) => {
  const { data: hotelData, isLoading } = useGetHotelByIdQuery(id, { skip: !id || !isOpen });

  if (!isOpen) return null;

  const hotel = hotelData?.data;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Hotel Details</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="py-20 text-center animate-pulse text-slate-400">Loading details...</div>
            ) : (
              <div className="space-y-8">
                {/* Main Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{hotel?.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-lg w-fit">
                      <MapPin size={16} />
                      {hotel?.location?.name || "Location not set"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Price / Night</div>
                    <div className="text-3xl font-black text-slate-900 flex items-center justify-end">
                      <IndianRupee size={24} /> {hotel?.pricePerNight}
                    </div>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-1">
                      <Star size={16} className="text-amber-500" fill="currentColor" /> Rating
                    </div>
                    <div className="text-lg font-bold text-slate-900">{hotel?.rating?.average || 0} / 5.0</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-1">
                      <Clock size={16} className="text-blue-500" /> Status
                    </div>
                    <div className={`text-lg font-bold ${hotel?.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {hotel?.isActive ? 'Active Listing' : 'Inactive'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">About this property</h3>
                  <p className="text-slate-600 leading-relaxed text-lg bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                    {hotel?.description || "No description available for this hotel."}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} /> Created: {new Date(hotel?.createdAt).toLocaleDateString()}
                  </div>
                  <div>ID: {hotel?._id}</div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HotelViewModal;