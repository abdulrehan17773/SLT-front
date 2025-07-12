import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../store/slices/authSlice";
import { useLogoutMutation } from "../apis/authApi";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const [logoutApiCall, { isLoading }] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
    { path: "/profile", label: "Profile" },
  ];

  // hide header if inside dashboard
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  if (isDashboardRoute) return null;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              MyLogo
            </Link>
          </div>

          {/* Show nav only if logged in */}
          {authStatus && (
            <>
              {/* Desktop Nav */}
              <div className="hidden md:flex md:space-x-8 md:items-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-gray-700 hover:text-blue-600 ${
                      location.pathname === link.path
                        ? "font-bold text-blue-600 underline"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Logout Button */}
              <div className="hidden md:flex items-center">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </div>

              {/* Hamburger Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    // Close icon
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    // Hamburger icon
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {authStatus && mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 ${
                location.pathname === link.path
                  ? "font-bold text-blue-600 underline"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            disabled={isLoading}
            className="block px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
