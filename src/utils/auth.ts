/**
 * Authentication utility functions
 */

/**
 * Get authentication headers with Bearer token
 * @returns Headers object with Authorization token or empty if no token
 */
export function getAuthHeaders(): { Authorization: string } | {} {
  // Token disimpan saat user berhasil login.
  const token = localStorage.getItem("token");
  if (!token) {
    // Jika belum login, return object kosong agar request publik tetap bisa jalan.
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get current user from localStorage
 * @returns User object or null if not logged in
 */
export function getCurrentUser() {
  // Data user disimpan sebagai string JSON di localStorage.
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    // Parse string JSON menjadi object JavaScript.
    return JSON.parse(userStr);
  } catch {
    // Jika data rusak/tidak valid, anggap tidak ada user.
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns true if user has valid token
 */
export function isAuthenticated(): boolean {
  // Sederhananya, user dianggap login jika token ada.
  return !!localStorage.getItem("token");
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  // Dipakai saat logout atau sesi berakhir.
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
