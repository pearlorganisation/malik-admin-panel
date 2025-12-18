// app/admin/activities/components/DetailsSection.jsx
export default function DetailsSection({ formData, setFormData }) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        ⚙️ Details & Policies
      </h2>

      {/* Languages */}
      <div>
        <label className="block text-lg font-semibold mb-3">
          Languages (one per line)
        </label>
        <textarea
          rows={5}
          value={(formData.languages || []).join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              languages: e.target.value
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean),
            })
          }
          placeholder="English\nArabic\nFrench"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
        />
      </div>

      {/* Live Guide */}
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={formData.liveGuide}
          onChange={(e) =>
            setFormData({ ...formData, liveGuide: e.target.checked })
          }
          className="w-6 h-6 text-indigo-600 rounded"
        />
        <label className="text-lg font-medium">Live Guide Included</label>
      </div>

      {/* Cancellation & Reserve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cancellation */}
        <div>
          <label className="block text-lg font-semibold mb-3">
            Cancellation Policy
          </label>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={formData.cancellationPolicy?.isFreeCancellation || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cancellationPolicy: {
                    ...formData.cancellationPolicy,
                    isFreeCancellation: e.target.checked,
                  },
                })
              }
            />
            <span>Free Cancellation</span>
            <input
              type="number"
              value={formData.cancellationPolicy?.hoursBefore || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cancellationPolicy: {
                    ...formData.cancellationPolicy,
                    hoursBefore: Number(e.target.value) || null,
                  },
                })
              }
              className="w-24 px-4 py-3 border-2 rounded-xl"
            />
            <span>hours before</span>
          </div>
        </div>

        {/* Reserve */}
        <div>
          <label className="block text-lg font-semibold mb-3">
            Reserve Policy
          </label>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="checkbox"
              checked={formData.reservePolicy?.payLater || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reservePolicy: {
                    ...formData.reservePolicy,
                    payLater: e.target.checked,
                  },
                })
              }
            />
            <span>Pay Later Available</span>
          </div>
          <textarea
            rows={3}
            value={formData.reservePolicy?.description || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                reservePolicy: {
                  ...formData.reservePolicy,
                  description: e.target.value,
                },
              })
            }
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
        </div>
      </div>

      {/* Pickup */}
      <div>
        <label className="block text-lg font-semibold mb-4">
          Pickup & Transfer
        </label>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.pickup?.included || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickup: { ...formData.pickup, included: e.target.checked },
                })
              }
            />
            <span className="font-medium">Pickup Included</span>
          </div>
          <textarea
            rows={3}
            value={formData.pickup?.description || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pickup: { ...formData.pickup, description: e.target.value },
              })
            }
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
          <input
            type="text"
            placeholder="Locations (comma separated)"
            value={(formData.pickup?.locations || []).join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                pickup: {
                  ...formData.pickup,
                  locations: e.target.value
                    .split(",")
                    .map((l) => l.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.pickup?.privateForOutskirts || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickup: {
                    ...formData.pickup,
                    privateForOutskirts: e.target.checked,
                  },
                })
              }
            />
            <span>Private transfer for outskirts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
