"use client";

import { useGetActivityByIdQuery, useUpdateActivityMutation } from "@/features/activity/activityApi.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditActivity({ params }) {
  const { id } = params;
  const router = useRouter();
  const [title, setTitle] = useState("");

  useEffect(() => {
    useGetActivityByIdQuery(id).then((res) => {
      setTitle(res.data.name);
    });
  }, [id]);

  const handleUpdate = async () => {
    await useUpdateActivityMutation(id, { title });
    router.push("/activities");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Activity</h1>

      <input
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        className="bg-black text-white px-4 py-2 rounded mt-4"
      >
        Update
      </button>
    </div>
  );
}
