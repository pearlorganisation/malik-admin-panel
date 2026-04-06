"use client";
import { useDeleteAddonMutation } from "@/features/addon/addonApi";
import { Edit3, Trash2, Eye, MoreHorizontal } from "lucide-react";

export default function AddonTable({ data, loading, onEdit, onView }) {
  const [deleteAddon] = useDeleteAddonMutation();

  if (loading) return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Fetching addons...</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4">Addon Name</th>
            <th className="px-6 py-4 text-center">Price</th>
            <th className="px-6 py-4 text-center">Limit (Max)</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {data.length > 0 ? data.map((item) => (
            <tr key={item._id} className="group hover:bg-indigo-50/30 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
              <td className="px-6 py-4 text-center">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                    ₹{item.price.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-gray-600 font-medium">{item.max} units</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2 transition-opacity">
                  <button onClick={() => onView(item)} className="p-2 hover:bg-white rounded-lg text-gray-600 shadow-sm border border-transparent hover:border-gray-200 transition-all" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(item)} className="p-2 hover:bg-white rounded-lg text-blue-600 shadow-sm border border-transparent hover:border-gray-200 transition-all" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => {if(confirm('Are you sure?')) deleteAddon(item._id)}} className="p-2 hover:bg-white rounded-lg text-red-600 shadow-sm border border-transparent hover:border-gray-200 transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
                <td colSpan="4" className="text-center py-20 text-gray-400">No addons found. Create one to get started.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}