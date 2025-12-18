// app/admin/activities/components/InclusionsSection.jsx
export default function InclusionsSection({ formData, setFormData }) {
  const addSharedAddon = () => {
    setFormData({
      ...formData,
      addons: [
        ...(formData.addons || []),
        { title: "", duration: "", price: 0 },
      ],
    });
  };

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        ✅ Shared Highlights & Inclusions
      </h2>

      {/* Highlights */}
      <div>
        <label className="block text-lg font-semibold mb-3">
          Highlights (one per line)
        </label>
        <textarea
          rows={8}
          placeholder="• Dune bashing&#10;• Camel riding&#10;• Sandboarding&#10;• Belly dance show"
          value={(formData.highlights || []).join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              highlights: e.target.value.split("\n").filter((h) => h.trim()),
            })
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl font-mono text-sm"
        />
      </div>

      {/* Includes / Excludes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-lg font-semibold mb-3">
            What's Included
          </label>
          <textarea
            rows={10}
            value={(formData.includes || []).join("\n")}
            onChange={(e) =>
              setFormData({
                ...formData,
                includes: e.target.value.split("\n").filter((i) => i.trim()),
              })
            }
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-3">
            What's Excluded
          </label>
          <textarea
            rows={10}
            value={(formData.excludes || []).join("\n")}
            onChange={(e) =>
              setFormData({
                ...formData,
                excludes: e.target.value.split("\n").filter((e) => e.trim()),
              })
            }
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
        </div>
      </div>

      {/* Shared Addons */}
      <div>
        <label className="block text-lg font-semibold mb-4">
          Shared Optional Addons
        </label>
        <button
          type="button"
          onClick={addSharedAddon}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium"
        >
          + Add Shared Addon
        </button>

        {(formData.addons || []).map((addon, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 mb-4 p-5 bg-gray-50 rounded-2xl"
          >
            <input
              placeholder="Title (e.g. Quad Bike Ride)"
              value={addon.title}
              onChange={(e) => {
                const newA = [...formData.addons];
                newA[i].title = e.target.value;
                setFormData({ ...formData, addons: newA });
              }}
              className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl"
            />
            <input
              placeholder="Duration (e.g. 30 min)"
              value={addon.duration || ""}
              onChange={(e) => {
                const newA = [...formData.addons];
                newA[i].duration = e.target.value;
                setFormData({ ...formData, addons: newA });
              }}
              className="w-48 px-5 py-3 border-2 rounded-xl"
            />
            <input
              type="number"
              placeholder="Price (AED)"
              value={addon.price}
              onChange={(e) => {
                const newA = [...formData.addons];
                newA[i].price = Number(e.target.value) || 0;
                setFormData({ ...formData, addons: newA });
              }}
              className="w-32 px-5 py-3 border-2 rounded-xl"
            />
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  addons: formData.addons.filter((_, idx) => idx !== i),
                })
              }
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
