/**
 * Setup axios interceptors untuk error handling global
 * File ini dipanggil di main.ts sebelum app mount
 */

import axios from "axios";
import type { Router } from "vue-router";
import { fetchAuthenticatedUser } from "@/utils/auth";
import {
  getRedirectPathForRole,
  normalizeUserRole,
} from "@/utils/roleRoutes";

// Flag ini mencegah toast 401 muncul berkali-kali saat banyak request gagal bersamaan.
let hasShownError401 = false;
// Mencegah banyak response 403 paralel menjalankan sinkronisasi berulang.
let isHandlingRoleMismatch = false;

function getRequiredRoleFromPath(path: string) {
  if (path.startsWith("/pemilik")) return "pemilik";
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/mekanik")) return "mekanik";
  if (path.startsWith("/app")) return "pelanggan";
  return null;
}

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
    async (error) => {
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

      // Jika backend menolak role, cek identitas asli dari token. Ini menangani
      // localStorage.user yang diubah lewat DevTools tanpa mempercayai nilainya.
      if (
        error.response?.status === 403 &&
        hasToken &&
        !isAuthRequest &&
        !isHandlingRoleMismatch
      ) {
        isHandlingRoleMismatch = true;

        try {
          const serverUser = await fetchAuthenticatedUser();
          const serverRole = normalizeUserRole(serverUser.role);
          const requiredRole = getRequiredRoleFromPath(router.currentRoute.value.path);

          if (requiredRole && serverRole !== requiredRole) {
            if ((window as any).__krg_showToast) {
              (window as any).__krg_showToast(
                "Akses halaman tidak sesuai dengan akun Anda. Anda dialihkan ke halaman yang benar.",
              );
            }

            await router.replace(getRedirectPathForRole(serverRole));
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          await router.replace("/");
        } finally {
          isHandlingRoleMismatch = false;
        }
      }

      // Error tetap dilempar agar caller lokal masih bisa catch error juga.
      return Promise.reject(error);
    },
  );
}
