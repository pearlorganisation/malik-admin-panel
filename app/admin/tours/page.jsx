"use client";

import React, { useState } from "react";
import { useGetAllToursQuery, useDeleteTourMutation } from "@/features/tour/tourApi";
import { 
  Ticket, Trash2, Eye, Calendar, User, 
  MapPin, CreditCard, Car, Anchor, Clock3, 
  X, CheckCircle2, Phone, Mail, Users, Zap
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminToursPage() {
  const { data, isLoading } = useGetAllToursQuery();
  const [deleteTour] = useDeleteTourMutation();
  
  // State for Modal
  const [selectedTour, setSelectedTour] = useState(null);

  const tours = data?.data || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteTour(id).unwrap();
        toast.success("Booking deleted");
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-slate-500">Loading Bookings...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Bookings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage all customer tour reservations</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
           <span className="text-xs font-bold text-slate-400 uppercase">Total Result: </span>
           <span className="text-lg font-black text-blue-600">{tours.length}</span>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Reference</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Customer</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Activity</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Schedule</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Transfer</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Amount</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((tour) => (
                <tr key={tour._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                      {tour.bookingReference}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{tour.customerDetails.firstName} {tour.customerDetails.lastName}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{tour.customerDetails.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-[180px]">
                      <p className="text-xs font-bold text-slate-800 truncate uppercase">{tour.activityName}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">{tour.variantName?.split('-')[0]}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[11px] text-slate-600 font-bold">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={13} className="text-slate-400" />
                      {new Date(tour.selectedDate).toLocaleDateString('en-GB')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 size={13} className="text-slate-400" />
                      {tour.timeSlot}
                    </div>
                  </td>
                  <td className="p-4">
                    {tour.transferType === "Private SUV" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase border border-orange-100">
                        <Car size={12} /> SUV x{tour.suvCount || 1}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase border border-slate-200">
                        <Anchor size={12} /> Self
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-black text-slate-900">${tour.pricing.grandTotal}</div>
                    <div className="text-[9px] text-emerald-600 font-black uppercase flex items-center gap-1">
                      <CheckCircle2 size={10} /> Paid
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedTour(tour)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tour._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VIEW MODAL */}
      {selectedTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedTour(null)}
          ></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-black tracking-tight">Booking Details</h3>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{selectedTour.bookingReference}</p>
              </div>
              <button 
                onClick={() => setSelectedTour(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Customer & Pickup Info */}
              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={14} /> Customer Info
                  </h4>
                  <p className="text-base font-black text-slate-900">{selectedTour.customerDetails.firstName} {selectedTour.customerDetails.lastName}</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Mail size={14} className="text-blue-500" /> {selectedTour.customerDetails.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Phone size={14} className="text-emerald-500" /> {selectedTour.customerDetails.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin size={14} /> Pickup Location
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {selectedTour.customerDetails.pickupHotel || "Not Provided (Self Arrival)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity & Breakdown */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Ticket size={14} /> Tour Breakdown
                </h4>
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                  <h5 className="font-black text-blue-900 text-sm mb-1 uppercase">{selectedTour.activityName}</h5>
                  <p className="text-blue-600 text-[11px] font-black mb-4">{selectedTour.variantName}</p>
                  
                  <div className="space-y-3">
                    {selectedTour.participantsBreakdown?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600">{item.quantity} x {item.label}</span>
                        <span className="font-black text-slate-900">${item.pricePerUnit * item.quantity}</span>
                      </div>
                    ))}
                    {selectedTour.transferType === "Private SUV" && (
                       <div className="flex justify-between items-center text-sm pt-2 border-t border-blue-200">
                        <span className="font-bold text-slate-600 flex items-center gap-2"><Car size={14}/> Private SUV Addon</span>
                        <span className="font-black text-slate-900">${selectedTour.pricing.suvTotal}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Pricing */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total Amount</p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-1 uppercase flex items-center gap-1">
                    <CreditCard size={12} /> Payment Verified (Online)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white">${selectedTour.pricing.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
}