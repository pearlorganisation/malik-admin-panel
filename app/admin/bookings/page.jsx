"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Users,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useGetBookingsQuery } from "@/features/booking/bookingApi";
import { useRouter } from "next/navigation";

const BookingCard = ({ booking }) => {
  const router = useRouter();

  const mainImage =
    booking?.activity?.images?.find((img) => img.isMain)?.url ||
    booking?.activity?.images?.[0]?.url ||
    "/placeholder.jpg";

  const statusConfig = {
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      dot: "bg-amber-400",
    },
    confirmed: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      dot: "bg-emerald-400",
    },
    paid: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-400" },
    cancelled: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" },
    completed: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-400" },
  };

  const statusStyle = statusConfig[booking.status] || statusConfig.pending;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const totalParticipants = booking.participants.reduce(
    (acc, p) => acc + p.quantity,
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col group">
      {/* Header: Image + Status */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={mainImage}
          alt={booking.activity.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}
          >
            <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
            {booking.status}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight flex-1 pr-2">
            {booking.activity.title}
          </h3>
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(booking.date)}</span>
            <Clock className="w-3 h-3" />
            <span>{booking.timeSlot}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-gray-500">
              <Users className="w-3 h-3" />
              {totalParticipants} Pax
            </span>
            <span className="font-medium text-gray-900">
              {booking.totalAmount} {booking.currency}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 truncate flex-1">
            {booking.user?.name || booking.user?.email}
          </div>
          <button
            onClick={() => router.push(`/admin/booking/${booking._id}`)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  const resetToPage1 = useCallback(() => {
    if (page !== 1) setPage(1);
  }, [page]);

  useEffect(() => {
    resetToPage1();
  }, [debouncedSearch, statusFilter, resetToPage1]);

  const { data, isLoading, isError, isFetching } = useGetBookingsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const bookings = data?.bookings || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const statusFilters = [
    { key: "all", label: "All", count: data?.pagination?.totalBookings },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "paid", label: "Paid" },
    { key: "cancelled", label: "Cancelled" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Bookings
          </h1>
          <p className="text-gray-600">
            Manage all customer bookings ({data?.pagination?.totalBookings || 0}{" "}
            total)
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by activity, customer name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-slate-100 transition-all"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setStatusFilter(filter.key);
                    resetToPage1();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === filter.key
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  {filter.label}
                  {filter.count !== undefined && (
                    <span className="ml-1 text-xs bg-white/80 text-slate-600 px-2 py-0.5 rounded-full">
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading || isFetching ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-slate-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : isError ? (
            <div className="p-12 text-center border-t border-gray-200">
              <p className="text-red-600 text-lg font-medium mb-2">
                Failed to load bookings
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-slate-700 hover:text-slate-900 font-medium"
              >
                Try again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center border-t border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, pagination.totalBookings)} of{" "}
                      {pagination.totalBookings} bookings
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="p-2 text-gray-500 hover:text-slate-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm">
                        Page {page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="p-2 text-gray-500 hover:text-slate-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
