import type { RouteLocationRaw } from "vue-router";
import { normalizeUserRole, type CanonicalUserRole } from "@/utils/roleRoutes";
import { getIconToneClass, type IconToneKey } from "@/utils/badgeVariants";

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
  pemesanan_diproses:     "mdi-wrench-cog",
  pemesanan_selesai:      "mdi-check-all",
  pemesanan_dibatalkan:   "mdi-close-circle",
  pemesanan_ditugaskan:   "mdi-account-check",
  pemesanan_dihapus:      "mdi-delete-circle",
  pemesanan_diperbarui:   "mdi-pencil-circle",
  stok_menipis:           "mdi-alert",
  pembayaran_diterima:    "mdi-cash-check",
};

const NOTIFICATION_TONES: Record<string, IconToneKey> = {
  pemesanan_dikonfirmasi: "info",
  pemesanan_diproses: "warning",
  pemesanan_selesai: "success",
  pemesanan_dibatalkan: "danger",
  pemesanan_ditugaskan: "warning",
  pemesanan_dihapus: "danger",
  pemesanan_diperbarui: "neutral",
  stok_menipis: "warning",
  pembayaran_diterima: "success",
};

export function normalizeRole(role?: string | null): AppRole {
  return normalizeUserRole(role);
}

export function getPemesananIdFromNotification(
  notifikasi: AppNotification,
): number | null {
  const directPemesananId = Number(notifikasi.id_pemesanan);
  if (Number.isFinite(directPemesananId) && directPemesananId > 0) {
    return directPemesananId;
  }

  const relationPemesananId = Number(notifikasi.pemesanan?.id);
  if (Number.isFinite(relationPemesananId) && relationPemesananId > 0) {
    return relationPemesananId;
  }

  return null;
}

export function resolveNotificationTarget(
  role: AppRole,
  idPemesanan: number | null,
  notifikasiType?: string,
): RouteLocationRaw {
  if (role === "admin") {
    if (idPemesanan) {
      return {
        name: "admin-pemesanan-detail",
        params: { id: String(idPemesanan) },
      };
    }

    return { name: "admin-pemesanan" };
  }

  if (role === "mekanik") {
    if (idPemesanan) {
      return {
        name: "mekanik-dasbor",
        query: { pemesanan: String(idPemesanan) },
      };
    }

    return { name: "mekanik-dasbor" };
  }

  if (role === "pemilik") {
    if (notifikasiType === "stok_menipis") {
      return { name: "pemilik-analisa-inventaris" };
    }

    if (notifikasiType === "pembayaran_diterima") {
      return { name: "pemilik-laporan-keuangan" };
    }

    if (idPemesanan) {
      return { name: "pemilik-laporan-keuangan" };
    }

    return { name: "pemilik-dasbor" };
  }

  if (idPemesanan) {
    return {
      name: "pelanggan-riwayat-detail",
      params: { id: String(idPemesanan) },
    };
  }

  return { name: "pelanggan-riwayat" };
}

export function getNotificationIcon(tipe: string): string {
  return NOTIFICATION_ICONS[tipe] || "mdi-bell";
}

export function getNotificationColor(tipe: string): string {
  return getIconToneClass(NOTIFICATION_TONES[tipe] || "neutral");
}
