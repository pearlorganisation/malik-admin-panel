// "use client";

// import React, { useState, useCallback, useEffect } from "react";
// import Image from "next/image";
// import {
//   Calendar,
//   Clock,
//   Users,
//   Search,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   MoreHorizontal,
// } from "lucide-react";
// import { useGetBookingsQuery } from "@/features/booking/bookingApi";
// import { useRouter } from "next/navigation";

// const BookingCard = ({ booking }) => {
//   const router = useRouter();

//   const mainImage =
//     booking?.activity?.images?.find((img) => img.isMain)?.url ||
//     booking?.activity?.images?.[0]?.url ||
//     "/placeholder.jpg";

//   const statusConfig = {
//     pending: {
//       bg: "bg-amber-100",
//       text: "text-amber-800",
//       dot: "bg-amber-400",
//     },
//     confirmed: {
//       bg: "bg-emerald-100",
//       text: "text-emerald-800",
//       dot: "bg-emerald-400",
//     },
//     paid: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-400" },
//     cancelled: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" },
//     completed: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-400" },
//   };

//   const statusStyle = statusConfig[booking.status] || statusConfig.pending;

//   const formatDate = (dateStr) =>
//     new Date(dateStr).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });

//   const totalParticipants = booking.participants.reduce(
//     (acc, p) => acc + p.quantity,
//     0
//   );

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col group">
//       {/* Header: Image + Status */}
//       <div className="relative h-32 overflow-hidden">
//         <Image
//           src={mainImage}
//           alt={booking.activity.title}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         <div className="absolute top-2 right-2">
//           <div
//             className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}
//           >
//             <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
//             {booking.status}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-4 flex-1 flex flex-col">
//         <div className="flex items-start justify-between mb-2">
//           <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight flex-1 pr-2">
//             {booking.activity.title}
//           </h3>
//           <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//             <MoreHorizontal className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="space-y-2 mb-3">
//           <div className="flex items-center gap-2 text-xs text-gray-600">
//             <Calendar className="w-3 h-3" />
//             <span>{formatDate(booking.date)}</span>
//             <Clock className="w-3 h-3" />
//             <span>{booking.timeSlot}</span>
//           </div>

//           <div className="flex items-center justify-between text-xs">
//             <span className="flex items-center gap-1 text-gray-500">
//               <Users className="w-3 h-3" />
//               {totalParticipants} Pax
//             </span>
//             <span className="font-medium text-gray-900">
//               {booking.totalAmount} {booking.currency}
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
//           <div className="text-xs text-gray-500 truncate flex-1">
//             {booking.user?.name || booking.user?.email}
//           </div>
//           <button
//             onClick={() => router.push(`/admin/booking/${booking._id}`)}
//             className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
//           >
//             View
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminBookings = () => {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   const router = useRouter();

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [search]);

//   // Reset page when filters change
//   const resetToPage1 = useCallback(() => {
//     if (page !== 1) setPage(1);
//   }, [page]);

//   useEffect(() => {
//     resetToPage1();
//   }, [debouncedSearch, statusFilter, resetToPage1]);

//   const { data, isLoading, isError, isFetching } = useGetBookingsQuery({
//     page,
//     limit,
//     search: debouncedSearch || undefined,
//     status: statusFilter !== "all" ? statusFilter : undefined,
//   });

//   const bookings = data?.bookings || [];
//   const pagination = data?.pagination;

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
//       setPage(newPage);
//     }
//   };

//   const statusFilters = [
//     { key: "all", label: "All", count: data?.pagination?.totalBookings },
//     { key: "pending", label: "Pending" },
//     { key: "confirmed", label: "Confirmed" },
//     { key: "paid", label: "Paid" },
//     { key: "cancelled", label: "Cancelled" },
//     { key: "completed", label: "Completed" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             All Bookings
//           </h1>
//           <p className="text-gray-600">
//             Manage all customer bookings ({data?.pagination?.totalBookings || 0}{" "}
//             total)
//           </p>
//         </div>

//         {/* Filters & Search */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
//             {/* Search */}
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by activity, customer name or email..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-slate-100 transition-all"
//               />
//             </div>

//             {/* Status Filters */}
//             <div className="flex flex-wrap gap-2">
//               {statusFilters.map((filter) => (
//                 <button
//                   key={filter.key}
//                   onClick={() => {
//                     setStatusFilter(filter.key);
//                     resetToPage1();
//                   }}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
//                     statusFilter === filter.key
//                       ? "bg-slate-900 text-white shadow-sm"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
//                   }`}
//                 >
//                   {filter.label}
//                   {filter.count !== undefined && (
//                     <span className="ml-1 text-xs bg-white/80 text-slate-600 px-2 py-0.5 rounded-full">
//                       {filter.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bookings Grid */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {isLoading || isFetching ? (
//             <div className="p-12 text-center">
//               <Loader2 className="w-8 h-8 text-slate-500 animate-spin mx-auto mb-4" />
//               <p className="text-gray-600">Loading bookings...</p>
//             </div>
//           ) : isError ? (
//             <div className="p-12 text-center border-t border-gray-200">
//               <p className="text-red-600 text-lg font-medium mb-2">
//                 Failed to load bookings
//               </p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="text-slate-700 hover:text-slate-900 font-medium"
//               >
//                 Try again
//               </button>
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="p-12 text-center border-t border-gray-200">
//               <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Search className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No bookings found
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Try adjusting your search or filter criteria
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
//                 {bookings.map((booking) => (
//                   <BookingCard key={booking._id} booking={booking} />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {pagination && (
//                 <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-600">
//                       Showing {(page - 1) * limit + 1} to{" "}
//                       {Math.min(page * limit, pagination.totalBookings)} of{" "}
//                       {pagination.totalBookings} bookings
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handlePageChange(page - 1)}
//                         disabled={!pagination.hasPrevPage}
//                         className="p-2 text-gray-500 hover:text-slate-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
//                       >
//                         <ChevronLeft className="w-4 h-4" />
//                       </button>
//                       <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm">
//                         Page {page} of {pagination.totalPages}
//                       </span>
//                       <button
//                         onClick={() => handlePageChange(page + 1)}
//                         disabled={!pagination.hasNextPage}
//                         className="p-2 text-gray-500 hover:text-slate-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
//                       >
//                         <ChevronRight className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminBookings;



