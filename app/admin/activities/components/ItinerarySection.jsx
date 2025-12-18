// app/admin/activities/components/ItinerarySection.jsx
export default function ItinerarySection({ formData, setFormData }) {
  const addItineraryItem = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...(formData.itinerary || []),
        {
          title: "New Stop",
          location: "",
          activities: [""],
          optionalAddons: [""],
        },
      ],
    });
  };

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          🗺️ Itinerary
        </h2>
        <button
          type="button"
          onClick={addItineraryItem}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
        >
          + Add Itinerary Item
        </button>
      </div>

      {(formData.itinerary || []).map((item, i) => (
        <div
          key={i}
          className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 space-y-6"
        >
          <input
            type="text"
            placeholder="Title (e.g. Hotel Pickup)"
            value={item.title}
            onChange={(e) => {
              const newIt = [...formData.itinerary];
              newIt[i].title = e.target.value;
              setFormData({ ...formData, itinerary: newIt });
            }}
            className="w-full px-6 py-4 text-xl font-bold border-2 border-gray-300 rounded-2xl focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={item.location || ""}
            onChange={(e) => {
              const newIt = [...formData.itinerary];
              newIt[i].location = e.target.value;
              setFormData({ ...formData, itinerary: newIt });
            }}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl"
          />
          <textarea
            placeholder="Activities (one per line)"
            rows={4}
            value={item.activities.join("\n")}
            onChange={(e) => {
              const newIt = [...formData.itinerary];
              newIt[i].activities = e.target.value
                .split("\n")
                .filter((a) => a.trim());
              setFormData({ ...formData, itinerary: newIt });
            }}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl"
          />
          <textarea
            placeholder="Optional Addons (one per line)"
            rows={3}
            value={item.optionalAddons.join("\n")}
            onChange={(e) => {
              const newIt = [...formData.itinerary];
              newIt[i].optionalAddons = e.target.value
                .split("\n")
                .filter((a) => a.trim());
              setFormData({ ...formData, itinerary: newIt });
            }}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl"
          />
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                itinerary: formData.itinerary.filter((_, idx) => idx !== i),
              })
            }
            className="text-red-600 font-medium hover:text-red-800"
          >
            Remove Item
          </button>
        </div>
      ))}
    </section>
  );
}
