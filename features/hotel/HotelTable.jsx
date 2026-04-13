"use client";
import React, { useState } from "react";
import { useGetHotelsQuery, useDeleteHotelMutation } from "./hotelApi";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, Trash2, Plus, MapPin, Hotel ,Eye} from "lucide-react";
import { toast } from "react-hot-toast";
import HotelViewModal from "./HotelViewModal";
const HotelTable = () => {
  const { data, isLoading } = useGetHotelsQuery();
  const [deleteHotel] = useDeleteHotelMutation();
const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteHotel(id).unwrap();
        toast.success("Hotel deleted successfully");
      } catch (err) {
        toast.error("Failed to delete hotel");
      }
    }
  };
const handleView = (id) => {
    setSelectedHotelId(id);
    setIsViewOpen(true);
  };
  if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Hotels...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Where to Stay</h1>
          <p className="text-slate-500">Manage your property listings and inventory</p>
        </div>
        <Link href="/admin/hotels/create">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-bold">
            <Plus size={20} /> Add Property
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.data?.map((hotel, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.05 }}
                key={hotel._id} 
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Hotel size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{hotel.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">{hotel.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                    <MapPin size={14} className="text-slate-400" />
                    {hotel.location?.name || "Global"}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-slate-900 font-bold">₹{hotel.pricePerNight}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Per Night</div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleView(hotel._id)}
                      className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <Link href={`/admin/hotels/edit/${hotel._id}`}>
                      <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit3 size={18} />
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(hotel._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <HotelViewModal 
        id={selectedHotelId} 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
      />
    </div>
  );
};

export default HotelTable;