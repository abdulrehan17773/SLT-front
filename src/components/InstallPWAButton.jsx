import React, { useState, useEffect } from "react";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button onClick={handleInstall} style={{
      padding: "10px 20px",
      background: "#4cafef",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}>
      📲 Install App
    </button>
  );
}
