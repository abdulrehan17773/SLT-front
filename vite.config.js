import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "icons/icon-192x192.png",
        "icons/icon-512x512.png",
        "screenshots/mobile-preview.png",
        "screenshots/desktop-preview.png"
      ],
      manifest: {
        name: "Sign Language Translator",
        short_name: "SLT",
        description: "Translate sign language in real time.",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        screenshots: [
          {
            src: "/screenshots/mobile-preview.png",
            sizes: "540x720",
            type: "image/png",
            form_factor: "narrow",
            label: "Mobile view of the app"
          },
          {
            src: "/screenshots/desktop-preview.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "Desktop view of the app"
          }
        ]
      }
    })
  ]
});
