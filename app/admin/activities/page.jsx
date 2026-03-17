'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetActivitiesQuery, useDeleteActivityMutation, useToggleActivityStatusMutation } from '@/features/activity/activityApi';
import ViewActivityModal from '@/components/activity/modals/ViewActivityModal';
// import EditActivityModal from '@/components/activity/modals/EditActivityModal';
import ConfirmDeleteModal from '@/components/activity/modals/ConfirmDeleteModal';
import EditActivityModalNew from '@/components/activity/modals/EditActivityModalNew';

export default function ActivitiesPage() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Set limit to 10 to demonstrate pagination

  // Pass page and limit to the query
  const { data: response, isLoading, refetch } = useGetActivitiesQuery({ page: currentPage, limit });
  const [deleteActivity] = useDeleteActivityMutation();
  const [toggleStatus] = useToggleActivityStatusMutation();

  // Modal States
  const [viewModal, setViewModal] = useState({ open: false, activity: null });
  const [editModal, setEditModal] = useState({ open: false, activity: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');

  // Extract Data & Pagination Info
  const activities = response?.data?.data || [];
  console.log("FULL RESPONSE:", response);
  const pagination = response?.data?.pagination || { total: 0, page: 1, totalPages: 1 };
  
  // const filteredActivities = activities.filter(a =>
  //   a.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredActivities = activities.filter(a =>
  (a?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
);

  console.log("testing data", filteredActivities)
  // Pagination Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteActivity(deleteModal.id).unwrap();
      setDeleteModal({ open: false, id: null });
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  // Helper to calculate "Showing X to Y of Z"
  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, pagination.total);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage tours, activities, and their packages.</p>
          </div>
          <Link
            href="/activities/create"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Create Activity
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search in current page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
          
          {/* Simple Stats Tag */}
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
             <span className="px-2.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 font-medium text-gray-700">
               {pagination.total} Total Activities
             </span>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 animate-pulse">Loading activities...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {filteredActivities.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Packages</th>
                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredActivities.map((activity) => (
                        <tr key={activity._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                          {/* Name & Image */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 relative">
                                {activity.Images && activity.Images.length > 0 ? (
                                  <img className="h-12 w-12 rounded-lg object-cover border border-gray-200" src={activity.Images[0].secure_url} alt="" />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{activity?.name || ""}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{activity.categoryId?.name || activity.categoryId || 'Uncategorized'}</div>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              {activity.placeId?.name || 'Unknown Location'}
                            </div>
                          </td> */}

                          <td className="px-6 py-4">
  <div className="flex items-start text-sm text-gray-600">
    {/* Icon */}
    <svg 
      className="flex-shrink-0 mt-0.5 mr-2 h-4 w-4 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>

    {/* Text Container */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
      <span className="font-medium text-gray-900">
        {activity.placeId?.name || 'N/A'}
      </span>
      
      {activity.placeId?.region && (
        <>
          <span className="hidden sm:inline text-gray-300">|</span> 
          <span className="text-gray-500 text-xs sm:text-sm italic">
            {activity.placeId.region}
          </span>
        </>
      )}
    </div>
  </div>
</td>

                          {/* Packages Count */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {activity.packageCount || 0} Packages
                            </span>
                          </td>

                          {/* Status Toggle */}
                         <td className="px-6 py-4 whitespace-nowrap text-center">
  <div className="relative inline-block text-left">
    <select
      value={activity.isActive ? "active" : "inactive"}
      onChange={() => handleToggleStatus(activity._id)}
      className={`appearance-none pl-8 pr-10 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border-none focus:ring-2 focus:ring-offset-2 focus:outline-none ${
        activity.isActive
          ? 'bg-green-100 text-green-800 focus:ring-green-500 hover:bg-green-200'
          : 'bg-red-100 text-red-800 focus:ring-red-500 hover:bg-red-200'
      }`}
    >
      {/* Agar Active hai to 'Active' selected rahega, aur 'Disable' ka option aayega */}
      <option value="active" disabled={activity.isActive}>
        {activity.isActive ? '● Active' : 'Enable Activity'}
      </option>
      
      {/* Agar Inactive hai to 'Inactive' selected rahega, aur 'Enable' ka option aayega */}
      <option value="inactive" disabled={!activity.isActive}>
        {!activity.isActive ? '● Inactive' : 'Disable Activity'}
      </option>
    </select>

    {/* Custom Dropdown Arrow Icon (Optional but looks better) */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-60">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setViewModal({ open: true, activity })}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Details"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                              </button>
                              <button
                                onClick={() => setEditModal({ open: true, activity })}
                                className="text-gray-400 hover:text-amber-600 transition-colors"
                                title="Edit Activity"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                              </button>
                              <button
                                onClick={() => setDeleteModal({ open: true, id: activity._id })}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Activity"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                  {/* Mobile Pagination */}
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Next
                    </button>
                  </div>

                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startRecord}</span> to <span className="font-medium">{endRecord}</span> of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-12 w-12 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new activity.</p>
                <div className="mt-6">
                  <Link
                    href="/activities/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Activity
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setViewModal({ open: false, activity: null })}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full h-[90vh] flex flex-col">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg leading-6 font-semibold text-gray-900">Activity Details</h3>
                <button
                  onClick={() => setViewModal({ open: false, activity: null })}
                  className="bg-white rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <ViewActivityModal
                  activity={viewModal.activity}
                  onClose={() => setViewModal({ open: false, activity: null })}
                  onPackageAdded={refetch}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {/* {editModal.open  && editModal.activity && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() =>{
               setEditModal({ open: false, activity: null })
               
               }}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
               <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Edit Activity</h3>
                <button
                  onClick={() => setEditModal({ open: false, activity: null })}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6">
                <EditActivityModal
                  activity={editModal.activity}
                  onClose={() => setEditModal({ open: false, activity: null })}
                  onSuccess={() => {
                    setEditModal({ open: false, activity: null });
                    refetch();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )} */}

     {editModal.open && editModal.activity && (
  <EditActivityModalNew
    activity={editModal.activity}
    onClose={() => setEditModal({ open: false, activity: null })}
    onSuccess={() => {
      setEditModal({ open: false, activity: null });
      refetch();
    }}
  />
)}


      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        title={deleteModal.type === 'activity' ? 'Delete Activity?' : 'Delete Package?'}
        message="Are you sure you want to delete this item? This action cannot be undone."
        itemName={deleteModal.item}
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ open: false, item: null, type: null })}
      />

    </div>
  );
}