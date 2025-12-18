// app/admin/activities/components/AvailabilitySection.jsx
export default function AvailabilitySection({ formData, setFormData }) {
  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [
        ...(formData.timeSlots || []),
        { startTime: "09:00 AM", isAvailable: true },
      ],
    });
  };

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        📅 Availability
      </h2>

      {/* Time Slots */}
      <div>
        <label className="block text-lg font-semibold mb-4">Time Slots</label>
        <button
          type="button"
          onClick={addTimeSlot}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          + Add Time Slot
        </button>

        {(formData.timeSlots || []).map((slot, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 mb-4 p-5 bg-gray-50 rounded-2xl items-center"
          >
            <input
              type="text"
              placeholder="e.g. 04:00 PM"
              value={slot.startTime}
              onChange={(e) => {
                const newSlots = [...formData.timeSlots];
                newSlots[i].startTime = e.target.value;
                setFormData({ ...formData, timeSlots: newSlots });
              }}
              className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500"
            />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={slot.isAvailable}
                onChange={(e) => {
                  const newSlots = [...formData.timeSlots];
                  newSlots[i].isAvailable = e.target.checked;
                  setFormData({ ...formData, timeSlots: newSlots });
                }}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span>Available</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  timeSlots: formData.timeSlots.filter((_, idx) => idx !== i),
                })
              }
              className="text-red-600 font-medium hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Available Dates */}
      <div>
        <label className="block text-lg font-semibold mb-3">
          Available Dates (comma separated, YYYY-MM-DD)
        </label>
        <input
          type="text"
          placeholder="2025-12-20, 2025-12-25, 2025-12-31"
          value={(formData.availableDates || []).join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              availableDates: e.target.value
                .split(",")
                .map((d) => d.trim())
                .filter(Boolean),
            })
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500"
        />
      </div>
    </section>
  );
}
