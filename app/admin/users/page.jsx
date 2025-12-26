"use client";
import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "@/features/users/usersApi"; // Adjust path if needed
import debounce from "lodash.debounce";

const UserManagementPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Debounced values to reduce API calls
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  // Debounce name and email inputs
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

  // useEffect(() => {
  //   setDebouncedRole(role);
  // }, [role]);

const queryParams = {
   name: debouncedName || "",
   email: debouncedEmail || "",
    role,  
 };

 const {
   data: usersResponse,
   isLoading,
   isFetching,
   error,
 } = useGetUsersQuery(queryParams);


  const users = usersResponse?.users || []; // Adjust if your API returns differently
console.log("Fetched users:", users);
  const handleReset = () => {
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          User Management
        </h1>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Search by email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                {/* Add more roles as needed */}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16 text-red-600 text-lg">
            Error loading users. Please try again later.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && users.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              No users found matching your criteria.
            </p>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !error && users.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        {user.name || "-"}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="text-blue-600 hover:underline text-sm">
                          View
                        </button>
                        <button className="text-green-600 hover:underline text-sm">
                          Edit
                        </button>
                        {/* Add Delete button if needed */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
              Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
