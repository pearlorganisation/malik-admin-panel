// app/activities/page.jsx

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetActivitiesQuery } from "@/features/activity/activityApi"; // Adjust path if needed
import { Clock, MapPin, Users, Package, Calendar, Star } from "lucide-react";

export default function ActivitiesPage() {
  const { data, isLoading, isFetching, error } = useGetActivitiesQuery({
    page: 1,
    limit: 12,
  }); // Fetch first 12 activities

  const activities = data?.activities || [];
  const total = data?.total || 0;

  // Helper: Get price range from all variants
  const getPriceRange = (variants) => {
    if (!variants || variants.length === 0) return "Price on request";
    const prices = variants.flatMap((v) =>
      v.pricing.map((p) => p.price).filter((p) => p > 0)
    );
    if (prices.length === 0) return "From Free";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `AED ${min}` : `AED ${min} - ${max}`;
  };

  // Helper: Get main image
  const getMainImage = (activity) => {
    return (
      activity.images?.find((img) => img.isMain)?.url ||
      activity.images?.[0]?.url ||
      "/placeholder.jpg"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-4">
            Failed to load activities
          </p>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
            Explore Amazing Activities
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl drop-shadow-lg">
            Discover unforgettable experiences in Dubai and beyond
          </p>
          <p className="mt-8 text-lg">
            <span className="font-bold text-2xl">{total}</span> activities
            available
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isFetching && !isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      )}

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">
              No activities found at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activities.map((activity) => (
              <Link
                key={activity._id}
                href={`/activity/${activity._id}`}
                className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getMainImage(activity)}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{activity.duration?.label || "Full Day"}</span>
                    </div>
                    {activity.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">
                          {activity.rating.toFixed(1)}
                        </span>
                        <span className="text-sm">
                          ({activity.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variant Count Badge */}
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {activity.variants?.length || 1} Plans
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {activity.shortDescription ||
                      "Amazing experience awaits you"}
                  </p>

                  {/* Price */}
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {getPriceRange(activity.variants)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {activity.liveGuide && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Live Guide</span>
                      </div>
                    )}
                    {activity.pickup?.included && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Pickup Included</span>
                      </div>
                    )}
                    {activity.availableDates?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Available</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More or Pagination */}
        {data?.pages > 1 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
