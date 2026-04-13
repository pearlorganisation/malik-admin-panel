"use client";
import React, { useState, useEffect } from "react";
import { useCreateHotelMutation, useUpdateHotelMutation, useGetHotelByIdQuery } from "./hotelApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

const HotelForm = ({ id }) => {
  const isEdit = Boolean(id);
  const router = useRouter();

  // 1. Fetch Data (Skip if not edit mode)
  const { data: hotelData, isLoading: isFetching } = useGetHotelByIdQuery(id, { 
    skip: !id,
    refetchOnMountOrArgChange: true 
  });
  
  const { data: placesData, isLoading: placesLoading } = useGetAllPlacesQuery();

  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    pricePerNight: "",
  });

  // 2. Pre-fill Logic (Stronger check)
  useEffect(() => {
    if (isEdit && hotelData?.data) {
      const hotel = hotelData.data;
      setForm({
        name: hotel.name || "",
        description: hotel.description || "",
        // Agar backend location object bhej raha hai to ._id nikalenge
        location: typeof hotel.location === 'object' ? hotel.location?._id : hotel.location,
        pricePerNight: hotel.pricePerNight || "",
      });
    }
  }, [hotelData, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location) return toast.error("Please select a valid location");

    try {
      if (isEdit) {
        await updateHotel({ id, data: form }).unwrap();
        toast.success("Hotel updated successfully");
      } else {
        await createHotel(form).unwrap();
        toast.success("Hotel created successfully");
      }
      router.push("/admin/hotels");
      router.refresh();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Loading state for Edit mode
  if (isEdit && isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium italic">Fetching data...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to List
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <h2 className="text-2xl font-bold text-slate-900">{isEdit ? "Edit Property" : "Add New Property"}</h2>
          <p className="text-slate-500 mt-1">Manage your hotel details and locations.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Hotel Name</label>
              <input required name="name" value={form.name} onChange={handleChange}
                placeholder="The Grand Palace"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-900"
              />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Price per Night (₹)</label>
              <input required type="number" name="pricePerNight" value={form.pricePerNight} onChange={handleChange}
                placeholder="0.00"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-900"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Location / Place</label>
              <select required name="location" value={form.location} onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white outline-none transition-all text-slate-900 appearance-none bg-no-repeat bg-[right_1.25rem_center]"
              >
                <option value="">Select a place...</option>
                {placesData?.data?.map((place) => (
                  <option key={place._id} value={place._id}>{place.name}</option>
                ))}
              </select>
              {placesLoading && <p className="text-[10px] text-blue-500 ml-2">Loading locations...</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
              <textarea required rows={4} name="description" value={form.description} onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white outline-none transition-all resize-none text-slate-900"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" disabled={isCreating || isUpdating}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl transition-all font-bold shadow-lg disabled:opacity-50"
            >
              {isCreating || isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEdit ? "Update Hotel" : "Publish Hotel"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default HotelForm;