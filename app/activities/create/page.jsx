// "use client";

// import { useCreateActivityMutation } from "@/features/activity/activityApi.js";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CreateActivity() {
//   const router = useRouter();
//   const [createActivity] = useCreateActivityMutation();
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [location, setLocation] = useState("");
//   const [images, setImages] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("category", category);
//     formData.append("location", location);

//     images.forEach((img) => formData.append("images", img));

//     await createActivity(formData);
//     router.push("/activities");
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Add Activity</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           className="border p-2 w-full"
//           placeholder="Title"
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <input
//           className="border p-2 w-full"
//           placeholder="Category"
//           onChange={(e) => setCategory(e.target.value)}
//         />

//         <input
//           className="border p-2 w-full"
//           placeholder="Location"
//           onChange={(e) => setLocation(e.target.value)}
//         />

//         <input
//           type="file"
//           multiple
//           onChange={(e) => setImages([...e.target.files])}
//         />

//         <button className="bg-black text-white px-4 py-2 rounded">
//           Create
//         </button>
//       </form>
//     </div>
//   );
// }




'use client';

import CreateActivityForm from '@/components/activity/CreateActivityForm';

export default function CreateActivityPage() {
  return <CreateActivityForm />;
}
