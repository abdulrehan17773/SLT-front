import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        return true;
      }
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (!checkIfInstalled()) {
      const handleBeforeInstallPrompt = (e) => {
        // Prevent default mini infobar
        e.preventDefault();
        if (process.env.NODE_ENV === "development") {
          console.log("✅ beforeinstallprompt fired");
        }
        setDeferredPrompt(e);
      };

      const handleAppInstalled = () => {
        if (process.env.NODE_ENV === "development") {
          console.log("🎉 App installed");
        }
        setIsInstalled(true);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (process.env.NODE_ENV === "development") {
        console.log("User choice:", outcome);
      }

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Install prompt failed:", error);
      }
      setDeferredPrompt(null);
    }
  };

  // Hide footer on dashboard routes
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

        {/* Install button */}
        {!isInstalled && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-2 md:mb-0 transition-colors duration-200 flex items-center gap-2"
          >
            <span role="img" aria-label="Install">📲</span>
            <span>Install App</span>
          </button>
        )}

        {/* Copyright */}
        <p className="text-xs text-gray-400 text-center md:text-right">
          <strong>© {new Date().getFullYear()} Sign Language Translator. All rights reserved.</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
