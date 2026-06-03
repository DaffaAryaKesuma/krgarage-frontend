/**
 * API Configuration
 */
const normalizeUrl = (url: string): string => url.replace(/\/+$/, "");

const resolveDefaultApiUrl = (): string => {
  const apiPort = import.meta.env.VITE_API_PORT || "8000";

  if (import.meta.env.PROD) {
    return "https://krgarage-backend-production.up.railway.app/api";
  }

  if (typeof window === "undefined") {
    return `http://127.0.0.1:${apiPort}/api`;
  }

  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  const host = window.location.hostname || "127.0.0.1";

  return `${protocol}//${host}:${apiPort}/api`;
};

export const API_URL =
  normalizeUrl((import.meta.env.VITE_API_URL || "").trim() || resolveDefaultApiUrl());

export const API_BASE_URL =
  normalizeUrl((import.meta.env.VITE_API_BASE_URL || "").trim()) ||
  API_URL.replace(/\/api\/?$/, "");

export const STORAGE_URL =
  normalizeUrl((import.meta.env.VITE_STORAGE_URL || "").trim()) ||
  `${API_BASE_URL}/storage`;
