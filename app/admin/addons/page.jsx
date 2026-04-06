"use client";
import { useState } from "react";
import { useGetAddonsQuery } from "@/features/addon/addonApi";
import AddonTable from "@/components/addon/AddonTable";
import AddonDrawer from "@/components/addon/AddonDrawer";
import AddonViewModal from "@/components/addon/AddonViewModal";
import { Plus, Search, RefreshCw } from "lucide-react";

export default function AddonPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  
  const { data, isLoading, refetch, isFetching } = useGetAddonsQuery({});

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Addons Management</h1>
            <p className="text-gray-500 mt-1">Manage your extra services and pricing</p>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => refetch()}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { setEditData(null); setOpen(true); }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Create Addon</span>
            </button>
          </div>
        </div>

        {/* Stats/Search bar could go here */}
        
        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <AddonTable
            data={data?.data?.data || []}
            loading={isLoading}
            onEdit={(item) => { setEditData(item); setOpen(true); }}
            onView={(item) => setViewData(item)}
          />
        </div>
      </div>

      {/* Overlays */}
      <AddonDrawer
        open={open}
        onClose={() => setOpen(false)}
        editData={editData}
      />
      
      <AddonViewModal 
        data={viewData} 
        onClose={() => setViewData(null)} 
      />
    </div>
  );
}