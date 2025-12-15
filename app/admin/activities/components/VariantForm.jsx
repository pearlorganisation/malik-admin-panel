// app/admin/activities/components/VariantForm.jsx
"use client";

import React from "react";

export default function VariantForm({
  variant,
  index,
  updateVariant,
  removeVariant,
}) {
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-md border border-indigo-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-indigo-900">
          Plan {index + 1}: {variant.name || "New Variant"}
        </h3>
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeVariant(index)}
            className="text-red-600 font-semibold hover:underline"
          >
            Remove Variant
          </button>
        )}
      </div>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Variant Name (e.g. Standard, Premium, VIP)"
          value={variant.name}
          onChange={(e) =>
            updateVariant(index, { ...variant, name: e.target.value })
          }
          className="w-full px-6 py-4 border border-indigo-300 rounded-xl text-lg focus:ring-4 focus:ring-indigo-300"
          required
        />
        <textarea
          placeholder="Description of this plan"
          rows={3}
          value={variant.description || ""}
          onChange={(e) =>
            updateVariant(index, { ...variant, description: e.target.value })
          }
          className="w-full px-6 py-4 border border-indigo-300 rounded-xl"
        />

        {/* Pricing Tiers inside Variant */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Pricing for this plan</h4>
          {variant.pricing.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-white rounded-xl"
            >
              <input
                placeholder="Label (Adult/Child)"
                value={p.label}
                onChange={(e) => {
                  const newPricing = [...variant.pricing];
                  newPricing[i].label = e.target.value;
                  updateVariant(index, { ...variant, pricing: newPricing });
                }}
                className="px-5 py-3 border rounded-lg"
              />
              <select
                value={p.type}
                onChange={(e) => {
                  const newPricing = [...variant.pricing];
                  newPricing[i].type = e.target.value;
                  updateVariant(index, { ...variant, pricing: newPricing });
                }}
                className="px-5 py-3 border rounded-lg"
              >
                <option value="per_person">Per Person</option>
                <option value="per_vehicle">Per Vehicle</option>
                <option value="flat">Flat</option>
              </select>
              <input
                type="number"
                placeholder="Price *"
                value={p.price}
                onChange={(e) => {
                  const newPricing = [...variant.pricing];
                  newPricing[i].price = Number(e.target.value);
                  updateVariant(index, { ...variant, pricing: newPricing });
                }}
                className="px-5 py-3 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Min Pax"
                value={p.minParticipants || ""}
                onChange={(e) => {
                  const newPricing = [...variant.pricing];
                  newPricing[i].minParticipants = e.target.value
                    ? Number(e.target.value)
                    : null;
                  updateVariant(index, { ...variant, pricing: newPricing });
                }}
                className="px-5 py-3 border rounded-lg"
              />

                  <input
                type="number"
                placeholder="Max Participants"
                value={p.maxParticipants || ""}
                onChange={(e) => {
                  const newPricing = [...variant.pricing];
                  newPricing[i].maxParticipants = e.target.value
                    ? Number(e.target.value)
                    : null;
                  updateVariant(index, { ...variant, pricing: newPricing });
                }}
                className="px-5 py-3 border rounded-lg"
              />



              <button
                type="button"
                onClick={() => {
                  const newPricing = variant.pricing.filter(
                    (_, idx) => idx !== i
                  );
                  updateVariant(index, { ...variant, pricing: newPricing });
                }}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateVariant(index, {
                ...variant,
                pricing: [
                  ...variant.pricing,
                  {
                    label: "Adult",
                    type: "per_person",
                    price: 0,
                    currency: "AED",
                  },
                ],
              })
            }
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg"
          >
            + Add Pricing Tier
          </button>
        </div>

        {/* Includes / Highlights */}
        <textarea
          placeholder="What's included in this plan (one per line)"
          rows={5}
          value={variant.includes.join("\n")}
          onChange={(e) =>
            updateVariant(index, {
              ...variant,
              includes: e.target.value.split("\n").filter((l) => l.trim()),
            })
          }
          className="w-full px-6 py-4 border rounded-xl"
        />
        <textarea
          placeholder="Key highlights / upgrades (one per line)"
          rows={4}
          value={variant.highlights?.join("\n") || ""}
          onChange={(e) =>
            updateVariant(index, {
              ...variant,
              highlights: e.target.value.split("\n").filter((l) => l.trim()),
            })
          }
          className="w-full px-6 py-4 border rounded-xl"
        />

        {/* Discount */}
        <div className="grid grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Discount %"
            value={variant.discount?.percentage || ""}
            onChange={(e) =>
              updateVariant(index, {
                ...variant,
                discount: {
                  ...variant.discount,
                  percentage: e.target.value ? Number(e.target.value) : null,
                },
              })
            }
            className="px-6 py-4 border rounded-xl"
          />
          <input
            type="text"
            placeholder="Discount Label"
            value={variant.discount?.label || ""}
            onChange={(e) =>
              updateVariant(index, {
                ...variant,
                discount: { ...variant.discount, label: e.target.value },
              })
            }
            className="px-6 py-4 border rounded-xl"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={variant.isActive ?? true}
            onChange={(e) =>
              updateVariant(index, { ...variant, isActive: e.target.checked })
            }
            className="w-6 h-6"
          />
          <label className="text-lg font-medium">This plan is active</label>
        </div>
      </div>
    </div>
  );
}
