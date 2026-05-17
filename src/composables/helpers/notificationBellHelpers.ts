import type { RouteLocationRaw } from "vue-router";
import { normalizeUserRole, type CanonicalUserRole } from "@/utils/roleRoutes";

export interface AppNotification {
  id: number;
  tipe: string;
  judul: string;
  pesan: string;
  sudah_dibaca: boolean;
  id_pemesanan: number | null;
  created_at: string;
  pemesanan?: {
    id?: number;
    kode_pemesanan: string;
  };
}

type AppRole = CanonicalUserRole;

const NOTIFICATION_ICONS: Record<string, string> = {
  pemesanan_dikonfirmasi: "mdi-check-circle",
  pemesanan_diproses:     "mdi-progress-clock",
  pemesanan_selesai:      "mdi-check-all",
  pemesanan_dibatalkan:   "mdi-close-circle",
  pemesanan_ditugaskan:   "mdi-account-check",
  pemesanan_dihapus:      "mdi-delete-circle",
  pemesanan_diperbarui:   "mdi-pencil-circle",
  stok_menipis:           "mdi-alert",
  pembayaran_diterima:    "mdi-cash-check",
};

const NOTIFICATION_COLORS: Record<string, string> = {
  pemesanan_dikonfirmasi: "text-green-600 bg-green-50",
  pemesanan_diproses:     "text-blue-600 bg-blue-50",
  pemesanan_selesai:      "text-purple-600 bg-purple-50",
  pemesanan_dibatalkan:   "text-red-600 bg-red-50",
  pemesanan_ditugaskan:   "text-orange-600 bg-orange-50",
  pemesanan_dihapus:      "text-red-700 bg-red-50",
  pemesanan_diperbarui:   "text-gray-600 bg-gray-50",
  stok_menipis:           "text-yellow-600 bg-yellow-50",
  pembayaran_diterima:    "text-emerald-700 bg-emerald-50",
};

export function normalizeRole(role?: string | null): AppRole {
  return normalizeUserRole(role);
}

export function getPemesananIdFromNotification(
  notification: AppNotification,
): number | null {
  const directPemesananId = Number(notification.id_pemesanan);
  if (Number.isFinite(directPemesananId) && directPemesananId > 0) {
    return directPemesananId;
  }

  const relationPemesananId = Number(notification.pemesanan?.id);
  if (Number.isFinite(relationPemesananId) && relationPemesananId > 0) {
    return relationPemesananId;
  }

  return null;
}

export function resolveNotificationTarget(
  role: AppRole,
  pemesananId: number | null,
  notificationType?: string,
): RouteLocationRaw {
  if (role === "admin") {
    if (pemesananId) {
      return {
        name: "admin-pemesanan-detail",
        params: { id: String(pemesananId) },
      };
    }

    return { name: "admin-pemesanan" };
  }

  if (role === "mekanik") {
    if (pemesananId) {
      return {
        name: "mekanik-dasbor",
        query: { pemesanan: String(pemesananId) },
      };
    }

    return { name: "mekanik-dasbor" };
  }

  if (role === "pemilik") {
    if (notificationType === "stok_menipis") {
      return { name: "pemilik-analisa-inventaris" };
    }

    if (notificationType === "pembayaran_diterima") {
      return { name: "pemilik-laporan-keuangan" };
    }

    if (pemesananId) {
      return { name: "pemilik-laporan-keuangan" };
    }

    return { name: "pemilik-dasbor" };
  }

  if (pemesananId) {
    return {
      name: "pelanggan-riwayat-detail",
      params: { id: String(pemesananId) },
    };
  }

  return { name: "pelanggan-riwayat" };
}

export function getNotificationIcon(tipe: string): string {
  return NOTIFICATION_ICONS[tipe] || "mdi-bell";
}

export function getNotificationColor(tipe: string): string {
  return NOTIFICATION_COLORS[tipe] || "text-gray-600 bg-gray-50";
}
