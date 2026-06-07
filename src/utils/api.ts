/**
 * API Configuration
 */
// Menghapus slash di akhir URL agar hasil gabungan URL tidak dobel slash.
const normalizeUrl = (url: string): string => url.replace(/\/+$/, "");

// Menentukan URL API default jika VITE_API_URL tidak diisi di file .env.
const resolveDefaultApiUrl = (): string => {
  // Port backend default Laravel biasanya 8000.
  const apiPort = import.meta.env.VITE_API_PORT || "8000";

  // Saat production, arahkan ke backend Railway.
  if (import.meta.env.PROD) {
    return "https://krgarage-backend-production.up.railway.app/api";
  }

  // Jika kode berjalan tanpa browser, pakai localhost aman.
  if (typeof window === "undefined") {
    return `http://127.0.0.1:${apiPort}/api`;
  }

  // Ambil protocol dan hostname dari alamat frontend yang sedang dibuka.
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  const host = window.location.hostname || "127.0.0.1";

  // Contoh hasil development: http://localhost:8000/api.
  return `${protocol}//${host}:${apiPort}/api`;
};

// Base URL utama untuk endpoint API.
export const API_URL =
  normalizeUrl((import.meta.env.VITE_API_URL || "").trim() || resolveDefaultApiUrl());

// Base URL backend tanpa /api, dipakai untuk asset/storage.
export const API_BASE_URL =
  normalizeUrl((import.meta.env.VITE_API_BASE_URL || "").trim()) ||
  API_URL.replace(/\/api\/?$/, "");

// URL storage Laravel, dipakai untuk mengambil gambar dari backend.
export const STORAGE_URL =
  normalizeUrl((import.meta.env.VITE_STORAGE_URL || "").trim()) ||
  `${API_BASE_URL}/storage`;
