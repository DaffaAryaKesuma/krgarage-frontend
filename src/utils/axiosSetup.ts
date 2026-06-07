/**
 * Setup axios interceptors untuk error handling global
 * File ini dipanggil di main.ts sebelum app mount
 */

import axios from "axios";
import type { Router } from "vue-router";

// Flag ini mencegah toast 401 muncul berkali-kali saat banyak request gagal bersamaan.
let hasShownError401 = false;

/**
 * Setup axios error interceptor untuk 401
 * Dipanggil di main.ts setelah app created
 * App instance digunakan untuk akses composable setelah mount
 */
export function setupAxiosInterceptors401(router: Router) {
  // Interceptor response akan memeriksa semua response axios secara global.
  axios.interceptors.response.use(
    // Jika response sukses, langsung kembalikan tanpa diubah.
    (response) => response,
    // Jika response error, cek apakah error karena sesi habis.
    (error) => {
      const requestUrl = String(error.config?.url || "");
      // Request auth dikecualikan supaya login/register/logout tidak memicu redirect aneh.
      const isAuthRequest =
        requestUrl.includes("/masuk") ||
        requestUrl.includes("/daftar") ||
        requestUrl.includes("/keluar");
      const hasToken = !!localStorage.getItem("token");

      // Handle 401 - session expired.
      if (
        error.response?.status === 401 &&
        !hasShownError401 &&
        hasToken &&
        !isAuthRequest
      ) {
        hasShownError401 = true;

        // Hapus data login lokal karena token sudah tidak valid.
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Coba tampilkan toast global jika fungsi toast sudah tersedia di window.
        const tryShowToast = () => {
          try {
            if ((window as any).__krg_showToast) {
              (window as any).__krg_showToast(
                "Sesi Anda telah berakhir. Silakan login kembali.",
              );
            }
          } catch (e) {
            console.error("Failed to show toast:", e);
          }
        };

        // Dicoba langsung dan diulang sebentar agar tidak kalah cepat dari proses mount app.
        tryShowToast();
        setTimeout(tryShowToast, 100);

        // Redirect ke beranda setelah toast sempat terlihat.
        setTimeout(() => {
          router.push("/").catch(() => {});
        }, 2500);

        // Reset flag agar 401 berikutnya tetap bisa ditangani.
        setTimeout(() => {
          hasShownError401 = false;
        }, 3000);
      }

      // Error tetap dilempar agar caller lokal masih bisa catch error juga.
      return Promise.reject(error);
    },
  );
}
