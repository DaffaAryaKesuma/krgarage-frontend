/**
 * Setup axios interceptors untuk error handling global
 * File ini dipanggil di main.ts sebelum app mount
 */

import axios from "axios";
import type { Router } from "vue-router";

let hasShownError401 = false;

/**
 * Setup axios error interceptor untuk 401
 * Dipanggil di main.ts setelah app created
 * App instance digunakan untuk akses composable setelah mount
 */
export function setupAxiosInterceptors401(router: Router) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 - session expired
      if (error.response?.status === 401 && !hasShownError401) {
        hasShownError401 = true;

        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Try to show toast if available
        const tryShowToast = () => {
          try {
            if ((window as any).__krg_showToast) {
              (window as any).__krg_showToast(
                "Sesi Anda telah berakhir. Silakan login kembali."
              );
            }
          } catch (e) {
            console.error("Failed to show toast:", e);
          }
        };

        // Try immediately and then retry after a delay
        tryShowToast();
        setTimeout(tryShowToast, 100);

        // Redirect ke home after toast has time to show (2500ms)
        setTimeout(() => {
          router.push("/").catch(() => {});
        }, 2500);

        // Reset flag
        setTimeout(() => {
          hasShownError401 = false;
        }, 3000);
      }

      return Promise.reject(error);
    }
  );
}
