// app/admin/activities/components/RestrictionsSection.jsx
export default function RestrictionsSection({ formData, setFormData }) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        ⚠️ Restrictions & Important Info
      </h2>

      <div>
        <label className="block text-lg font-semibold mb-3">
          Not Suitable For (one per line)
        </label>
        <textarea
          rows={7}
          placeholder="• Pregnant women&#10;• People with heart conditions&#10;• Children under 3 years"
          value={(formData.notSuitableFor || []).join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              notSuitableFor: e.target.value
                .split("\n")
                .filter((n) => n.trim()),
            })
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">
          Important Information (one per line)
        </label>
        <textarea
          rows={10}
          placeholder="• Bring sunscreen and hat&#10;• Wear comfortable shoes&#10;• Valid ID required"
          value={(formData.importantInfo || []).join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              importantInfo: e.target.value.split("\n").filter((i) => i.trim()),
            })
          }
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl"
        />
      </div>

      <div className="flex items-center gap-4 pt-8">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="w-8 h-8 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isActive" className="text-2xl font-bold text-gray-900">
          Publish Activity (Make it Live)
        </label>
      </div>
    </section>
  );
}
