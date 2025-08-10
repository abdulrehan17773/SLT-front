import React, { useEffect, useState } from "react";

function Footer() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    promptReceived: false,
    isStandalone: false,
    userAgent: '',
    protocol: '',
    hasServiceWorker: false,
    hasManifest: false
  });

  useEffect(() => {
    const handler = (e) => {
      console.log("beforeinstallprompt event fired!");
      e.preventDefault();
      setDeferredPrompt(e);
      setDebugInfo(prev => ({ ...prev, promptReceived: true }));
    };
    
    window.addEventListener("beforeinstallprompt", handler);

    // Detect if already installed
    window.addEventListener("appinstalled", () => {
      console.log("App installed!");
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    // Check if running as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                        window.navigator.standalone;
    
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Check PWA requirements
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasManifest = document.querySelector('link[rel="manifest"]') !== null;

    // Set debug info
    setDebugInfo(prev => ({
      ...prev,
      isStandalone,
      userAgent: navigator.userAgent.substring(0, 50) + '...',
      protocol: window.location.protocol,
      hasServiceWorker,
      hasManifest
    }));

    // Check for existing service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          console.log('Service Worker is registered');
        } else {
          console.log('No Service Worker registered');
        }
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('User choice:', choice.outcome);
    if (choice.outcome === "accepted") {
      console.log("PWA installed");
    }
    setDeferredPrompt(null);
  };

  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Install button */}
        <div className="text-center mb-4">
          {!isInstalled && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
            >
              📲 Install App
            </button>
          )}
          
          {!deferredPrompt && !isInstalled && (
            <div className="text-yellow-400 text-sm">
              Install button not available - see debug info below
            </div>
          )}
          
          {isInstalled && (
            <div className="text-green-400 text-sm">
              ✅ App is already installed
            </div>
          )}
        </div>

        {/* Debug info */}
        <div className="bg-gray-700 p-4 rounded-lg text-xs space-y-1">
          <h3 className="text-white font-bold mb-2">PWA Debug Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>Install Prompt Ready: <span className={deferredPrompt ? 'text-green-400' : 'text-red-400'}>{deferredPrompt ? '✅ Yes' : '❌ No'}</span></div>
            <div>Is Installed: <span className={isInstalled ? 'text-green-400' : 'text-red-400'}>{isInstalled ? '✅ Yes' : '❌ No'}</span></div>
            <div>Is Standalone: <span className={debugInfo.isStandalone ? 'text-green-400' : 'text-red-400'}>{debugInfo.isStandalone ? '✅ Yes' : '❌ No'}</span></div>
            <div>Protocol: <span className={debugInfo.protocol === 'https:' ? 'text-green-400' : 'text-red-400'}>{debugInfo.protocol}</span></div>
            <div>Has Service Worker: <span className={debugInfo.hasServiceWorker ? 'text-green-400' : 'text-red-400'}>{debugInfo.hasServiceWorker ? '✅ Yes' : '❌ No'}</span></div>
            <div>Has Manifest: <span className={debugInfo.hasManifest ? 'text-green-400' : 'text-red-400'}>{debugInfo.hasManifest ? '✅ Yes' : '❌ No'}</span></div>
          </div>
          <div className="mt-2">
            <div>User Agent: {debugInfo.userAgent}</div>
          </div>
          
          <div className="mt-3 p-2 bg-gray-600 rounded text-yellow-200">
            <strong>Common Issues:</strong><br/>
            • Missing manifest.json file<br/>
            • No service worker registered<br/>
            • Not served over HTTPS<br/>
            • Browser doesn't support PWA<br/>
            • App already installed<br/>
            • Need to visit site multiple times (engagement heuristics)
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          © 2025 Sign Language Translator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;