"use client";
import React, { useState } from "react";
import {
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
} from "@/features/contact/contactApi.js";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Inbox
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function ContactsPage() {
  const { data, isLoading } = useGetAllContactsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedContact, setSelectedContact] = useState(null);

  const contacts = data?.data || [];

  // 1. Filter Data
  const filteredData = contacts.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    updateStatus({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
   <div className="p-2 w-full max-w-7xl mx-auto font-sans text-gray-900 overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Contact Queries
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track incoming customer messages.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Message Preview</th>
                <th className="px-6 py-4 font-medium">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Date <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 uppercase">
                          {item.name.substring(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 break-words">{item.email}</span>
                        <span className="text-xs text-gray-500">
                          {item.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[200px] truncate text-gray-500 break-words">
                        {item.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={isUpdating}
                        value={item.status}
                        onChange={(e) =>
                          handleStatusUpdate(item._id, e.target.value)
                        }
                        className={`h-8 rounded-full border-0 px-3 text-xs font-semibold outline-none ring-1 ring-inset focus:ring-2 cursor-pointer ${
                          STATUS_STYLES[item.status]
                        }`}
                      >
                        <option value="NEW">New</option>
                        <option value="PENDING">Pending</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedContact(item)}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Inbox className="h-10 w-10 mb-2 opacity-50" />
                      <p>No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
            <span className="text-xs text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span> entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal View */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 transform transition-all scale-100">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Message Details
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    {selectedContact.name}
                  </h4>
                  <div className="mt-1 flex flex-col gap-0.5 text-sm text-gray-500">
                    <span>{selectedContact.email}</span>
                    <span>{selectedContact.phone}</span>
                  </div>
                </div>
                <div
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    STATUS_STYLES[selectedContact.status]
                  }`}
                >
                  {selectedContact.status}
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-100">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {selectedContact.message}
                </p>
              </div>

              <div className="mt-2 text-right">
                <span className="text-xs text-gray-400">
                  Received:{" "}
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}