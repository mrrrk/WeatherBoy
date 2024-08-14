import { fileURLToPath, URL } from "node:url";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const pwaOptions: Partial<VitePWAOptions> = {
    mode: "development",
    base: "/",
    includeAssets: ["favicon.svg"],
    manifest: {
        name: "Weatherboy",
        short_name: "Weatherboy",
        theme_color: "#3366FF",
        icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
            { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    devOptions: {
        enabled: process.env.SW_DEV === "true",
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html",
        suppressWarnings: true,
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA(pwaOptions)
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
})
