import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [diagnostics, setDiagnostics] = useState({});

  useEffect(() => {
    // Comprehensive PWA diagnostics
    const runDiagnostics = () => {
      const diag = {
        isHttps: location.protocol === 'https:' || location.hostname === 'localhost',
        hasServiceWorker: 'serviceWorker' in navigator,
        swRegistered: false,
        swActive: false,
        manifestPresent: false,
        manifestParsed: false,
        displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
        userAgent: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                   navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                   navigator.userAgent.includes('Safari') ? 'Safari' : 'Other',
        beforeInstallPromptSupported: 'onbeforeinstallprompt' in window,
      };

      // Check service worker registration
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            diag.swRegistered = true;
            diag.swActive = !!registration.active;
            setDiagnostics(prev => ({ ...prev, ...diag }));
          }
        });
      }

      // Check manifest
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        diag.manifestPresent = true;
        fetch(manifestLink.href)
          .then(response => response.json())
          .then(manifest => {
            diag.manifestParsed = true;
            diag.manifestData = {
              name: manifest.name,
              shortName: manifest.short_name,
              startUrl: manifest.start_url,
              display: manifest.display,
              hasIcons: manifest.icons && manifest.icons.length > 0,
              iconSizes: manifest.icons ? manifest.icons.map(i => i.sizes) : []
            };
            setDiagnostics(prev => ({ ...prev, ...diag }));
          })
          .catch(() => {
            diag.manifestParsed = false;
            setDiagnostics(prev => ({ ...prev, ...diag }));
          });
      }

      setDiagnostics(prev => ({ ...prev, ...diag }));
    };

    // Check if already installed
    const checkInstallStatus = () => {
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

    const isAlreadyInstalled = checkInstallStatus();
    runDiagnostics();

    if (!isAlreadyInstalled) {
      const handleBeforeInstallPrompt = (e) => {
        console.log("🎉 beforeinstallprompt event fired!", e);
        
        // Validate that this is a real beforeinstallprompt event
        if (e.isTrusted && typeof e.prompt === 'function') {
          e.preventDefault();
          setDeferredPrompt(e);
          setCanInstall(true);
          console.log("✅ Valid install prompt saved");
        } else {
          console.log("⚠️ Invalid or synthetic beforeinstallprompt event, ignoring");
        }
      };

      const handleAppInstalled = () => {
        console.log("🎉 PWA was installed");
        setIsInstalled(true);
        setDeferredPrompt(null);
        setCanInstall(false);
      };

      // Remove the synthetic event dispatch - it causes the error
      const checkTimer = setTimeout(() => {
        console.log("⏰ Checking PWA installability after delay...");
        if (!deferredPrompt && !isInstalled) {
          console.log("❌ No install prompt available after timeout");
          console.log("ℹ️ This is normal if PWA install criteria aren't met");
        }
      }, 3000);

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        clearTimeout(checkTimer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, [location]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("❌ No deferred prompt available");
      return;
    }

    // Validate that the prompt method exists and is callable
    if (typeof deferredPrompt.prompt !== 'function') {
      console.error("❌ Invalid deferred prompt - prompt method not available");
      setDeferredPrompt(null);
      setCanInstall(false);
      return;
    }

    try {
      console.log("🚀 Triggering install prompt...");
      
      // Call the prompt method
      const promptResult = await deferredPrompt.prompt();
      console.log("📱 Prompt result:", promptResult);
      
      // Wait for the user's choice
      const choiceResult = await deferredPrompt.userChoice;
      console.log("👤 User choice:", choiceResult);
      
      if (choiceResult.outcome === "accepted") {
        console.log("✅ User accepted the install prompt");
        setIsInstalled(true);
      } else {
        console.log("❌ User dismissed the install prompt");
      }
    } catch (error) {
      console.error("💥 Error during installation:", error);
      
      // Provide more specific error handling
      if (error.name === 'TypeError' && error.message.includes('prompt is not a function')) {
        console.error("🔍 The deferred prompt object is invalid or has been consumed");
      } else if (error.name === 'InvalidStateError') {
        console.error("🔍 The prompt has already been used or is in an invalid state");
      } else if (error.name === 'NotAllowedError') {
        console.error("🔍 The user has previously dismissed the prompt");
      }
    } finally {
      // Clean up the prompt regardless of outcome
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  // Force install button for testing (remove in production)
  const handleForceInstall = () => {
    if ('serviceWorker' in navigator && 'showInstallPrompt' in window) {
      window.showInstallPrompt();
    } else {
      alert('Force install not available. Check console for diagnostics.');
      console.log('PWA Diagnostics:', diagnostics);
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

        <div className="flex flex-col items-center gap-2">
          {/* Regular install button - only show if we have a valid prompt */}
          {!isInstalled && canInstall && deferredPrompt && typeof deferredPrompt.prompt === 'function' && (
            <button
              onClick={handleInstallClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              📲 Install App
            </button>
          )}

          {/* Development tools */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleForceInstall}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
              >
                🔧 Force Install (Debug)
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                <div>Installed: {isInstalled ? 'Yes' : 'No'} | Can Install: {canInstall ? 'Yes' : 'No'}</div>
                <div>Prompt: {deferredPrompt ? 'Yes' : 'No'} | HTTPS: {diagnostics.isHttps ? 'Yes' : 'No'}</div>
                <div>SW: {diagnostics.swActive ? 'Active' : diagnostics.swRegistered ? 'Registered' : 'None'}</div>
                <div>Manifest: {diagnostics.manifestParsed ? 'OK' : diagnostics.manifestPresent ? 'Present' : 'Missing'}</div>
                <div>Browser: {diagnostics.userAgent} | Support: {diagnostics.beforeInstallPromptSupported ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center md:text-right">
          <strong>© {new Date().getFullYear()} Sign Language Translator. All rights reserved.</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;