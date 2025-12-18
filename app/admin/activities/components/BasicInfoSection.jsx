// app/admin/activities/components/BasicInfoSection.jsx
export default function BasicInfoSection({ formData, setFormData }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        📝 Basic Information
      </h2>
      <div className="space-y-5">
        <input
          type="text"
          placeholder="Activity Title *"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
        />
        <textarea
          placeholder="Short Description (for listings)"
          rows={3}
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 resize-none"
        />
        <textarea
          placeholder="Full Description (detailed)"
          rows={10}
          value={formData.fullDescription}
          onChange={(e) =>
            setFormData({ ...formData, fullDescription: e.target.value })
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 resize-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Duration Label (e.g. 6-7 Hours)"
            value={formData.duration.label}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: { ...formData.duration, label: e.target.value },
              })
            }
            className="px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
          <input
            type="number"
            placeholder="Approx Hours"
            value={formData.duration.hours || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: {
                  ...formData.duration,
                  hours: e.target.value ? Number(e.target.value) : null,
                },
              })
            }
            className="px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
