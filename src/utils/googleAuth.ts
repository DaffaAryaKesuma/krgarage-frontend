// Helper untuk login via Google Identity Services (GSI).
// GSI script dimuat di index.html via CDN Google.
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getRedirectPathForRole } from "@/utils/roleRoutes";

// Tipe callback dari GSI setelah user memilih akun Google.
interface GoogleCredentialResponse {
  credential: string;
}

/**
 * Login via Google menggunakan popup OAuth2 Token Client.
 * Pendekatan ini lebih reliable daripada One Tap karena:
 * - Tidak bergantung pada third-party cookies.
 * - Tidak terpengaruh ITP (Intelligent Tracking Prevention) browser.
 * - Membuka popup pilih akun secara eksplisit saat tombol diklik.
 *
 * @param onSuccess  Callback dengan token & data user dari backend.
 * @param onError    Callback untuk menampilkan pesan error.
 * @param onLoading  Callback untuk mengubah state loading tombol.
 */
export function loginWithGoogle(
  onSuccess: (token: string, userData: any) => void,
  onError: (message: string) => void,
  onLoading: (isLoading: boolean) => void,
): void {
  // Pastikan Google GSI sudah dimuat dari CDN.
  const google = (window as any).google;
  if (!google?.accounts) {
    onError("Layanan Google belum dimuat. Coba refresh halaman.");
    return;
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    onError("Konfigurasi Google belum diatur. Hubungi administrator.");
    return;
  }

  // Gunakan OAuth2 Token Client dengan response_type=code (popup).
  // Ini lebih reliable dari One Tap untuk tombol klik manual.
  const tokenClient = google.accounts.oauth2.initCodeClient({
    client_id: clientId,
    // Scope minimal: hanya email dan profil dasar.
    scope: "openid email profile",
    // Popup mode — tidak bergantung pada cookie/ITP.
    ux_mode: "popup",
    callback: async (codeResponse: any) => {
      if (codeResponse.error) {
        // User menutup popup atau ada error.
        if (codeResponse.error !== "access_denied") {
          onError("Login Google dibatalkan atau gagal. Coba lagi.");
        }
        return;
      }

      onLoading(true);
      try {
        // Kirim authorization code ke backend untuk ditukar dengan token.
        const res = await axios.post(`${API_URL}/auth/google-login`, {
          code: codeResponse.code,
        });

        const data = res.data;
        const token = data.access_token || data.data?.access_token;
        const user  = data.data;

        if (!token || !user) {
          onError("Respons server tidak valid. Coba lagi.");
          return;
        }

        // Simpan token dan data user ke localStorage.
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        onSuccess(token, user);
      } catch (err: any) {
        const pesan =
          err?.response?.data?.message ||
          "Gagal login dengan Google. Coba lagi.";
        onError(pesan);
      } finally {
        onLoading(false);
      }
    },
  });

  // Tampilkan popup pilih akun Google secara eksplisit.
  tokenClient.requestCode();
}

/**
 * Kembalikan path redirect berdasarkan role user setelah login Google.
 */
export function getGoogleRedirectPath(role?: string): string {
  return getRedirectPathForRole(role);
}
