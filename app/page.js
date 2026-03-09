import React from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  BarChart2,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function DashboardPage() {
  const stats = [
    { title: "Users", value: 1234, icon: <Users className="w-6 h-6 text-white" /> , color: "bg-blue-500"},
    { title: "Orders", value: 567, icon: <ShoppingCart className="w-6 h-6 text-white" /> , color: "bg-green-500"},
    { title: "Revenue", value: "$12,345", icon: <DollarSign className="w-6 h-6 text-white" /> , color: "bg-purple-500"},
    { title: "Visits", value: "45k", icon: <BarChart2 className="w-6 h-6 text-white" /> , color: "bg-yellow-500"},
  ];

  const recentActivity = [
    "User John Doe registered",
    "Order #1234 placed",
    "Payment received from Jane",
    "New product added",
  ];

  return (
    <ProtectedRoute>

    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="flex items-center p-4 bg-white rounded shadow">
            <div className={`${stat.color} p-3 rounded-full mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {recentActivity.map((item, idx) => (
              <li key={idx} className="border-b py-2">{item}</li>
            ))}
          </ul>
        </div>

        {/* Dummy Table */}
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">#1234</td>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">$120</td>
                <td className="px-4 py-2 text-green-600">Completed</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">#1235</td>
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2">$75</td>
                <td className="px-4 py-2 text-yellow-600">Pending</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">#1236</td>
                <td className="px-4 py-2">Bob Lee</td>
                <td className="px-4 py-2">$210</td>
                <td className="px-4 py-2 text-red-600">Cancelled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </ProtectedRoute>
  );
}

export default DashboardPage;
