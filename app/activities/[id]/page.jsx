"use client";

import { useGetActivityByIdQuery } from "@/features/activity/activityApi.js";

export default function ActivityDetail({ params }) {
  const { id } = params;

  // ✅ Hook yaha use hoga (TOP LEVEL)
  const { data: activity, isLoading, error } = useGetActivityByIdQuery(id);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading data</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img
        src={activity?.imageUrl}
        className="rounded-lg w-full h-80 object-cover"
      />

      <h1 className="text-3xl font-bold mt-4">{activity?.name}</h1>
      <p className="text-gray-600">{activity?.location}</p>

      <p className="mt-4">{activity?.fullDescription}</p>

      <h3 className="font-semibold mt-6">Highlights</h3>
      <ul className="list-disc ml-5">
        {activity?.highlights?.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}