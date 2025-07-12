import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../store/slices/authSlice";
import { useLogoutMutation } from "../apis/authApi";

function SideBar({ activeTab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  
    const [logoutApiCall, { isLoading }] = useLogoutMutation();

  
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Users", path: "/dashboard/users" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 shadow fixed w-full top-0 z-50">
        <Link to="/" className="text-xl font-extrabold text-white">
          MyLogo
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 min-h-screen w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg z-50 transform transition-transform duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0 md:static md:block"
          }`}
      >
        <div className="px-6 py-4 border-b border-blue-600 flex justify-between items-center">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-extrabold tracking-tight text-white hover:text-blue-200"
          >
            MyLogo
          </Link>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="md:flex md:flex-col md:h-[calc(100vh-64px)]">
          {/* Nav links */}
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  activeTab === link.path
                    ? "bg-blue-500 text-white shadow"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-blue-600 mt-auto">
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="w-full px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
