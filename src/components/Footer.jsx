import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for the install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // Save event so we can trigger later
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Detect if app is already installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("PWA installed");
    }
    setDeferredPrompt(null);
  };

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

        {/* Install App Button */}
        {isInstalled && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-2 md:mb-0"
          >
            📲 Install App
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
