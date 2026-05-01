"use client";
import React, { useState, useEffect } from "react";
import { useGetUsersQuery, useGetUserByIdQuery } from "@/features/users/usersApi";
import debounce from "lodash.debounce";
import { 
  Search, 
  Mail, 
  UserCircle, 
  RefreshCcw, 
  ChevronRight, 
  X, 
  Filter,
  Calendar,
  Phone,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const UserManagementPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handler = debounce((value) => setDebouncedName(value), 500);
    handler(name);
    return () => handler.cancel();
  }, [name]);

  useEffect(() => {
    const handler = debounce((value) => setDebouncedEmail(value), 500);
    handler(email);
    return () => handler.cancel();
  }, [email]);

  const queryParams = { name: debouncedName || "", email: debouncedEmail || "", role };
  const { data: usersResponse, isLoading, isFetching, error } = useGetUsersQuery(queryParams);
  const users = usersResponse?.users || [];

  const { data: userDetail, isLoading: isUserLoading } = useGetUserByIdQuery(selectedUserId, {
    skip: !selectedUserId,
  });

  const handleRowClick = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setRole("");
  };

  // Skeleton Loader Component
  const TableSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-xl w-full"></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 transition-all duration-300">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage, search and filter your organization users.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                Total: {users.length} Users
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Name */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Search Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Search by email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="relative group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none"
              >
                <option value="">All Roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all font-medium text-sm shadow-sm active:scale-95"
            >
              <RefreshCcw size={16} />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {isLoading || isFetching ? (
            <TableSkeleton />
          ) : error ? (
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center">
              <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
              <p className="text-red-700 font-medium">Failed to load users. Please try again.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        onClick={() => handleRowClick(user._id)}
                        className="group hover:bg-indigo-50/30 cursor-pointer transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-50 text-purple-700 border-purple-100' 
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight className="inline text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={20} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <div 
                    key={user._id}
                    onClick={() => handleRowClick(user._id)}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 italic">{user.role}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail size={14} /> {user.email}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

            {/* Modal Box */}
            <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-lg">
              <div className="absolute right-4 top-4">
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {isUserLoading || !userDetail ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Fetching Details...</p>
                </div>
              ) : (
                <div className="p-0">
                  {/* Modal Top Banner */}
                  <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  
                  <div className="px-8 pb-8">
                    {/* Profile Image Overflow */}
                    <div className="relative -mt-10 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                          {userDetail?.name?.charAt(0)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">{userDetail?.name}</h2>
                      <p className="text-gray-500">{userDetail?.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Phone</p>
                          <p className="text-sm font-semibold text-gray-700">{userDetail?.phoneNumber || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${userDetail?.isVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                            {userDetail?.isVerified ? "VERIFIED" : "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                          <UserCircle size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">User Role</p>
                          <p className="text-sm font-semibold text-gray-700 capitalize">{userDetail?.role?.toLowerCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Member Since</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {new Date(userDetail?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="mt-10 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200 active:scale-[0.99]"
                    >
                      Close Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;