import React, { useState } from "react";
import SideBar from "../components/SideBar";
import {
  useGetUserCountsQuery,
  useGetRecentUsersQuery,
  useGetLast7DaysUsersQuery,
  useGetLast4WeeksUsersQuery,
} from "../apis/adminApi";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaUsers,
  FaStar,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: countsData,
    isLoading: countsLoading,
    refetch: refetchCounts,
  } = useGetUserCountsQuery();
  const {
    data: recentData,
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useGetRecentUsersQuery();
  const {
    data: last7DaysData,
    isLoading: last7Loading,
    refetch: refetchLast7,
  } = useGetLast7DaysUsersQuery();
  const {
    data: last4WeeksData,
    isLoading: last4Loading,
    refetch: refetchLast4,
  } = useGetLast4WeeksUsersQuery();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchCounts(),
      refetchRecent(),
      refetchLast7(),
      refetchLast4(),
    ]);
    setRefreshing(false);
  };

  const counts = countsData?.data || {};
  const recentUsers = (recentData?.data || []).filter(
    (user) => !user.role?.includes("admin")
  );

  const last7Days = (last7DaysData?.data || []).map((item) => ({
    date: item._id,
    count: item.count,
  }));

  const lineChartData = {
    labels: last7Days.map((d) => d.date),
    datasets: [
      {
        label: "New Users",
        data: last7Days.map((d) => d.count),
        borderColor: "#43a047",
        backgroundColor: "rgba(67, 160, 71, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const last4Weeks = (last4WeeksData?.data || []).map((item) => ({
    week: `Week ${item._id}`,
    count: item.count,
  }));

  const barChartData = {
    labels: last4Weeks.map((d) => d.week),
    datasets: [
      {
        label: "Users",
        data: last4Weeks.map((d) => d.count),
        backgroundColor: "#2e7d32",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-green-50 overflow-hidden relative">
      <SideBar activeTab="/dashboard" />

      <main className="flex-1 h-screen overflow-y-auto p-6 pt-24 md:pt-10 md:p-10 relative">
        {/* Spinner overlay */}
        {refreshing && (
          <div className="absolute inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
            <div className="border-4 border-green-200 border-t-green-600 rounded-full w-10 h-10 animate-spin"></div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2 cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 text-green-800 mb-2">
              <FaUsers className="text-xl" />
              <h2 className="text-xl font-semibold">Total Users</h2>
            </div>
            <p className="text-4xl font-extrabold text-green-700">
              {countsLoading ? "..." : counts.totalUsers}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-200 to-green-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 text-green-800 mb-2">
              <FaStar className="text-xl" />
              <h2 className="text-xl font-semibold">App Rating</h2>
            </div>
            <p className="text-4xl font-extrabold text-green-700">
              {countsLoading ? "..." : counts.todaysUsers}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 text-red-700 mb-2">
              <FaTrash className="text-xl" />
              <h2 className="text-xl font-semibold">Soft Deleted</h2>
            </div>
            <p className="text-4xl font-extrabold text-red-600">
              {countsLoading ? "..." : counts.softDeletedUsers}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2">
            <FaUser className="text-lg" />
            Recent Users
          </h2>
          {recentLoading ? (
            <p className="text-gray-500">Loading recent users...</p>
          ) : recentUsers.length === 0 ? (
            <p className="text-gray-500">No recent users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-green-100 text-green-800 uppercase text-xs">
                  <tr>
                    <th className="pl-2 py-3 text-left">
                      <div className="flex items-center gap-1 text-xs">
                        <FaUser /> Full Name
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1 text-xs">
                        <FaEnvelope /> Email
                      </div>
                    </th>
                    <th className="px-0 py-3 text-left">
                      <div className="flex items-center gap-1 text-xs">
                        <FaCalendarAlt /> Created At
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, idx) => (
                    <tr
                      key={user._id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-green-50 transition`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.fullname}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-green-800">
              Users in Last 7 Days
            </h3>
            {last7Loading ? (
              <p className="text-gray-500">Loading chart...</p>
            ) : (
              <Line data={lineChartData} options={{ responsive: true }} />
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-green-800">
              Users in Last 4 Weeks
            </h3>
            {last4Loading ? (
              <p className="text-gray-500">Loading chart...</p>
            ) : (
              <Bar data={barChartData} options={{ responsive: true }} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
