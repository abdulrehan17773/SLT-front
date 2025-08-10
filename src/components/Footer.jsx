import React, { useEffect, useState } from "react";

function Footer() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener("beforeinstallprompt", handler);

    // Detect if already installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    // Check if running as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                        window.navigator.standalone;
    
    if (isStandalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (error) {
      // Handle error silently
      setDeferredPrompt(null);
    }
  };

  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        
        {/* Logo */}
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="Sign Language Translator Logo" 
            className="h-12 w-auto mx-auto"
          />
        </div>

        {/* Install button - only show when available */}
        {!isInstalled && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <span>📱</span>
            <span>Install App</span>
          </button>
        )}

        {/* Manual install hint for Chrome users */}
        {!isInstalled && !deferredPrompt && (
          <div className="text-center text-xs text-gray-400 max-w-md">
            <p className="mb-1">Want to install this app?</p>
            <p>Chrome: Menu → "Install Sign Language Translator"</p>
            <p>Mobile: Menu → "Add to Home screen"</p>
          </div>
        )}

        {/* Success message */}
        {isInstalled && (
          <div className="text-green-400 text-sm text-center">
            ✅ App installed successfully!
          </div>
        )}

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Sign Language Translator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;