import React, { useState } from "react";
import SideBar from "../components/SideBar";
import { useGetAllFeedbacksQuery } from "../apis/adminApi";

function Feedback() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching // this tells if any background fetch is in progress
  } = useGetAllFeedbacksQuery({ page, limit });

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (data?.data?.pagination?.totalPages > page) setPage((prev) => prev + 1);
  };

  const closeModal = () => setSelectedFeedback(null);

  return (
    <div className="flex min-h-screen bg-green-50 relative">
      <SideBar activeTab="/dashboard/feedback" />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-800">User Feedback</h1>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer flex items-center gap-2"
          >
            <span className="text-lg">🔄</span>
            Refresh
          </button>
        </div>

        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-20 rounded-xl">
              <div className="border-4 border-green-200 border-t-green-600 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          )}

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error fetching feedbacks</p>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead className="text-green-700 text-sm uppercase bg-green-100 rounded">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Feedback</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.feedbacks.map((fb) => (
                    <tr
                      key={fb._id}
                      className="bg-green-50 hover:bg-green-100 rounded text-sm"
                    >
                      <td className="p-3 font-medium text-green-900">
                        {fb.user?.fullname || "Unknown"}
                      </td>
                      <td className="p-3 text-green-800">{fb.user?.email}</td>
                      <td className="p-3">{fb.stars} ⭐</td>
                      <td
                        className="p-3 max-w-xs truncate cursor-pointer text-blue-600 hover:underline"
                        onClick={() => setSelectedFeedback(fb)}
                        title="Click to view full"
                      >
                        {fb.feedback?.length > 50
                          ? fb.feedback.slice(0, 50) + "..."
                          : fb.feedback}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <p className="text-green-800">
                  Page {page} of {data?.data?.pagination?.totalPages || 1}
                </p>
                <button
                  onClick={handleNext}
                  disabled={page === data?.data?.pagination?.totalPages}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL WITHOUT BLACK BACKGROUND */}
        {selectedFeedback && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative pointer-events-auto border border-gray-200">
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-2 text-green-800">Full Feedback</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>User:</strong> {selectedFeedback.user?.fullname || "Unknown"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Email:</strong> {selectedFeedback.user?.email}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Rating:</strong> {selectedFeedback.stars} ⭐
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">{selectedFeedback.feedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
