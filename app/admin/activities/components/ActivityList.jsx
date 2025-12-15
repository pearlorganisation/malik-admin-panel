// app/admin/activities/components/ActivityList.jsx
"use client";

import React from "react";

export default function ActivityList({
  activities,
  onEdit,
  onToggle,
  onDelete,
  totalPages,
  page,
  setPage,
}) {
  const getVariantPriceRange = (variants) => {
    if (!variants?.length) return "-";
    const prices = variants.flatMap((v) => v.pricing.map((p) => p.price));
    if (prices.length === 0) return "-";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min} AED` : `${min}–${max} AED`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
            <tr>
              <th className="px-8 py-5 text-left font-bold">Title</th>
              <th className="px-8 py-5 text-left font-bold">Duration</th>
              <th className="px-8 py-5 text-left font-bold">Price Range</th>
              <th className="px-8 py-5 text-center font-bold">Variants</th>
              <th className="px-8 py-5 text-center font-bold">Status</th>
              <th className="px-8 py-5 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-16 text-gray-500 text-xl"
                >
                  No activities found.
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr
                  key={activity._id}
                  className="hover:bg-indigo-50 transition"
                >
                  <td className="px-8 py-6">
                    <div className="font-semibold text-lg">
                      {activity.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activity.shortDescription || "—"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {activity.duration?.label || "-"}
                  </td>
                  <td className="px-8 py-6 font-bold">
                    {getVariantPriceRange(activity.variants)}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {activity.variants?.length || 0} plans
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        activity.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {activity.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center space-x-4">
                    <button
                      onClick={() => onEdit(activity._id)}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggle(activity._id)}
                      className={
                        activity.isActive ? "text-orange-600" : "text-green-600"
                      }
                    >
                      {activity.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => onDelete(activity._id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center border-t">
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
