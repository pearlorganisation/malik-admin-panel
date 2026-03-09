'use client';

import React, { useState } from 'react';
import { useGetActivitiesQuery, useDeleteActivityMutation, useToggleActivityStatusMutation } from '@/lib/api/activityApi';
import ViewActivityModal from './modals/ViewActivityModal';
import EditActivityModal from './modals/EditActivityModal';
import ViewPackageModal from './modals/ViewPackageModal';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

export default function ActivityListWithModals() {
  const { data: response, isLoading, refetch } = useGetActivitiesQuery({ page: 1, limit: 50 });
  const [deleteActivity] = useDeleteActivityMutation();
  const [toggleStatus] = useToggleActivityStatusMutation();

  const [viewModal, setViewModal] = useState({ open: false, activity: null });
  const [editModal, setEditModal] = useState({ open: false, activity: null });
  const [packageModal, setPackageModal] = useState({ open: false, package: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, type: null });

  const activities = response?.data || [];

  const handleView = (activity) => {
    setViewModal({ open: true, activity });
  };

  const handleEdit = (activity) => {
    setEditModal({ open: true, activity });
  };

  const handleViewPackage = (pkg) => {
    setPackageModal({ open: true, package: pkg });
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, item: id, type: 'activity' });
  };

  const handleDeletePackage = (id) => {
    setDeleteModal({ open: true, item: id, type: 'package' });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.type === 'activity') {
        await deleteActivity(deleteModal.item).unwrap();
        refetch();
      }
      setDeleteModal({ open: false, item: null, type: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Toggle status failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activities Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Activity Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Packages</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{activity.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{activity.categoryId?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{activity.placeId?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{activity.packages?.length || 0}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(activity._id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      activity.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {activity.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleView(activity)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(activity)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {viewModal.open && (
        <ViewActivityModal
          activity={viewModal.activity}
          onClose={() => setViewModal({ open: false, activity: null })}
          onViewPackage={handleViewPackage}
        />
      )}

      {editModal.open && (
        <EditActivityModal
          activity={editModal.activity}
          onClose={() => setEditModal({ open: false, activity: null })}
          onSuccess={() => refetch()}
        />
      )}

      {packageModal.open && (
        <ViewPackageModal
          package={packageModal.package}
          onClose={() => setPackageModal({ open: false, package: null })}
          onEdit={() => {}}
          onDelete={handleDeletePackage}
        />
      )}

      {deleteModal.open && (
        <ConfirmDeleteModal
          title={deleteModal.type === 'activity' ? 'Delete Activity?' : 'Delete Package?'}
          message={`This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ open: false, item: null, type: null })}
        />
      )}
    </div>
  );
}
