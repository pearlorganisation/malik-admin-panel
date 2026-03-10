"use client";
import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
} from "@/features/users/usersApi";
import debounce from "lodash.debounce";

const UserManagementPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce name
  useEffect(() => {
    const handler = debounce((value) => setDebouncedName(value), 500);
    handler(name);
    return () => handler.cancel();
  }, [name]);

  // Debounce email
  useEffect(() => {
    const handler = debounce((value) => setDebouncedEmail(value), 500);
    handler(email);
    return () => handler.cancel();
  }, [email]);

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

  const users = usersResponse?.users || [];

  // Fetch single user details
  const { data: userDetail, isLoading: isUserLoading } =
    useGetUserByIdQuery(selectedUserId, {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          User Management
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <input
              type="text"
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />

            <input
              type="email"
              placeholder="Search by email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              {/* <option value="MODERATOR">Moderator</option> */}
            </select>

            <button
              onClick={handleReset}
              className="bg-gray-200 rounded-md px-4 py-2"
            >
              Reset
            </button>

          </div>
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="bg-white p-8 rounded-lg shadow">
            Loading users...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-500 text-center">
            Failed to load users
          </div>
        )}

        {/* Empty */}
        {!isLoading && users.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            No users found
          </div>
        )}

        {/* Table */}
        {!isLoading && users.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">

            <table className="w-full text-left text-sm">

              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created At</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => handleRowClick(user._id)}
                    className="border-b hover:bg-blue-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {user.name}
                    </td>

                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs capitalize">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            <div className="px-6 py-4 bg-gray-50 text-sm">
              Showing {users.length} users
            </div>

          </div>
        )}

      </div>

      {/* User Detail Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl relative">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          User Details
        </h2>

        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6">

        {isUserLoading ? (
          <div className="text-center text-gray-500 py-6">
            Loading user details...
          </div>
        ) : (
          <div className="space-y-6">

            {/* User Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-600">
                {userDetail?.data?.name?.charAt(0) || "U"}
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {userDetail?.data?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {userDetail?.data?.email}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6 text-sm">

              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800">
                  {userDetail?.data?.phoneNumber || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Role</p>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                  {userDetail?.data?.role}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Verified</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    userDetail?.data?.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {userDetail?.data?.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Created At</p>
                <p className="font-medium text-gray-800">
                  {userDetail?.data?.createdAt
                    ? new Date(
                        userDetail.data.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default UserManagementPage;