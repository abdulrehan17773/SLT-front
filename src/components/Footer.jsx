import React from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  // Hide footer if route starts with "/dashboard"
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  if (isDashboardRoute) return null;

  return (
    <footer className="bg-gray-800 text-gray-300 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold text-white hover:text-blue-400 mb-2 md:mb-0"
        >
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
        </Link>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
         <strong> © {new Date().getFullYear()} Sign Language Translator. All rights reserved.</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
