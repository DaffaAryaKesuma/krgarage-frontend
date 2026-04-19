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
  booking_confirmed: "mdi-check-circle",
  booking_in_progress: "mdi-progress-clock",
  booking_completed: "mdi-check-all",
  booking_cancelled: "mdi-close-circle",
  booking_assigned: "mdi-account-check",
  low_stock: "mdi-alert",
};

const NOTIFICATION_COLORS: Record<string, string> = {
  booking_confirmed: "text-green-600 bg-green-50",
  booking_in_progress: "text-blue-600 bg-blue-50",
  booking_completed: "text-purple-600 bg-purple-50",
  booking_cancelled: "text-red-600 bg-red-50",
  booking_assigned: "text-orange-600 bg-orange-50",
  low_stock: "text-yellow-600 bg-yellow-50",
};

export function normalizeRole(role?: string | null): AppRole {
  return normalizeUserRole(role);
}

export function getBookingIdFromNotification(
  notification: AppNotification,
): number | null {
  const directBookingId = Number(notification.id_pemesanan);
  if (Number.isFinite(directBookingId) && directBookingId > 0) {
    return directBookingId;
  }

  const relationBookingId = Number(notification.pemesanan?.id);
  if (Number.isFinite(relationBookingId) && relationBookingId > 0) {
    return relationBookingId;
  }

  return null;
}

export function resolveNotificationTarget(
  role: AppRole,
  bookingId: number | null,
): RouteLocationRaw {
  if (role === "admin") {
    if (bookingId) {
      return {
        name: "admin-pemesanan-detail",
        params: { id: String(bookingId) },
      };
    }

    return { name: "admin-pemesanan" };
  }

  if (role === "mekanik") {
    if (bookingId) {
      return {
        name: "mekanik-dasbor",
        query: { pemesanan: String(bookingId) },
      };
    }

    return { name: "mekanik-dasbor" };
  }

  if (role === "pemilik") {
    return { name: "pemilik-dasbor" };
  }

  if (bookingId) {
    return {
      name: "pelanggan-riwayat-detail",
      params: { id: String(bookingId) },
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
