"use client";

import React from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  BarChart2,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";

function DashboardPage() {
  const stats = [
    {
      title: "Users",
      value: 1234,
      icon: <Users className="w-6 h-6 text-white" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Orders",
      value: 567,
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: "from-purple-500 to-fuchsia-600",
    },
    {
      title: "Visits",
      value: "45k",
      icon: <BarChart2 className="w-6 h-6 text-white" />,
      color: "from-orange-400 to-yellow-500",
    },
  ];

  const recentActivity = [
    "User John Doe registered",
    "Order #1234 placed",
    "Payment received from Jane",
    "New product added",
  ];

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen p-8 bg-linear-to-br from-slate-50 via-blue-50 to-purple-100">

        {/* background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-20 blur-3xl rounded-full"></div>

        {/* header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of your platform performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative rounded-2xl p-6 backdrop-blur-lg bg-white/60 shadow-xl border border-white/40"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-linear-to-r ${stat.color} opacity-10`}
              ></div>

              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>

                <div
                  className={`p-3 rounded-xl bg-linear-to-r ${stat.color} shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

            <ul className="space-y-4">
              {recentActivity.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-3 h-3 mt-2 rounded-full bg-indigo-500"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 overflow-x-auto"
          >
            <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>

            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">#1234</td>
                  <td className="px-4 py-3">John Doe</td>
                  <td className="px-4 py-3">$120</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Completed
                    </span>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">#1235</td>
                  <td className="px-4 py-3">Jane Smith</td>
                  <td className="px-4 py-3">$75</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">#1236</td>
                  <td className="px-4 py-3">Bob Lee</td>
                  <td className="px-4 py-3">$210</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>

        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;