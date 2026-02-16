"use client";

import { useEffect, useState } from "react";
import { useGetActivitiesQuery, useDeleteActivityMutation } from "@/features/activity/activityApi.js";
import Link from "next/link";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await useGetActivitiesQuery();
      setActivities(res.data.activities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this activity?")) return;
    await useDeleteActivityMutation(id);
    fetchActivities();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Activities</h1>
        <Link
          href="/activities/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Activity
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {activities.map((a) => (
          <div key={a.id} className="border rounded-lg p-4">
            <img
              src={a.imageUrl}
              alt={a.name}
              className="h-40 w-full object-cover rounded"
            />

            <h2 className="font-semibold mt-2">{a.name}</h2>
            <p className="text-sm text-gray-600">{a.location}</p>
            <p className="text-sm">₹ {a.price}</p>

            <div className="flex gap-2 mt-3">
              <Link
                href={`/activities/${a.id}`}
                className="text-blue-600 text-sm"
              >
                View
              </Link>
              <Link
                href={`/activities/edit/${a.id}`}
                className="text-green-600 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
