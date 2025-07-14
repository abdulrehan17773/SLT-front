import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f5e9] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-10 text-center">
        <h1 className="text-3xl font-bold text-[#2e7d32] mb-4">Coming Soon</h1>
        <p className="text-gray-600 mb-6">
          This section is under construction. New features and dashboards will be available here soon!
        </p>
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#43a047] to-[#2e7d32] mx-auto flex items-center justify-center text-white text-2xl font-bold">
          🚧
        </div>
      </div>
    </div>
  );
};

export default Home;
