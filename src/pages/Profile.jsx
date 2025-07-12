import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../apis/authApi";
import { logout as logoutAction } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData.user);
  const authStatus = useSelector((state) => state.auth.status);

  const [formData, setFormData] = useState({
    fullname: "",
    password: "",
  });

  const [
    updateProfile,
    { isLoading, isSuccess, isError, error, data },
  ] = useUpdateProfileMutation();

  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
    }
    if (userData) {
      setFormData({
        fullname: userData.fullname || "",
        password: "",
      });
    }
  }, [authStatus, userData, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        fullname: formData.fullname,
        password: formData.password || undefined,
        }).unwrap();

        // ✅ update fullname in localStorage
        const stored = JSON.parse(localStorage.getItem("auth"));
        if (stored && stored.userData && stored.userData.user) {
        stored.userData.user.fullname = res.data.fullname;
        localStorage.setItem("auth", JSON.stringify(stored));
        }

        // ✅ update Redux too (if needed)
        dispatch(
        loginAction({
            userData: {
            ...stored.userData
            },
        })
        );
      
    } catch (err) {
      console.error(err);
    }
  };


  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-center mb-6">
        {/* Dummy Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
          {getInitial(userData?.fullname)}
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
        Your Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fullname */}
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email (disabled) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={userData?.email || ""}
            disabled
            className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition duration-300 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {isSuccess && (
        <p className="text-green-600 mt-4 text-center">
          Profile updated successfully!
        </p>
      )}
      {isError && (
        <p className="text-red-600 mt-4 text-center">
          {error?.data?.message || "Something went wrong"}
        </p>
      )}

    </div>
  );
}

export default Profile;
