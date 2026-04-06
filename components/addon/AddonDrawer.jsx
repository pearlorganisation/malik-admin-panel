"use client";
import { useState, useEffect } from "react";
import { useCreateAddonMutation, useUpdateAddonMutation } from "@/features/addon/addonApi";
import { X, Save } from "lucide-react";

export default function AddonDrawer({ open, onClose, editData }) {
  const [createAddon, { isLoading: isCreating }] = useCreateAddonMutation();
  const [updateAddon, { isLoading: isUpdating }] = useUpdateAddonMutation();

  const [form, setForm] = useState({ name: "", price: "", max: 1 });

  useEffect(() => {
    if (editData) setForm(editData);
    else setForm({ name: "", price: "", max: 1 });
  }, [editData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      await updateAddon({ id: editData._id, data: form });
    } else {
      await createAddon(form);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">{editData ? "Edit Addon" : "Create New Addon"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Addon Name</label>
              <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                placeholder="e.g. Extra Cleaning" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                <input type="number" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-700"
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Limit</label>
                <input type="number" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-700"
                  value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value })} />
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50">
            <button type="submit" onClick={handleSubmit} disabled={isCreating || isUpdating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-400">
              <Save className="w-5 h-5" />
              {isCreating || isUpdating ? "Saving..." : "Save Addon"}
            </button>
            <button onClick={onClose} className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}