"use client";

import React, { useState } from "react";
import { 
  useGetBookingsQuery, 
  useDeleteBookingMutation, 
  useUpdateBookingStatusMutation 
} from "@/features/booking/bookingApi";
import { 
  Ticket, Trash2, Eye, Calendar, User, 
  MapPin, CreditCard, Car, Clock3, 
  X, CheckCircle2, Phone, Mail, ChevronDown, 
  Info, ShieldCheck, AlertCircle, RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetBookingsQuery({ page, search, status });
  const [deleteBooking] = useDeleteBookingMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = data?.data || [];
  const pagination = data?.pagination || {};

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking record permanently?")) {
      try {
        await deleteBooking(id).unwrap();
        toast.success("Booking deleted from database");
      } catch (err) {
        toast.error("Failed to delete booking");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Loading Records...</div>;

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reservations</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">Manage Activity & Tour Bookings</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search Reference or Email..." 
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 outline-none shadow-sm"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Booking Ref</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Customer Detail</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Activity & Package</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Tour Schedule</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Total</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg text-xs border border-blue-100">
                      {item.bookingReference}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-[13px]">{item.guestDetails.firstName} {item.guestDetails.lastName}</span>
                      <span className="text-[11px] text-slate-400 font-bold tracking-tight">{item.guestDetails.email}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="max-w-[200px]">
                      <p className="text-[12px] font-black text-slate-800 line-clamp-1 uppercase">{item.activityName}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">{item.variantName}</p>
                    </div>
                  </td>
                  <td className="p-5 text-[11px] text-slate-600 font-bold">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={13} className="text-slate-400" />
                      {new Date(item.date).toLocaleDateString('en-GB')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 size={13} className="text-slate-400" />
                      {item.timeSlot}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      disabled={isUpdating}
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border outline-none cursor-pointer ${getStatusColor(item.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-5">
                    <div className="text-[14px] font-black text-slate-900">${item.totalAmount}</div>
                    <div className={`text-[9px] font-black uppercase mt-0.5 ${item.paymentMethod === 'pay_later' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {item.paymentMethod === 'pay_later' ? 'PAY AT COUNTER' : 'PAID ONLINE'}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedBooking(item)}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
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

      {/* VIEW DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
                    <Ticket size={24} className="text-white" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black tracking-tight">Voucher Details</h3>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{selectedBooking.bookingReference}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
              {/* Customer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Passenger Contact
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-base font-black text-slate-900 mb-2">{selectedBooking.guestDetails.firstName} {selectedBooking.guestDetails.lastName}</p>
                    <div className="space-y-1.5 text-xs font-bold text-slate-500 uppercase">
                        <div className="flex items-center gap-2"><Mail size={14} className="text-blue-500" /> {selectedBooking.guestDetails.email}</div>
                        <div className="flex items-center gap-2"><Phone size={14} className="text-emerald-500" /> {selectedBooking.guestDetails.whatsappPhone}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Stay Info
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 h-full">
                    <p className="text-sm font-black text-slate-700 leading-relaxed uppercase">
                      {selectedBooking.guestDetails.pickupHotel || "Standard Pickup"}
                    </p>
                    {selectedBooking.extras.isSuvSelected && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black uppercase">
                            <Car size={12} /> {selectedBooking.extras.suvModel} (x{selectedBooking.extras.suvCount})
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Snapshots: Inclusions */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={14} /> Voucher Snapshots
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-700 mb-2 uppercase">Included</p>
                        <ul className="text-[11px] space-y-1 font-bold text-emerald-900/70">
                            {selectedBooking.whatInclude?.map((inc, i) => <li key={i}>• {inc}</li>)}
                        </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <p className="text-[10px] font-black text-red-700 mb-2 uppercase">Excluded</p>
                        <ul className="text-[11px] space-y-1 font-bold text-red-900/70">
                            {selectedBooking.whatExclude?.map((exc, i) => <li key={i}>• {exc}</li>)}
                        </ul>
                    </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard size={14} /> Financial Summary
                </h4>
                <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-inner">
                    <div className="p-6 space-y-4 bg-white">
                        {selectedBooking.amountBreakdown?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{item.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400">UNIT QUANTITY: {item.quantity}</p>
                                </div>
                                <span className="font-black text-slate-900 text-base">${item.amount}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount Payable</p>
                            <p className="text-xs font-bold text-emerald-400 uppercase mt-1 flex items-center gap-1">
                                {selectedBooking.paymentStatus}
                            </p>
                        </div>
                        <span className="text-3xl font-black">${selectedBooking.totalAmount}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Container */}
      <div className="mt-8 flex justify-center gap-2">
         {Array.from({ length: pagination.pages || 1 }, (_, i) => (
            <button
              key={i+1}
              onClick={() => setPage(i+1)}
              className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === i+1 ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'}`}
            >
              {i+1}
            </button>
         ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}