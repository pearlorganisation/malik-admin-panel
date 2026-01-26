"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/category/categoryApi"; // Adjust path if needed
import { Trash2, Edit, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 12;

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetCategoriesQuery({ page, limit, search });


  const categories = response?.data || [];
  const totalPages = response?.totalPages || 1;

  // Filter categories locally based on search input
const filteredCategories = categories.filter((cat) =>
  cat.name.toLowerCase().includes(search.toLowerCase()) ||
  (cat.description?.toLowerCase().includes(search.toLowerCase()))
);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
      setImagePreview(category.image?.url || null);
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
      setImageFile(null);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
       toast.error("Category name is required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    if (formData.description?.trim())
      data.append("description", formData.description.trim());
    if (imageFile) data.append("image", imageFile);

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, data }).unwrap();
         toast.success("Category updated successfully");
      } else {
        await createCategory(data).unwrap();
        toast.success("Category created successfully");
      }
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (err) {
      alert(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Categories
          </h1>

          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading || isFetching ? (
          <p className="text-center py-12">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-12">
            Failed to load categories. Please try again.
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No categories found. Create your first one!
          </p>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {cat.image?.url ? (
                    <div className="relative h-48">
                      <Image
                        src={cat.image.url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2 truncate">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {cat.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(cat)}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center overflow-y-auto scrollbar-hide justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 px-8  scrollbar-hide relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {editingCategory && "(Leave empty to keep current)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {imagePreview && (
                  <div className="mt-4 relative h-64 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
