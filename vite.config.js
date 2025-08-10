import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png"
      ],
      manifest: {
        name: "Sign Language Translator",
        short_name: "SignLang",
        description: "Translate sign language in real-time.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        form_factor: "narrow", // Force Chrome to treat as mobile-friendly
        icons: [
          { src: "/pwa-48x48.png", sizes: "48x48", type: "image/png" },
          { src: "/pwa-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "/pwa-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "/pwa-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/pwa-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-256x256.png", sizes: "256x256", type: "image/png" },
          { src: "/pwa-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});
