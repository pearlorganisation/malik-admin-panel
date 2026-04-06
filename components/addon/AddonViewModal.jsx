"use client";
import { X, CheckCircle2 } from "lucide-react";

export default function AddonViewModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-8 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{data.name}</h2>
            <span className="mt-2 px-3 py-1 bg-white text-indigo-600 font-bold rounded-full text-sm italic uppercase">Active Addon</span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-gray-500 font-medium uppercase text-xs tracking-widest">Price Unit</span>
            <span className="text-2xl font-black text-gray-900">₹{data.price}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-gray-500 font-medium uppercase text-xs tracking-widest">Maximum Quantity</span>
            <span className="text-xl font-bold text-gray-700">{data.max} Units</span>
          </div>

          <button onClick={onClose} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]">
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}