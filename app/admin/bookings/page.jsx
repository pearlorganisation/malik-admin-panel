"use client";

import React, { useState } from "react";
import {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useDeleteBookingMutation,
  useUpdateBookingStatusMutation,
} from "@/features/booking/bookingApi";
import {
  Ticket,
  Trash2,
  Eye,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Car,
  Clock3,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const STATUS_STYLES = {
  confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
};

const PAY_STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-600 border-emerald-200",
  awaiting_payment: "bg-amber-50 text-amber-600 border-amber-200",
  pending: "bg-blue-50 text-blue-600 border-blue-200",
  failed: "bg-red-50 text-red-500 border-red-200",
};

const PAY_STATUS_LABELS = {
  paid: "Paid",
  awaiting_payment: "Awaiting payment",
  pending: "Pending",
  failed: "Failed",
};

function getFieldDef(pkg, fieldId) {
  return pkg?.bookingFields?.find((f) => f._id === fieldId) || null;
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
function StatCard({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Detail Modal (fetches fresh data via getBookingById)
// ─────────────────────────────────────────────
function BookingDetailModal({ bookingId, onClose }) {
  const { data, isLoading } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  const b = data?.data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
              <Ticket size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Voucher Details
              </h3>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                {b?.bookingReference || "—"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="p-6 max-h-[78vh] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f8fafc",
          }}
        >
          {isLoading || !b ? (
            <div className="py-16 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
              Loading booking details…
            </div>
          ) : (
            <>
              {/* Activity Images */}
              {b.activity?.Images?.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {b.activity.Images.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img.secure_url}
                      alt=""
                      className="w-full h-16 object-cover rounded-xl"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ))}
                </div>
              )}

              {/* Guest & Transport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Guest */}
                <div>
                  <SectionLabel icon={<User size={12} />}>
                    Guest details
                  </SectionLabel>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                    <p className="font-black text-slate-900 text-sm mb-2">
                      {b.guestDetails.firstName} {b.guestDetails.lastName}
                    </p>
                    <InfoRow icon={<Mail size={12} className="text-blue-500" />}>
                      {b.guestDetails.email}
                    </InfoRow>
                    <InfoRow
                      icon={<Phone size={12} className="text-emerald-500" />}
                    >
                      +{b.guestDetails.whatsappPhone}
                    </InfoRow>
                  </div>
                </div>

                {/* Pickup & SUV */}
                <div>
                  <SectionLabel icon={<MapPin size={12} />}>
                    Pickup & transport
                  </SectionLabel>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs font-bold text-slate-500 mb-1">
                      Pickup hotel
                    </p>
                    <p className="text-sm font-black text-slate-800 uppercase mb-3">
                      {b.guestDetails.pickupHotel || "Not specified"}
                    </p>
                    {b.extras?.isSuvSelected ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-xl text-[10px] font-black uppercase">
                        <Car size={11} />
                        {b.extras.suvModel} × {b.extras.suvCount}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        No SUV transfer
                      </p>
                    )}
                    {b.extras?.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 italic">
                        Note: {b.extras.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-6">
                <SectionLabel icon={<Calendar size={12} />}>
                  Tour schedule
                </SectionLabel>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-wrap gap-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Date
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {fmtDate(b.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Time slot
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {b.timeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Booked on
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {fmtDate(b.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Status
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        STATUS_STYLES[b.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package & Booking Fields */}
              <div className="mb-6">
                <SectionLabel icon={<Package size={12} />}>
                  Package & booking fields
                </SectionLabel>
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  {/* Package header */}
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-800">
                      {b.packageId?.name || "—"}
                    </p>
                    {b.packageId?.price && (
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        Base price: AED {b.packageId.price}
                      </p>
                    )}
                  </div>
                  {/* Booking fields */}
                  {b.bookingFields?.length > 0 ? (
                    b.bookingFields.map((bf, i) => {
                      const def = getFieldDef(b.packageId, bf.fieldId);
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {def?.name || bf.fieldId}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {def?.unit}
                              {def?.price > 0 && ` · AED ${def.price} each`}
                            </p>
                          </div>
                          <span className="text-sm font-black text-slate-900">
                            {bf.value}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="px-4 py-3 text-xs text-slate-400">
                      No booking fields
                    </p>
                  )}
                </div>
              </div>

              {/* Addons */}
              <div className="mb-6">
                <SectionLabel icon={<Package size={12} />}>Addons</SectionLabel>
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  {b.addons?.length > 0 ? (
                    b.addons.map((a, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center px-4 py-3 border-b border-slate-50 last:border-0"
                      >
                        <p className="text-xs font-bold text-slate-700">
                          {a.title}
                        </p>
                        <span className="text-xs font-black text-slate-800">
                          × {a.quantity} · AED {a.price}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-xs text-slate-400">
                      No addons selected
                    </p>
                  )}
                </div>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="mb-6">
                <SectionLabel icon={<ShieldCheck size={12} />}>
                  Inclusions & exclusions
                </SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">
                      Included
                    </p>
                    <ul className="space-y-1">
                      {b.whatInclude?.map((inc, i) => (
                        <li
                          key={i}
                          className="text-[11px] font-bold text-emerald-900/70 flex items-start gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-red-600 uppercase mb-2">
                      Excluded
                    </p>
                    <ul className="space-y-1">
                      {b.whatExclude?.map((exc, i) => (
                        <li
                          key={i}
                          className="text-[11px] font-bold text-red-900/70 flex items-start gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <SectionLabel icon={<CreditCard size={12} />}>
                  Financial summary
                </SectionLabel>
                <div className="border border-slate-100 rounded-3xl overflow-hidden">
                  <div className="divide-y divide-slate-50">
                    {b.amountBreakdown?.map((row, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center px-5 py-4"
                      >
                        <div>
                          <p className="text-sm font-black text-slate-700 uppercase tracking-tight">
                            {row.label}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                            Qty: {row.quantity}
                          </p>
                        </div>
                        <span className="font-black text-slate-900 text-base">
                          AED {row.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900 px-5 py-5 flex justify-between items-center text-white">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total amount payable
                      </p>
                      <span
                        className={`inline-block mt-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                          PAY_STATUS_STYLES[b.paymentStatus] ||
                          PAY_STATUS_STYLES.pending
                        }`}
                      >
                        {PAY_STATUS_LABELS[b.paymentStatus] || b.paymentStatus}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">
                        {b.paymentMethod === "pay_later"
                          ? "Pay at counter"
                          : "Paid online"}
                      </p>
                    </div>
                    <span className="text-3xl font-black">
                      AED {b.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
      {icon}
      {children}
    </h4>
  );
}

function InfoRow({ icon, children }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-1.5">
      {icon}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id to confirm

  const { data, isLoading, isFetching } = useGetBookingsQuery({
    page,
    search,
    status,
  });
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBookingStatusMutation();

  const bookings = data?.data || [];
  const pagination = data?.pagination || {};

  // Stats derived from current page (server ideally returns totals, adjust if needed)
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const revenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id).unwrap();
      toast.success("Booking deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status → ${newStatus}`);
    } catch {
      toast.error("Status update failed");
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest text-xs">
        Loading records…
      </div>
    );

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Reservations
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
            Manage activity & tour bookings
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search ref, name, email…"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 shadow-sm bg-white"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 outline-none shadow-sm bg-white"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total (this page)"
          value={bookings.length}
          color="text-blue-600"
        />
        <StatCard
          label="Confirmed"
          value={confirmed}
          color="text-emerald-600"
        />
        <StatCard label="Pending" value={pending} color="text-amber-600" />
        <StatCard
          label="Revenue"
          value={`AED ${revenue.toLocaleString()}`}
          color="text-slate-900"
        />
      </div>

      {/* ── Table ── */}
      <div
        className={`bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden transition-opacity ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                {[
                  "Booking ref",
                  "Customer",
                  "Activity & package",
                  "Schedule",
                  "Status",
                  "Total",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`p-5 text-[10px] font-black uppercase tracking-widest ${
                      i >= 4 ? "text-center" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-slate-400 text-sm font-bold"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Ref */}
                    <td className="p-5">
                      <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg text-xs border border-blue-100">
                        {item.bookingReference}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-5">
                      <p className="font-black text-slate-900 text-[13px]">
                        {item.guestDetails.firstName} {item.guestDetails.lastName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                        {item.guestDetails.email}
                      </p>
                      <p className="text-[10px] text-slate-300 font-bold mt-0.5">
                        +{item.guestDetails.whatsappPhone}
                      </p>
                    </td>

                    {/* Activity */}
                    <td className="p-5 max-w-[210px]">
                      <p className="text-[12px] font-black text-slate-800 line-clamp-1 uppercase">
                        {item.activityName}
                      </p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">
                        {item.variantName}
                      </p>
                    </td>

                    {/* Schedule */}
                    <td className="p-5 text-[11px] text-slate-600 font-bold">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(item.date).toLocaleDateString("en-GB")}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock3 size={12} className="text-slate-400" />
                        {item.timeSlot}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-5 text-center">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        disabled={isUpdating}
                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                          STATUS_STYLES[item.status] || STATUS_STYLES.pending
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Total */}
                    <td className="p-5 text-center">
                      <p className="text-[14px] font-black text-slate-900">
                        AED {item.totalAmount}
                      </p>
                      <p
                        className={`text-[9px] font-black uppercase mt-0.5 ${
                          item.paymentMethod === "pay_later"
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {item.paymentMethod === "pay_later"
                          ? "Pay at counter"
                          : "Paid online"}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          PAY_STATUS_STYLES[item.paymentStatus] ||
                          PAY_STATUS_STYLES.pending
                        }`}
                      >
                        {PAY_STATUS_LABELS[item.paymentStatus] ||
                          item.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedBookingId(item._id)}
                          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete booking"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center disabled:opacity-40 hover:border-slate-400 transition-all"
          >
            <ChevronLeft size={15} />
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                  page === p
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-400 border border-slate-200 hover:border-slate-400"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center disabled:opacity-40 hover:border-slate-400 transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedBookingId && (
        <BookingDetailModal
          bookingId={selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-2">
              Delete booking?
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              This will permanently remove the record from the system. This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}