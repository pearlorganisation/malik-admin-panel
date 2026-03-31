"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Fallback Data ────────────────────────────────────────────────────────────
const FALLBACK = {
  stats: [
    { title: "Total Users", value: 12480, change: 8.2, suffix: "" },
    { title: "Total Orders", value: 3267, change: 5.1, suffix: "" },
    { title: "Revenue", value: 94320, change: 12.4, suffix: "$", prefix: true },
    { title: "Site Visits", value: 128000, change: -2.3, suffix: "K", divisor: 1000 },
  ],
  revenueChart: [
    { month: "Jan", revenue: 42000, orders: 310 },
    { month: "Feb", revenue: 53000, orders: 390 },
    { month: "Mar", revenue: 48000, orders: 360 },
    { month: "Apr", revenue: 61000, orders: 440 },
    { month: "May", revenue: 75000, orders: 530 },
    { month: "Jun", revenue: 69000, orders: 510 },
    { month: "Jul", revenue: 82000, orders: 620 },
    { month: "Aug", revenue: 94320, orders: 700 },
  ],
  orderStatus: [
    { name: "Completed", value: 62 },
    { name: "Pending", value: 24 },
    { name: "Cancelled", value: 14 },
  ],
  weeklyUsers: [
    { day: "Mon", new: 120, returning: 430 },
    { day: "Tue", new: 180, returning: 510 },
    { day: "Wed", new: 150, returning: 480 },
    { day: "Thu", new: 220, returning: 560 },
    { day: "Fri", new: 280, returning: 620 },
    { day: "Sat", new: 190, returning: 400 },
    { day: "Sun", new: 110, returning: 330 },
  ],
  recentOrders: [
    { id: "#10042", customer: "James Wilson", amount: 320, status: "Completed", date: "2024-08-12" },
    { id: "#10043", customer: "Priya Sharma", amount: 155, status: "Pending", date: "2024-08-12" },
    { id: "#10044", customer: "Tom Fischer", amount: 890, status: "Completed", date: "2024-08-11" },
    { id: "#10045", customer: "Aisha Yusuf", amount: 215, status: "Cancelled", date: "2024-08-11" },
    { id: "#10046", customer: "Lucas Martin", amount: 440, status: "Pending", date: "2024-08-10" },
  ],
};

// ─── API Fetcher ──────────────────────────────────────────────────────────────
async function fetchDashboardData() {
  const endpoints = {
    stats: "/api/dashboard/stats",
    revenueChart: "/api/dashboard/revenue-chart",
    orderStatus: "/api/dashboard/order-status",
    weeklyUsers: "/api/dashboard/weekly-users",
    recentOrders: "/api/dashboard/recent-orders",
  };

  const results = {};
  const errors = {};

  await Promise.allSettled(
    Object.entries(endpoints).map(async ([key, url]) => {
      try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json && (Array.isArray(json) ? json.length > 0 : Object.keys(json).length > 0)) {
          results[key] = json;
        } else {
          throw new Error("Empty response");
        }
      } catch (err) {
        errors[key] = err.message;
        results[key] = FALLBACK[key]; // graceful fallback per key
      }
    })
  );

  return { data: results, errors };
}

// ─── Stat Icons ───────────────────────────────────────────────────────────────
const STAT_META = [
  { icon: Users, gradient: "from-[#3B82F6] to-[#1D4ED8]", accent: "#3B82F6" },
  { icon: ShoppingCart, gradient: "from-[#10B981] to-[#047857]", accent: "#10B981" },
  { icon: DollarSign, gradient: "from-[#8B5CF6] to-[#6D28D9]", accent: "#8B5CF6" },
  { icon: TrendingUp, gradient: "from-[#F59E0B] to-[#B45309]", accent: "#F59E0B" },
];

