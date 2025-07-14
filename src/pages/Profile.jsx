import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../apis/authApi";
import { logout as logoutAction, login as loginAction } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

// ...imports stay the same...

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData.user);
  const authStatus = useSelector((state) => state.auth.status);

  const [formData, setFormData] = useState({
    fullname: "",
    password: "",
  });

  const [updateProfile, { isLoading, isSuccess, isError, error }] =
    useUpdateProfileMutation();

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

      const stored = JSON.parse(localStorage.getItem("auth"));
      if (stored?.userData?.user) {
        stored.userData.user.fullname = res.data.fullname;
        localStorage.setItem("auth", JSON.stringify(stored));
      }

      dispatch(
        loginAction({
          userData: { ...stored.userData },
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f5e9] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#43a047] to-[#2e7d32] flex items-center justify-center text-white text-3xl font-bold">
            {getInitial(userData?.fullname)}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-[#2e7d32] mb-6">
          Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fullname */}
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#ecfdf5] text-gray-800 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] transition"
            placeholder="Full name"
          />

          {/* Email (disabled) */}
          <input
            type="email"
            value={userData?.email || ""}
            disabled
            className="w-full px-4 py-3 bg-[#ecfdf5] text-gray-500 rounded-md cursor-not-allowed"
            placeholder="Email"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#ecfdf5] text-gray-800 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] transition"
            placeholder="New Password (optional)"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2e7d32] text-white py-3 rounded-md font-semibold hover:bg-[#1b5e20] transition disabled:opacity-60 cursor-pointer"
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
    </div>
  );
}

export default Profile;
