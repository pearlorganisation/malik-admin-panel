"use client";
import React, { useState } from "react";
import { useSearchHotelsQuery, useSoftDeleteHotelMutation } from "./hotelApi";
import Link from "next/link";
import { Edit3, Trash2, Plus, Eye, Search, MapPin, IndianRupee, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import HotelViewModal from "./HotelViewModal";

const HotelTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data, isLoading } = useSearchHotelsQuery({ page, limit: 10, search });
  const [deleteHotel] = useSoftDeleteHotelMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Move this hotel to trash?")) {
      try {
        await deleteHotel(id).unwrap();
        toast.success("Hotel moved to trash");
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Hotels</h1>
          <p className="text-slate-500 font-medium">Manage your properties and bookings</p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" />
          </div>
          <Link href="/admin/hotels/create">
            <button className="bg-slate-900 hover:bg-black text-white p-3.5 md:px-6 rounded-2xl flex items-center gap-2 shadow-lg transition-all">
              <Plus size={20} /> <span className="hidden md:inline font-bold">Add New</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Modern Table Layout */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hotel Details</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.data?.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                        <img src={hotel.images[0]?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-base">{hotel.name}</div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                          <MapPin size={12} /> {hotel.location?.city || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-black text-slate-800 flex items-center">
                      <IndianRupee size={14} />{hotel.pricePerNight}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Per Night</div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${hotel.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {hotel.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {hotel.isFeatured && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2  transition-opacity">
                      <button onClick={() => { setSelectedId(hotel._id); setIsViewOpen(true); }} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"><Eye size={18} /></button>
                      <Link href={`/admin/hotels/edit/${hotel._id}`} className="p-2.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"><Edit3 size={18} /></Link>
                      <button onClick={() => handleDelete(hotel._id)} className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400 uppercase">Showing Page {page}</p>
           <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-white border rounded-xl text-xs font-black disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-white border rounded-xl text-xs font-black">Next</button>
           </div>
        </div>
      </div>

      <HotelViewModal id={selectedId} isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} />
    </div>
  );
};

export default HotelTable;