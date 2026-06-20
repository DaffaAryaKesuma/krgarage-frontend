/**
 * Authentication utility functions
 */

import axios from "axios";
import { API_URL } from "@/utils/api";

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
 * Ambil identitas yang benar dari token aktif, bukan dari localStorage.
 */
export async function fetchAuthenticatedUser() {
  const response = await axios.get(`${API_URL}/profil`, {
    headers: getAuthHeaders(),
  });
  const user = response.data?.data;

  if (!user || typeof user !== "object" || !user.role) {
    throw new Error("Data pengguna dari server tidak valid.");
  }

  localStorage.setItem("user", JSON.stringify(user));
  return user;
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
