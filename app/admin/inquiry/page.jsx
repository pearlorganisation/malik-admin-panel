"use client"
import React, { useState } from "react";
import { 
  useGetAllInquiriesQuery, 
  useGetInquiryByIdQuery, 
  useUpdateInquiryStatusMutation, 
  useDeleteInquiryMutation 
} from "@/features/inquiry/inquiryApi";
import { 
  Eye, Trash2, X, Mail, Phone, Users, 
  Calendar, MessageSquare, Loader2, ChevronRight 
} from "lucide-react";
import { toast } from "react-hot-toast";

const InquiryDashboard = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { data, isLoading } = useGetAllInquiriesQuery();
  const [deleteInquiry] = useDeleteInquiryMutation();

  const inquiries = data?.data || [];

  const handleDelete = async (id) => {
    if (confirm("Move this inquiry to trash?")) {
      await deleteInquiry(id);
      toast.success("Inquiry deleted successfully");
    }
  };

  if (isLoading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Inquiries</h1>
            <p className="text-slate-500 mt-1">Manage and respond to tour bookings.</p>
          </div>
          <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border shadow-sm text-slate-600">
            Total: {data?.count || 0}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Tour Details</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((item) => (
                <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail size={12} /> {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {item.tourName || "General Inquiry"}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Users size={12} /> {item.adults} Adults, {item.kids} Kids
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={item.status || "pending"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedId(item._id)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedId && (
        <InquiryDetailModal 
          id={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </div>
  );
};

/**
 * Status Pill Component
 */
const StatusPill = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-100",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

/**
 * Modern Detail Modal
 */
const InquiryDetailModal = ({ id, onClose }) => {
  const { data, isLoading } = useGetInquiryByIdQuery(id);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateInquiryStatusMutation();
  
  const inquiry = data?.data;

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("Status updated");
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  if (!inquiry && !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {isLoading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : (
          <>
            <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
              <div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Inquiry Details</p>
                <h2 className="text-2xl font-bold">{inquiry.name}</h2>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                  <Calendar size={14} /> Received on {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Contact */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-2 bg-slate-100 rounded-lg"><Mail size={16} /></div>
                      <span>{inquiry.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-2 bg-slate-100 rounded-lg"><Phone size={16} /></div>
                      <span>{inquiry.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Travel Party</h4>
                  <div className="flex gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex-1 text-center">
                      <div className="text-2xl font-bold text-slate-800">{inquiry.adults}</div>
                      <div className="text-xs text-slate-500">Adults</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex-1 text-center">
                      <div className="text-2xl font-bold text-slate-800">{inquiry.kids}</div>
                      <div className="text-xs text-slate-500">Kids</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tour & Message */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Requested Tour</h4>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="font-bold text-blue-900">{inquiry.tourName || "Custom Package Inquiry"}</p>
                    <p className="text-xs text-blue-700 mt-1">ID: {inquiry.tourId || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Requirement</h4>
                  <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-sm leading-relaxed relative">
                    <MessageSquare size={14} className="absolute top-4 right-4 text-slate-300" />
                    {inquiry.requirement}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-8 bg-slate-50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500 uppercase">Status</span>
                <select 
                  className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  defaultValue={inquiry.status || "pending"}
                  disabled={isUpdating}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button 
                onClick={onClose}
                className="w-full md:w-auto px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryDashboard;