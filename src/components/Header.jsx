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
  const userData = useSelector((state) => state.auth.userData);
  const [logoutApiCall, { isLoading }] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardBtn, setDashboardBtn] = useState(false);
  
  
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  React.useEffect(() => {
    if (userData?.user?.role?.includes("Admin")) {
      setDashboardBtn(true);
    } else {
      setDashboardBtn(false);
    }
  }, [userData]);
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold text-green-600 hidden sm:inline">
              {/* Sign Language Translator */}
            </span>
          </Link>

          {/* Authenticated Navigation */}
          {authStatus && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-6 items-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition ${
                      location.pathname === link.path
                        ? "text-green-600 font-semibold underline"
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              

              {/* Logout Button */}
              
              <div className="hidden md:flex gap-3 items-center">
                {dashboardBtn && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className=" bg-green-500 block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </div>

              {/* Hamburger */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-700 hover:text-green-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
        <div className="md:hidden px-4 pb-4 pt-2 space-y-2 bg-white border-t">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                location.pathname === link.path
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {dashboardBtn && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className=" bg-green-500 block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            disabled={isLoading}
            className="w-full rounded-md px-3 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
