// app/activity/[id]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetActivityByIdQuery } from "@/features/activity/activityApi";

import {
  Clock,
  MapPin,
  Users,
  Check,
  X,
  Calendar,
  MessageCircle,
  Star,
  Info,
  Package,
  Plus,
  Minus,
} from "lucide-react";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const { data: activity, isLoading, isError } = useGetActivityByIdQuery(id);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [quantities, setQuantities] = useState({});

  // Initialize quantities when variant or activity changes
  useEffect(() => {
    if (!activity || !activity.variants?.length) return;

    const selectedVariant = activity.variants[selectedVariantIndex];
    const initialQuantities = {};

    selectedVariant.pricing.forEach((p) => {
      if (p.type === "per_person") {
        initialQuantities[p._id] = p.label.toLowerCase().includes("adult")
          ? 1
          : 0;
      }
      // No initial quantity for per_vehicle or flat – they will be auto-calculated
    });

    setQuantities(initialQuantities);
    setSelectedTimeSlot(activity.timeSlots?.[0]?.startTime || "");
  }, [selectedVariantIndex, activity]);

  // Early returns
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <p className="text-3xl font-bold text-red-600 mb-4">
            Activity Not Found
          </p>
          <p className="text-gray-600">We couldn't load this experience.</p>
        </div>
      </div>
    );
  }

  const selectedVariant = activity.variants[selectedVariantIndex];
  const mainImage =
    activity.images?.find((img) => img.isMain)?.url ||
    activity.images?.[0]?.url ||
    "/placeholder.jpg";

  // Quantity update (only for per_person)
  const updateQuantity = (pricingId, delta) => {
    setQuantities((prev) => {
      const current = prev[pricingId] || 0;
      const newQty = Math.max(0, current + delta);
      const pricing = selectedVariant.pricing.find((p) => p._id === pricingId);

      if (pricing?.minParticipants && newQty < pricing.minParticipants)
        return prev;
      if (pricing?.maxParticipants && newQty > pricing.maxParticipants)
        return prev;

      return { ...prev, [pricingId]: newQty };
    });
  };

  // Calculations
  const totalPersons = selectedVariant.pricing
    .filter((p) => p.type === "per_person")
    .reduce((sum, p) => sum + (quantities[p._id] || 0), 0);

  const vehiclePricing = selectedVariant.pricing.find(
    (p) => p.type === "per_vehicle"
  );

  const maxPerVehicle = vehiclePricing?.maxParticipants || 4; // fallback
  const vehiclesNeeded =
    totalPersons > 0 ? Math.ceil(totalPersons / maxPerVehicle) : 0;

  const vehicleCost = vehiclePricing
    ? vehiclesNeeded * vehiclePricing.price
    : 0;

  const personsCost = selectedVariant.pricing
    .filter((p) => p.type === "per_person")
    .reduce((sum, p) => sum + p.price * (quantities[p._id] || 0), 0);

  // Add any flat pricing if exists
  const flatCost = selectedVariant.pricing
    .filter((p) => p.type === "flat")
    .reduce((sum, p) => sum + p.price * (quantities[p._id] || 1), 0); // flat usually qty=1

  const totalPrice = personsCost + vehicleCost + flatCost;

  const canBook = totalPersons > 0 && selectedTimeSlot;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[80vh] overflow-hidden">
        <Image
          src={mainImage}
          alt={activity.title}
          fill
          className="object-cover brightness-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl">
            {activity.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mb-8 opacity-95">
            {activity.shortDescription}
          </p>

          <div className="flex flex-wrap gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>
                {activity.duration?.label} ({activity.duration?.hours} hours)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              <span>Guide: {activity.languages?.join(" & ")}</span>
            </div>
            {activity.pickup?.included && (
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>
                  Pickup from {activity.pickup.locations?.join(" & ")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <span>{activity.variants?.length} Plans Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Full Description */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Experience Overview</h2>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {activity.fullDescription}
            </p>
          </section>

          {/* Variant Selection */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Choose Your Package</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activity.variants.map((variant, index) => (
                <button
                  key={variant._id}
                  onClick={() => setSelectedVariantIndex(index)}
                  className={`p-8 rounded-2xl border-4 text-left transition-all shadow-lg ${
                    selectedVariantIndex === index
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-400 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-bold">{variant.name}</h3>
                    {variant.discount?.percentage && (
                      <span className="px-5 py-2 bg-red-600 text-white rounded-full text-lg font-bold">
                        Save {variant.discount.percentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg">
                    {variant.description}
                  </p>

                  <div className="space-y-3">
                    {variant.pricing.map((p) => (
                      <div
                        key={p._id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {p.label} (
                          {p.type === "per_person"
                            ? "per person"
                            : p.type === "per_vehicle"
                            ? "per vehicle"
                            : "flat rate"}
                          )
                        </span>
                        <span className="text-xl font-bold">{p.price} AED</span>
                      </div>
                    ))}
                  </div>

                  {variant.highlights?.length > 0 && (
                    <ul className="mt-6 space-y-2">
                      {variant.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <Star className="w-5 h-5 text-yellow-500" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Itinerary, Inclusions, Exclusions, Important Info – unchanged */}
          {activity.itinerary?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-10">Detailed Itinerary</h2>
              <div className="space-y-12">
                {activity.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        {i + 1}
                      </div>
                      {i < activity.itinerary.length - 1 && (
                        <div className="w-1 h-full bg-indigo-200 mt-4" />
                      )}
                    </div>
                    <div className="flex-1 pb-12">
                      <h4 className="text-2xl font-semibold mb-3">
                        {item.title}
                      </h4>
                      <p className="text-lg text-gray-600 flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5" />
                        {item.location}
                      </p>
                      <ul className="list-disc pl-8 space-y-2 mb-4">
                        {item.activities.map((act, j) => (
                          <li key={j} className="text-gray-700">
                            {act}
                          </li>
                        ))}
                      </ul>
                      {item.optionalAddons?.length > 0 && (
                        <p className="text-sm italic text-gray-500">
                          Optional add-ons: {item.optionalAddons.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="grid md:grid-cols-2 gap-10">
            <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Check className="w-8 h-8 text-green-600" />
                What's Included
              </h3>
              <ul className="space-y-3">
                {(activity.includes || [])
                  .concat(selectedVariant.includes || [])
                  .map((inc, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>{inc}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <X className="w-8 h-8 text-red-600" />
                What's Excluded
              </h3>
              <ul className="space-y-3">
                {(activity.excludes || []).map((exc, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-600" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {(activity.importantInfo?.length > 0 ||
            activity.notSuitableFor?.length > 0) && (
            <section className="bg-amber-50 border-2 border-amber-400 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Info className="w-8 h-8 text-amber-600" />
                Important Information
              </h3>
              {activity.importantInfo?.map((info, i) => (
                <p key={i} className="flex items-start gap-4 mb-4 text-lg">
                  <span className="text-3xl font-bold text-amber-600 mt-1">
                    !
                  </span>
                  <span>{info}</span>
                </p>
              ))}
              {activity.notSuitableFor?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-amber-400">
                  <h4 className="font-bold text-lg mb-2">Not Suitable For:</h4>
                  <p className="text-gray-700">
                    {activity.notSuitableFor.join(", ")}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-6">
            <h3 className="text-2xl font-bold mb-6">Your Booking Summary</h3>

            <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl mb-8">
              <h4 className="text-2xl font-bold">{selectedVariant.name}</h4>
              {selectedVariant.discount?.percentage && (
                <p className="text-red-600 font-bold text-lg mt-2">
                  Save {selectedVariant.discount.percentage}% –{" "}
                  {selectedVariant.discount.label}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="mb-8">
              <label className="block font-bold text-lg mb-3">Date</label>
              <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-xl">
                <Calendar className="w-8 h-8 text-indigo-600" />
                <span className="font-semibold text-lg">
                  {new Date(activity.availableDates[0]).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-10">
              <label className="block font-bold text-lg mb-4">
                Select Starting Time
              </label>
              <div className="grid grid-cols-2 gap-4">
                {activity.timeSlots?.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => setSelectedTimeSlot(slot.startTime)}
                    disabled={!slot.isAvailable}
                    className={`py-5 px-6 rounded-xl font-bold text-lg transition shadow-md ${
                      selectedTimeSlot === slot.startTime
                        ? "bg-indigo-600 text-white"
                        : slot.isAvailable
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selectors – Only per_person */}
            <div className="mb-10">
              <h4 className="font-bold text-xl mb-6">Number of Travellers</h4>
              <div className="space-y-5">
                {selectedVariant.pricing
                  .filter((p) => p.type === "per_person")
                  .map((pricing) => {
                    const qty = quantities[pricing._id] || 0;

                    return (
                      <div
                        key={pricing._id}
                        className="p-5 bg-gray-50 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <div className="font-bold text-lg">
                              {pricing.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {pricing.price} AED per person
                              {pricing.minParticipants &&
                                ` • Min: ${pricing.minParticipants}`}
                              {pricing.maxParticipants &&
                                ` • Max: ${pricing.maxParticipants}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => updateQuantity(pricing._id, -1)}
                            disabled={qty <= (pricing.minParticipants || 0)}
                            className="w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                          >
                            <Minus className="w-6 h-6" />
                          </button>
                          <span className="text-3xl font-bold w-20 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(pricing._id, 1)}
                            disabled={
                              pricing.maxParticipants &&
                              qty >= pricing.maxParticipants
                            }
                            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Show auto-calculated vehicles info */}
              {vehiclePricing && totalPersons > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                  <p className="font-semibold text-lg">
                    {vehiclesNeeded} vehicle{vehiclesNeeded > 1 ? "s" : ""}{" "}
                    required (max {maxPerVehicle} per vehicle)
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t-2 border-gray-300 pt-6 mb-8">
              <h4 className="font-bold text-xl mb-5">Price Breakdown</h4>

              {/* Per-person lines */}
              {selectedVariant.pricing
                .filter((p) => p.type === "per_person")
                .map((pricing) => {
                  const qty = quantities[pricing._id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div
                      key={pricing._id}
                      className="flex justify-between py-3 text-lg"
                    >
                      <span>
                        {pricing.label} × {qty}
                      </span>
                      <span className="font-semibold">
                        {pricing.price * qty} AED
                      </span>
                    </div>
                  );
                })}

              {/* Vehicle line – auto calculated */}
              {vehiclePricing && vehiclesNeeded > 0 && (
                <div className="flex justify-between py-3 text-lg">
                  <span>
                    Vehicle (max {maxPerVehicle} pax) × {vehiclesNeeded}
                  </span>
                  <span className="font-semibold">{vehicleCost} AED</span>
                </div>
              )}

              {/* Flat pricing if any */}
              {selectedVariant.pricing
                .filter((p) => p.type === "flat")
                .map((pricing) => (
                  <div
                    key={pricing._id}
                    className="flex justify-between py-3 text-lg"
                  >
                    <span>{pricing.label}</span>
                    <span className="font-semibold">{pricing.price} AED</span>
                  </div>
                ))}

              {/* Total */}
              {totalPrice > 0 ? (
                <>
                  <div className="flex justify-between text-3xl font-bold mt-8 pt-6 border-t-2 border-gray-300">
                    <span>Total Amount</span>
                    <span className="text-indigo-600">{totalPrice} AED</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    All taxes and fees included
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Select number of travellers to see pricing
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-5">
              <a
                href={`https://wa.me/?text=I want to book "${
                  activity.title
                }" (${
                  selectedVariant.name
                }) for ${totalPrice} AED on ${new Date(
                  activity.availableDates[0]
                ).toLocaleDateString()} at ${selectedTimeSlot}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-4 py-6 rounded-xl font-bold text-xl transition shadow-xl ${
                  canBook
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                <MessageCircle className="w-9 h-9" />
                Book via WhatsApp
              </a>

              <button
                disabled={!canBook}
                className={`w-full py-6 rounded-xl font-bold text-xl transition shadow-xl ${
                  canBook
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                Proceed to Book Online
              </button>
            </div>

            {/* Policies */}
            <div className="mt-10 pt-8 border-t text-sm text-gray-600 space-y-3">
              {activity.cancellationPolicy?.isFreeCancellation && (
                <p className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  Free cancellation up to{" "}
                  {activity.cancellationPolicy.hoursBefore} hours before
                </p>
              )}
              {activity.reservePolicy?.payLater && (
                <p className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  Reserve now, pay later available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
