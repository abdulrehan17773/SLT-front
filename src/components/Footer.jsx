import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const deferredPrompt = useRef(null); // ✅ useRef instead of useState
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Already installed?
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      console.log("🎉 beforeinstallprompt fired", e);
      e.preventDefault();
      deferredPrompt.current = e; // ✅ store safely
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      console.log("✅ App installed");
      setIsInstalled(true);
      setCanInstall(false);
      deferredPrompt.current = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt.current) {
      console.log("❌ No deferredPrompt available");
      return;
    }

    try {
      console.log("🚀 Triggering install prompt...");
      await deferredPrompt.current.prompt(); // ✅ call prompt safely
      const { outcome } = await deferredPrompt.current.userChoice;
      console.log("👤 User choice:", outcome);

      if (outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (err) {
      console.error("💥 Error during installation:", err);
    } finally {
      deferredPrompt.current = null;
      setCanInstall(false);
    }
  };

  if (isDashboardRoute) return null;

  return (
    <footer className="bg-gray-800 text-gray-300 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold text-white hover:text-blue-400 mb-2 md:mb-0"
        >
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
        </Link>

        {!isInstalled && canInstall && (
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            📲 Install App
          </button>
        )}

        <p className="text-xs text-gray-400 text-center md:text-right">
          <strong>
            © {new Date().getFullYear()} Sign Language Translator. All rights reserved.
          </strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
