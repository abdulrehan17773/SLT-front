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
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
        name: "Sign Language Translator",
        short_name: "SignLang",
        description: "Translate sign language in real-time.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        screenshots: [
          {
            src: "/screenshots/mobile.png",
            sizes: "540x720",
            type: "image/png",
            form_factor: "narrow"
          },
          {
            src: "/screenshots/desktop.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide"
          }
        ]
      }
    })
  ]
});
