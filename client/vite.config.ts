import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Remove 'command' parameter
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd());

  // Determine the backend URL based on the mode
  const backendUrl =
    mode === "production"
      ? "https://socialapp-backend-ujiv.onrender.com" // Use production backend URL
      : "http://localhost:8080"; // Use development backend URL

  return {
    server: {
      proxy: {
        "/api": backendUrl, // Use the determined backend URL for API requests
      },
    },
    plugins: [react()],
    // Define environment variable for usage in the application
    define: {
      __APP_ENV__: env.APP_ENV, // Access environment variables
    },
  };
});
