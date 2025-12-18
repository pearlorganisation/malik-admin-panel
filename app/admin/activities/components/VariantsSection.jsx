// app/admin/activities/components/VariantsSection.jsx
import VariantForm from "./VariantForm";

export default function VariantsSection({ formData, setFormData }) {
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          name: "New Package",
          description: "",
          images: [],
          pricing: [
            { label: "Adult", type: "per_person", price: 0, currency: "AED" },
          ],
          includes: [],
          excludes: [],
          addons: [],
          highlights: [],
          discount: { percentage: null, label: "" },
          isActive: true,
        },
      ],
    });
  };

  const updateVariant = (index, updated) => {
    const newVariants = [...formData.variants];
    newVariants[index] = updated;
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1 || confirm("Remove this package?")) {
      setFormData({
        ...formData,
        variants: formData.variants.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          🎟️ Activity Plans
        </h2>
        <button
          type="button"
          onClick={addVariant}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition"
        >
          + Add New Package
        </button>
      </div>

      {formData.variants.map((variant, index) => (
        <VariantForm
          key={index}
          variant={variant}
          index={index}
          updateVariant={updateVariant}
          removeVariant={removeVariant}
          totalVariants={formData.variants.length}
        />
      ))}
    </section>
  );
}
