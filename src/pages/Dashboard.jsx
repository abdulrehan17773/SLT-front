import React from "react";
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
  const { data: countsData, isLoading: countsLoading } = useGetUserCountsQuery();
  const { data: recentData, isLoading: recentLoading } = useGetRecentUsersQuery();
  const { data: last7DaysData, isLoading: last7Loading } = useGetLast7DaysUsersQuery();
  const { data: last4WeeksData, isLoading: last4Loading } = useGetLast4WeeksUsersQuery();

  const counts = countsData?.data || {};
  const recentUsers = (recentData?.data || []).filter(
    (user) => !user.role?.includes("admin")
  );

  // Chart data: Last 7 days
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
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart data: Last 4 weeks
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
        backgroundColor: "#10b981",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <SideBar activeTab="/dashboard" />

      <main className="flex-1 h-screen overflow-y-auto p-6 pt-24 md:pt-10 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Counts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h2>
            <p className="text-4xl font-extrabold text-blue-600">
              {countsLoading ? "..." : counts.totalUsers}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Today's Users</h2>
            <p className="text-4xl font-extrabold text-green-600">
              {countsLoading ? "..." : counts.todaysUsers}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Soft Deleted</h2>
            <p className="text-4xl font-extrabold text-red-600">
              {countsLoading ? "..." : counts.softDeletedUsers}
            </p>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Users</h2>
          {recentLoading ? (
            <p className="text-gray-500">Loading recent users...</p>
          ) : recentUsers.length === 0 ? (
            <p className="text-gray-500">No recent users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, idx) => (
                    <tr
                      key={user._id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.fullname}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.email}
                      </td>
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

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Users in Last 7 Days
            </h3>
            {last7Loading ? (
              <p className="text-gray-500">Loading chart...</p>
            ) : (
              <Line data={lineChartData} options={{ responsive: true }} />
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
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