const PIE_COLORS = ["#3B82F6", "#F59E0B", "#EF4444"];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("revenue") ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat, meta, index, isFallback }) {
  const Icon = meta.icon;
  const isPositive = stat.change >= 0;
  const displayValue =
    stat.prefix
      ? `$${(stat.value / 1000).toFixed(1)}K`
      : stat.divisor
      ? `${(stat.value / stat.divisor).toFixed(0)}K`
      : stat.value.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden group cursor-default"
    >
      {/* subtle left accent bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b ${meta.gradient} opacity-80`}
      />

      {/* background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 80% 20%, ${meta.accent}, transparent 70%)` }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            {stat.title}
          </p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{displayValue}</p>

          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(stat.change)}% vs last month
          </div>
        </div>

        <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.gradient} shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {isFallback && (
        <div className="absolute top-2 right-2 text-amber-400" title="Using fallback data">
          <AlertCircle className="w-3 h-3" />
        </div>
      )}
    </motion.div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ children, className = "", delay = 0, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    const { data: d, errors: e } = await fetchDashboardData();
    setData(d);
    setErrors(e);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading dashboard…</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const { stats, revenueChart, orderStatus, weeklyUsers, recentOrders } = data;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8F9FC] font-sans">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" />
                Some data uses fallback
              </div>
            )}
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-8">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.title}
                stat={stat}
                meta={STAT_META[i]}
                index={i}
                isFallback={!!errors.stats}
              />
            ))}
          </div>

          {/* ── Revenue Area Chart ── */}
          <Card
            title="Revenue & Orders"
            subtitle="Monthly trend for current year"
            delay={0.1}
            action={
              errors.revenueChart && (
                <span className="text-[10px] text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Fallback data
                </span>
              )
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueChart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="rev"
                  orientation="left"
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  yAxisId="ord"
                  orientation="right"
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 5, fill: "#3B82F6" }} />
                <Area yAxisId="ord" type="monotone" dataKey="orders" name="Orders" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradOrders)" strokeDasharray="5 3" dot={false} activeDot={{ r: 4, fill: "#8B5CF6" }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* ── Middle Row: Weekly Users Bar + Order Status Pie ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Weekly Users Bar */}
            <Card
              title="Weekly Users"
              subtitle="New vs Returning this week"
              delay={0.15}
              className="lg:col-span-2"
              action={
                errors.weeklyUsers && (
                  <span className="text-[10px] text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Fallback data
                  </span>
                )
              }
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyUsers} barGap={4} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F8FAFC" }} />
                  <Bar dataKey="new" name="New" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="returning" name="Returning" fill="#E0EAFF" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Legend
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "12px", color: "#64748B" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Order Status Pie */}
            <Card
              title="Order Status"
              subtitle="Distribution this month"
              delay={0.2}
              action={
                errors.orderStatus && (
                  <span className="text-[10px] text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Fallback data
                  </span>
                )
              }
            >
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatus}
                    cx="50%"
                    cy="45%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {orderStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v}%`, ""]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #F1F5F9", fontSize: "12px" }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: "11px", color: "#64748B" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label overlay via absolute (pure decorative) */}
              <div className="flex justify-center -mt-4">
                <span className="text-[10px] text-gray-400 font-medium">
                  {orderStatus.find((o) => o.name === "Completed")?.value ?? "—"}% completed
                </span>
              </div>
            </Card>
          </div>

          {/* ── Recent Orders Table ── */}
          <Card
            title="Recent Orders"
            subtitle="Latest transactions across all channels"
            delay={0.25}
            action={
              errors.recentOrders && (
                <span className="text-[10px] text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Fallback data
                </span>
              )
            }
          >
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Order ID", "Customer", "Amount", "Date", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 first:pl-0 last:pr-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="border-b border-gray-50 hover:bg-[#F8F9FC] transition-colors group"
                      >
                        <td className="px-4 py-3.5 first:pl-0 font-mono text-xs font-semibold text-gray-700">{order.id}</td>
                        <td className="px-4 py-3.5 font-medium text-gray-800">{order.customer}</td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900">${order.amount.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-gray-400 text-xs">{order.date}</td>
                        <td className="px-4 py-3.5 last:pr-0">
                          <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-lg ${STATUS_STYLE[order.status] ?? "bg-gray-50 text-gray-600"}`}>
                            {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;